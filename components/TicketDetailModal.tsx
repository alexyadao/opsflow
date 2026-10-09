'use client';

import React, { useState } from 'react';
import {
  X,
  Clock,
  User,
  Server,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  MessageSquare,
  Send,
  Calendar,
  Tag,
  Shield,
  Layers,
} from 'lucide-react';
import { Ticket, TicketStatus, TicketPriority } from '@/lib/types';
import { useRole } from '@/context/RoleContext';

interface TicketDetailModalProps {
  ticket: Ticket | null;
  onClose: () => void;
  onUpdateStatus: (ticketId: string, status: TicketStatus) => Promise<void>;
  onUpdatePriority: (ticketId: string, priority: TicketPriority) => Promise<void>;
  onDeleteTicket: (ticketId: string) => Promise<void>;
  onAddComment?: (ticketId: string, text: string) => Promise<void>;
}

export default function TicketDetailModal({
  ticket,
  onClose,
  onUpdateStatus,
  onUpdatePriority,
  onDeleteTicket,
  onAddComment,
}: TicketDetailModalProps) {
  const { currentUser, isAdmin } = useRole();
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  if (!ticket) return null;

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

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !onAddComment) return;
    try {
      setIsSubmittingComment(true);
      await onAddComment(ticket.id, newComment.trim());
      setNewComment('');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60 shrink-0">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-bold text-blue-400">
              {ticket.id}
            </span>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded ${getPriorityBadgeClass(
                ticket.priority
              )}`}
            >
              {ticket.priority} Priority
            </span>
            <span className="text-xs text-slate-400">
              {ticket.category}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && (
              <button
                onClick={() => {
                  if (confirm(`Are you sure you want to delete ticket ${ticket.id}?`)) {
                    onDeleteTicket(ticket.id);
                    onClose();
                  }
                }}
                title="Delete Ticket"
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-950/40 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Title */}
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-white tracking-tight">
              {ticket.title}
            </h2>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] text-slate-400 font-mono">
              <span>Opened {new Date(ticket.createdAt).toLocaleString()}</span>
              <span aria-hidden="true">·</span>
              <span>Updated {new Date(ticket.updatedAt).toLocaleTimeString()}</span>
            </div>
          </div>

          {/* Status Row */}
          {isAdmin ? (
            /* Admin can switch workflow status & priority */
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] text-slate-400 font-medium block mb-1">
                  Workflow Status
                </label>
                <select
                  value={ticket.status}
                  onChange={(e) => onUpdateStatus(ticket.id, e.target.value as TicketStatus)}
                  className="w-full bg-slate-900 border border-slate-700 focus:border-blue-500 rounded-lg px-3 py-1.5 text-xs text-white outline-none cursor-pointer"
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Pending Vendor">Pending Vendor</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 font-medium block mb-1">
                  Priority Tier
                </label>
                <select
                  value={ticket.priority}
                  onChange={(e) => onUpdatePriority(ticket.id, e.target.value as TicketPriority)}
                  className="w-full bg-slate-900 border border-slate-700 focus:border-blue-500 rounded-lg px-3 py-1.5 text-xs text-white outline-none cursor-pointer"
                >
                  <option value="Critical">Critical (P1)</option>
                  <option value="High">High (P2)</option>
                  <option value="Medium">Medium (P3)</option>
                  <option value="Low">Low (P4)</option>
                </select>
              </div>
            </div>
          ) : (
            /* Employee view: Clean read-only status progress card */
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 block">Current Status</span>
                <span className="text-sm font-semibold text-white capitalize mt-0.5 inline-block">
                  {ticket.status}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-slate-400 block">Assigned Engineer</span>
                <span className="text-xs font-medium text-slate-300 mt-0.5 inline-block">
                  {ticket.assignee ? ticket.assignee.name : 'In Support Queue'}
                </span>
              </div>
            </div>
          )}

          {/* Incident Description */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
              Incident Details
            </h3>
            <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/60 text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
              {ticket.description}
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* Requester Box */}
            <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/60 space-y-1">
              <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-blue-400" />
                <span>Requester</span>
              </div>
              <div className="font-semibold text-white">{ticket.requester.name}</div>
              <div className="text-[11px] text-slate-400">{ticket.requester.email}</div>
              <div className="text-[10px] text-slate-400 font-mono">{ticket.requester.department}</div>
            </div>

            {/* Affected Asset Box */}
            <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/60 space-y-1">
              <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-emerald-400" />
                <span>Affected Asset</span>
              </div>
              {ticket.assetName ? (
                <>
                  <div className="font-semibold text-white">{ticket.assetName}</div>
                  <div className="text-[11px] text-slate-400 font-mono">{ticket.assetId}</div>
                </>
              ) : (
                <div className="text-slate-400 italic text-[11px]">No specific asset linked</div>
              )}
            </div>
          </div>

          {/* Internal Work Notes & Comments */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-white">
              <MessageSquare className="w-4 h-4 text-blue-400" />
              <span>Internal Operations Notes</span>
              <span className="text-slate-400 font-mono text-[11px]">
                ({ticket.comments?.length || 0})
              </span>
            </div>

            {ticket.comments && ticket.comments.length > 0 ? (
              <div className="space-y-2.5">
                {ticket.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium text-white">{comment.author}</span>
                        <span className="text-slate-400">({comment.role})</span>
                      </div>
                      <span className="text-slate-400 font-mono">
                        {new Date(comment.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">{comment.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No notes posted yet for this incident.</p>
            )}

            {/* Post Note Form */}
            {onAddComment && (
              <form onSubmit={handlePostComment} className="flex gap-2 pt-1">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Post operational progress note..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-400 outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  disabled={!newComment.trim() || isSubmittingComment}
                  className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-xs font-medium flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Post</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <span>Assigned: <span className="text-slate-200">{ticket.assignee ? ticket.assignee.name : 'Unassigned'}</span></span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
