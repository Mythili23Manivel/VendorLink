import KPICard from '../components/KPICard';
import AlertPanel from '../components/AlertPanel';
import { useDashboardViewModel } from '../hooks/useDashboardViewModel';

export default function Dashboard() {
  const { data, loading, error } = useDashboardViewModel();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-12 h-12 border-2 border-primary-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="card border-red-500/50 text-red-400">
        {error}
      </div>
    );
  }

  if (!data) return null;

  return (
    <div>
      <h1 className="font-display font-bold text-2xl text-white mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard title="Total Vendors" value={data.totalVendors} icon="🏢" />
        <KPICard title="Pending Payments" value={data.totalPendingPayments} icon="💰" />
        <KPICard title="Invoice Mismatches" value={data.totalInvoiceMismatches} icon="⚠️" />
        <KPICard
          title="High Risk Vendors"
          value={data.riskVendors?.length || 0}
          icon="🔴"
          subtitle="Require attention"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AlertPanel
          title="Top Performing Vendors"
          items={data.topPerformingVendors?.map((v) => ({ name: v.name, value: `★ ${v.rating}` }))}
          emptyMessage="No data yet"
          type="info"
        />
        <AlertPanel
          title="Delayed Vendors"
          items={data.delayedVendors?.map((v) => ({ name: v.name, value: `${v.delayRate}%` }))}
          emptyMessage="No delayed vendors"
          type="warning"
        />
        <AlertPanel
          title="Risk Vendors"
          items={data.riskVendors?.map((v) => ({ name: v.name, value: v.riskLevel }))}
          emptyMessage="No high-risk vendors"
          type="danger"
        />
      </div>
    </div>
  );
}
