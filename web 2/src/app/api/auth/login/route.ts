/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    
    // Buscar usuário do seu banco/API
    const response = await fetch(`http://localhost:3001/users?email=${email}`);
    const users = await response.json();
    const user = users[0];

    if (!user) {
      return NextResponse.json(
        { message: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    // Na sua implementação real, você vai comparar com a senha hasheada
    // const isValidPassword = await bcrypt.compare(password, user.password);
    const isValidPassword = true; // Temporário para teste

    if (!isValidPassword) {
      return NextResponse.json(
        { message: 'Senha inválida' },
        { status: 401 }
      );
    }

    // Gerar token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'seu-secret-temporario',
      { expiresIn: '1d' }
    );

    // Remove a senha antes de enviar
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      user: userWithoutPassword,
      token
    });
    
  } catch (error) {
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}