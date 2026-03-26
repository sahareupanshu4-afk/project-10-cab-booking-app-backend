import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    // Demo mode - simulate successful login without database
    const mockUser = {
      id: `demo-${Date.now()}`,
      email,
      name: email.split('@')[0],
      role: email.includes('driver') ? 'DRIVER' : 'RIDER',
      created_at: new Date().toISOString(),
    }

    const mockSession = {
      access_token: `demo-token-${Date.now()}`,
      user: mockUser,
    }

    return NextResponse.json({
      success: true,
      data: {
        user: mockUser,
        session: mockSession,
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Login failed' },
      { status: 500 }
    )
  }
}
