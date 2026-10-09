'use client';

import React, { useState } from 'react';
import {
  Laptop,
  Layers,
  Wifi,
  KeyRound,
  HelpCircle,
  Send,
  Loader2,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { Ticket, TicketCategory, TicketPriority } from '@/lib/types';
import { UserProfile } from '@/context/RoleContext';

interface EmployeePortalViewProps {
  currentUser: UserProfile;
  myTickets: Ticket[];
  onSubmitTicket: (ticketData: {
    title: string;
    category: TicketCategory;
    priority: TicketPriority;
    description: string;
  }) => Promise<boolean>;
  onSelectTicket: (ticket: Ticket) => void;
  onNavigateToMyTickets: () => void;
}

export default function EmployeePortalView({
  currentUser,
  myTickets,
  onSubmitTicket,
  onSelectTicket,
  onNavigateToMyTickets,
}: EmployeePortalViewProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<TicketCategory>('Hardware');
  const [priority, setPriority] = useState<TicketPriority>('Medium');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  const categories = [
    {
      id: 'Hardware' as TicketCategory,
      title: 'Hardware & Peripherals',
      desc: 'MacBook, laptop repair, monitors, docks, chargers, cables',
      icon: Laptop,
      color: 'text-blue-400 bg-blue-950/60 border-blue-800/60',
    },
    {
      id: 'Software & OS' as TicketCategory,
      title: 'Software & Licenses',
      desc: 'Figma, GitHub, Adobe, Slack, OS updates, app crashes',
      icon: Layers,
      color: 'text-indigo-400 bg-indigo-950/60 border-indigo-800/60',
    },
    {
      id: 'Network' as TicketCategory,
      title: 'VPN & Office Wi-Fi',
      desc: 'GlobalProtect VPN, slow connection, office SSID access',
      icon: Wifi,
      color: 'text-cyan-400 bg-cyan-950/60 border-cyan-800/60',
    },
    {
      id: 'Access & Identity' as TicketCategory,
      title: 'Accounts, SSO & 2FA',
      desc: 'Okta password reset, Google Workspace, multi-factor auth',
      icon: KeyRound,
      color: 'text-amber-400 bg-amber-950/60 border-amber-800/60',
    },
  ];

  const handleCategorySelect = (selectedCat: TicketCategory) => {
    setCategory(selectedCat);
    // Smooth scroll down to form
    const formElement = document.getElementById('employee-ticket-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorNotice(null);
    setSuccessNotice(null);

    if (!title.trim()) {
      setErrorNotice('Please describe the issue in a short summary.');
      return;
    }
    if (!description.trim()) {
      setErrorNotice('Please provide details on what you need help with.');
      return;
    }

    try {
      setIsSubmitting(true);
      const success = await onSubmitTicket({
        title: title.trim(),
        category,
        priority,
        description: description.trim(),
      });

      if (success) {
        setTitle('');
        setDescription('');
        setSuccessNotice('Your IT request has been submitted! Our desk team is reviewing it.');
        setTimeout(() => setSuccessNotice(null), 6000);
      }
    } catch (err: any) {
      setErrorNotice(err.message || 'Failed to submit request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeTickets = myTickets.filter((t) => t.status !== 'Resolved' && t.status !== 'Closed');

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Friendly Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950/60 to-slate-900 border border-slate-800 p-6 sm:p-8 shadow-lg">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-950/80 border border-blue-800/80 text-[11px] font-medium text-blue-300">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>OpsFlow Employee IT Service Desk</span>
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-white">
            How can IT help you today, {currentUser.name.split(' ')[0]}?
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Need a hardware replacement, software license, or access to company tools?
            Submit a request below, and our internal support team will handle it immediately.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              <span>Median response: 18 mins</span>
            </span>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <span>Support Desk Hours: 24/7 Global On-Call</span>
          </div>
        </div>

        {/* Subtle background decoration */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-blue-600/10 to-transparent pointer-events-none" />
      </div>

      {/* Quick Category Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white tracking-tight">
            Popular IT Service Categories
          </h2>
          <span className="text-xs text-slate-400">Click to autofill request form</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = category === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategorySelect(cat.id)}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between group ${
                  isSelected
                    ? 'bg-slate-900 border-blue-500 shadow-md shadow-blue-950/40 ring-1 ring-blue-500/40'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div>
                  <div className={`w-9 h-9 rounded-lg border flex items-center justify-center mb-3 ${cat.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs font-semibold text-white group-hover:text-blue-300 transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1 leading-normal line-clamp-2">
                    {cat.desc}
                  </p>
                </div>

                <div className="mt-3 flex items-center gap-1 text-[11px] font-medium text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Start request</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Prominent Ticket Submission Card */}
      <div
        id="employee-ticket-form"
        className="rounded-2xl bg-slate-900/90 border border-slate-800/90 shadow-xl overflow-hidden scroll-mt-20"
      >
        <div className="px-6 py-4 border-b border-slate-800/80 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-blue-950 border border-blue-800/80 text-blue-400">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">Submit an IT Request</h2>
              <p className="text-xs text-slate-400">
                Logged as <span className="text-slate-200 font-medium">{currentUser.name}</span> ({currentUser.department})
              </p>
            </div>
          </div>

          <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
            Requester ID: {currentUser.email}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {successNotice && (
            <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-xs text-emerald-200 flex items-center gap-2.5 animate-in fade-in duration-150">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successNotice}</span>
            </div>
          )}

          {errorNotice && (
            <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-800/80 text-xs text-red-200 flex items-center gap-2.5 animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorNotice}</span>
            </div>
          )}

          {/* Issue Summary */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-200">
              What do you need help with? <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Need external monitor for desk, Cannot connect to GlobalProtect VPN"
              className="w-full bg-slate-950 border border-slate-800 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-400 outline-none transition-all"
            />
          </div>

          {/* Category & Urgency Pickers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-200">
                Service Category <span className="text-red-400">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TicketCategory)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-slate-200 focus:border-blue-600 outline-none cursor-pointer"
              >
                <option value="Hardware">Hardware & Peripherals</option>
                <option value="Software & OS">Software & SaaS Licenses</option>
                <option value="Network">Network & VPN</option>
                <option value="Access & Identity">Access, SSO & Accounts</option>
                <option value="Security Alert">Security Incident</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-200">
                How urgently do you need this? <span className="text-red-400">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'Low' as TicketPriority, label: 'Low', sub: 'Standard' },
                  { value: 'Medium' as TicketPriority, label: 'Normal', sub: 'Today' },
                  { value: 'High' as TicketPriority, label: 'Urgent', sub: 'Blocking' },
                ].map((item) => (
                  <button
                    type="button"
                    key={item.value}
                    onClick={() => setPriority(item.value)}
                    className={`py-2 px-2.5 rounded-lg border text-center transition-all cursor-pointer ${
                      priority === item.value
                        ? 'border-blue-500 bg-blue-950/70 text-blue-300 font-medium'
                        : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="text-xs">{item.label}</div>
                    <div className="text-[10px] text-slate-400">{item.sub}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-200">
              Detailed Description <span className="text-red-400">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue, what hardware or software you are using, error messages seen, or steps to reproduce..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-lg p-3 text-xs text-white placeholder-slate-400 outline-none resize-none transition-all"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-800/80">
            <p className="text-[11px] text-slate-400">
              Tickets are automatically routed to the next available IT engineer.
            </p>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-medium text-xs shadow-md shadow-blue-900/20 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit IT Request</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Your Recent Requests Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-white tracking-tight">
              Your Open Requests
            </h2>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 tabular-nums">
              {activeTickets.length} active
            </span>
          </div>

          <button
            type="button"
            onClick={onNavigateToMyTickets}
            className="text-xs font-medium text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
          >
            <span>View all in My Tickets</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {activeTickets.length === 0 ? (
          <div className="p-8 rounded-xl bg-slate-900/50 border border-slate-800 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <h3 className="text-xs font-semibold text-white">All Clear! No Open Issues</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              You currently have no pending IT requests. If you run into any software or hardware trouble, use the form above.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {activeTickets.map((ticket) => (
              <div
                key={ticket.id}
                onClick={() => onSelectTicket(ticket)}
                className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 hover:bg-slate-900 transition-all cursor-pointer group space-y-2.5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-blue-400">
                    {ticket.id}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950/80 border border-blue-800/80 text-blue-300">
                    {ticket.status}
                  </span>
                </div>

                <h3 className="text-xs sm:text-sm font-semibold text-white group-hover:text-blue-300 transition-colors line-clamp-1">
                  {ticket.title}
                </h3>

                <p className="text-xs text-slate-400 line-clamp-2">
                  {ticket.description}
                </p>

                <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Assigned to: {ticket.assignee ? ticket.assignee.name : 'Triage Queue'}</span>
                  <span className="font-mono">{new Date(ticket.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
