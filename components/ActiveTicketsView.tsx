'use client';

import React, { useState } from 'react';
import {
  Search,
  Filter,
  Plus,
  LayoutGrid,
  ListFilter,
  Clock,
  User,
  Server,
  ArrowRight,
  MoreVertical,
  CheckCircle2,
  Trash2,
  Eye,
  AlertCircle,
} from 'lucide-react';
import { Ticket, TicketPriority, TicketStatus, TicketCategory } from '@/lib/types';

interface ActiveTicketsViewProps {
  tickets: Ticket[];
  onOpenNewTicketModal: () => void;
  onSelectTicket: (ticket: Ticket) => void;
  onUpdateTicketStatus: (ticketId: string, newStatus: TicketStatus) => Promise<void>;
  onDeleteTicket: (ticketId: string) => Promise<void>;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function ActiveTicketsView({
  tickets,
  onOpenNewTicketModal,
  onSelectTicket,
  onUpdateTicketStatus,
  onDeleteTicket,
  searchQuery,
  onSearchChange,
}: ActiveTicketsViewProps) {
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Filter tickets
  const filteredTickets = tickets.filter((ticket) => {
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        ticket.id.toLowerCase().includes(q) ||
        ticket.title.toLowerCase().includes(q) ||
        ticket.description.toLowerCase().includes(q) ||
        ticket.requester.name.toLowerCase().includes(q) ||
        (ticket.assetName && ticket.assetName.toLowerCase().includes(q));
      if (!match) return false;
    }

    // Priority
    if (priorityFilter !== 'All' && ticket.priority !== priorityFilter) {
      return false;
    }

    // Category
    if (categoryFilter !== 'All' && ticket.category !== categoryFilter) {
      return false;
    }

    // Status
    if (statusFilter !== 'All' && ticket.status !== statusFilter) {
      return false;
    }

    return true;
  });

  // Color helper for priorities
  const getPriorityBadgeClass = (priority: TicketPriority) => {
    switch (priority) {
      case 'Critical':
      case 'High':
        return 'text-red-400 bg-red-950/70 border border-red-800/80';
      case 'Medium':
        return 'text-amber-400 bg-amber-950/70 border border-amber-800/80';
      case 'Low':
      default:
        return 'text-emerald-400 bg-emerald-950/70 border border-emerald-800/80';
    }
  };

  const kanbanColumns: { status: TicketStatus; label: string; headerColor: string }[] = [
    { status: 'Open', label: 'Open / Unassigned', headerColor: 'text-slate-200' },
    { status: 'In Progress', label: 'In Progress', headerColor: 'text-blue-400' },
    { status: 'Pending Vendor', label: 'Pending Vendor / Hardware', headerColor: 'text-amber-400' },
    { status: 'Resolved', label: 'Resolved / Verified', headerColor: 'text-emerald-400' },
  ];

