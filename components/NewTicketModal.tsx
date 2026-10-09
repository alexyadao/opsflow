'use client';

import React, { useState } from 'react';
import {
  X,
  PlusCircle,
  AlertCircle,
  Server,
  User,
  ShieldAlert,
  CheckCircle,
  Send,
  Loader2,
} from 'lucide-react';
import { TicketCategory, TicketPriority, Asset } from '@/lib/types';
import { useRole } from '@/context/RoleContext';

interface NewTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTicketCreated: () => void;
  assets: Asset[];
  initialAsset?: Asset | null;
}

export default function NewTicketModal({
  isOpen,
  onClose,
  onTicketCreated,
  assets,
  initialAsset,
}: NewTicketModalProps) {
  const { currentUser, isAdmin } = useRole();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<TicketCategory>(() => {
    if (initialAsset?.type === 'Switch/Router') return 'Network';
    if (initialAsset?.type === 'Security Appliance') return 'Security Alert';
    if (initialAsset?.type === 'Cloud Cluster') return 'Cloud Infrastructure';
    return 'Hardware';
  });
  const [priority, setPriority] = useState<TicketPriority>('Medium');
  const [description, setDescription] = useState('');
  const [selectedAssetId, setSelectedAssetId] = useState<string>(() =>
    initialAsset ? initialAsset.id : ''
  );
  const [requesterName, setRequesterName] = useState(() => currentUser.name);
  const [requesterDepartment, setRequesterDepartment] = useState(() => currentUser.department);
  const [requesterEmail, setRequesterEmail] = useState(() => currentUser.email);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!title.trim()) {
      setErrorMessage('Please provide a ticket title.');
      return;
    }
    if (!description.trim()) {
      setErrorMessage('Please provide a detailed description of the issue.');
      return;
    }

    try {
      setIsSubmitting(true);
      const matchedAsset = assets.find((a) => a.id === selectedAssetId);

      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          category,
          priority,
          description: description.trim(),
          requesterName: requesterName.trim() || 'Alex Yadao',
          requesterEmail: requesterEmail.trim() || 'a.yadao@opsflow.internal',
          requesterDepartment: requesterDepartment.trim() || 'IT Operations',
          assetId: matchedAsset ? matchedAsset.id : undefined,
          assetName: matchedAsset ? matchedAsset.name : undefined,
          status: 'Open',
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit ticket');
      }

      // Reset form
      setTitle('');
      setDescription('');
      onTicketCreated();
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred while creating the ticket.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const priorityOptions: { value: TicketPriority; label: string; desc: string; color: string }[] = [
    {
      value: 'Low',
      label: 'Low (P4)',
      desc: 'Minor defect or routine maintenance',
      color: 'border-emerald-600/60 bg-emerald-950/40 text-emerald-300',
    },
    {
      value: 'Medium',
      label: 'Medium (P3)',
      desc: 'Standard non-blocking operational request',
      color: 'border-amber-600/60 bg-amber-950/40 text-amber-300',
    },
    {
      value: 'High',
      label: 'High (P2)',
      desc: 'Impaired workflow or redundancy loss',
      color: 'border-orange-600/60 bg-orange-950/40 text-orange-300',
    },
    {
      value: 'Critical',
      label: 'Critical (P1)',
      desc: 'Complete service outage or severe hazard',
      color: 'border-red-600/80 bg-red-950/60 text-red-300',
    },
  ];

  const categories: TicketCategory[] = [
    'Hardware',
    'Network',
    'Cloud Infrastructure',
    'Access & Identity',
    'Software & OS',
    'Security Alert',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-blue-950 border border-blue-800/80 text-blue-400">
              <PlusCircle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">Create New IT Incident / Ticket</h2>
              <p className="text-xs text-slate-400">OpsFlow Ticket Ingestion Dispatcher</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-lg bg-red-950/60 border border-red-800 text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Issue Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-200">
              Ticket Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Rack B-04 Cisco Catalyst Fan Sensor Alert, Okta SSO Gateway timeout"
              className="w-full bg-slate-950 border border-slate-800 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-400 outline-none"
            />
          </div>

          {/* Category & Affected Asset Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Category */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-200">
                Category <span className="text-red-400">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TicketCategory)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:border-blue-600 outline-none cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Affected Asset */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-200">
                Affected Infrastructure Asset
              </label>
              <select
                value={selectedAssetId}
                onChange={(e) => setSelectedAssetId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:border-blue-600 outline-none cursor-pointer"
              >
                <option value="">None / General Inquiry</option>
                {assets.map((asset) => (
                  <option key={asset.id} value={asset.id}>
                    {asset.id} — {asset.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Priority Level Selectors */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-200">
              Priority Level <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {priorityOptions.map((opt) => {
                const isSelected = priority === opt.value;
                return (
                  <button
                    type="button"
                    key={opt.value}
                    onClick={() => setPriority(opt.value)}
                    className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? `${opt.color} ring-1 ring-white/20`
                        : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-semibold text-xs text-white">
                      {opt.label}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1 leading-tight line-clamp-2">
                      {opt.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-200">
              Incident Description & Logs <span className="text-red-400">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide exact symptoms, affected users/nodes, error codes, and troubleshooting steps attempted..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-lg p-3 text-xs text-white placeholder-slate-400 outline-none resize-none"
            />
          </div>

          {/* Requester Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-slate-800/80">
            <div className="space-y-1">
              <label className="text-[11px] text-slate-400">Requester Name</label>
              <input
                type="text"
                value={requesterName}
                onChange={(e) => setRequesterName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] text-slate-400">Department</label>
              <input
                type="text"
                value={requesterDepartment}
                onChange={(e) => setRequesterDepartment(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 outline-none"
              />
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-xs font-medium text-white transition-colors cursor-pointer disabled:opacity-50 shadow-sm"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Ticket</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
