import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useState, type FormEvent } from 'react';
import { Seo } from '@/components/common/Seo';
import { Button } from '@/components/ui/Button';
import { demoAddresses, demoOrders, demoPrescriptions, demoUsers } from '@/data/users';
import { formatPrice } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout, setSession, startDemoSession } from '@/store/slices/authSlice';
import { useAdminLoginMutation } from '@/store/api/adminApi';
import { useGetOrdersQuery, useLazyTrackOrderQuery, useLoginMutation } from '@/store/api/storeApi';
import type { DemoUser } from '@shared/types';

export function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [adminLogin, { isLoading: adminLoading }] = useAdminLoginMutation();
  const [customerLogin, { isLoading: customerLoading }] = useLoginMutation();
  const [error, setError] = useState('');
  const isLoading = adminLoading || customerLoading;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get('email'));
    const password = String(form.get('password'));
    try {
      let payload: { user: { id: string; name: string; email: string; role: string; phone?: string }; tokens: { access: { token: string }; refresh: { token: string } } };
      try {
        payload = (await adminLogin({ email, password }).unwrap()).data;
      } catch {
        payload = (await customerLogin({ email, password }).unwrap()).data;
      }
      dispatch(
        setSession({
          user: { ...payload.user, phone: payload.user.phone ?? '', role: payload.user.role as DemoUser['role'] },
          accessToken: payload.tokens.access.token,
          refreshToken: payload.tokens.refresh.token,
        }),
      );
      const staff = ['staff', 'pharmacist', 'manager', 'admin', 'superAdmin'];
      navigate(staff.includes(payload.user.role) ? '/admin' : '/account');
    } catch {
      setError('Sign-in failed. Check email/password, or use a demo session below if the API is offline.');
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <Seo title="Sign in | Ishaq Medical" description="Staff and customer sign-in." path="/login" noIndex />
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal">Staff & customers</p>
      <h1 className="font-display mt-2 text-4xl font-semibold text-navy">Sign in</h1>
      <p className="mt-3 text-sm text-ink/65">Staff can manage website content from the admin panel. Default seed account: admin@ishaq.local / Admin123!</p>
      <form onSubmit={onSubmit} className="mt-6 grid gap-3">
        <label className="grid gap-1 text-sm">
          <span className="text-ink/55">Email</span>
          <input required name="email" type="email" defaultValue="admin@ishaq.local" className="rounded-xl border border-line px-3 py-2" />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="text-ink/55">Password</span>
          <input required name="password" type="password" defaultValue="Admin123!" className="rounded-xl border border-line px-3 py-2" />
        </label>
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
        <Button type="submit" variant="navy" disabled={isLoading}>{isLoading ? 'Signing in…' : 'Sign in'}</Button>
      </form>
      <p className="mt-8 text-sm text-ink/55">Or explore without the API:</p>
      <div className="mt-3 grid gap-3">
        <Button onClick={() => { dispatch(startDemoSession('customer')); navigate('/account'); }}>Continue as demo customer</Button>
        <Button variant="navy" onClick={() => { dispatch(startDemoSession('admin')); navigate('/admin'); }}>Continue as demo admin</Button>
        <Button variant="outline" onClick={() => { dispatch(startDemoSession('pharmacist')); navigate('/admin/prescriptions'); }}>Continue as demo pharmacist</Button>
      </div>
    </div>
  );
}

export function AccountLayout() {
  const user = useAppSelector((s) => s.auth.user);
  if (!user) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-navy">Account</h1>
        <p className="mt-2 text-ink/65">Start a demo session or connect the API for real accounts.</p>
        <Button asChild className="mt-4"><Link to="/login">Sign in</Link></Button>
      </div>
    );
  }
  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 lg:grid-cols-[200px_1fr]">
      <Seo title="Account | Ishaq Medical" description="Customer account." path="/account" noIndex />
      <aside className="h-fit rounded-2xl bg-white p-4 text-sm ring-1 ring-line">
        <p className="font-bold text-navy">{user.name}</p>
        <p className="text-ink/50">{user.role}{user.email.endsWith('.local') ? ' · demo' : ''}</p>
        <nav className="mt-4 grid gap-2">
          <Link to="/account">Dashboard</Link>
          <Link to="/account/orders">Orders</Link>
          <Link to="/account/prescriptions">Prescriptions</Link>
          <Link to="/wishlist">Wishlist</Link>
          <Link to="/account/addresses">Addresses</Link>
          <Link to="/account/profile">Profile</Link>
        </nav>
      </aside>
      <Outlet />
    </div>
  );
}

