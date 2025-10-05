/**
 * Represents a node in a Telegram flow blueprint
 */
export interface BlueprintNode {
  id: string;
  type: string; // Allow any type to be compatible with React Flow node types
  position: { x: number; y: number };
  data: {
    type: string;
    title: string;
    criteria?: Record<string, any>;
    message?: string;
    variableName?: string;
    [key: string]: any;
  };
}

/**
 * Represents an edge between nodes in a Telegram flow blueprint
 */
export interface BlueprintEdge {
  id: string;
  source: string;
  target: string;
}

/**
 * Represents a Telegram flow blueprint from the Telegram bot
 */
export interface TelegramBlueprint {
  id: string;
  name: string;
  description: string;
  type: string;
  nodes: BlueprintNode[];
  edges: BlueprintEdge[];
}

/**
 * Represents recent activity in the Telegram system
 */
export interface TelegramActivity {
  id: string;
  action: string;
  entityType: string;
  timestamp: string;
  username: string;
}

/**
 * Represents statistics from the Telegram system
 */
export interface TelegramStats {
  userCount: number;
  flowStats: Record<string, number>;
  watchlistCount: number;
  totalNotifications: number;
  recentActivity: TelegramActivity[];
}
