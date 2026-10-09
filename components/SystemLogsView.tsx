'use client';

import React, { useState } from 'react';
import {
  Terminal,
  Search,
  Filter,
  Copy,
  Check,
  AlertCircle,
  AlertTriangle,
  Info,
  ShieldAlert,
  ArrowDownCircle,
  RotateCw,
} from 'lucide-react';
import { SystemLog } from '@/lib/types';

interface SystemLogsViewProps {
  logs: SystemLog[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onRefreshLogs: () => void;
  isRefreshing?: boolean;
}

export default function SystemLogsView({
  logs,
  searchQuery,
  onSearchChange,
  onRefreshLogs,
  isRefreshing = false,
}: SystemLogsViewProps) {
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredLogs = logs.filter((log) => {
    if (severityFilter !== 'all' && log.severity !== severityFilter) {
      return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        log.event.toLowerCase().includes(q) ||
        log.service.toLowerCase().includes(q) ||
        log.user.toLowerCase().includes(q) ||
        log.ipAddress.includes(q) ||
        log.id.toLowerCase().includes(q) ||
        (log.ticketRef && log.ticketRef.toLowerCase().includes(q));
      if (!match) return false;
    }

    return true;
  });

  const copyLogText = (log: SystemLog) => {
    const text = `[${log.timestamp}] [${log.severity.toUpperCase()}] [${log.service}] (${log.ipAddress}) ${log.event}`;
    navigator.clipboard.writeText(text);
    setCopiedId(log.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getSeverityStyle = (severity: SystemLog['severity']) => {
    switch (severity) {
      case 'critical':
        return {
          badge: 'text-red-400 bg-red-950/80 border-red-800',
          dot: 'bg-red-500',
          icon: ShieldAlert,
        };
      case 'error':
        return {
          badge: 'text-red-400 bg-red-950/60 border-red-900',
          dot: 'bg-red-400',
          icon: AlertCircle,
        };
      case 'warning':
        return {
          badge: 'text-amber-400 bg-amber-950/80 border-amber-800',
          dot: 'bg-amber-400',
          icon: AlertTriangle,
        };
      case 'info':
      default:
        return {
          badge: 'text-slate-400 bg-slate-800/80 border-slate-700',
          dot: 'bg-slate-400',
          icon: Info,
        };
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Severity controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          {/* Search */}
          <div className="relative min-w-[240px] max-w-sm flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search syslog events, service names, IP addresses..."
              className="w-full bg-slate-900 border border-slate-800 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-400 outline-none"
            />
          </div>

          {/* Severity Segmented Filter */}
          <div className="flex items-center p-1 bg-slate-900 rounded-lg border border-slate-800 text-xs">
            {['all', 'critical', 'error', 'warning', 'info'].map((sev) => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`px-2.5 py-1 rounded capitalize transition-colors cursor-pointer ${
                  severityFilter === sev
                    ? 'bg-slate-800 text-white font-medium shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>

          {(severityFilter !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setSeverityFilter('all');
                onSearchChange('');
              }}
              className="text-xs text-slate-400 hover:text-white px-2 py-1 underline cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-slate-400 tabular-nums">
            {filteredLogs.length} events logged
          </span>
          <button
            onClick={onRefreshLogs}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 transition-colors cursor-pointer disabled:opacity-50"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-400' : ''}`} />
            <span>Poll Stream</span>
          </button>
        </div>
      </div>

      {/* Terminal-inspired Telemetry Viewer */}
      <div className="rounded-xl bg-slate-950 border border-slate-800/90 shadow-md overflow-hidden">
        {/* Terminal Header */}
        <div className="bg-slate-900/90 px-4 py-2.5 border-b border-slate-800/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            </div>
            <span className="text-slate-400 font-mono text-[11px] ml-2">
              telemetry.syslog.opsflow.internal
            </span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider">
            Ingest Pipeline: Active
          </span>
        </div>

        {/* Log Entries List */}
        <div className="divide-y divide-slate-900/80 max-h-[620px] overflow-y-auto font-mono text-xs">
          {filteredLogs.length === 0 ? (
            <div className="p-8 text-center text-slate-400 font-mono text-xs">
              No telemetry events match your query.
            </div>
          ) : (
            filteredLogs.map((log) => {
              const sev = getSeverityStyle(log.severity);
              const SevIcon = sev.icon;

              return (
                <div
                  key={log.id}
                  className="p-3 hover:bg-slate-900/40 transition-colors flex items-start justify-between gap-3 group"
                >
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 text-[11px]">
                      {/* Timestamp */}
                      <span className="text-slate-400 tabular-nums">
                        {new Date(log.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}
                      </span>

                      {/* Severity Badge */}
                      <span
                        className={`text-[10px] uppercase font-semibold px-1.5 py-0.2 rounded border ${sev.badge}`}
                      >
                        {log.severity}
                      </span>

                      {/* Service */}
                      <span className="text-blue-400 font-medium">{log.service}</span>

                      {/* Host IP */}
                      <span className="text-slate-400">[{log.ipAddress}]</span>

                      {/* Ticket Ref if linked */}
                      {log.ticketRef && (
                        <span className="text-cyan-400 bg-cyan-950/60 border border-cyan-800/80 px-1 rounded text-[10px]">
                          Ref: {log.ticketRef}
                        </span>
                      )}
                    </div>

                    {/* Log event content */}
                    <div className="text-slate-200 leading-relaxed font-sans text-xs break-words">
                      {log.event}
                    </div>

                    {/* Actor user */}
                    <div className="text-[10px] text-slate-400">
                      Actor: <span className="text-slate-400">{log.user}</span>
                    </div>
                  </div>

                  {/* Copy Button */}
                  <button
                    onClick={() => copyLogText(log)}
                    title="Copy full log line"
                    className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer shrink-0"
                  >
                    {copiedId === log.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
