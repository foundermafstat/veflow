import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    
    // Mock execution result
    const result = {
      message: 'Flow execution started (mock)',
      flowId: id,
      triggerData: body.triggerData || {
        type: 'manual_trigger',
        timestamp: new Date().toISOString(),
        testMode: true
      },
      executionId: `mock-exec-${Date.now()}`,
      status: 'running'
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error executing flow:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
