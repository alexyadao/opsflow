'use client';

import React from 'react';
import {
  LayoutDashboard,
  TicketCheck,
  Server,
  Terminal,
  PlusCircle,
  ChevronRight,
  HardDrive,
  UserCheck,
  ArrowLeftRight,
  Send,
  Shield,
  User,
} from 'lucide-react';
import { useRole } from '@/context/RoleContext';
import { useMounted } from '@/hooks/use-mounted';

export type NavTab =
  | 'dashboard'
  | 'tickets'
  | 'assets'
  | 'logs'
  | 'employee_portal'
  | 'employee_tickets';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  openTicketsCount: number;
  criticalCount: number;
  myTicketsCount: number;
  onOpenNewTicketModal: () => void;
  mobileMenuOpen?: boolean;
  onCloseMobileMenu?: () => void;
}

export default function Sidebar({
  currentTab,
  onSelectTab,
  openTicketsCount,
  criticalCount,
  myTicketsCount,
  onOpenNewTicketModal,
  mobileMenuOpen = false,
  onCloseMobileMenu,
}: SidebarProps) {
  const { role, currentUser, toggleRole, isAdmin } = useRole();
  const mounted = useMounted();

  // Use a stable baseline during SSR until client is mounted to prevent hydration mismatches
  const effectiveIsAdmin = mounted ? isAdmin : false;
  const effectiveRoleTitle = mounted ? currentUser.roleTitle : 'Employee (Requester)';
  const effectiveName = mounted ? currentUser.name : 'Taylor Morgan';
  const effectiveInitials = mounted ? currentUser.initials : 'TM';
  const effectiveGradient = mounted
    ? currentUser.avatarGradient
    : 'from-violet-600 via-purple-600 to-indigo-900';

  // Admin navigation items
  const adminNavItems = [
    {
      id: 'dashboard' as NavTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: criticalCount > 0 ? `${criticalCount} crit` : null,
      badgeColor: 'text-red-400 bg-red-950/80 border-red-800/80',
    },
    {
      id: 'tickets' as NavTab,
      label: 'Active Tickets',
      icon: TicketCheck,
      badge: openTicketsCount > 0 ? `${openTicketsCount}` : null,
      badgeColor: 'text-blue-400 bg-blue-950/80 border-blue-800/80',
    },
    {
      id: 'assets' as NavTab,
      label: 'Asset Directory',
      icon: Server,
      badge: null,
      badgeColor: '',
    },
    {
      id: 'logs' as NavTab,
      label: 'System Logs',
      icon: Terminal,
      badge: 'Live',
      badgeColor: 'text-slate-400 bg-slate-800/80 border-slate-700/80',
    },
  ];

  // Employee isolated navigation items
  const employeeNavItems = [
    {
      id: 'employee_portal' as NavTab,
      label: 'Submit IT Request',
      icon: Send,
      badge: 'Portal',
      badgeColor: 'text-blue-400 bg-blue-950/80 border-blue-800/80',
    },
    {
      id: 'employee_tickets' as NavTab,
      label: 'My Tickets',
      icon: TicketCheck,
      badge: myTicketsCount > 0 ? `${myTicketsCount}` : null,
      badgeColor: 'text-purple-400 bg-purple-950/80 border-purple-800/80',
    },
  ];

  const currentNavItems = effectiveIsAdmin ? adminNavItems : employeeNavItems;

  const handleTabClick = (tab: NavTab) => {
    onSelectTab(tab);
    if (onCloseMobileMenu) onCloseMobileMenu();
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-950/95 backdrop-blur-md border-r border-slate-800/80 flex flex-col transition-transform duration-200 lg:translate-x-0 ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 px-5 flex items-center justify-between border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-900 p-0.5 shadow-md shadow-blue-900/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center">
              <HardDrive className="w-4 h-4 text-blue-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base tracking-tight text-white">OpsFlow</span>
              <span
                className={`text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded border ${
                  effectiveIsAdmin
                    ? 'bg-blue-950 text-blue-300 border-blue-800/50'
                    : 'bg-purple-950 text-purple-300 border-purple-800/50'
                }`}
              >
                {effectiveIsAdmin ? 'ITSM ADMIN' : 'EMPLOYEE'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              {effectiveIsAdmin ? 'Infra Operations' : 'Self-Service Desk'}
            </p>
          </div>
        </div>
      </div>

      {/* Primary Action Button */}
      <div className="p-4">
        {effectiveIsAdmin ? (
          <button
            onClick={() => {
              onOpenNewTicketModal();
              if (onCloseMobileMenu) onCloseMobileMenu();
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-medium text-xs shadow-sm shadow-blue-900/30 transition-all duration-150 group cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
            <span>New Ticket</span>
          </button>
        ) : (
          <button
            onClick={() => {
              handleTabClick('employee_portal');
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-white font-medium text-xs shadow-sm shadow-purple-900/30 transition-all duration-150 group cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Submit IT Request</span>
          </button>
        )}
      </div>

      {/* Main Navigation */}
      <div className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-400">
          {effectiveIsAdmin ? 'IT Infrastructure Workspaces' : 'Employee Portal'}
        </div>

        {currentNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer ${
                isActive
                  ? effectiveIsAdmin
                    ? 'bg-blue-950/70 text-blue-300 border border-blue-800/60 shadow-sm'
                    : 'bg-purple-950/70 text-purple-300 border border-purple-800/60 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900/80 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive
                      ? effectiveIsAdmin
                        ? 'text-blue-400'
                        : 'text-purple-400'
                      : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />
                <span className="whitespace-nowrap">{item.label}</span>
              </div>
              <div className="flex items-center gap-1.5">
                {item.badge && (
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded border tabular-nums ${item.badgeColor}`}
                  >
                    {item.badge}
                  </span>
                )}
                {isActive && (
                  <ChevronRight
                    className={`w-3.5 h-3.5 ${effectiveIsAdmin ? 'text-blue-400' : 'text-purple-400'}`}
                  />
                )}
              </div>
            </button>
          );
        })}

        {/* Admin-only: Infrastructure telemetry indicator */}
        {effectiveIsAdmin && (
          <div className="pt-6 px-3">
            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400 font-medium">Datacenter Mesh</span>
                <span className="text-emerald-400 font-mono text-[10px] font-semibold">
                  99.98% UP
                </span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[99.9%]" />
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span>Nodes: 28 Online</span>
                <span>1 Degraded</span>
              </div>
            </div>
          </div>
        )}

        {/* Employee-only: Help desk SLA note */}
        {!effectiveIsAdmin && (
          <div className="pt-6 px-3">
            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800/80 space-y-2 text-xs">
              <div className="text-[11px] font-semibold text-white flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-purple-400" />
                <span>Need Urgent Help?</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Hardware replacements and login lockouts are prioritized within 30 minutes.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Role Switcher & User Profile Card */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950">
        <div className="mb-1 px-1 flex items-center justify-between text-[10px] font-mono uppercase text-slate-400">
          <span>Active Role</span>
          <span className="text-blue-400 hover:text-blue-300 cursor-pointer" onClick={toggleRole}>
            Switch ⇄
          </span>
        </div>

        <button
          onClick={toggleRole}
          type="button"
          title={`Currently logged in as ${effectiveRoleTitle}. Click to switch role.`}
          className={`w-full p-2.5 rounded-xl border transition-all cursor-pointer group text-left ${
            effectiveIsAdmin
              ? 'bg-slate-900/90 border-slate-800 hover:border-blue-700/80 hover:bg-slate-900'
              : 'bg-slate-900/90 border-slate-800 hover:border-purple-700/80 hover:bg-slate-900'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {/* Dynamic Avatar */}
              <div
                className={`w-8 h-8 rounded-full bg-gradient-to-tr ${effectiveGradient} flex items-center justify-center text-white text-xs font-semibold shadow-sm`}
              >
                {effectiveInitials}
              </div>

              <div className="text-left overflow-hidden">
                <div className="text-xs font-semibold text-white truncate max-w-[105px]">
                  {effectiveName}
                </div>
                <div className="text-[10px] text-slate-400 font-mono truncate max-w-[110px]">
                  {effectiveRoleTitle}
                </div>
              </div>
            </div>

            {/* Toggle Affordance */}
            <div className="p-1 rounded-md bg-slate-800 text-slate-300 group-hover:text-white group-hover:bg-slate-700 transition-colors">
              <ArrowLeftRight className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-300" />
            </div>
          </div>

          {/* Role pill indicator */}
          <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
            <span
              className={`font-mono px-1.5 py-0.5 rounded ${
                effectiveIsAdmin
                  ? 'bg-blue-950 text-blue-300 border border-blue-800/60'
                  : 'bg-purple-950 text-purple-300 border border-purple-800/60'
              }`}
            >
              {effectiveIsAdmin ? 'ADMIN VIEW' : 'EMPLOYEE VIEW'}
            </span>
            <span className="text-slate-400 group-hover:text-blue-300 transition-colors">
              Click to toggle ➔
            </span>
          </div>
        </button>
      </div>
    </aside>
  );
}
