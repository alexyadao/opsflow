'use client';

import React, { useState } from 'react';
import {
  Search,
  Plus,
  Clock,
  User,
  CheckCircle2,
  AlertCircle,
  FileText,
  Eye,
  MessageSquare,
} from 'lucide-react';
import { Ticket, TicketPriority, TicketStatus } from '@/lib/types';
import { UserProfile } from '@/context/RoleContext';

interface EmployeeTicketsViewProps {
  currentUser: UserProfile;
  tickets: Ticket[];
  onOpenSubmitModal: () => void;
  onSelectTicket: (ticket: Ticket) => void;
}

export default function EmployeeTicketsView({
  currentUser,
  tickets,
  onOpenSubmitModal,
  onSelectTicket,
}: EmployeeTicketsViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Filter only tickets belonging to current user
  const userTickets = tickets.filter(
    (t) =>
      t.requester.email.toLowerCase() === currentUser.email.toLowerCase() ||
      t.requester.name.toLowerCase() === currentUser.name.toLowerCase()
  );

  const filteredTickets = userTickets.filter((ticket) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        ticket.id.toLowerCase().includes(q) ||
        ticket.title.toLowerCase().includes(q) ||
        ticket.description.toLowerCase().includes(q) ||
        ticket.category.toLowerCase().includes(q);
      if (!match) return false;
    }

    if (statusFilter !== 'All' && ticket.status !== statusFilter) {
      return false;
    }

    return true;
  });

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

  const getStatusBadge = (status: TicketStatus) => {
    switch (status) {
      case 'Resolved':
      case 'Closed':
        return 'text-emerald-400 bg-emerald-950/70 border-emerald-800/70';
      case 'In Progress':
        return 'text-blue-400 bg-blue-950/70 border-blue-800/70';
      case 'Pending Vendor':
        return 'text-amber-400 bg-amber-950/70 border-amber-800/70';
      case 'Open':
      default:
        return 'text-slate-300 bg-slate-800 border-slate-700';
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            My IT Requests
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Track status, review technician comments, and manage tickets submitted by {currentUser.name}
          </p>
        </div>

        <button
          onClick={onOpenSubmitModal}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-medium text-xs shadow-sm transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New IT Request</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 w-full sm:w-auto flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your requests by title, ID, or topic..."
              className="w-full bg-slate-900 border border-slate-800 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-400 outline-none"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 outline-none focus:border-blue-600 cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>

        <div className="text-xs text-slate-400 font-mono self-end sm:self-auto tabular-nums">
          {filteredTickets.length} of {userTickets.length} requests
        </div>
      </div>

      {/* Tickets List */}
      <div className="rounded-xl bg-slate-900/70 border border-slate-800/80 overflow-hidden shadow-sm">
        <div className="divide-y divide-slate-800/60">
          {filteredTickets.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <FileText className="w-10 h-10 text-slate-600 mx-auto" />
              <div className="text-sm font-semibold text-white">No requests found</div>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                {userTickets.length === 0
                  ? "You haven't submitted any IT tickets yet. Click 'New IT Request' to log an issue."
                  : 'No tickets match the selected filter.'}
              </p>
              {userTickets.length === 0 && (
                <button
                  onClick={onOpenSubmitModal}
                  className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Submit Your First Request</span>
                </button>
              )}
            </div>
          ) : (
            filteredTickets.map((ticket) => (
              <div
                key={ticket.id}
                onClick={() => onSelectTicket(ticket)}
                className="p-4 hover:bg-slate-850/80 transition-colors cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-mono text-xs font-bold text-blue-400">
                      {ticket.id}
                    </span>
                    <span aria-hidden="true" className="text-slate-700">·</span>
                    <span className="text-slate-400">{ticket.category}</span>
                    <span aria-hidden="true" className="text-slate-700">·</span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded ${getPriorityBadgeClass(
                        ticket.priority
                      )}`}
                    >
                      {ticket.priority} Urgency
                    </span>
                  </div>

                  <h3 className="text-xs sm:text-sm font-semibold text-white group-hover:text-blue-300 transition-colors">
                    {ticket.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-1 max-w-2xl">
                    {ticket.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 pt-1 text-[11px] text-slate-400 font-mono">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span>Submitted {new Date(ticket.createdAt).toLocaleDateString()}</span>
                    </span>
                    {ticket.comments && ticket.comments.length > 0 && (
                      <span className="flex items-center gap-1 text-blue-400">
                        <MessageSquare className="w-3 h-3" />
                        <span>{ticket.comments.length} updates</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0">
                  <span
                    className={`text-[11px] font-mono font-medium px-2.5 py-1 rounded border capitalize ${getStatusBadge(
                      ticket.status
                    )}`}
                  >
                    {ticket.status}
                  </span>

                  <span className="text-[11px] text-slate-400">
                    Technician:{' '}
                    <span className="text-slate-300">
                      {ticket.assignee ? ticket.assignee.name.split(' ')[0] : 'In Queue'}
                    </span>
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
