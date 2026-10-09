'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Sidebar, { NavTab } from '@/components/Sidebar';
import Header from '@/components/Header';
import DashboardView from '@/components/DashboardView';
import ActiveTicketsView from '@/components/ActiveTicketsView';
import AssetDirectoryView from '@/components/AssetDirectoryView';
import SystemLogsView from '@/components/SystemLogsView';
import EmployeePortalView from '@/components/EmployeePortalView';
import EmployeeTicketsView from '@/components/EmployeeTicketsView';
import NewTicketModal from '@/components/NewTicketModal';
import TicketDetailModal from '@/components/TicketDetailModal';
import SplashScreen from '@/components/SplashScreen';
import { RoleProvider, useRole } from '@/context/RoleContext';
import {
  Ticket,
  Asset,
  SystemLog,
  ActivityFeedItem,
  DashboardMetrics,
  TicketStatus,
  TicketPriority,
  TicketCategory,
} from '@/lib/types';
import { CheckCircle2, AlertCircle } from 'lucide-react';

function OpsFlowDashboard() {
  const { role, currentUser, isAdmin, isEmployee } = useRole();

  // Tab state - default differs by role
  const [currentTab, setCurrentTab] = useState<NavTab>(() =>
    role === 'admin' ? 'dashboard' : 'employee_portal'
  );

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [activityFeed, setActivityFeed] = useState<ActivityFeedItem[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    openTickets: 5,
    criticalAlerts: 1,
    avgResolutionTimeHours: 1.8,
    slaCompliancePercent: 98.4,
    activeAssets: 5,
    resolvedToday: 1,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

  // Modals state
  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(false);
  const [targetAssetForNewTicket, setTargetAssetForNewTicket] = useState<Asset | null>(null);
  const [selectedTicketForDetail, setSelectedTicketForDetail] = useState<Ticket | null>(null);

  // Mobile menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Derive effective tab based on active role so view is always valid without cascading renders
  const effectiveTab: NavTab = isAdmin
    ? (currentTab === 'employee_portal' || currentTab === 'employee_tickets' ? 'dashboard' : currentTab)
    : (['dashboard', 'tickets', 'assets', 'logs'].includes(currentTab) ? 'employee_portal' : currentTab);

  // Refresh function callable by buttons and event handlers
  const refreshAllData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const [ticketsRes, assetsRes, logsRes, metricsRes] = await Promise.all([
        fetch('/api/tickets'),
        fetch('/api/assets'),
        fetch('/api/logs'),
        fetch('/api/metrics'),
      ]);

      if (ticketsRes.ok) {
        const tData = await ticketsRes.json();
        if (tData.success) setTickets(tData.data);
      }

      if (assetsRes.ok) {
        const aData = await assetsRes.json();
        if (aData.success) setAssets(aData.data);
      }

      if (logsRes.ok) {
        const lData = await logsRes.json();
        if (lData.success) {
          setLogs(lData.data);
          if (lData.activityFeed) setActivityFeed(lData.activityFeed);
        }
      }

      if (metricsRes.ok) {
        const mData = await metricsRes.json();
        if (mData.success) setMetrics(mData.data);
      }
    } catch (err) {
      console.error('Error fetching OpsFlow data:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;

    async function initialLoad() {
      try {
        const [ticketsRes, assetsRes, logsRes, metricsRes] = await Promise.all([
          fetch('/api/tickets'),
          fetch('/api/assets'),
          fetch('/api/logs'),
          fetch('/api/metrics'),
        ]);

        if (ignore) return;

        if (ticketsRes.ok) {
          const tData = await ticketsRes.json();
          if (tData.success && !ignore) setTickets(tData.data);
        }

        if (assetsRes.ok) {
          const aData = await assetsRes.json();
          if (aData.success && !ignore) setAssets(aData.data);
        }

        if (logsRes.ok) {
          const lData = await logsRes.json();
          if (lData.success && !ignore) {
            setLogs(lData.data);
            if (lData.activityFeed) setActivityFeed(lData.activityFeed);
          }
        }

        if (metricsRes.ok) {
          const mData = await metricsRes.json();
          if (mData.success && !ignore) setMetrics(mData.data);
        }
      } catch (err) {
        console.error('Error in initial OpsFlow load:', err);
      } finally {
        if (!ignore) {
          setIsLoading(false);
          setIsRefreshing(false);
        }
      }
    }

    initialLoad();

    return () => {
      ignore = true;
    };
  }, []);

  // Handle status update
  const handleUpdateTicketStatus = async (ticketId: string, newStatus: TicketStatus) => {
    try {
      const res = await fetch(`/api/tickets/${ticketId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update ticket');
      }

      setTickets((prev) =>
        prev.map((t) => (t.id === ticketId ? data.data : t))
      );

      if (selectedTicketForDetail && selectedTicketForDetail.id === ticketId) {
        setSelectedTicketForDetail(data.data);
      }

      showToast(`Ticket ${ticketId} status updated to ${newStatus}`);

      // Refresh metrics in background
      fetch('/api/metrics')
        .then((r) => r.json())
        .then((m) => m.success && setMetrics(m.data));
    } catch (err: any) {
      showToast(err.message || 'Error updating status', 'error');
    }
  };

  // Handle priority update
  const handleUpdateTicketPriority = async (ticketId: string, newPriority: TicketPriority) => {
    try {
      const res = await fetch(`/api/tickets/${ticketId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priority: newPriority }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update priority');
      }

      setTickets((prev) =>
        prev.map((t) => (t.id === ticketId ? data.data : t))
      );

      if (selectedTicketForDetail && selectedTicketForDetail.id === ticketId) {
        setSelectedTicketForDetail(data.data);
      }

      showToast(`Ticket ${ticketId} priority set to ${newPriority}`);
    } catch (err: any) {
      showToast(err.message || 'Error updating priority', 'error');
    }
  };

  // Handle delete ticket
  const handleDeleteTicket = async (ticketId: string) => {
    try {
      const res = await fetch(`/api/tickets/${ticketId}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to delete ticket');
      }

      setTickets((prev) => prev.filter((t) => t.id !== ticketId));
      if (selectedTicketForDetail?.id === ticketId) {
        setSelectedTicketForDetail(null);
      }

      showToast(`Ticket ${ticketId} removed`);

      fetch('/api/metrics')
        .then((r) => r.json())
        .then((m) => m.success && setMetrics(m.data));
    } catch (err: any) {
      showToast(err.message || 'Error deleting ticket', 'error');
    }
  };

  // Handle internal comment
  const handleAddTicketComment = async (ticketId: string, content: string) => {
    try {
      const current = tickets.find((t) => t.id === ticketId);
      if (!current) return;

      const newComments = [
        ...(current.comments || []),
        {
          id: `c-${Date.now()}`,
          author: currentUser.name,
          role: currentUser.roleTitle,
          timestamp: new Date().toISOString(),
          content,
          isInternal: isAdmin,
        },
      ];

      const res = await fetch(`/api/tickets/${ticketId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comments: newComments }),
      });

      const data = await res.json();
      if (data.success) {
        setTickets((prev) =>
          prev.map((t) => (t.id === ticketId ? data.data : t))
        );
        setSelectedTicketForDetail(data.data);
        showToast('Work note posted');
      }
    } catch (err: any) {
      showToast('Failed to post note', 'error');
    }
  };

  // Employee-specific ticket submission from the portal view
  const handleEmployeeSubmitTicket = async (ticketData: {
    title: string;
    category: TicketCategory;
    priority: TicketPriority;
    description: string;
  }): Promise<boolean> => {
    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: ticketData.title,
          category: ticketData.category,
          priority: ticketData.priority,
          description: ticketData.description,
          requesterName: currentUser.name,
          requesterEmail: currentUser.email,
          requesterDepartment: currentUser.department,
          status: 'Open',
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit request');
      }

      // Add to local state immediately
      setTickets((prev) => [data.data, ...prev]);

      showToast(`Request ${data.data.id} submitted to IT Helpdesk`);

      // Refresh metrics & logs
      refreshAllData();
      return true;
    } catch (err: any) {
      showToast(err.message || 'Failed to submit ticket', 'error');
      return false;
    }
  };

  // Open ticket modal pre-configured for an asset
  const handleOpenTicketForAsset = (asset: Asset) => {
    setTargetAssetForNewTicket(asset);
    setIsNewTicketModalOpen(true);
  };

  // Filter employee tickets
  const myEmployeeTickets = tickets.filter(
    (t) =>
      t.requester.email.toLowerCase() === currentUser.email.toLowerCase() ||
      t.requester.name.toLowerCase() === currentUser.name.toLowerCase()
  );

  const openTicketsCount = tickets.filter(
    (t) => t.status !== 'Resolved' && t.status !== 'Closed'
  ).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600/30 selection:text-blue-200">
      {/* Cinematic Initial Loading Splash Screen */}
      <SplashScreen />

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Persistent Side Navigation Bar */}
      <Sidebar
        currentTab={effectiveTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          setMobileMenuOpen(false);
        }}
        openTicketsCount={openTicketsCount}
        criticalCount={metrics.criticalAlerts}
        myTicketsCount={myEmployeeTickets.length}
        onOpenNewTicketModal={() => {
          setTargetAssetForNewTicket(null);
          setIsNewTicketModalOpen(true);
        }}
        mobileMenuOpen={mobileMenuOpen}
        onCloseMobileMenu={() => setMobileMenuOpen(false)}
      />

      {/* Main Layout Area */}
      <div className="lg:pl-64 flex flex-col flex-1 min-w-0">
        {/* Top Header */}
        <Header
          currentTab={effectiveTab}
          onOpenNewTicketModal={() => {
            setTargetAssetForNewTicket(null);
            setIsNewTicketModalOpen(true);
          }}
          onRefreshData={refreshAllData}
          isRefreshing={isRefreshing}
          onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
          searchQuery={globalSearch}
          onSearchChange={setGlobalSearch}
        />

        {/* Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {isLoading ? (
            <div className="h-64 flex flex-col items-center justify-center text-slate-400 gap-3">
              <div className="w-7 h-7 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-mono">Initializing OpsFlow telemetry & tickets...</span>
            </div>
          ) : (
            <>
              {/* ADMIN VIEWS */}
              {isAdmin && (
                <>
                  {effectiveTab === 'dashboard' && (
                    <DashboardView
                      metrics={metrics}
                      tickets={tickets}
                      activityFeed={activityFeed}
                      onNavigateToTab={(tab) => setCurrentTab(tab)}
                      onSelectTicket={(ticket) => setSelectedTicketForDetail(ticket)}
                      onOpenNewTicketModal={() => {
                        setTargetAssetForNewTicket(null);
                        setIsNewTicketModalOpen(true);
                      }}
                    />
                  )}

                  {effectiveTab === 'tickets' && (
                    <ActiveTicketsView
                      tickets={tickets}
                      onOpenNewTicketModal={() => {
                        setTargetAssetForNewTicket(null);
                        setIsNewTicketModalOpen(true);
                      }}
                      onSelectTicket={(ticket) => setSelectedTicketForDetail(ticket)}
                      onUpdateTicketStatus={handleUpdateTicketStatus}
                      onDeleteTicket={handleDeleteTicket}
                      searchQuery={globalSearch}
                      onSearchChange={setGlobalSearch}
                    />
                  )}

                  {effectiveTab === 'assets' && (
                    <AssetDirectoryView
                      assets={assets}
                      searchQuery={globalSearch}
                      onSearchChange={setGlobalSearch}
                      onOpenTicketForAsset={handleOpenTicketForAsset}
                    />
                  )}

                  {effectiveTab === 'logs' && (
                    <SystemLogsView
                      logs={logs}
                      searchQuery={globalSearch}
                      onSearchChange={setGlobalSearch}
                      onRefreshLogs={refreshAllData}
                      isRefreshing={isRefreshing}
                    />
                  )}
                </>
              )}

              {/* EMPLOYEE VIEWS */}
              {isEmployee && (
                <>
                  {effectiveTab === 'employee_portal' && (
                    <EmployeePortalView
                      currentUser={currentUser}
                      myTickets={myEmployeeTickets}
                      onSubmitTicket={handleEmployeeSubmitTicket}
                      onSelectTicket={(ticket) => setSelectedTicketForDetail(ticket)}
                      onNavigateToMyTickets={() => setCurrentTab('employee_tickets')}
                    />
                  )}

                  {effectiveTab === 'employee_tickets' && (
                    <EmployeeTicketsView
                      currentUser={currentUser}
                      tickets={tickets}
                      onOpenSubmitModal={() => setCurrentTab('employee_portal')}
                      onSelectTicket={(ticket) => setSelectedTicketForDetail(ticket)}
                    />
                  )}
                </>
              )}
            </>
          )}
        </main>
      </div>

      {/* New Ticket Modal */}
      <NewTicketModal
        key={targetAssetForNewTicket ? targetAssetForNewTicket.id : 'default-modal'}
        isOpen={isNewTicketModalOpen}
        onClose={() => {
          setIsNewTicketModalOpen(false);
          setTargetAssetForNewTicket(null);
        }}
        onTicketCreated={() => {
          refreshAllData();
          showToast('Ticket submitted successfully to OpsFlow');
        }}
        assets={assets}
        initialAsset={targetAssetForNewTicket}
      />

      {/* Ticket Details & Triage Modal */}
      <TicketDetailModal
        ticket={selectedTicketForDetail}
        onClose={() => setSelectedTicketForDetail(null)}
        onUpdateStatus={handleUpdateTicketStatus}
        onUpdatePriority={handleUpdateTicketPriority}
        onDeleteTicket={handleDeleteTicket}
        onAddComment={handleAddTicketComment}
      />

      {/* Floating Feedback Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-200">
          <div
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border shadow-xl text-xs font-medium ${
              toastMessage.type === 'success'
                ? 'bg-slate-900 text-slate-100 border-slate-700 shadow-blue-950/40'
                : 'bg-red-950 text-red-200 border-red-800 shadow-red-950/40'
            }`}
          >
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            )}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OpsFlowPage() {
  return (
    <RoleProvider>
      <OpsFlowDashboard />
    </RoleProvider>
  );
}
