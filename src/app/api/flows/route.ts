import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { fetchFlows, createFlow } from '@/app/api/flows';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { flows, total } = await fetchFlows(session.user.id);
    return NextResponse.json({ flows, total });
  } catch (error) {
    console.error('Error fetching flows:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const flow = await createFlow(body, session.user.id);
    return NextResponse.json(flow);
  } catch (error) {
    console.error('Error creating flow:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
