import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { executeFlow } from '@/app/api/flows';

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
    const result = await executeFlow(id, session.user.id, body.triggerData);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error executing flow:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
