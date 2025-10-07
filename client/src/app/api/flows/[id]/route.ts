import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getMockFlows } from '@/data/mock-flows';
import { Flow } from '@/types/flow.types';

// In-memory storage for flows (in production, this would be a database)
let flows: Flow[] = getMockFlows().map(mockFlow => ({
  id: mockFlow.id,
  name: mockFlow.name,
  description: mockFlow.description,
  nodes: [],
  edges: [],
  isActive: mockFlow.isActive,
  createdAt: mockFlow.createdAt,
  updatedAt: mockFlow.updatedAt,
  userId: 'default-user',
  executionCount: mockFlow.executionCount,
  lastExecuted: mockFlow.lastExecuted,
  category: mockFlow.category,
  tags: mockFlow.tags
}));

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
    const flow = flows.find(f => f.id === id);
    
    if (!flow) {
      return NextResponse.json({ error: 'Flow not found' }, { status: 404 });
    }

    return NextResponse.json({ flow });
  } catch (error) {
    console.error('Error fetching flow:', error);
    return NextResponse.json({ error: 'Flow not found' }, { status: 404 });
  }
}

export async function PUT(
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
    
    const flowIndex = flows.findIndex(f => f.id === id);
    if (flowIndex === -1) {
      return NextResponse.json({ error: 'Flow not found' }, { status: 404 });
    }

    flows[flowIndex] = {
      ...flows[flowIndex],
      ...body,
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json(flows[flowIndex]);
  } catch (error) {
    console.error('Error updating flow:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const flowIndex = flows.findIndex(f => f.id === id);
    
    if (flowIndex === -1) {
      return NextResponse.json({ error: 'Flow not found' }, { status: 404 });
    }

    flows.splice(flowIndex, 1);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting flow:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
