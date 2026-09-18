import { useEffect, useState } from 'react';
import { Database, FileText, Activity, Clock, Server, RefreshCw } from 'lucide-react';
import { AnimatedCounter } from '../common/AnimatedCounter';
import { Skeleton } from '../common/Skeleton';
import { SyncButton } from './SyncButton';
import type { AdminStats } from '../../types';

// Mock api import
const getAdminStats = async (): Promise<AdminStats> => {
  return new Promise(resolve => setTimeout(() => resolve({
    lastSyncTimestamp: new Date().toISOString(),
    totalRecords: 14502,
    embeddingIndexFreshness: '2 hours ago',
    catalogVersion: 'v2023.10',
    recordsIngested: 450,
    pendingUpdates: 12
  }), 1000));
};

export function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    getAdminStats().then(setStats);
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Manage standard catalog and embedding synchronization.</p>
        </div>
        <SyncButton />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <StatCard 
          title="Total Records" 
          value={stats ? <AnimatedCounter value={stats.totalRecords} /> : <Skeleton className="w-24 h-8" />} 
          icon={<Database className="w-5 h-5 text-indigo-500" />} 
        />
        <StatCard 
          title="Records Ingested (Last 30d)" 
          value={stats ? <AnimatedCounter value={stats.recordsIngested} /> : <Skeleton className="w-16 h-8" />} 
          icon={<FileText className="w-5 h-5 text-green-500" />} 
        />
        <StatCard 
          title="Pending Updates" 
          value={stats ? <AnimatedCounter value={stats.pendingUpdates} /> : <Skeleton className="w-12 h-8" />} 
          icon={<Activity className="w-5 h-5 text-amber-500" />} 
        />
        <StatCard 
          title="Last Sync" 
          value={stats ? new Date(stats.lastSyncTimestamp).toLocaleString() : <Skeleton className="w-32 h-8" />} 
          icon={<Clock className="w-5 h-5 text-blue-500" />} 
          valueSize="small"
        />
        <StatCard 
          title="Index Freshness" 
          value={stats?.embeddingIndexFreshness || <Skeleton className="w-24 h-8" />} 
          icon={<RefreshCw className="w-5 h-5 text-purple-500" />} 
          valueSize="small"
        />
        <StatCard 
          title="Catalog Version" 
          value={stats?.catalogVersion || <Skeleton className="w-20 h-8" />} 
          icon={<Server className="w-5 h-5 text-zinc-500" />} 
          valueSize="small"
        />
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, valueSize = 'large' }: { title: string, value: React.ReactNode, icon: React.ReactNode, valueSize?: 'large' | 'small' }) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
          {icon}
        </div>
        <h3 className="font-medium text-zinc-600 dark:text-zinc-400 text-sm">{title}</h3>
      </div>
      <div className={`font-semibold tabular-nums text-zinc-900 dark:text-zinc-100 ${valueSize === 'large' ? 'text-3xl' : 'text-xl'}`}>
        {value}
      </div>
    </div>
  );
}
