import { TelegramBlueprint, TelegramStats } from '@/types/telegram.types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

/**
 * Fetches all available telegram blueprints and stats
 */
// Mock data for fallback when API is not available
const mockBlueprints = [
  // Standard blueprints
  {
    id: 'expiration-blueprint',
    name: 'Domain Expiration Monitor',
    description: 'Monitor all watched domains for upcoming expirations',
    type: 'domain_expiration',
    nodes: [
      {
        id: 'trigger',
        type: 'domainTrigger',
        position: { x: 100, y: 100 },
        data: {
          type: 'domain_expiration',
          title: 'Domain Expiration Trigger'
        }
      },
      {
        id: 'notification',
        type: 'notification',
        position: { x: 300, y: 100 },
        data: {
          type: 'telegram_notification',
          title: 'Send Telegram Alert'
        }
      }
    ],
    edges: [
      {
        id: 'trigger-to-notification',
        source: 'trigger',
        target: 'notification'
      }
    ]
  },
  {
    id: 'burn-blueprint',
    name: 'Burn Opportunity Monitor',
    description: 'Get alerted when domains are burned and become available',
    type: 'domain_burn',
    nodes: [
      {
        id: 'trigger',
        type: 'domainTrigger',
        position: { x: 100, y: 100 },
        data: {
          type: 'domain_burn',
          title: 'Domain Burn Event'
        }
      },
      {
        id: 'filter',
        type: 'condition',
        position: { x: 300, y: 100 },
        data: {
          type: 'domain_filter',
          title: 'Filter Valuable Domains',
          criteria: {
            maxLength: 8,
            excludeNumbers: true,
            minValue: 0
          }
        }
      },
      {
        id: 'notification',
        type: 'notification',
        position: { x: 500, y: 100 },
        data: {
          type: 'telegram_notification',
          title: 'Opportunity Alert'
        }
      }
    ],
    edges: [
      {
        id: 'trigger-to-filter',
        source: 'trigger',
        target: 'filter'
      },
      {
        id: 'filter-to-notification',
        source: 'filter',
        target: 'notification'
      }
    ]
  },
  
  // Telegram Command Blueprints
  {
    id: 'watch-command-blueprint',
    name: 'Watch Command Handler',
    description: 'Handle /watch <domain> <days> command to add domain to watchlist',
    type: 'telegram_command',
    nodes: [
      {
        id: 'command-trigger',
        type: 'start',
        position: { x: 100, y: 100 },
        data: {
          type: 'telegram_command',
          title: '/watch Command',
          message: 'Command: /watch <domain> <days>',
          command: 'watch'
        }
      },
      {
        id: 'parse-args',
        type: 'condition',
        position: { x: 300, y: 100 },
        data: {
          type: 'argument_validation',
          title: 'Validate Arguments',
          condition: 'args.length === 2 && isValidDomain(args[0]) && isNumber(args[1])'
        }
      },
      {
        id: 'add-to-watchlist',
        type: 'action',
        position: { x: 500, y: 0 },
        data: {
          type: 'domain_action',
          title: 'Add to Watchlist',
          actionType: 'add_watchlist'
        }
      },
      {
        id: 'success-message',
        type: 'message',
        position: { x: 700, y: 0 },
        data: {
          type: 'telegram_message',
          title: 'Success Message',
          message: 'Domain ${domain} added to watchlist. You will be notified ${days} days before expiration.'
        }
      },
      {
        id: 'error-message',
        type: 'message',
        position: { x: 500, y: 200 },
        data: {
          type: 'telegram_message',
          title: 'Error Message',
          message: 'Invalid command format. Usage: /watch <domain> <days>'
        }
      }
    ],
    edges: [
      {
        id: 'command-to-validation',
        source: 'command-trigger',
        target: 'parse-args'
      },
      {
        id: 'valid-to-action',
        source: 'parse-args',
        target: 'add-to-watchlist',
        label: 'valid'
      },
      {
        id: 'action-to-success',
        source: 'add-to-watchlist',
        target: 'success-message'
      },
      {
        id: 'invalid-to-error',
        source: 'parse-args',
        target: 'error-message',
        label: 'invalid'
      }
    ]
  },
  {
    id: 'flow-command-blueprint',
    name: 'Flow Command Handler',
    description: 'Handle /flow commands to manage Telegram flows',
    type: 'telegram_command',
    nodes: [
      {
        id: 'command-trigger',
        type: 'start',
        position: { x: 100, y: 100 },
        data: {
          type: 'telegram_command',
          title: '/flow Command',
          message: 'Command: /flow [list|create|delete] [name]',
          command: 'flow'
        }
      },
      {
        id: 'parse-action',
        type: 'condition',
        position: { x: 300, y: 100 },
        data: {
          type: 'command_action',
          title: 'Parse Action',
          condition: 'args[0] in ["list", "create", "delete"]'
        }
      },
      {
        id: 'list-flows',
        type: 'action',
        position: { x: 500, y: 0 },
        data: {
          type: 'flow_action',
          title: 'List Flows',
          actionType: 'list'
        }
      },
      {
        id: 'create-flow',
        type: 'action',
        position: { x: 500, y: 100 },
        data: {
          type: 'flow_action',
          title: 'Create Flow',
          actionType: 'create'
        }
      },
      {
        id: 'delete-flow',
        type: 'action',
        position: { x: 500, y: 200 },
        data: {
          type: 'flow_action',
          title: 'Delete Flow',
          actionType: 'delete'
        }
      },
      {
        id: 'respond-result',
        type: 'message',
        position: { x: 700, y: 100 },
        data: {
          type: 'telegram_message',
          title: 'Response Message',
          message: '${actionResult}'
        }
      },
      {
        id: 'help-message',
        type: 'message',
        position: { x: 300, y: 250 },
        data: {
          type: 'telegram_message',
          title: 'Help Message',
          message: 'Usage:\n/flow list - Show all flows\n/flow create <name> - Create a new flow\n/flow delete <name> - Delete a flow'
        }
      }
    ],
    edges: [
      {
        id: 'command-to-parse',
        source: 'command-trigger',
        target: 'parse-action'
      },
      {
        id: 'list-action',
        source: 'parse-action',
        target: 'list-flows',
        label: 'list'
      },
      {
        id: 'create-action',
        source: 'parse-action',
        target: 'create-flow',
        label: 'create'
      },
      {
        id: 'delete-action',
        source: 'parse-action',
        target: 'delete-flow',
        label: 'delete'
      },
      {
        id: 'list-to-response',
        source: 'list-flows',
        target: 'respond-result'
      },
      {
        id: 'create-to-response',
        source: 'create-flow',
        target: 'respond-result'
      },
      {
        id: 'delete-to-response',
        source: 'delete-flow',
        target: 'respond-result'
      },
      {
        id: 'invalid-to-help',
        source: 'command-trigger',
        target: 'help-message'
      }
    ]
  },
  {
    id: 'watchlist-command-blueprint',
    name: 'Watchlist Command Handler',
    description: 'Handle /watchlist command to view and manage domains',
    type: 'telegram_command',
    nodes: [
      {
        id: 'command-trigger',
        type: 'start',
        position: { x: 100, y: 100 },
        data: {
          type: 'telegram_command',
          title: '/watchlist Command',
          message: 'Command: /watchlist [remove <id>]',
          command: 'watchlist'
        }
      },
      {
        id: 'parse-action',
        type: 'condition',
        position: { x: 300, y: 100 },
        data: {
          type: 'command_action',
          title: 'Parse Action',
          condition: 'args.length > 0 && args[0] === "remove"'
        }
      },
      {
        id: 'list-domains',
        type: 'action',
        position: { x: 500, y: 0 },
        data: {
          type: 'domain_action',
          title: 'List Watched Domains',
          actionType: 'list_watchlist'
        }
      },
      {
        id: 'remove-domain',
        type: 'action',
        position: { x: 500, y: 200 },
        data: {
          type: 'domain_action',
          title: 'Remove Domain',
          actionType: 'remove_watchlist'
        }
      },
      {
        id: 'watchlist-response',
        type: 'message',
        position: { x: 700, y: 100 },
        data: {
          type: 'telegram_message',
          title: 'Watchlist Response',
          message: '${watchlistResult}'
        }
      }
    ],
    edges: [
      {
        id: 'command-to-parse',
        source: 'command-trigger',
        target: 'parse-action'
      },
      {
        id: 'show-watchlist',
        source: 'parse-action',
        target: 'list-domains',
        label: 'list'
      },
      {
        id: 'remove-from-watchlist',
        source: 'parse-action',
        target: 'remove-domain',
        label: 'remove'
      },
      {
        id: 'list-to-response',
        source: 'list-domains',
        target: 'watchlist-response'
      },
      {
        id: 'remove-to-response',
        source: 'remove-domain',
        target: 'watchlist-response'
      }
    ]
  }
]

