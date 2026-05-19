import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, TrendingUp, UserCheck, UserX, PhoneCall, Plus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { PageLoader, ErrorState } from '@/components/ui/Feedback';
import { leadsApi } from '@/api/leads.api';
import { useAuthStore } from '@/store/auth.store';
import { Lead } from '@/types';

// ─── Stat Card ────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  iconColor: string;
  iconBg: string;
  change?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  iconColor,
  iconBg,
}) => (
  <div className="bg-white dark:bg-slate-900 rounded-xl border border-border dark:border-slate-800 shadow-card p-5 flex items-center gap-4 hover:shadow-card-hover transition-shadow">
    <div
      className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}
    >
      <div className={iconColor}>{icon}</div>
    </div>
    <div>
      <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 tabular-nums">
        {value}
      </p>
      <p className="text-xs text-muted font-medium">{label}</p>
    </div>
  </div>
);

// ─── Dashboard ────────────────────────────────────────────────────────────────

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['leads', 'stats'],
    queryFn: leadsApi.getStats,
    staleTime: 60_000, // Stats can be 1 minute stale
  });

  if (isLoading)
    return (
      <div className="flex flex-col h-full">
        <Header title="Dashboard" />
        <PageLoader />
      </div>
    );

  if (isError)
    return (
      <div className="flex flex-col h-full">
        <Header title="Dashboard" />
        <ErrorState onRetry={refetch} />
      </div>
    );

  const stats = data!;
  const recentLeads: Lead[] = stats.recentLeads ?? [];

  const statCards: StatCardProps[] = [
    {
      label: 'Total Leads',
      value: stats.total,
      icon: <Users size={20} />,
      iconColor: 'text-secondary',
      iconBg: 'bg-secondary-light dark:bg-indigo-900/30',
    },
    {
      label: 'New',
      value: stats.byStatus['New'] ?? 0,
      icon: <TrendingUp size={20} />,
      iconColor: 'text-info',
      iconBg: 'bg-info-light dark:bg-blue-900/30',
    },
    {
      label: 'Contacted',
      value: stats.byStatus['Contacted'] ?? 0,
      icon: <PhoneCall size={20} />,
      iconColor: 'text-warning',
      iconBg: 'bg-warning-light dark:bg-yellow-900/30',
    },
    {
      label: 'Qualified',
      value: stats.byStatus['Qualified'] ?? 0,
      icon: <UserCheck size={20} />,
      iconColor: 'text-accent',
      iconBg: 'bg-accent-light dark:bg-emerald-900/30',
    },
    {
      label: 'Lost',
      value: stats.byStatus['Lost'] ?? 0,
      icon: <UserX size={20} />,
      iconColor: 'text-danger',
      iconBg: 'bg-danger-light dark:bg-red-900/30',
    },
  ];

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Dashboard"
        subtitle={`Welcome back, ${user?.name ?? 'there'} 👋`}
        actions={
          <Button
            size="sm"
            icon={<Plus size={14} />}
            onClick={() => navigate('/leads')}
          >
            Add Lead
          </Button>
        }
      />

      <div className="p-8 space-y-8 animate-fade-in">
        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {statCards.map((card) => (
            <StatCard key={card.label} {...card} />
          ))}
        </div>

        {/* Recent Leads */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-border dark:border-slate-800 shadow-card">
          <div className="px-6 py-4 border-b border-border dark:border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                Recent Leads
              </h2>
              <p className="text-xs text-muted mt-0.5">Latest 5 additions</p>
            </div>
            <button
              onClick={() => navigate('/leads')}
              className="text-xs text-accent hover:underline font-medium"
            >
              View all →
            </button>
          </div>

          {recentLeads.length === 0 ? (
            <div className="px-6 py-10 text-center">
              <p className="text-sm text-muted">
                No leads yet.{' '}
                <button
                  onClick={() => navigate('/leads')}
                  className="text-accent hover:underline"
                >
                  Create your first lead →
                </button>
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border dark:divide-slate-800">
              {recentLeads.map((lead) => (
                <div
                  key={lead._id}
                  onClick={() => navigate(`/leads/${lead._id}`)}
                  className="px-6 py-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors group"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 group-hover:text-accent transition-colors truncate">
                      {lead.name}
                    </p>
                    <p className="text-xs text-muted font-mono truncate">{lead.email}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                    <Badge variant={lead.source}>{lead.source}</Badge>
                    <Badge variant={lead.status}>{lead.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick pipeline view */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-border dark:border-slate-800 shadow-card p-6">
          <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-4">
            Pipeline Overview
          </h2>
          <div className="space-y-3">
            {(['New', 'Contacted', 'Qualified', 'Lost'] as const).map((status) => {
              const count = stats.byStatus[status] ?? 0;
              const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
              const colors: Record<string, string> = {
                New: 'bg-info',
                Contacted: 'bg-warning',
                Qualified: 'bg-accent',
                Lost: 'bg-danger',
              };
              return (
                <div key={status}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                      {status}
                    </span>
                    <span className="text-xs text-muted tabular-nums">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${colors[status]}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
