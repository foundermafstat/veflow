import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { FlowExecution } from '@/types/flow.types';

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
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');

    // Mock execution history data
    const mockExecutions: FlowExecution[] = [
      {
        id: `mock-exec-1`,
        flowId: id,
        status: 'completed',
        triggerData: {
          type: 'manual_trigger',
          timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
          testMode: true
        },
        executionData: { success: true, nodes: 3, edges: 2 },
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        completedAt: new Date(Date.now() - 3599000).toISOString(),
        correlationId: 'mock-corr-1'
      },
      {
        id: `mock-exec-2`,
        flowId: id,
        status: 'completed',
        triggerData: {
          type: 'manual_trigger',
          timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
          testMode: true
        },
        executionData: { success: true, nodes: 3, edges: 2 },
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        completedAt: new Date(Date.now() - 7199000).toISOString(),
        correlationId: 'mock-corr-2'
      },
      {
        id: `mock-exec-3`,
        flowId: id,
        status: 'failed',
        triggerData: {
          type: 'manual_trigger',
          timestamp: new Date(Date.now() - 10800000).toISOString(), // 3 hours ago
          testMode: true
        },
        error: 'Mock execution error for testing',
        createdAt: new Date(Date.now() - 10800000).toISOString(),
        completedAt: new Date(Date.now() - 10799000).toISOString(),
        correlationId: 'mock-corr-3'
      }
    ];

    const total = mockExecutions.length;
    const executions = {
      executions: mockExecutions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };

    return NextResponse.json(executions);
  } catch (error) {
    console.error('Error fetching flow executions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
