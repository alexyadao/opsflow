'use client';

import React from 'react';
import {
  AlertTriangle,
  Clock,
  CheckCircle,
  Inbox,
  ArrowUpRight,
  ShieldAlert,
  Server,
  ArrowRight,
  TrendingDown,
  User,
  Zap,
} from 'lucide-react';
import { Ticket, DashboardMetrics, ActivityFeedItem } from '@/lib/types';
import { NavTab } from './Sidebar';

interface DashboardViewProps {
  metrics: DashboardMetrics;
  tickets: Ticket[];
  activityFeed: ActivityFeedItem[];
  onNavigateToTab: (tab: NavTab) => void;
  onSelectTicket: (ticket: Ticket) => void;
  onOpenNewTicketModal: () => void;
}

export default function DashboardView({
  metrics,
  tickets,
  activityFeed,
  onNavigateToTab,
  onSelectTicket,
  onOpenNewTicketModal,
}: DashboardViewProps) {
  // Urgent tickets (Critical or High priority that are Open or In Progress)
  const urgentTickets = tickets.filter(
    (t) => (t.priority === 'Critical' || t.priority === 'High') && t.status !== 'Resolved' && t.status !== 'Closed'
  );

  // Group tickets by category for distribution
  const categoryCounts = tickets.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalTickets = tickets.length || 1;

  const categories = [
    { name: 'Hardware', count: categoryCounts['Hardware'] || 0, color: 'bg-blue-500' },
    { name: 'Cloud Infrastructure', count: categoryCounts['Cloud Infrastructure'] || 0, color: 'bg-indigo-500' },
    { name: 'Network', count: categoryCounts['Network'] || 0, color: 'bg-cyan-500' },
    { name: 'Access & Identity', count: categoryCounts['Access & Identity'] || 0, color: 'bg-amber-500' },
    { name: 'Security Alert', count: categoryCounts['Security Alert'] || 0, color: 'bg-red-500' },
    { name: 'Software & OS', count: categoryCounts['Software & OS'] || 0, color: 'bg-emerald-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner Alert if Critical issues exist */}
      {metrics.criticalAlerts > 0 && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2 rounded-lg bg-red-900/50 border border-red-700/60 text-red-400 shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white flex items-center gap-2">
                <span>{metrics.criticalAlerts} Critical Infrastructure Incident Active</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-900/80 text-red-300 border border-red-700/80 uppercase">
                  P1 Incident
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Core Switch Fan Tray sensor fault in Datacenter Rack B-04 requires hardware dispatch.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateToTab('tickets')}
            className="flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 active:bg-red-700 text-white text-xs font-medium shrink-0 transition-colors cursor-pointer"
          >
            <span>Triage Active Incidents</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Open Tickets */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Open Tickets</span>
            <div className="p-1.5 rounded-md bg-blue-950/80 text-blue-400 border border-blue-800/60">
              <Inbox className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono text-white tabular-nums">
              {metrics.openTickets}
            </div>
            <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400">
              <span>{tickets.filter((t) => t.status === 'In Progress').length} in progress</span>
              <span className="text-blue-400 font-medium cursor-pointer hover:underline" onClick={() => onNavigateToTab('tickets')}>
                View all →
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Critical Alerts */}
        <div className={`p-4 rounded-xl border flex flex-col justify-between ${
          metrics.criticalAlerts > 0
            ? 'bg-red-950/20 border-red-900/60 shadow-sm shadow-red-950/30'
            : 'bg-slate-900/70 border-slate-800/80'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Critical Alerts</span>
            <div className={`p-1.5 rounded-md border ${
              metrics.criticalAlerts > 0
                ? 'bg-red-950/80 text-red-400 border-red-800/80'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}>
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono text-white tabular-nums flex items-baseline gap-2">
              <span>{metrics.criticalAlerts}</span>
              {metrics.criticalAlerts > 0 ? (
                <span className="text-xs font-sans font-medium text-red-400">Requires Triage</span>
              ) : (
                <span className="text-xs font-sans font-medium text-emerald-400">All Clear</span>
              )}
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-400">
              <span>Datacenter Mesh: Rack B-04 alert</span>
            </div>
          </div>
        </div>

        {/* Card 3: Avg Resolution Time */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Avg Resolution Time</span>
            <div className="p-1.5 rounded-md bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono text-white tabular-nums flex items-baseline gap-2">
              <span>{metrics.avgResolutionTimeHours}h</span>
              <span className="text-xs font-sans font-medium text-emerald-400 flex items-center gap-0.5">
                <TrendingDown className="w-3 h-3" />
                -14% vs avg
              </span>
            </div>
            <div className="mt-1 text-[11px] text-slate-400">
              Target SLA: &lt; 2.5h median
            </div>
          </div>
        </div>

        {/* Card 4: SLA Compliance */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">SLA Compliance</span>
            <div className="p-1.5 rounded-md bg-cyan-950/80 text-cyan-400 border border-cyan-800/60">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono text-white tabular-nums flex items-baseline gap-2">
              <span>{metrics.slaCompliancePercent}%</span>
              <span className="text-xs font-sans font-medium text-cyan-400">Target 98%</span>
            </div>
            <div className="mt-1 text-[11px] text-slate-400">
              {metrics.resolvedToday} tickets closed today
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column Section: Urgent Queue + Activity Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): High Priority Incident Queue */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-white tracking-tight">
                High Priority Queue
              </h2>
              <span className="text-xs font-mono text-slate-400 tabular-nums">
                ({urgentTickets.length} active)
              </span>
            </div>
            <button
              onClick={() => onNavigateToTab('tickets')}
              className="text-xs font-medium text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
            >
              <span>Open board</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {urgentTickets.length === 0 ? (
              <div className="p-8 rounded-xl bg-slate-900/40 border border-slate-800 text-center">
                <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <h3 className="text-xs font-semibold text-white">No Critical or High Incidents</h3>
                <p className="text-xs text-slate-400 mt-1">All high-priority tickets have been resolved.</p>
              </div>
            ) : (
              urgentTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  onClick={() => onSelectTicket(ticket)}
                  className="p-4 rounded-xl bg-slate-900/70 hover:bg-slate-900 border border-slate-800/90 hover:border-slate-700/80 transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="font-mono text-xs font-semibold text-blue-400">
                          {ticket.id}
                        </span>
                        <span aria-hidden="true" className="text-slate-600">·</span>
                        <span className="text-slate-400">{ticket.category}</span>
                        <span aria-hidden="true" className="text-slate-600">·</span>
                        <span
                          className={`font-medium ${
                            ticket.priority === 'Critical'
                              ? 'text-red-400'
                              : 'text-amber-400'
                          }`}
                        >
                          {ticket.priority} Priority
                        </span>
                      </div>

                      <h3 className="text-xs sm:text-sm font-semibold text-white group-hover:text-blue-300 transition-colors line-clamp-1">
                        {ticket.title}
                      </h3>

                      <p className="text-xs text-slate-400 line-clamp-2">
                        {ticket.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-400 font-mono">
                        {ticket.assetName && (
                          <div className="flex items-center gap-1 text-slate-300">
                            <Server className="w-3 h-3 text-slate-500" />
                            <span className="truncate max-w-[140px]">{ticket.assetName}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3 text-slate-500" />
                          <span>{ticket.assignee ? ticket.assignee.name : 'Unassigned'}</span>
                        </div>
                        <div className="text-slate-400">
                          Status: <span className="text-slate-200 capitalize">{ticket.status}</span>
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 flex flex-col items-end gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800/90 border border-slate-700 text-slate-300">
                        {ticket.status}
                      </span>
                      <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-blue-400 transition-colors mt-2" />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Category Distribution Card */}
          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-white">
              <span>Incident Category Distribution</span>
              <span className="text-slate-400 font-mono text-[11px]">{tickets.length} total recorded</span>
            </div>

            <div className="space-y-2 pt-1">
              {categories.map((cat) => {
                const percentage = Math.round((cat.count / totalTickets) * 100);
                return (
                  <div key={cat.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300">{cat.name}</span>
                      <span className="text-slate-400 font-mono text-[11px] tabular-nums">
                        {cat.count} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`${cat.color} h-full rounded-full transition-all duration-300`}
                        style={{ width: `${Math.max(percentage, 4)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Activity Feed & System Quick Links */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white tracking-tight">
              Recent Activity Feed
            </h2>
            <span className="text-[11px] font-mono text-emerald-400">
              Live Stream
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/80 divide-y divide-slate-800/60">
            {activityFeed.slice(0, 6).map((item) => (
              <div key={item.id} className="py-3 first:pt-0 last:pb-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <p className="text-xs text-slate-300 leading-relaxed">
                      <span className="font-semibold text-white">{item.actor}</span>{' '}
                      {item.action}{' '}
                      <span className="font-mono text-blue-400 font-medium">{item.target}</span>
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                      <span>{item.timestamp}</span>
                      {item.badge && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-slate-300 px-1.5 py-0.2 rounded bg-slate-800 border border-slate-700/60 text-[10px]">
                            {item.badge}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Action Box */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900/90 to-blue-950/40 border border-blue-900/40 space-y-3">
            <div className="flex items-center gap-2 text-white text-xs font-semibold">
              <Zap className="w-4 h-4 text-blue-400" />
              <span>Infrastructure Quick Actions</span>
            </div>
            <p className="text-xs text-slate-400">
              Quickly dispatch hardware requests or review edge network routing nodes.
            </p>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={onOpenNewTicketModal}
                className="py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs text-center transition-colors cursor-pointer"
              >
                + Submit Ticket
              </button>
              <button
                onClick={() => onNavigateToTab('assets')}
                className="py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs text-center border border-slate-700 transition-colors cursor-pointer"
              >
                Audit Assets
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