export function AccountHome() {
  const user = useAppSelector((s) => s.auth.user) ?? demoUsers[0];
  const dispatch = useAppDispatch();
  return (
    <div>
      <h1 className="text-2xl font-extrabold text-navy">Hello, {user.name}</h1>
      <p className="mt-2 text-sm text-ink/65">Demo records below are not server-persisted.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-white p-4 ring-1 ring-line"><p className="text-sm text-ink/50">Open orders</p><p className="text-2xl font-bold">{demoOrders.length}</p></div>
        <div className="rounded-2xl bg-white p-4 ring-1 ring-line"><p className="text-sm text-ink/50">Prescriptions</p><p className="text-2xl font-bold">{demoPrescriptions.length}</p></div>
        <div className="rounded-2xl bg-white p-4 ring-1 ring-line"><p className="text-sm text-ink/50">Saved addresses</p><p className="text-2xl font-bold">{demoAddresses.length}</p></div>
      </div>
      <Button variant="outline" className="mt-6" onClick={() => dispatch(logout())}>Log out</Button>
    </div>
  );
}

export function AccountOrders() {
  const isDemo = useAppSelector((s) => s.auth.isDemoSession);
  const { data } = useGetOrdersQuery(undefined, { skip: isDemo });
  const orders = isDemo ? demoOrders : (data?.data ?? []);
  return (
    <div>
      <h1 className="text-2xl font-extrabold text-navy">Orders</h1>
      {orders.length === 0 ? (
        <p className="mt-4 text-sm text-ink/60">No orders on this account yet. Place an order at checkout to see it here.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {orders.map((order) => (
            <li key={order.id} className="rounded-2xl bg-white p-4 ring-1 ring-line">
              <p className="font-semibold">{order.publicRef} · {order.status.replace('_', ' ')}</p>
              <p className="text-sm text-ink/60">{formatPrice(order.total)} · {order.paymentMethod}</p>
              {order.accessToken ? (
                <p className="text-xs text-ink/45">Access token for /track-order: {order.accessToken}</p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function AccountPrescriptions() {
  return (
    <div>
      <h1 className="text-2xl font-extrabold text-navy">Prescription requests</h1>
      <ul className="mt-4 space-y-3">
        {demoPrescriptions.map((rx) => (
          <li key={rx.id} className="rounded-2xl bg-white p-4 ring-1 ring-line">
            {rx.status} · {rx.fileName} {rx.isDemo ? '(demo)' : ''}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function AccountAddresses() {
  return (
    <div>
      <h1 className="text-2xl font-extrabold text-navy">Addresses</h1>
      {demoAddresses.map((addr) => (
        <div key={addr.id} className="mt-4 rounded-2xl bg-white p-4 ring-1 ring-line">
          <p className="font-semibold">{addr.label}</p>
          <p className="text-sm text-ink/65">{addr.addressLine}, {addr.area}, {addr.city}</p>
        </div>
      ))}
    </div>
  );
}

export function AccountProfile() {
  const user = useAppSelector((s) => s.auth.user);
  return (
    <div>
      <h1 className="text-2xl font-extrabold text-navy">Profile</h1>
      <p className="mt-3 text-sm">{user?.name}</p>
      <p className="text-sm">{user?.email}</p>
      <p className="text-sm">{user?.phone}</p>
      <p className="mt-4 text-sm text-ink/55">Password changes require the live API.</p>
    </div>
  );
}

export function TrackOrderPage() {
  const [lookup, { data, isFetching, isError }] = useLazyTrackOrderQuery();
  const order = data?.data;
  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <Seo title="Track order | Ishaq Medical" description="Look up an order with reference and access token." path="/track-order" noIndex />
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal">Order lookup</p>
      <h1 className="font-display mt-2 text-4xl font-semibold text-navy">Track order</h1>
      <p className="mt-3 text-sm text-ink/65">Use the public reference and the access token from your confirmation.</p>
      <form
        className="mt-6 space-y-3 rounded-[1.5rem] bg-white p-6 shadow-[0_14px_36px_rgba(18,32,51,0.06)] ring-1 ring-line"
        onSubmit={(event) => {
          event.preventDefault();
          const form = new FormData(event.currentTarget);
          void lookup({ ref: String(form.get('ref') ?? ''), token: String(form.get('token') ?? '') || undefined });
        }}
      >
        <label className="text-sm">Reference<input name="ref" className="mt-1 h-11 w-full rounded-xl border border-line px-3" defaultValue="IM-24018" /></label>
        <label className="text-sm">Access token<input name="token" className="mt-1 h-11 w-full rounded-xl border border-line px-3" defaultValue="demo-track-7f3a" /></label>
        <Button type="submit" disabled={isFetching}>{isFetching ? 'Looking up…' : 'Track'}</Button>
        {order ? (
          <p className="text-sm text-navy">{order.status.replaceAll('_', ' ')} · {order.publicRef} · {order.addressSummary || 'Address on file'}</p>
        ) : isError ? (
          <p className="text-sm text-red-700">No matching order for that reference and token.</p>
        ) : (
          <p className="text-sm text-ink/55">Demo reference IM-24018 works when the API is offline.</p>
        )}
      </form>
    </div>
  );
}
