import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/server/db';
import { rateLimit } from '@/server/rateLimit';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting by IP
    const clientIP = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    'unknown';
    
    if (rateLimit(`login:${clientIP}`, 5, 15 * 60 * 1000)) { // 5 attempts per 15 minutes
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => null);
    
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const { email, password } = body;

    // Validate input types and format
    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Rate limiting by email
    if (rateLimit(`login-email:${email.toLowerCase()}`, 3, 15 * 60 * 1000)) { // 3 attempts per email per 15 minutes
      return NextResponse.json(
        { error: 'Too many login attempts for this email. Please try again later.' },
        { status: 429 }
      );
    }

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user by email (case insensitive)
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password (handle both hashed and plain text for development)
    let isValidPassword = false;
    if (user.password.startsWith('$2')) {
      // Hashed password
      isValidPassword = await bcrypt.compare(password, user.password);
    } else {
      // Plain text password (for development)
      isValidPassword = user.password === password;
    }

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create response with user data (excluding password)
    const userWithoutPassword = {
      id: user.id,
      email: user.email,
      name: user.name
    };
    const response = NextResponse.json({ 
      success: true,
      user: userWithoutPassword 
    });

    // Set session cookie
    response.cookies.set('user-session', user.id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}
