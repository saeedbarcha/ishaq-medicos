import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ClipboardList,
  MessageSquare,
  Package,
  ShoppingBag,
  TrendingDown,
  TrendingUp,
  Users,
  Wallet,
} from 'lucide-react';
import type { AdminMetrics } from '@shared/types';
import { AreaChart, BarChart, DonutChart, HorizontalBars } from '@/features/admin/DashboardCharts';
import { formatPrice } from '@/lib/utils';
import { useGetAdminDashboardQuery } from '@/store/api/adminApi';

const statusColor: Record<string, string> = {
  delivered: '#01618D',
  pending: '#8a5a12',
  confirmed: '#000000',
  prescription_review: '#014866',
  preparing: '#4d8eab',
  ready_for_pickup: '#01618D',
  dispatched: '#014866',
  cancelled: '#9b2c2c',
};

const kindLabel: Record<string, string> = {
  medicine: 'Medicines',
  surgical: 'Surgical',
  cosmetic: 'Cosmetics',
  'personal-care': 'Personal care',
  'mother-baby': 'Mother & baby',
  supplement: 'Supplements',
};

const payLabel: Record<string, string> = {
  store_pickup: 'Store pickup',
  cod: 'Cash on delivery',
  bank_transfer: 'Bank transfer',
  jazzcash: 'JazzCash',
  easypaisa: 'Easypaisa',
};

function changeTone(value = 0) {
  if (value > 0) return { icon: TrendingUp, text: `+${value}% vs last week`, className: 'text-teal' };
  if (value < 0) return { icon: TrendingDown, text: `${value}% vs last week`, className: 'text-[#9b2c2c]' };
  return { icon: TrendingUp, text: 'Flat vs last week', className: 'text-ink/45' };
}

function statusLabel(status: string) {
  return status.replaceAll('_', ' ');
}

function Kpi({
  label,
  value,
  hint,
  icon: Icon,
  to,
  tone = 'white',
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon: typeof ShoppingBag;
  to?: string;
  tone?: 'white' | 'navy' | 'teal';
}) {
  const wrap =
    tone === 'navy'
      ? 'bg-navy text-white shadow-[0_18px_40px_rgba(18,32,51,0.22)]'
      : tone === 'teal'
        ? 'bg-teal text-white shadow-[0_18px_40px_rgba(1,97,141,0.22)]'
        : 'bg-white text-navy shadow-[0_12px_28px_rgba(18,32,51,0.06)] ring-1 ring-line';
  const inner = (
    <div className={`rounded-[1.35rem] p-5 ${wrap}`}>
      <div className="flex items-start justify-between gap-3">
        <p className={`text-xs font-bold uppercase tracking-[0.14em] ${tone === 'white' ? 'text-ink/45' : 'text-white/60'}`}>{label}</p>
        <span className={`grid size-9 place-items-center rounded-full ${tone === 'white' ? 'bg-mist text-teal' : 'bg-white/15 text-white'}`}>
          <Icon className="size-4" />
        </span>
      </div>
      <p className="mt-3 font-display text-3xl font-semibold tracking-tight">{value}</p>
      {hint ? <p className={`mt-2 text-xs ${tone === 'white' ? 'text-ink/50' : 'text-white/65'}`}>{hint}</p> : null}
    </div>
  );
  return to ? (
    <Link to={to} className="block transition hover:-translate-y-0.5">
      {inner}
    </Link>
  ) : (
    inner
  );
}

function Skeleton() {
  return (
    <div className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="shimmer h-32 rounded-[1.35rem]" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-5">
        <div className="shimmer h-72 rounded-[1.5rem] lg:col-span-3" />
        <div className="shimmer h-72 rounded-[1.5rem] lg:col-span-2" />
      </div>
    </div>
  );
}

