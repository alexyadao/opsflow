export type TicketPriority = 'Low' | 'Medium' | 'High' | 'Critical';

export type TicketStatus = 'Open' | 'In Progress' | 'Pending Vendor' | 'Resolved' | 'Closed';

export type TicketCategory =
  | 'Hardware'
  | 'Network'
  | 'Cloud Infrastructure'
  | 'Access & Identity'
  | 'Software & OS'
  | 'Security Alert';

export interface TicketRequester {
  name: string;
  email: string;
  department: string;
  avatar?: string;
}

export interface TicketAssignee {
  name: string;
  email: string;
  role: string;
}

export interface TicketComment {
  id: string;
  author: string;
  avatar?: string;
  role: string;
  timestamp: string;
  content: string;
  isInternal: boolean;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  requester: TicketRequester;
  assignee: TicketAssignee | null;
  assetId?: string;
  assetName?: string;
  createdAt: string;
  updatedAt: string;
  slaDue: string;
  slaBreached?: boolean;
  tags: string[];
  comments?: TicketComment[];
}

export type AssetType = 'Server Node' | 'Workstation' | 'Switch/Router' | 'Security Appliance' | 'Cloud Cluster';

export type AssetStatus = 'Operational' | 'Degraded' | 'Maintenance' | 'Decommissioned';

export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  model: string;
  ipAddress: string;
  location: string;
  assignedTo: string;
  status: AssetStatus;
  healthScore: number;
  cpuRamUsage?: string;
  uptime: string;
  lastAudited: string;
  activeTicketsCount: number;
}

export interface SystemLog {
  id: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  service: string;
  event: string;
  user: string;
  ipAddress: string;
  ticketRef?: string;
}

export interface ActivityFeedItem {
  id: string;
  actor: string;
  action: string;
  target: string;
  targetType: 'ticket' | 'asset' | 'infrastructure';
  timestamp: string;
  badge?: string;
}

export interface DashboardMetrics {
  openTickets: number;
  criticalAlerts: number;
  avgResolutionTimeHours: number;
  slaCompliancePercent: number;
  activeAssets: number;
  resolvedToday: number;
}
