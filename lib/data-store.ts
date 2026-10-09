import { Ticket, Asset, SystemLog, ActivityFeedItem, DashboardMetrics } from './types';

// In-memory data store with realistic enterprise IT Helpdesk & Infrastructure records
let tickets: Ticket[] = [
  {
    id: 'OPS-1049',
    title: 'Core Switch Cisco 9300 Fan Tray 2 Sensor Fault',
    description: 'Hardware telemetry triggered amber alert on DataCenter rack B-04. Redundant fan running at max RPM; replacement module requested on warranty RMA.',
    category: 'Hardware',
    priority: 'Critical',
    status: 'In Progress',
    requester: {
      name: 'Marcus Vance',
      email: 'm.vance@opsflow.internal',
      department: 'Infrastructure SecOps',
    },
    assignee: {
      name: 'Elena Rostova',
      email: 'e.rostova@opsflow.internal',
      role: 'Lead Network Engineer',
    },
    assetId: 'SW-CORE-DC1',
    assetName: 'Cisco Catalyst 9300-48UXM (DC1)',
    createdAt: new Date(Date.now() - 42 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    slaDue: new Date(Date.now() + 118 * 60 * 1000).toISOString(),
    tags: ['Datacenter', 'Hardware', 'Switching', 'RMA'],
    comments: [
      {
        id: 'c-1',
        author: 'Elena Rostova',
        role: 'Lead Network Engineer',
        timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
        content: 'RMA dispatch reference #CS-89214 initiated with Cisco TAC. Spare unit is staged in DC1 staging cage.',
        isInternal: true,
      },
    ],
  },
  {
    id: 'OPS-1048',
    title: 'Production Read-Replica NVMe IOPS Latency Spike',
    description: 'Cloudwatch alarm p99 disk read latency exceeded 45ms on RDS Postgres Aurora cluster us-east-1a during batch indexing job.',
    category: 'Cloud Infrastructure',
    priority: 'High',
    status: 'Open',
    requester: {
      name: 'Devon Lee',
      email: 'd.lee@opsflow.internal',
      department: 'Data Platform Team',
    },
    assignee: {
      name: 'Tariq Al-Mansoor',
      email: 't.mansoor@opsflow.internal',
      role: 'Staff SRE',
    },
    assetId: 'K8S-CLUSTER-PROD',
    assetName: 'AWS Aurora RDS Node Replica-03',
    createdAt: new Date(Date.now() - 95 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    slaDue: new Date(Date.now() + 245 * 60 * 1000).toISOString(),
    tags: ['AWS', 'RDS', 'Postgres', 'Performance'],
    comments: [],
  },
  {
    id: 'OPS-1047',
    title: 'Okta SAML SSO Token Mismatch for Engineering Gitlab',
    description: 'Developers reporting HTTP 403 invalid recipient certificate when authenticating via SSO since the 02:00 UTC certificate rollover.',
    category: 'Access & Identity',
    priority: 'High',
    status: 'In Progress',
    requester: {
      name: 'Sarah Chen',
      email: 's.chen@opsflow.internal',
      department: 'Platform Engineering',
    },
    assignee: {
      name: 'Marcus Vance',
      email: 'm.vance@opsflow.internal',
      role: 'IAM Administrator',
    },
    assetId: 'SRV-PROD-DB-01',
    assetName: 'Okta SAML Identity Bridge',
    createdAt: new Date(Date.now() - 180 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    slaDue: new Date(Date.now() + 180 * 60 * 1000).toISOString(),
    tags: ['IAM', 'Okta', 'SAML', 'SSO'],
    comments: [
      {
        id: 'c-2',
        author: 'Marcus Vance',
        role: 'IAM Administrator',
        timestamp: new Date(Date.now() - 50 * 60 * 1000).toISOString(),
        content: 'Regenerating x509 cert in Okta tenant app settings and updating GitLab metadata XML.',
        isInternal: true,
      },
    ],
  },
  {
    id: 'OPS-1046',
    title: 'Workstation DisplayLink Dual-Monitor Kernel Panic',
    description: 'Executive workstation Dell XPS 15 crashing on Sonoma 14.5 when connecting to CalDigit TS4 dock with dual 4K DisplayPort monitors.',
    category: 'Hardware',
    priority: 'Medium',
    status: 'Pending Vendor',
    requester: {
      name: 'Claire Beauchamp',
      email: 'c.beauchamp@opsflow.internal',
      department: 'Finance & Strategy',
    },
    assignee: {
      name: 'Jordan Miller',
      email: 'j.miller@opsflow.internal',
      role: 'IT Desktop Support Lead',
    },
    assetId: 'WK-ENG-M3-44',
    assetName: 'Dell XPS 15 9530 (Asset #2104)',
    createdAt: new Date(Date.now() - 360 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 110 * 60 * 1000).toISOString(),
    slaDue: new Date(Date.now() + 620 * 60 * 1000).toISOString(),
    tags: ['macOS', 'Docking', 'DisplayLink'],
    comments: [
      {
        id: 'c-3',
        author: 'Jordan Miller',
        role: 'IT Desktop Support Lead',
        timestamp: new Date(Date.now() - 110 * 60 * 1000).toISOString(),
        content: 'Provided temporary Anker USB-C dock loaner while awaiting firmware v1.4 patch from CalDigit support.',
        isInternal: false,
      },
    ],
  },
  {
    id: 'OPS-1045',
    title: 'GlobalProtect VPN Gateway Certificate Auto-Renewal Expired',
    description: 'Palo Alto PA-3220 portal wildcard certificate warning: expires in 48 hours. Certbot DNS challenge hook needs API secret update.',
    category: 'Security Alert',
    priority: 'Medium',
    status: 'Open',
    requester: {
      name: 'Automated SecOps Bot',
      email: 'soc-monitors@opsflow.internal',
      department: 'Automated Monitoring',
    },
    assignee: null,
    assetId: 'FW-EDGE-P1',
    assetName: 'Palo Alto PA-3220 Perimeter Firewall',
    createdAt: new Date(Date.now() - 480 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 480 * 60 * 1000).toISOString(),
    slaDue: new Date(Date.now() + 1440 * 60 * 1000).toISOString(),
    tags: ['Firewall', 'SSL', 'VPN', 'Security'],
    comments: [],
  },
  {
    id: 'OPS-1044',
    title: 'Docker Build Cache Disk Space Exceeded on Jenkins Agent 04',
    description: 'Volume /var/lib/docker reached 96% capacity on CI runner node `ci-builder-04.internal`. Automated prune cron failed due to locked overlay fs.',
    category: 'Software & OS',
    priority: 'Low',
    status: 'Resolved',
    requester: {
      name: 'Nikhil Rao',
      email: 'n.rao@opsflow.internal',
      department: 'DevOps / CI-CD',
    },
    assignee: {
      name: 'Elena Rostova',
      email: 'e.rostova@opsflow.internal',
      role: 'Lead Network Engineer',
    },
    assetId: 'SRV-PROD-DB-01',
    assetName: 'CI Runner Bare Metal Node 04',
    createdAt: new Date(Date.now() - 1440 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
    slaDue: new Date(Date.now() - 600 * 60 * 1000).toISOString(),
    tags: ['Docker', 'CI/CD', 'Disk Space', 'Resolved'],
    comments: [
      {
        id: 'c-4',
        author: 'Elena Rostova',
        role: 'Lead Network Engineer',
        timestamp: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
        content: 'Flushed orphaned buildx containers and expanded underlying LVM thin pool by 200GB.',
        isInternal: true,
      },
    ],
  },
  {
    id: 'OPS-1043',
    title: 'Figma Enterprise License & Brand Asset Drive Permissions',
    description: 'Need seat upgrade to Figma Enterprise and access to the shared Google Drive brand asset repository for Q4 product campaigns.',
    category: 'Software & OS',
    priority: 'Low',
    status: 'In Progress',
    requester: {
      name: 'Taylor Morgan',
      email: 't.morgan@opsflow.internal',
      department: 'Product Marketing',
    },
    assignee: {
      name: 'Marcus Vance',
      email: 'm.vance@opsflow.internal',
      role: 'IAM Administrator',
    },
    createdAt: new Date(Date.now() - 240 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 75 * 60 * 1000).toISOString(),
    slaDue: new Date(Date.now() + 720 * 60 * 1000).toISOString(),
    tags: ['Figma', 'Permissions', 'Software'],
    comments: [
      {
        id: 'c-5',
        author: 'Marcus Vance',
        role: 'IAM Administrator',
        timestamp: new Date(Date.now() - 75 * 60 * 1000).toISOString(),
        content: 'Approved by manager. Provisioning Okta application group assignment for Figma SCIM.',
        isInternal: false,
      },
    ],
  },
  {
    id: 'OPS-1041',
    title: 'Replacement USB-C to DisplayPort Adapter for Desk 210',
    description: 'Current dongle intermittently flickers at 60Hz. Requested replacement high-speed DisplayPort 1.4 adapter.',
    category: 'Hardware',
    priority: 'Low',
    status: 'Resolved',
    requester: {
      name: 'Taylor Morgan',
      email: 't.morgan@opsflow.internal',
      department: 'Product Marketing',
    },
    assignee: {
      name: 'Jordan Miller',
      email: 'j.miller@opsflow.internal',
      role: 'IT Desktop Support Lead',
    },
    createdAt: new Date(Date.now() - 2880 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1440 * 60 * 1000).toISOString(),
    slaDue: new Date(Date.now() - 1000 * 60 * 1000).toISOString(),
    tags: ['Hardware', 'Peripherals', 'Resolved'],
    comments: [
      {
        id: 'c-6',
        author: 'Jordan Miller',
        role: 'IT Desktop Support Lead',
        timestamp: new Date(Date.now() - 1440 * 60 * 1000).toISOString(),
        content: 'Delivered Anker 4K@120Hz adapter to Desk 210.',
        isInternal: false,
      },
    ],
  },
];

let assets: Asset[] = [
  {
    id: 'SW-CORE-DC1',
    name: 'Cisco Catalyst 9300-48UXM (Core DC1)',
    type: 'Switch/Router',
    model: 'Catalyst 9300 Modular Uplink',
    ipAddress: '10.240.0.1',
    location: 'Ashburn Datacenter / Rack B-04 / U12',
    assignedTo: 'Network Operations (NOC)',
    status: 'Degraded',
    healthScore: 78,
    cpuRamUsage: 'CPU: 18% | RAM: 42%',
    uptime: '184d 14h',
    lastAudited: '2026-09-15',
    activeTicketsCount: 1,
  },
  {
    id: 'SRV-PROD-DB-01',
    name: 'Dell PowerEdge R750 (Postgres Primary)',
    type: 'Server Node',
    model: 'PowerEdge R750 2x Xeon Platinum 8368',
    ipAddress: '10.240.12.10',
    location: 'Ashburn Datacenter / Rack A-01 / U04-U06',
    assignedTo: 'Data Platform Operations',
    status: 'Operational',
    healthScore: 99,
    cpuRamUsage: 'CPU: 32% | RAM: 74%',
    uptime: '312d 08h',
    lastAudited: '2026-10-01',
    activeTicketsCount: 0,
  },
  {
    id: 'FW-EDGE-P1',
    name: 'Palo Alto PA-3220 Edge Firewall',
    type: 'Security Appliance',
    model: 'PA-3220 Enterprise Threat Prevention',
    ipAddress: '198.51.100.2',
    location: 'Ashburn Datacenter / Rack E-01 / U20',
    assignedTo: 'InfoSec Infrastructure',
    status: 'Operational',
    healthScore: 94,
    cpuRamUsage: 'CPU: 28% | RAM: 51%',
    uptime: '92d 19h',
    lastAudited: '2026-09-28',
    activeTicketsCount: 1,
  },
  {
    id: 'K8S-CLUSTER-PROD',
    name: 'EKS Production Cluster (Nodes 1-24)',
    type: 'Cloud Cluster',
    model: 'AWS Kubernetes v1.31 Managed Group',
    ipAddress: '172.31.0.0/16',
    location: 'AWS us-east-1 (N. Virginia)',
    assignedTo: 'SRE & Cloud Engineering',
    status: 'Operational',
    healthScore: 96,
    cpuRamUsage: 'CPU: 64% | RAM: 68%',
    uptime: '420d 02h',
    lastAudited: '2026-10-05',
    activeTicketsCount: 1,
  },
  {
    id: 'WK-ENG-M3-44',
    name: 'MacBook Pro 16" M3 Max (Dev-Lead)',
    type: 'Workstation',
    model: 'Apple Silicon M3 Max / 64GB / 2TB',
    ipAddress: '10.240.88.14',
    location: 'HQ San Francisco / Floor 4 / Desk 412',
    assignedTo: 'Devon Lee (Data Platform)',
    status: 'Maintenance',
    healthScore: 82,
    cpuRamUsage: 'Battery Health: 94%',
    uptime: '14d 06h',
    lastAudited: '2026-08-12',
    activeTicketsCount: 1,
  },
  {
    id: 'SAN-STORAGE-01',
    name: 'PureStorage FlashArray//X70 R3',
    type: 'Server Node',
    model: 'DirectFlash NVMe Array 150TB',
    ipAddress: '10.240.10.5',
    location: 'Ashburn Datacenter / Rack C-02 / U08',
    assignedTo: 'Infrastructure Storage',
    status: 'Operational',
    healthScore: 100,
    cpuRamUsage: 'Capacity: 48% allocated',
    uptime: '504d 11h',
    lastAudited: '2026-09-01',
    activeTicketsCount: 0,
  },
];

let systemLogs: SystemLog[] = [
  {
    id: 'LOG-8812',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    severity: 'critical',
    service: 'snmp-trap-collector',
    event: 'SNMP trap: FanTray 2 RPM dropped below minimum threshold (0 RPM)',
    user: 'system/monitoring-daemon',
    ipAddress: '10.240.0.1',
    ticketRef: 'OPS-1049',
  },
  {
    id: 'LOG-8811',
    timestamp: new Date(Date.now() - 14 * 60 * 1000).toISOString(),
    severity: 'warning',
    service: 'auth-gateway',
    event: 'SAML Signature Verification Failed for assertion Issuer https://okta.opsflow.internal',
    user: 's.chen@opsflow.internal',
    ipAddress: '192.168.4.112',
    ticketRef: 'OPS-1047',
  },
  {
    id: 'LOG-8810',
    timestamp: new Date(Date.now() - 28 * 60 * 1000).toISOString(),
    severity: 'info',
    service: 'ansible-automation',
    event: 'Playbook `patch-security-kernel-cve-2026-44` successfully executed across 18 nodes',
    user: 'elena.rostova',
    ipAddress: '10.240.100.4',
  },
  {
    id: 'LOG-8809',
    timestamp: new Date(Date.now() - 41 * 60 * 1000).toISOString(),
    severity: 'error',
    service: 'vpn-concentrator',
    event: 'SSL Handshake failure: Gateway certificate near expiry warning (48 hours remaining)',
    user: 'daemon/certwatch',
    ipAddress: '198.51.100.2',
    ticketRef: 'OPS-1045',
  },
  {
    id: 'LOG-8808',
    timestamp: new Date(Date.now() - 62 * 60 * 1000).toISOString(),
    severity: 'info',
    service: 'dhcp-server-isc',
    event: 'DHCPACK on 10.240.88.14 to 3c:22:fb:8a:99:10 (WK-ENG-M3-44) via vlan88',
    user: 'dhcpd',
    ipAddress: '10.240.88.1',
  },
  {
    id: 'LOG-8807',
    timestamp: new Date(Date.now() - 85 * 60 * 1000).toISOString(),
    severity: 'warning',
    service: 'cloudwatch-exporter',
    event: 'AuroraReadReplicaLatencyHigh: p99 latency spiked to 48.2ms',
    user: 'aws-metrics-bridge',
    ipAddress: '172.31.12.8',
    ticketRef: 'OPS-1048',
  },
  {
    id: 'LOG-8806',
    timestamp: new Date(Date.now() - 110 * 60 * 1000).toISOString(),
    severity: 'info',
    service: 'backup-manager',
    event: 'Snapshot snapshot-prod-db-daily-20261008 finished (2.4TB transferred, checksum verified)',
    user: 'backup-cron',
    ipAddress: '10.240.10.5',
  },
];

let activityFeed: ActivityFeedItem[] = [
  {
    id: 'act-1',
    actor: 'Elena Rostova',
    action: 'claimed ticket and updated status to In Progress',
    target: 'OPS-1049 (Cisco Catalyst Fan Fault)',
    targetType: 'ticket',
    timestamp: '12m ago',
    badge: 'In Progress',
  },
  {
    id: 'act-2',
    actor: 'Automated SecOps Bot',
    action: 'triggered alert and filed ticket',
    target: 'OPS-1045 (VPN Gateway Certificate Warning)',
    targetType: 'ticket',
    timestamp: '48m ago',
    badge: 'New Alert',
  },
  {
    id: 'act-3',
    actor: 'Marcus Vance',
    action: 'added troubleshooting note to',
    target: 'OPS-1047 (Okta SAML SSO Mismatch)',
    targetType: 'ticket',
    timestamp: '1h 10m ago',
  },
  {
    id: 'act-4',
    actor: 'Elena Rostova',
    action: 'marked as Resolved and verified SLA',
    target: 'OPS-1044 (Docker Build Cache Disk Space)',
    targetType: 'ticket',
    timestamp: '2h ago',
    badge: 'Resolved',
  },
  {
    id: 'act-5',
    actor: 'Devon Lee',
    action: 'updated firmware tracking on asset',
    target: 'Dell XPS 15 9530 (#2104)',
    targetType: 'asset',
    timestamp: '3h ago',
  },
];

// Helper functions for tickets
export function getAllTickets(): Ticket[] {
  return [...tickets];
}

export function getTicketById(id: string): Ticket | undefined {
  return tickets.find((t) => t.id.toLowerCase() === id.toLowerCase());
}

export function createTicket(ticketData: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'slaDue' | 'comments'>): Ticket {
  const nextNum = 1050 + tickets.length;
  const newId = `OPS-${nextNum}`;
  const now = new Date().toISOString();
  
  // Calculate SLA based on priority
  let slaMinutes = 240; // Default 4 hours
  if (ticketData.priority === 'Critical') slaMinutes = 60; // 1 hour SLA
  else if (ticketData.priority === 'High') slaMinutes = 120; // 2 hours
  else if (ticketData.priority === 'Medium') slaMinutes = 480; // 8 hours
  else slaMinutes = 1440; // 24 hours

  const slaDue = new Date(Date.now() + slaMinutes * 60 * 1000).toISOString();

  const newTicket: Ticket = {
    ...ticketData,
    id: newId,
    createdAt: now,
    updatedAt: now,
    slaDue,
    status: ticketData.status || 'Open',
    comments: [],
  };

  tickets.unshift(newTicket);

  // Also log activity
  activityFeed.unshift({
    id: `act-${Date.now()}`,
    actor: ticketData.requester.name || 'Support Agent',
    action: 'created ticket',
    target: `${newId} (${newTicket.title.slice(0, 32)}...)`,
    targetType: 'ticket',
    timestamp: 'Just now',
    badge: newTicket.priority,
  });

  // Also append to system logs
  systemLogs.unshift({
    id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
    timestamp: now,
    severity: newTicket.priority === 'Critical' ? 'critical' : newTicket.priority === 'High' ? 'warning' : 'info',
    service: 'opsflow-tickets-engine',
    event: `Ticket ${newId} logged: [${newTicket.category}] ${newTicket.title}`,
    user: newTicket.requester.email,
    ipAddress: '10.240.100.8',
    ticketRef: newId,
  });

  return newTicket;
}

export function updateTicket(id: string, updates: Partial<Ticket>): Ticket | null {
  const index = tickets.findIndex((t) => t.id.toLowerCase() === id.toLowerCase());
  if (index === -1) return null;

  const prevTicket = tickets[index];
  const updatedTicket: Ticket = {
    ...prevTicket,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  tickets[index] = updatedTicket;

  if (updates.status && updates.status !== prevTicket.status) {
    activityFeed.unshift({
      id: `act-${Date.now()}`,
      actor: 'Alex Yadao (Lead SysAdmin)',
      action: `changed status from ${prevTicket.status} to ${updates.status} on`,
      target: updatedTicket.id,
      targetType: 'ticket',
      timestamp: 'Just now',
      badge: updates.status,
    });
  }

  return updatedTicket;
}

export function deleteTicket(id: string): boolean {
  const initialLen = tickets.length;
  tickets = tickets.filter((t) => t.id.toLowerCase() !== id.toLowerCase());
  return tickets.length < initialLen;
}

export function addTicketComment(ticketId: string, comment: { author: string; role: string; content: string; isInternal?: boolean }) {
  const ticket = getTicketById(ticketId);
  if (!ticket) return null;

  const newComment = {
    id: `c-${Date.now()}`,
    author: comment.author,
    role: comment.role,
    content: comment.content,
    timestamp: new Date().toISOString(),
    isInternal: comment.isInternal ?? true,
  };

  if (!ticket.comments) ticket.comments = [];
  ticket.comments.push(newComment);
  ticket.updatedAt = new Date().toISOString();

  return newComment;
}

// Assets helpers
export function getAllAssets(): Asset[] {
  return [...assets];
}

// Logs helpers
export function getAllLogs(): SystemLog[] {
  return [...systemLogs];
}

// Activity helpers
export function getActivityFeed(): ActivityFeedItem[] {
  return [...activityFeed];
}

// Metrics
export function getDashboardMetrics(): DashboardMetrics {
  const openCount = tickets.filter((t) => t.status !== 'Resolved' && t.status !== 'Closed').length;
  const criticalCount = tickets.filter((t) => t.priority === 'Critical' && t.status !== 'Resolved' && t.status !== 'Closed').length;
  const resolvedToday = tickets.filter((t) => t.status === 'Resolved' || t.status === 'Closed').length;

  return {
    openTickets: openCount,
    criticalAlerts: criticalCount,
    avgResolutionTimeHours: 1.8,
    slaCompliancePercent: 98.4,
    activeAssets: assets.filter((a) => a.status === 'Operational').length,
    resolvedToday,
  };
}