const mockStats = {
  userCount: 238,
  flowCount: 54,
  watchlistCount: 892,
  totalNotifications: 1463
};

export async function fetchTelegramBlueprints(): Promise<{ blueprints: TelegramBlueprint[], stats: any }> {
  try {
    // Using modern fetch with AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
    
    const response = await fetch(`${API_URL}/api/telegram/blueprints`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      mode: 'cors', // Enable CORS
      credentials: 'same-origin',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.warn('Failed to fetch telegram blueprints, using mock data:', error);
    // Return mock data instead of throwing
    return { 
      blueprints: mockBlueprints, 
      stats: mockStats 
    };
  }
}

/**
 * Fetches telegram statistics
 */
// Mock stats data
const mockTelegramStats: TelegramStats = {
  userCount: 238,
  flowStats: {
    'domain_expiration': 34,
    'domain_burn': 12,
    'smart_filter': 8
  },
  watchlistCount: 892,
  recentActivity: [
    {
      id: 'act1',
      action: 'watch_domain',
      entityType: 'domain',
      timestamp: new Date().toISOString(),
      username: 'alice_eth'
    },
    {
      id: 'act2',
      action: 'create_flow',
      entityType: 'flow',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      username: 'crypto_bob'
    },
    {
      id: 'act3',
      action: 'domain_notification',
      entityType: 'domain',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      username: 'domain_hunter'
    }
  ]
};

export async function fetchTelegramStats(): Promise<TelegramStats> {
  try {
    // Using modern fetch with AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
    
    const response = await fetch(`${API_URL}/api/telegram/stats`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      credentials: 'same-origin',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.warn('Failed to fetch telegram stats, using mock data:', error);
    // Return mock data instead of throwing
    return mockTelegramStats;
  }
}
