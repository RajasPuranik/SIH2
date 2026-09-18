import { AdminDashboard } from '../components/admin/AdminDashboard';

export function AdminPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <div className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-6">
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            Data Health & Administration
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Monitor BIS catalog sync status and embedding index freshness
          </p>
        </div>
      </div>
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-6">
        <AdminDashboard />
      </div>
    </div>
  );
}
