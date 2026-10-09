'use client';

import React, { useState } from 'react';
import {
  Server,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Wrench,
  Copy,
  ExternalLink,
  Plus,
  Cpu,
  Layers,
  MapPin,
  Clock,
  Shield,
  Check,
} from 'lucide-react';
import { Asset, AssetType, AssetStatus } from '@/lib/types';

interface AssetDirectoryViewProps {
  assets: Asset[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenTicketForAsset: (asset: Asset) => void;
}

export default function AssetDirectoryView({
  assets,
  searchQuery,
  onSearchChange,
  onOpenTicketForAsset,
}: AssetDirectoryViewProps) {
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [copiedIp, setCopiedIp] = useState<string | null>(null);

  const filteredAssets = assets.filter((asset) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        asset.name.toLowerCase().includes(q) ||
        asset.id.toLowerCase().includes(q) ||
        asset.model.toLowerCase().includes(q) ||
        asset.ipAddress.toLowerCase().includes(q) ||
        asset.location.toLowerCase().includes(q) ||
        asset.assignedTo.toLowerCase().includes(q);
      if (!match) return false;
    }

    if (selectedType !== 'All' && asset.type !== selectedType) {
      return false;
    }

    if (selectedStatus !== 'All' && asset.status !== selectedStatus) {
      return false;
    }

    return true;
  });

  const copyToClipboard = (ip: string) => {
    navigator.clipboard.writeText(ip);
    setCopiedIp(ip);
    setTimeout(() => setCopiedIp(null), 2000);
  };

  const getStatusBadge = (status: AssetStatus) => {
    switch (status) {
      case 'Operational':
        return {
          label: 'Operational',
          color: 'text-emerald-400 bg-emerald-950/80 border-emerald-800/80',
          icon: CheckCircle2,
        };
      case 'Degraded':
        return {
          label: 'Degraded',
          color: 'text-amber-400 bg-amber-950/80 border-amber-800/80',
          icon: AlertTriangle,
        };
      case 'Maintenance':
        return {
          label: 'Maintenance',
          color: 'text-blue-400 bg-blue-950/80 border-blue-800/80',
          icon: Wrench,
        };
      case 'Decommissioned':
      default:
        return {
          label: 'Decommissioned',
          color: 'text-slate-400 bg-slate-800 border-slate-700',
          icon: Shield,
        };
    }
  };

  return (
    <div className="space-y-5">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          {/* Search */}
          <div className="relative min-w-[240px] max-w-sm flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by asset ID, IP, location, or model..."
              className="w-full bg-slate-900 border border-slate-800 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-400 outline-none"
            />
          </div>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 outline-none focus:border-blue-600 cursor-pointer"
          >
            <option value="All">All Asset Types</option>
            <option value="Server Node">Server Node</option>
            <option value="Switch/Router">Switch / Router</option>
            <option value="Security Appliance">Security Appliance</option>
            <option value="Workstation">Workstation</option>
            <option value="Cloud Cluster">Cloud Cluster</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 outline-none focus:border-blue-600 cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Operational">Operational</option>
            <option value="Degraded">Degraded</option>
            <option value="Maintenance">Maintenance</option>
          </select>

          {(selectedType !== 'All' || selectedStatus !== 'All' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedType('All');
                setSelectedStatus('All');
                onSearchChange('');
              }}
              className="text-xs text-slate-400 hover:text-white px-2 py-1 underline cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>

        <div className="text-xs text-slate-400 font-mono self-end sm:self-auto tabular-nums">
          {filteredAssets.length} assets cataloged
        </div>
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredAssets.map((asset) => {
          const statusConfig = getStatusBadge(asset.status);
          const StatusIcon = statusConfig.icon;

          return (
            <div
              key={asset.id}
              className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/80 hover:border-slate-700/80 hover:bg-slate-900 transition-all flex flex-col justify-between space-y-3.5 shadow-sm"
            >
              <div>
                {/* Header: ID, Status Badge */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-400">
                      {asset.id}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {asset.type}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded border flex items-center gap-1 ${statusConfig.color}`}
                  >
                    <StatusIcon className="w-3 h-3" />
                    <span>{statusConfig.label}</span>
                  </span>
                </div>

                {/* Asset Name and Model */}
                <div className="mt-2.5">
                  <h3 className="text-sm font-semibold text-white tracking-tight line-clamp-1">
                    {asset.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5 font-mono line-clamp-1">
                    {asset.model}
                  </p>
                </div>

                {/* Key Spec Grid */}
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  {/* IP Address */}
                  <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800/60 flex items-center justify-between">
                    <span className="text-slate-400 font-mono text-[11px] truncate">
                      {asset.ipAddress}
                    </span>
                    <button
                      onClick={() => copyToClipboard(asset.ipAddress)}
                      title="Copy IP Address"
                      className="text-slate-400 hover:text-white p-0.5 rounded cursor-pointer"
                    >
                      {copiedIp === asset.ipAddress ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>

                  {/* Health Score */}
                  <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800/60 flex items-center justify-between">
                    <span className="text-slate-400 text-[11px]">Health</span>
                    <span
                      className={`font-mono text-xs font-semibold tabular-nums ${
                        asset.healthScore >= 95
                          ? 'text-emerald-400'
                          : asset.healthScore >= 80
                          ? 'text-blue-400'
                          : 'text-amber-400'
                      }`}
                    >
                      {asset.healthScore}%
                    </span>
                  </div>
                </div>

                {/* Details list */}
                <div className="mt-3 space-y-1.5 text-[11px] text-slate-400">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                    <span className="truncate">{asset.location}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Custodian: <span className="text-slate-300">{asset.assignedTo}</span></span>
                  </div>
                  {asset.cpuRamUsage && (
                    <div className="flex items-center gap-1.5 font-mono text-[10px] text-slate-400 pt-0.5">
                      <Cpu className="w-3 h-3 text-slate-500 shrink-0" />
                      <span>{asset.cpuRamUsage}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between">
                <div className="text-[11px] font-mono text-slate-400">
                  Uptime: <span className="text-slate-300 tabular-nums">{asset.uptime}</span>
                </div>

                <button
                  onClick={() => onOpenTicketForAsset(asset)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
                >
                  <Plus className="w-3 h-3 text-blue-400" />
                  <span>Log Ticket</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
