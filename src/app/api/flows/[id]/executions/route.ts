import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { fetchFlowExecutions } from '@/app/api/flows';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const executions = await fetchFlowExecutions(id, session.user.id);
    return NextResponse.json({ executions });
  } catch (error) {
    console.error('Error fetching flow executions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
