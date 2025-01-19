/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppUser, AuthResponse, CreateUserData, LoginCredentials, Permission } from "@/types/auth-types";
import Cookies from 'js-cookie';

class AuthService {
    private baseUrl = 'http://localhost:3001';
    private tokenKey = 'auth_token';
    private userKey = 'auth_user';

    // Helper to check if we're on the client side
    private isClient(): boolean {
      return typeof window !== 'undefined';
    }

    // ✅ Armazenamento Híbrido: Cookies e LocalStorage
    public setToken(token: string) {
      Cookies.set(this.tokenKey, token, { expires: 1, secure: true, sameSite: 'Strict' });
      if (this.isClient()) {
          localStorage.setItem(this.tokenKey, token);
      }
    }

    public getToken(): string | null {
        const cookieToken = Cookies.get(this.tokenKey);
        const localToken = this.isClient() ? localStorage.getItem(this.tokenKey) : null;
        return cookieToken || localToken || null;
    }

    public removeToken() {
        Cookies.remove(this.tokenKey);
        if (this.isClient()) {
            localStorage.removeItem(this.tokenKey);
        }
    }

    // ✅ Validação de Token (Data e formato)
    public validateToken(): boolean {
        const token = this.getToken();
        if (!token) return false;

        const parts = token.split('-');
        if (parts.length !== 3 || parts[0] !== 'jwt') return false;

        const timestamp = Number(parts[2]);
        const tokenExpirationTime = 24 * 60 * 60 * 1000; // 24 horas
        return (Date.now() - timestamp) < tokenExpirationTime;
    }

    private setUser(user: AppUser | null) {
      if (user) {
          Cookies.set(this.userKey, JSON.stringify(user), { expires: 1 });
          if (this.isClient()) {
              localStorage.setItem(this.userKey, JSON.stringify(user));
          }
      } else {
          Cookies.remove(this.userKey);
          if (this.isClient()) {
              localStorage.removeItem(this.userKey);
          }
      }
    }

    public getCurrentUser(): AppUser | null {
        const cookieStr = Cookies.get(this.userKey);
        const localStr = this.isClient() ? localStorage.getItem(this.userKey) : null;
        const userStr = cookieStr || localStr;
        return userStr ? JSON.parse(userStr) : null;
    }

    private getHeaders(): HeadersInit {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };
        const token = this.getToken();
        if (token) headers['Authorization'] = `Bearer ${token}`;
        return headers;
    }

    // ✅ Login usando Cookies e LocalStorage
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const initialResponse: AuthResponse = {
            user: null,
            token: '',
            isLoading: true,
            error: null
        };

        try {
            const response = await fetch(`${this.baseUrl}/users`);
            if (!response.ok) {
                return { ...initialResponse, isLoading: false, error: 'Erro ao acessar o serviço' };
            }

            const users = await response.json();
            const user = users.find((u: AppUser) => 
                u.email === credentials.email && u.password === credentials.password
            );

            if (!user) {
                return { ...initialResponse, isLoading: false, error: 'Email ou senha inválidos' };
            }

            const token = `jwt-${user.id}-${Date.now()}`;
            this.setToken(token);
            this.setUser(user);

            return {
                user,
                token,
                isLoading: false,
                error: null
            };
        } catch (error: any) {
            return { ...initialResponse, isLoading: false, error: error.message || 'Erro no login' };
        }
    }

    // ✅ Logout completo (Cookies e LocalStorage)
    async logout(): Promise<void> {
        this.removeToken();
        Cookies.remove(this.userKey);
        localStorage.removeItem(this.userKey);
    }

    // ✅ Criação de usuário
    async createUser(userData: CreateUserData): Promise<AppUser> {
        const response = await fetch(`${this.baseUrl}/users`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            throw new Error('Erro ao criar o usuário');
        }

        return response.json();
    }

    // ✅ Busca usuário por email
    async getUserByEmail(email: string): Promise<AppUser | null> {
        const response = await fetch(`${this.baseUrl}/users?email=${email}`, {
            headers: this.getHeaders(),
        });

        if (!response.ok) throw new Error('Falha ao buscar usuário');

        const users = await response.json();
        return users.length > 0 ? users[0] : null;
    }

    // ✅ Atualizar usuário
    async updateUser(userId: string, userData: Partial<AppUser>): Promise<AppUser> {
        const response = await fetch(`${this.baseUrl}/users/${userId}`, {
            method: 'PATCH',
            headers: this.getHeaders(),
            body: JSON.stringify(userData),
        });

        if (!response.ok) throw new Error('Falha ao atualizar usuário');

        return response.json();
    }

    // ✅ Verificação de autenticação
    public isAuthenticated(): boolean {
        return this.getToken() !== null && this.validateToken();
    }

    // ✅ Verificação de permissões
    public hasPermission(permission: string): boolean {
        const user = this.getCurrentUser();
        return user?.permissions.includes(permission as Permission) ?? false;
    }

    // ✅ Renova o token se necessário
    async checkAndRenewToken(): Promise<boolean> {
        const token = this.getToken();
        if (!token || !this.validateToken()) return false;

        try {
            const response = await fetch(`${this.baseUrl}/refresh-token`, {
                method: 'POST',
                headers: this.getHeaders(),
            });

            if (response.ok) {
                const { token: newToken } = await response.json();
                this.setToken(newToken);
                return true;
            }
            return false;
        } catch {
            return false;
        }
    }

    // Verificar permissões
    public checkPermission(permission: Permission, hospitalId?: string): boolean {
      const user = this.getCurrentUser();
      if (!user) return false;

      if (permission === 'VIEW_ALL_HOSPITALS') {
        return user.permissions.includes('VIEW_ALL_HOSPITALS');
      }

      if (permission === 'VIEW_SINGLE_HOSPITAL') {
        return user.permissions.includes('VIEW_SINGLE_HOSPITAL') && 
              user.hospitalId === hospitalId;
      }

      return false;
    }

    // ✅ Retorna permissões do usuário
    public getUserPermissions(): Permission[] {
        const user = this.getCurrentUser();
        return user?.permissions || [];
    }

    // ✅ Verifica acesso ao hospital
    public canAccessHospital(hospitalId: string): boolean {
        const user = this.getCurrentUser();
        if (!user) return false;

        return user.permissions.includes('VIEW_ALL_HOSPITALS') || 
               (user.permissions.includes('VIEW_SINGLE_HOSPITAL') && user.hospitalId === hospitalId);
    }
}

export const authService = new AuthService();
