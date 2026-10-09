'use client';

import React from 'react';
import {
  Menu,
  RotateCw,
  Plus,
  Search,
  CheckCircle2,
  X,
  ArrowLeftRight,
  Shield,
  User,
} from 'lucide-react';
import { NavTab } from './Sidebar';
import { useRole } from '@/context/RoleContext';
import { useMounted } from '@/hooks/use-mounted';

interface HeaderProps {
  currentTab: NavTab;
  onOpenNewTicketModal: () => void;
  onRefreshData: () => void;
  isRefreshing: boolean;
  onToggleMobileMenu: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function Header({
  currentTab,
  onOpenNewTicketModal,
  onRefreshData,
  isRefreshing,
  onToggleMobileMenu,
  searchQuery,
  onSearchChange,
}: HeaderProps) {
  const { role, currentUser, toggleRole, isAdmin } = useRole();
  const mounted = useMounted();

  const effectiveIsAdmin = mounted ? isAdmin : true;

  const tabTitles: Record<NavTab, { title: string; subtitle: string; trail: string }> = {
    dashboard: {
      title: 'Infrastructure Overview',
      subtitle: 'Real-time telemetry, incidents, and SLA metrics',
      trail: 'Overview',
    },
    tickets: {
      title: 'Active IT Tickets',
      subtitle: 'Triage, assign, and resolve infrastructure & helpdesk issues',
      trail: 'Tickets',
    },
    assets: {
      title: 'Hardware & Cloud Directory',
      subtitle: 'Enterprise servers, edge routers, workstations, and instances',
      trail: 'Assets',
    },
    logs: {
      title: 'System Telemetry & Audit Logs',
      subtitle: 'Live infrastructure events, security traps, and access logs',
      trail: 'Syslogs',
    },
    employee_portal: {
      title: 'Employee IT Service Desk',
      subtitle: 'Self-service hardware, software licenses, and access requests',
      trail: 'Service Desk',
    },
    employee_tickets: {
      title: 'My IT Requests',
      subtitle: 'Track your personal IT tickets and engineer updates',
      trail: 'My Requests',
    },
  };

  const currentInfo = tabTitles[currentTab] || {
    title: 'OpsFlow IT Desk',
    subtitle: 'Enterprise operations',
    trail: 'Workspace',
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left: Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          aria-label="Toggle Navigation"
          className="lg:hidden p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex flex-col">
          <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
            <span>OpsFlow</span>
            <span className="text-slate-600">/</span>
            <span>{effectiveIsAdmin ? 'Infrastructure' : 'Helpdesk'}</span>
            <span className="text-slate-600">/</span>
            <span className={effectiveIsAdmin ? 'text-blue-400' : 'text-purple-400'}>
              {currentInfo.trail}
            </span>
          </div>
          <h1 className="text-sm font-semibold text-white tracking-tight">
            {currentInfo.title}
          </h1>
        </div>
        <div className="sm:hidden font-semibold text-sm text-white">
          {currentInfo.title}
        </div>
      </div>

      {/* Center: Global Search Bar */}
      <div className="flex-1 max-w-md hidden md:block">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={
              effectiveIsAdmin
                ? 'Search tickets, assets, error codes, hostnames...'
                : 'Search your tickets, articles, hardware...'
            }
            className="w-full bg-slate-900/90 border border-slate-800 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-lg pl-9 pr-8 py-1.5 text-xs text-slate-200 placeholder-slate-400 outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Right Actions: Role Switcher & New Ticket CTA */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Role Toggle Pill Button (Portfolio Demo Showcase) */}
        <button
          onClick={toggleRole}
          type="button"
          title={`Switch role to ${effectiveIsAdmin ? 'Employee' : 'Admin'}`}
          className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all cursor-pointer shadow-xs ${
            effectiveIsAdmin
              ? 'bg-blue-950/60 border-blue-800/80 text-blue-300 hover:bg-blue-900/60'
              : 'bg-purple-950/60 border-purple-800/80 text-purple-300 hover:bg-purple-900/60'
          }`}
        >
          {effectiveIsAdmin ? (
            <Shield className="w-3.5 h-3.5 text-blue-400" />
          ) : (
            <User className="w-3.5 h-3.5 text-purple-400" />
          )}
          <span className="hidden xl:inline">Role:</span>
          <span className="font-semibold">{effectiveIsAdmin ? 'Admin' : 'Employee'}</span>
          <ArrowLeftRight className="w-3 h-3 text-slate-400" />
        </button>

        {/* Sync/Refresh button */}
        <button
          onClick={onRefreshData}
          disabled={isRefreshing}
          title="Refresh data from server"
          className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer disabled:opacity-50"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-400' : ''}`} />
        </button>

        {/* Primary CTA button */}
        <button
          onClick={onOpenNewTicketModal}
          className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-white font-medium text-xs shadow-sm transition-colors cursor-pointer ${
            effectiveIsAdmin
              ? 'bg-blue-600 hover:bg-blue-500 active:bg-blue-700'
              : 'bg-purple-600 hover:bg-purple-500 active:bg-purple-700'
          }`}
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">
            {effectiveIsAdmin ? 'New Ticket' : 'New Request'}
          </span>
          <span className="sm:hidden">New</span>
        </button>
      </div>
    </header>
  );
}
