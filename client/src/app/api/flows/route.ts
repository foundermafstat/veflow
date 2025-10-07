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
  userId: 'default-user', // In production, this would come from auth
  executionCount: mockFlow.executionCount,
  lastExecuted: mockFlow.lastExecuted,
  category: mockFlow.category,
  tags: mockFlow.tags
}));

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Return all flows for now (in production, filter by userId)
    return NextResponse.json({ flows, total: flows.length });
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
    const newFlow: Flow = {
      id: Date.now().toString(),
      name: body.name || 'New Flow',
      description: body.description || '',
      nodes: body.nodes || [],
      edges: body.edges || [],
      isActive: body.isActive || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: session.user.id,
      executionCount: 0,
      category: body.category || 'vechain',
      tags: body.tags || []
    };

    flows.push(newFlow);
    return NextResponse.json(newFlow);
  } catch (error) {
    console.error('Error creating flow:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
