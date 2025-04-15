import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { authService } from '@/services/general/auth/AuthService';

// Solução híbrida com leitura nos cookies e localStorage
export async function middleware(request: NextRequest) {
    const token = request.cookies.get('auth_token')?.value || request.nextUrl.searchParams.get('auth_token');
    
    if (!token || !authService.validateToken()) {
        return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*']
};