export function AdminHome() {
  const { data, isLoading } = useGetAdminDashboardQuery();
  const m = (data?.data ?? {}) as AdminMetrics;
  const series = m.series ?? [];
  const salesChange = changeTone(m.salesChange);
  const ordersChange = changeTone(m.ordersChange);

  if (isLoading && !data) return <Skeleton />;

  const statusSlices = (m.ordersByStatus ?? [])
    .filter((row) => row.count > 0)
    .map((row) => ({
      label: statusLabel(row.status),
      value: row.count,
      color: statusColor[row.status] ?? '#7a8b86',
    }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal">Today at the counter</p>
          <h1 className="font-display mt-1 text-3xl font-semibold text-navy">Operations overview</h1>
          <p className="mt-1 text-sm text-ink/55">Live catalog, orders, prescriptions and stock risk — not a marketplace dashboard.</p>
        </div>
        <p className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-ink/55 ring-1 ring-line">
          14-day window · Asia/Karachi
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi
          label="Sales today"
          value={formatPrice(Number(m.salesToday ?? 0))}
          hint={`${salesChange.text} · 7-day ${formatPrice(Number(m.sales7d ?? 0))}`}
          icon={Wallet}
          tone="navy"
          to="/admin/orders"
        />
        <Kpi
          label="Orders today"
          value={m.todaysOrders ?? 0}
          hint={`${ordersChange.text} · ${m.orders7d ?? 0} this week`}
          icon={ShoppingBag}
          tone="teal"
          to="/admin/orders"
        />
        <Kpi
          label="Average ticket"
          value={formatPrice(Number(m.avgOrderValue ?? 0))}
          hint={`${m.orders30d ?? 0} orders in 30 days`}
          icon={TrendingUp}
        />
        <Kpi
          label="Customers (7d)"
          value={m.recentCustomers ?? 0}
          hint={`${m.totalCustomers ?? 0} customer accounts total`}
          icon={Users}
          to="/admin/users"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi label="Awaiting action" value={m.pendingOrders ?? 0} hint="Pending, Rx review, confirmed" icon={ClipboardList} to="/admin/orders" />
        <Kpi label="Rx queue" value={m.prescriptionReviews ?? 0} hint="Received or under review" icon={ClipboardList} to="/admin/prescriptions" />
        <Kpi label="Low / out of stock" value={(m.lowStock ?? 0) + (m.outOfStock ?? 0)} hint={`${m.outOfStock ?? 0} out of stock · ${m.nearExpiry ?? 0} near expiry`} icon={AlertTriangle} to="/admin/inventory" />
        <Kpi label="New inquiries" value={m.newInquiries ?? 0} hint={`${m.catalogActive ?? 0} active catalog rows`} icon={MessageSquare} to="/admin/inquiries" />
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <section className="rounded-[1.5rem] bg-white p-5 shadow-[0_14px_36px_rgba(18,32,51,0.06)] ring-1 ring-line lg:col-span-3">
          <div className="mb-2 flex items-center justify-between">
            <div>
              <h2 className="font-display text-xl font-semibold text-navy">Sales, 14 days</h2>
              <p className="text-sm text-ink/50">Cancelled orders are excluded from the trend.</p>
            </div>
            <p className={`inline-flex items-center gap-1 text-xs font-semibold ${salesChange.className}`}>
              <salesChange.icon className="size-3.5" />
              {salesChange.text}
            </p>
          </div>
          {series.length ? (
            <AreaChart values={series.map((p) => p.sales)} labels={series.map((p) => p.label)} />
          ) : (
            <p className="py-16 text-center text-sm text-ink/45">No sales in this window yet.</p>
          )}
        </section>
        <section className="rounded-[1.5rem] bg-white p-5 shadow-[0_14px_36px_rgba(18,32,51,0.06)] ring-1 ring-line lg:col-span-2">
          <h2 className="font-display text-xl font-semibold text-navy">Order mix</h2>
          <p className="mb-4 text-sm text-ink/50">All-time status on the books.</p>
          {statusSlices.length ? (
            <DonutChart slices={statusSlices} />
          ) : (
            <p className="py-10 text-center text-sm text-ink/45">No orders yet.</p>
          )}
        </section>
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <section className="rounded-[1.5rem] bg-white p-5 shadow-[0_14px_36px_rgba(18,32,51,0.06)] ring-1 ring-line lg:col-span-3">
          <h2 className="font-display text-xl font-semibold text-navy">Orders per day</h2>
          <p className="mb-2 text-sm text-ink/50">Volume at the counter, not marketplace GMV.</p>
          {series.length ? (
            <BarChart values={series.map((p) => p.orders)} labels={series.map((p) => p.label)} />
          ) : (
            <p className="py-16 text-center text-sm text-ink/45">No order volume yet.</p>
          )}
        </section>
        <section className="rounded-[1.5rem] bg-white p-5 shadow-[0_14px_36px_rgba(18,32,51,0.06)] ring-1 ring-line lg:col-span-2">
          <h2 className="font-display text-xl font-semibold text-navy">Asked-for products</h2>
          <p className="mb-4 text-sm text-ink/50">From order lines, not page views.</p>
          {(m.popularProducts ?? []).length ? (
            <HorizontalBars
              rows={(m.popularProducts ?? []).map((row) => ({
                label: row.name,
                value: row.qty,
                hint: `${row.qty} · ${formatPrice(row.revenue)}`,
              }))}
            />
          ) : (
            <p className="py-10 text-center text-sm text-ink/45">No order lines yet.</p>
          )}
        </section>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="rounded-[1.5rem] bg-white p-5 shadow-[0_14px_36px_rgba(18,32,51,0.06)] ring-1 ring-line lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold text-navy">Latest orders</h2>
            <Link to="/admin/orders" className="text-sm font-semibold text-teal">
              Open queue →
            </Link>
          </div>
          <div className="overflow-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-wider text-ink/40">
                <tr>
                  <th className="pb-3 font-semibold">Ref</th>
                  <th className="pb-3 font-semibold">Customer</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Pay</th>
                  <th className="pb-3 text-right font-semibold">Total</th>
                </tr>
              </thead>
              <tbody>
                {(m.recentOrders ?? []).length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-ink/45">
                      No orders on file.
                    </td>
                  </tr>
                ) : (
                  (m.recentOrders ?? []).map((order) => (
                    <tr key={order.id || order.publicRef} className="border-t border-line">
                      <td className="py-3 font-semibold text-navy">{order.publicRef}</td>
                      <td className="py-3 text-ink/70">{order.customerName}</td>
                      <td className="py-3">
                        <span className="rounded-full bg-mist px-2 py-0.5 text-xs font-medium capitalize text-navy">
                          {statusLabel(order.status)}
                        </span>
                      </td>
                      <td className="py-3 text-ink/55">{payLabel[order.paymentMethod] ?? order.paymentMethod}</td>
                      <td className="py-3 text-right font-semibold">{formatPrice(Number(order.total ?? 0))}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <div className="grid gap-4">
          <section className="rounded-[1.5rem] bg-white p-5 shadow-[0_14px_36px_rgba(18,32,51,0.06)] ring-1 ring-line">
            <h2 className="font-display text-lg font-semibold text-navy">Catalog mix</h2>
            <div className="mt-4">
              {(m.catalogByKind ?? []).length ? (
                <HorizontalBars
                  rows={(m.catalogByKind ?? []).map((row) => ({
                    label: kindLabel[row.kind] ?? row.kind,
                    value: row.count,
                    hint: String(row.count),
                  }))}
                />
              ) : (
                <p className="text-sm text-ink/45">Catalog is empty.</p>
              )}
            </div>
          </section>
          <section className="rounded-[1.5rem] bg-[linear-gradient(165deg,#01618D,#000000)] p-5 text-white shadow-[0_18px_40px_rgba(1,97,141,0.28)]">
            <div className="flex items-center gap-2">
              <Package className="size-4 text-mint" />
              <h2 className="font-display text-lg font-semibold">Stock to watch</h2>
            </div>
            <ul className="mt-4 space-y-2 text-sm">
              {(m.attention ?? []).length === 0 ? (
                <li className="text-white/70">No low-stock rows right now.</li>
              ) : (
                (m.attention ?? []).map((item) => (
                  <li key={item.sku || item.name} className="flex items-center justify-between gap-3 border-b border-white/10 py-2 last:border-0">
                    <span className="truncate">{item.name}</span>
                    <span className="shrink-0 rounded-full bg-white/15 px-2 py-0.5 text-xs">{item.stock} left</span>
                  </li>
                ))
              )}
            </ul>
            <Link to="/admin/inventory" className="mt-4 inline-block text-sm font-semibold text-mint">
              Inventory →
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}