  return (
    <div className="space-y-5">
      {/* Action & Filter Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Search & Selectors */}
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          {/* Search Bar */}
          <div className="relative min-w-[220px] max-w-xs flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Filter by title, ID, user..."
              className="w-full bg-slate-900 border border-slate-800 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-400 outline-none"
            />
          </div>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 outline-none focus:border-blue-600 cursor-pointer"
          >
            <option value="All">All Priorities</option>
            <option value="Critical">Critical (P1)</option>
            <option value="High">High (P2)</option>
            <option value="Medium">Medium (P3)</option>
            <option value="Low">Low (P4)</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 outline-none focus:border-blue-600 cursor-pointer hidden sm:block"
          >
            <option value="All">All Categories</option>
            <option value="Hardware">Hardware</option>
            <option value="Network">Network</option>
            <option value="Cloud Infrastructure">Cloud Infrastructure</option>
            <option value="Access & Identity">Access & Identity</option>
            <option value="Software & OS">Software & OS</option>
            <option value="Security Alert">Security Alert</option>
          </select>

          {/* Status Filter (Table view or mobile) */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 outline-none focus:border-blue-600 cursor-pointer hidden md:block"
          >
            <option value="All">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Pending Vendor">Pending Vendor</option>
            <option value="Resolved">Resolved</option>
          </select>

          {(priorityFilter !== 'All' || categoryFilter !== 'All' || statusFilter !== 'All' || searchQuery) && (
            <button
              onClick={() => {
                setPriorityFilter('All');
                setCategoryFilter('All');
                setStatusFilter('All');
                onSearchChange('');
              }}
              className="text-xs text-slate-400 hover:text-white px-2 py-1 underline cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>

        {/* View Toggle & New Ticket Button */}
        <div className="flex items-center gap-2.5 self-end lg:self-auto">
          {/* Segmented View Switcher */}
          <div className="flex items-center p-1 bg-slate-900 rounded-lg border border-slate-800">
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                viewMode === 'kanban'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Board</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
          </div>

          {/* New Ticket CTA */}
          <button
            onClick={onOpenNewTicketModal}
            className="flex items-center gap-1.5 py-1.5 px-3.5 rounded-lg bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-medium text-xs shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Ticket</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === 'kanban' ? (
        /* KANBAN BOARD VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
          {kanbanColumns.map((col) => {
            const columnTickets = filteredTickets.filter((t) => t.status === col.status);
            return (
              <div
                key={col.status}
                className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-3 flex flex-col min-h-[500px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold ${col.headerColor}`}>
                      {col.label}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 tabular-nums">
                      {columnTickets.length}
                    </span>
                  </div>
                </div>

                {/* Column Cards */}
                <div className="space-y-2.5 flex-1">
                  {columnTickets.length === 0 ? (
                    <div className="h-32 flex items-center justify-center text-center p-4 border border-dashed border-slate-800/80 rounded-lg text-slate-400 text-xs">
                      No tickets in this stage
                    </div>
                  ) : (
                    columnTickets.map((ticket) => (
                      <div
                        key={ticket.id}
                        onClick={() => onSelectTicket(ticket)}
                        className="p-3 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-850/80 transition-all cursor-pointer group space-y-2 shadow-sm"
                      >
                        {/* Header: ID, Priority, Category */}
                        <div className="flex items-center justify-between gap-1.5">
                          <span className="font-mono text-xs font-bold text-blue-400">
                            {ticket.id}
                          </span>
                          <span
                            className={`text-[10px] font-medium px-2 py-0.5 rounded font-mono ${getPriorityBadgeClass(
                              ticket.priority
                            )}`}
                          >
                            {ticket.priority}
                          </span>
                        </div>

                        {/* Title */}
                        <h4 className="text-xs font-semibold text-white group-hover:text-blue-300 transition-colors line-clamp-2">
                          {ticket.title}
                        </h4>

                        {/* Category & Asset */}
                        <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                          <span>{ticket.category}</span>
                          {ticket.assetName && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="truncate max-w-[110px] text-slate-300">
                                {ticket.assetName}
                              </span>
                            </>
                          )}
                        </div>

                        {/* Footer: Assignee & Move Action */}
                        <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
                          <div className="flex items-center gap-1 text-slate-400">
                            <User className="w-3 h-3 text-slate-500" />
                            <span className="truncate max-w-[100px]">
                              {ticket.assignee ? ticket.assignee.name.split(' ')[0] : 'Unassigned'}
                            </span>
                          </div>

                          {/* Quick advance status dropdown/button */}
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1"
                          >
                            <select
                              value={ticket.status}
                              onChange={(e) =>
                                onUpdateTicketStatus(ticket.id, e.target.value as TicketStatus)
                              }
                              className="text-[10px] font-mono bg-slate-950 border border-slate-700 rounded px-1.5 py-0.5 text-slate-300 outline-none hover:border-slate-500 cursor-pointer"
                            >
                              <option value="Open">Open</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Pending Vendor">Pending</option>
                              <option value="Resolved">Resolved</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* DATA TABLE VIEW */
        <div className="rounded-xl bg-slate-900/60 border border-slate-800/80 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 border-b border-slate-800/80 text-slate-400 font-mono uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Ticket ID</th>
                  <th className="py-3 px-4">Title & Category</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Requester</th>
                  <th className="py-3 px-4">Assignee</th>
                  <th className="py-3 px-4">Asset</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {filteredTickets.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      No tickets match the selected filters.
                    </td>
                  </tr>
                ) : (
                  filteredTickets.map((ticket) => (
                    <tr
                      key={ticket.id}
                      onClick={() => onSelectTicket(ticket)}
                      className="hover:bg-slate-800/50 transition-colors cursor-pointer group"
                    >
                      {/* ID */}
                      <td className="py-3 px-4 font-mono font-semibold text-blue-400 whitespace-nowrap">
                        {ticket.id}
                      </td>

                      {/* Title & Category */}
                      <td className="py-3 px-4 max-w-xs">
                        <div className="font-medium text-white group-hover:text-blue-300 transition-colors line-clamp-1">
                          {ticket.title}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {ticket.category}
                        </div>
                      </td>

                      {/* Priority Badge */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded ${getPriorityBadgeClass(
                            ticket.priority
                          )}`}
                        >
                          {ticket.priority}
                        </span>
                      </td>

                      {/* Status */}
                      <td
                        className="py-3 px-4 whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <select
                          value={ticket.status}
                          onChange={(e) =>
                            onUpdateTicketStatus(ticket.id, e.target.value as TicketStatus)
                          }
                          className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200 outline-none hover:border-slate-500 cursor-pointer"
                        >
                          <option value="Open">Open</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Pending Vendor">Pending Vendor</option>
                          <option value="Resolved">Resolved</option>
                          <option value="Closed">Closed</option>
                        </select>
                      </td>

                      {/* Requester */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="text-slate-200">{ticket.requester.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {ticket.requester.department}
                        </div>
                      </td>

                      {/* Assignee */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        {ticket.assignee ? (
                          <span className="text-slate-300">{ticket.assignee.name}</span>
                        ) : (
                          <span className="text-slate-400 italic">Unassigned</span>
                        )}
                      </td>

                      {/* Asset */}
                      <td className="py-3 px-4 whitespace-nowrap text-slate-300">
                        {ticket.assetName ? (
                          <span className="font-mono text-[11px]">{ticket.assetId || ticket.assetName}</span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td
                        className="py-3 px-4 text-right whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onSelectTicket(ticket)}
                            title="View Ticket Details"
                            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete ticket ${ticket.id}?`)) {
                                onDeleteTicket(ticket.id);
                              }
                            }}
                            title="Delete Ticket"
                            className="p-1 rounded text-slate-400 hover:text-red-400 hover:bg-red-950/40 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
