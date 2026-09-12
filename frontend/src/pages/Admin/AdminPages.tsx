import type { FormEvent, ReactNode } from 'react';
import { Suspense, useMemo, useState } from 'react';
import { Link, NavLink, Navigate, Outlet } from 'react-router-dom';
import {
  ClipboardList,
  FileText,
  FolderTree,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Megaphone,
  Package,
  Settings,
  ShoppingBag,
  Star,
  Store,
  Users,
  Warehouse,
  X,
} from 'lucide-react';
import { Seo } from '@/components/common/Seo';
import { Button } from '@/components/ui/Button';
import { cn, formatPrice } from '@/lib/utils';
import { roleLabel } from '@/repositories/staffRepository';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import { AdminHome as DashboardHome } from '@/features/admin/AdminHome';
import {
  useCreateAdminBannerMutation,
  useCreateAdminBlogMutation,
  useCreateAdminCategoryMutation,
  useCreateAdminFaqMutation,
  useCreateAdminInventoryMutation,
  useCreateAdminProductMutation,
  useCreateAdminZoneMutation,
  useDeleteAdminBannerMutation,
  useDeleteAdminBlogMutation,
  useDeleteAdminFaqMutation,
  useDeleteAdminProductMutation,
  useGetAdminAuditLogsQuery,
  useGetAdminBannersQuery,
  useGetAdminBlogQuery,
  useGetAdminBrandsQuery,
  useGetAdminCategoriesQuery,
  useGetAdminFaqsQuery,
  useGetAdminInquiriesQuery,
  useGetAdminInventoryQuery,
  useGetAdminOrdersQuery,
  useGetAdminPrescriptionsQuery,
  useGetAdminProductsQuery,
  useGetAdminReviewsQuery,
  useGetAdminSettingsQuery,
  useGetAdminUsersQuery,
  useCreateAdminUserMutation,
  useUpdateAdminUserMutation,
  useDeleteAdminUserMutation,
  useGetAdminZonesQuery,
  useUpdateAdminInquiryMutation,
  useUpdateAdminOrderMutation,
  useUpdateAdminPrescriptionMutation,
  useUpdateAdminReviewMutation,
  useUpdateAdminSettingsMutation,
} from '@/store/api/adminApi';

function Guard({ children }: { children: ReactNode }) {
  const user = useAppSelector((s) => s.auth.user);
  const allowed = user && ['admin', 'superAdmin', 'manager', 'pharmacist', 'staff'].includes(user.role);
  if (!allowed) return <Navigate to="/login" replace />;
  return children;
}

const nav = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/categories', label: 'Categories', icon: FolderTree },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { to: '/admin/prescriptions', label: 'Prescriptions', icon: ClipboardList },
  { to: '/admin/inventory', label: 'Inventory', icon: Warehouse },
  { to: '/admin/content', label: 'Homepage & FAQs', icon: Megaphone },
  { to: '/admin/blog', label: 'Blog', icon: FileText },
  { to: '/admin/inquiries', label: 'Inquiries', icon: MessageSquare },
  { to: '/admin/reviews', label: 'Reviews', icon: Star },
  { to: '/admin/users', label: 'Staff', icon: Users },
  { to: '/admin/settings', label: 'Store settings', icon: Settings },
] as const;

export function AdminLayout() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const source = useAppSelector((s) => s.dataSource.status);
  const [open, setOpen] = useState(false);
  const sourceLabel = source === 'api' ? 'Live API' : source === 'fallback' ? 'Demo catalog' : source;

  const sidebar = (
    <>
      <div className="flex items-center justify-between gap-3">
        <Link to="/admin" className="flex min-w-0 items-center gap-2">
          <img src="/images/brand/mark.png" alt="" className="h-9 w-auto object-contain" />
          <span className="min-w-0">
            <p className="font-brand text-lg tracking-tight text-white">Admin</p>
            <p className="text-[11px] uppercase tracking-[0.16em] text-mint/80">Ishaq Medicos</p>
          </span>
        </Link>
        <button type="button" className="grid size-9 place-items-center rounded-full lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu">
          <X className="size-4" />
        </button>
      </div>
      <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.16em] text-mint/80">Counter ops</p>
      <nav className="mt-3 grid gap-1 text-sm">
        {nav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={'end' in item ? item.end : false}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2.5 rounded-xl px-3 py-2 text-white/70 transition hover:bg-white/10 hover:text-white',
                isActive && 'bg-white/15 font-semibold text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]',
              )
            }
          >
            <item.icon className="size-4 opacity-80" />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto space-y-2 pt-8">
        <Link to="/" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white">
          <Store className="size-4" /> View storefront
        </Link>
        <button type="button" className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-white/55 hover:bg-white/10 hover:text-white" onClick={() => dispatch(logout())}>
          <LogOut className="size-4" /> Log out
        </button>
      </div>
    </>
  );

  return (
    <Guard>
      <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,#e7f3f1_0%,#f4f7f6_45%)]">
        <Seo title="Admin | Ishaq Medical" description="Store administration." path="/admin" noIndex />
        {open ? (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button className="absolute inset-0 bg-navy/40" aria-label="Close menu" onClick={() => setOpen(false)} />
            <aside className="absolute inset-y-0 left-0 flex w-[min(100%,18rem)] flex-col bg-navy p-5 text-white shadow-2xl">{sidebar}</aside>
          </div>
        ) : null}
        <div className="grid min-h-screen lg:grid-cols-[16.5rem_1fr]">
          <aside className="hidden min-h-screen flex-col bg-navy p-5 text-white lg:flex">{sidebar}</aside>
          <div className="flex min-w-0 flex-col">
            <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-line bg-white/85 px-4 py-3 backdrop-blur-md lg:px-8">
              <div className="flex items-center gap-3">
                <button type="button" className="grid size-10 place-items-center rounded-full hover:bg-mist lg:hidden" aria-label="Open menu" onClick={() => setOpen(true)}>
                  <Menu className="size-5" />
                </button>
                <div>
                  <p className="text-sm font-semibold text-navy">{user?.name}</p>
                  <p className="text-xs capitalize text-ink/45">{user?.role} · {sourceLabel}</p>
                </div>
              </div>
              <span className={cn('rounded-full px-3 py-1 text-xs font-semibold', source === 'api' ? 'bg-teal-soft text-teal-deep' : 'bg-sand text-navy')}>
                {source === 'api' ? 'Connected' : 'Local catalog'}
              </span>
            </header>
            <div className="flex-1 p-4 lg:p-8">
              <Suspense fallback={<p className="text-sm text-ink/55">Loading admin…</p>}>
                <Outlet />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </Guard>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="grid gap-1 text-sm">
      <span className="text-ink/55">{label}</span>
      {children}
    </label>
  );
}

const inputClass = 'rounded-xl border border-line bg-white px-3 py-2';

export function AdminHome() {
  return <DashboardHome />;
}

export function AdminProducts() {
  const { data } = useGetAdminProductsQuery();
  const { data: categories } = useGetAdminCategoriesQuery();
  const [create] = useCreateAdminProductMutation();
  const [remove] = useDeleteAdminProductMutation();
  const [message, setMessage] = useState('');
  const items = (data?.data ?? []) as Array<Record<string, unknown>>;
  const cats = (categories?.data ?? []) as Array<Record<string, unknown>>;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      await create({
        name: form.get('name'),
        sku: form.get('sku'),
        price: Number(form.get('price')),
        stock: Number(form.get('stock') || 0),
        kind: form.get('kind'),
        categoryId: form.get('categoryId'),
        packSize: form.get('packSize') || '1 pack',
        shortDescription: form.get('shortDescription') || '',
        active: true,
      }).unwrap();
      setMessage('Product saved.');
      event.currentTarget.reset();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not save product. Connect the API or use a staff login.');
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-navy">Products</h1>
      <p className="text-sm text-ink/55">{items.length} products. Create and edit persist when signed in to the API.</p>
      <form onSubmit={onSubmit} className="mt-4 grid gap-3 rounded-2xl bg-white p-4 ring-1 ring-line md:grid-cols-3">
        <Field label="Name"><input required name="name" className={inputClass} /></Field>
        <Field label="SKU"><input required name="sku" className={inputClass} /></Field>
        <Field label="Price (PKR)"><input required name="price" type="number" min={0} className={inputClass} /></Field>
        <Field label="Stock"><input name="stock" type="number" min={0} className={inputClass} /></Field>
        <Field label="Kind">
          <select name="kind" className={inputClass} defaultValue="medicine">
            <option value="medicine">Medicine</option>
            <option value="surgical">Surgical</option>
            <option value="cosmetic">Cosmetic</option>
            <option value="personal-care">Personal care</option>
            <option value="mother-baby">Mother & baby</option>
            <option value="supplement">Supplement</option>
          </select>
        </Field>
        <Field label="Category">
          <select name="categoryId" className={inputClass} required>
            {cats.map((c) => (
              <option key={String(c.id ?? c.slug)} value={String(c.id ?? c.slug)}>{String(c.name)}</option>
            ))}
          </select>
        </Field>
        <Field label="Pack size"><input name="packSize" className={inputClass} /></Field>
        <Field label="Short description"><input name="shortDescription" className={`${inputClass} md:col-span-2`} /></Field>
        <div className="flex items-end"><Button type="submit" variant="navy">Add product</Button></div>
      </form>
      {message ? <p className="mt-2 text-sm text-teal">{message}</p> : null}
      <div className="mt-4 overflow-auto rounded-2xl bg-white ring-1 ring-line">
        <table className="w-full text-left text-sm">
          <thead className="bg-mist">
            <tr>
              <th className="p-3">Name</th>
              <th>SKU</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Rx</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={String(p.id)} className="border-t border-line">
                <td className="p-3">{String(p.name)}</td>
                <td>{String(p.sku ?? '')}</td>
                <td>{formatPrice(Number(p.salePrice ?? p.price ?? 0))}</td>
                <td>{String(p.stock ?? 0)}</td>
                <td>{p.prescriptionRequired ? 'Yes' : 'No'}</td>
                <td>
                  <button type="button" className="text-xs text-red-700" onClick={() => remove(String(p.id))}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function AdminCategories() {
  const { data } = useGetAdminCategoriesQuery();
  const { data: brands } = useGetAdminBrandsQuery();
  const [create] = useCreateAdminCategoryMutation();
  const items = (data?.data ?? []) as Array<Record<string, unknown>>;
  const brandItems = (brands?.data ?? []) as Array<Record<string, unknown>>;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await create({ name: form.get('name'), navGroup: form.get('navGroup'), description: form.get('description') || '', featured: form.get('featured') === 'on' });
    event.currentTarget.reset();
  }

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-navy">Categories & brands</h1>
      <form onSubmit={onSubmit} className="mt-4 grid gap-3 rounded-2xl bg-white p-4 ring-1 ring-line md:grid-cols-4">
        <Field label="Category name"><input required name="name" className={inputClass} /></Field>
        <Field label="Nav group">
          <select name="navGroup" className={inputClass} defaultValue="medicines">
            <option value="medicines">Medicines</option>
            <option value="surgical">Surgical</option>
            <option value="cosmetics">Cosmetics</option>
            <option value="personal">Personal</option>
            <option value="mother">Mother</option>
            <option value="vitamins">Vitamins</option>
          </select>
        </Field>
        <Field label="Description"><input name="description" className={inputClass} /></Field>
        <div className="flex items-end gap-3">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="featured" /> Featured</label>
          <Button type="submit" variant="navy">Add category</Button>
        </div>
      </form>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <ul className="space-y-2">
          {items.map((c) => (
            <li key={String(c.id)} className="rounded-2xl bg-white p-4 ring-1 ring-line">{String(c.name)} · {String(c.slug)}</li>
          ))}
        </ul>
        <ul className="space-y-2">
          {brandItems.map((b) => (
            <li key={String(b.id)} className="rounded-2xl bg-white p-4 ring-1 ring-line">{String(b.name)} · {String(b.slug)}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function AdminOrders() {
  const { data } = useGetAdminOrdersQuery();
  const [update] = useUpdateAdminOrderMutation();
  const items = (data?.data ?? []) as Array<Record<string, unknown>>;
  return (
    <div>
      <h1 className="text-2xl font-extrabold text-navy">Orders</h1>
      <ul className="mt-4 space-y-2">
        {items.map((order) => (
          <li key={String(order.id)} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-4 ring-1 ring-line">
            <span>{String(order.publicRef)} · {String(order.customerName ?? '')} · {formatPrice(Number(order.total ?? 0))}</span>
            <select
              className={inputClass}
              defaultValue={String(order.status)}
              onChange={(e) => update({ id: String(order.id), body: { status: e.target.value } })}
            >
              {['pending', 'prescription_review', 'confirmed', 'preparing', 'ready_for_pickup', 'dispatched', 'delivered', 'cancelled'].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function AdminPrescriptions() {
  const { data } = useGetAdminPrescriptionsQuery();
  const [update] = useUpdateAdminPrescriptionMutation();
  const items = (data?.data ?? []) as Array<Record<string, unknown>>;
  return (
    <div>
      <h1 className="text-2xl font-extrabold text-navy">Prescription queue</h1>
      <p className="mt-2 text-sm text-ink/60">Files are never shown as public URLs. Demo rows have no binary attached.</p>
      <ul className="mt-4 space-y-2">
        {items.map((rx) => (
          <li key={String(rx.id)} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-4 ring-1 ring-line">
            <span>{String(rx.name)} · {String(rx.phone)} · {String(rx.fileName ?? 'no file')}</span>
            <select className={inputClass} defaultValue={String(rx.status)} onChange={(e) => update({ id: String(rx.id), body: { status: e.target.value } })}>
              {['received', 'under_review', 'needs_clarification', 'approved', 'unavailable', 'ready_for_order', 'completed'].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function AdminInventory() {
  const { data } = useGetAdminInventoryQuery();
  const { data: products } = useGetAdminProductsQuery();
  const [create] = useCreateAdminInventoryMutation();
  const items = (data?.data ?? []) as Array<Record<string, unknown>>;
  const catalog = (products?.data ?? []) as Array<Record<string, unknown>>;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await create({
      productId: form.get('productId'),
      batchNumber: form.get('batchNumber'),
      quantity: Number(form.get('quantity')),
      expiryDate: form.get('expiryDate'),
    });
    event.currentTarget.reset();
  }

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-navy">Inventory batches</h1>
      <form onSubmit={onSubmit} className="mt-4 grid gap-3 rounded-2xl bg-white p-4 ring-1 ring-line md:grid-cols-4">
        <Field label="Product">
          <select name="productId" required className={inputClass}>
            {catalog.map((p) => <option key={String(p.id)} value={String(p.id)}>{String(p.name)}</option>)}
          </select>
        </Field>
        <Field label="Batch number"><input required name="batchNumber" className={inputClass} /></Field>
        <Field label="Quantity"><input required name="quantity" type="number" min={0} className={inputClass} /></Field>
        <Field label="Expiry"><input required name="expiryDate" type="date" className={inputClass} /></Field>
        <div className="md:col-span-4"><Button type="submit" variant="navy">Add batch</Button></div>
      </form>
      <ul className="mt-4 space-y-2 text-sm">
        {items.map((b) => (
          <li key={String(b.id)} className="rounded-2xl bg-white p-4 ring-1 ring-line">
            {String(b.batchNumber)} · qty {String(b.quantity)} · expiry {String(b.expiryDate).slice(0, 10)}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function AdminContent() {
  const { data: banners } = useGetAdminBannersQuery();
  const { data: faqs } = useGetAdminFaqsQuery();
  const { data: zones } = useGetAdminZonesQuery();
  const [createBanner] = useCreateAdminBannerMutation();
  const [deleteBanner] = useDeleteAdminBannerMutation();
  const [createFaq] = useCreateAdminFaqMutation();
  const [deleteFaq] = useDeleteAdminFaqMutation();
  const [createZone] = useCreateAdminZoneMutation();

  async function bannerSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await createBanner({ title: form.get('title'), subtitle: form.get('subtitle'), ctaLabel: form.get('ctaLabel') || 'Shop', ctaHref: form.get('ctaHref') || '/medicines', tone: form.get('tone') || 'teal' });
    event.currentTarget.reset();
  }
  async function faqSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await createFaq({ question: form.get('question'), answer: form.get('answer'), group: form.get('group') || 'ordering' });
    event.currentTarget.reset();
  }
  async function zoneSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await createZone({ name: form.get('name'), district: form.get('district'), estimatedDays: form.get('estimatedDays') || '2-5', areas: String(form.get('areas') || '').split(',').map((s) => s.trim()).filter(Boolean) });
    event.currentTarget.reset();
  }

  return (
    <div className="grid gap-8">
      <section>
        <h1 className="text-2xl font-extrabold text-navy">Homepage banners</h1>
        <form onSubmit={bannerSubmit} className="mt-4 grid gap-3 rounded-2xl bg-white p-4 ring-1 ring-line md:grid-cols-2">
          <Field label="Title"><input required name="title" className={inputClass} /></Field>
          <Field label="CTA label"><input name="ctaLabel" className={inputClass} /></Field>
          <Field label="Subtitle"><input name="subtitle" className={inputClass} /></Field>
          <Field label="Link"><input name="ctaHref" className={inputClass} placeholder="/medicines" /></Field>
          <Button type="submit" variant="navy">Add banner</Button>
        </form>
        <ul className="mt-3 space-y-2">
          {((banners?.data ?? []) as Array<Record<string, unknown>>).map((b) => (
            <li key={String(b.id)} className="flex justify-between rounded-2xl bg-white p-4 ring-1 ring-line">
              <span>{String(b.title)}</span>
              <button type="button" className="text-xs text-red-700" onClick={() => deleteBanner(String(b.id))}>Remove</button>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2 className="text-xl font-extrabold text-navy">FAQs</h2>
        <form onSubmit={faqSubmit} className="mt-4 grid gap-3 rounded-2xl bg-white p-4 ring-1 ring-line">
          <Field label="Question"><input required name="question" className={inputClass} /></Field>
          <Field label="Answer"><textarea required name="answer" className={inputClass} rows={3} /></Field>
          <Field label="Group">
            <select name="group" className={inputClass} defaultValue="ordering">
              <option value="ordering">Ordering</option>
              <option value="prescription">Prescription</option>
              <option value="delivery">Delivery</option>
              <option value="products">Products</option>
            </select>
          </Field>
          <Button type="submit" variant="navy">Add FAQ</Button>
        </form>
        <ul className="mt-3 space-y-2">
          {((faqs?.data ?? []) as Array<Record<string, unknown>>).map((f) => (
            <li key={String(f.id)} className="flex justify-between rounded-2xl bg-white p-4 ring-1 ring-line">
              <span>{String(f.question)}</span>
              <button type="button" className="text-xs text-red-700" onClick={() => deleteFaq(String(f.id))}>Remove</button>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2 className="text-xl font-extrabold text-navy">Delivery zones</h2>
        <form onSubmit={zoneSubmit} className="mt-4 grid gap-3 rounded-2xl bg-white p-4 ring-1 ring-line md:grid-cols-4">
          <Field label="Name"><input required name="name" className={inputClass} /></Field>
          <Field label="District"><input required name="district" className={inputClass} /></Field>
          <Field label="Days"><input name="estimatedDays" className={inputClass} /></Field>
          <Field label="Areas (comma separated)"><input name="areas" className={inputClass} /></Field>
          <Button type="submit" variant="navy">Add zone</Button>
        </form>
        <ul className="mt-3 space-y-2">
          {((zones?.data ?? []) as Array<Record<string, unknown>>).map((z) => (
            <li key={String(z.id)} className="rounded-2xl bg-white p-4 ring-1 ring-line">{String(z.name)} · {String(z.district)}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export function AdminBlog() {
  const { data } = useGetAdminBlogQuery();
  const [create] = useCreateAdminBlogMutation();
  const [remove] = useDeleteAdminBlogMutation();
  const items = (data?.data ?? []) as Array<Record<string, unknown>>;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await create({
      title: form.get('title'),
      excerpt: form.get('excerpt'),
      content: form.get('content'),
      category: form.get('category') || 'general',
      published: true,
    });
    event.currentTarget.reset();
  }

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-navy">Blog</h1>
      <form onSubmit={onSubmit} className="mt-4 grid gap-3 rounded-2xl bg-white p-4 ring-1 ring-line">
        <Field label="Title"><input required name="title" className={inputClass} /></Field>
        <Field label="Excerpt"><input name="excerpt" className={inputClass} /></Field>
        <Field label="Content"><textarea name="content" rows={5} className={inputClass} /></Field>
        <Button type="submit" variant="navy">Publish</Button>
      </form>
      <ul className="mt-4 space-y-2">
        {items.map((post) => (
          <li key={String(post.id)} className="flex justify-between rounded-2xl bg-white p-4 ring-1 ring-line">
            <span>{String(post.title)}</span>
            <button type="button" className="text-xs text-red-700" onClick={() => remove(String(post.id))}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function AdminInquiries() {
  const { data } = useGetAdminInquiriesQuery();
  const [update] = useUpdateAdminInquiryMutation();
  const items = (data?.data ?? []) as Array<Record<string, unknown>>;
  return (
    <div>
      <h1 className="text-2xl font-extrabold text-navy">Contact inquiries</h1>
      <ul className="mt-4 space-y-2">
        {items.length === 0 ? <li className="text-sm text-ink/55">No inquiries yet.</li> : null}
        {items.map((row) => (
          <li key={String(row.id)} className="rounded-2xl bg-white p-4 ring-1 ring-line">
            <p className="font-medium">{String(row.name)} · {String(row.email ?? row.phone ?? '')}</p>
            <p className="mt-1 text-sm text-ink/70">{String(row.message)}</p>
            <select className={`${inputClass} mt-2`} defaultValue={String(row.status)} onChange={(e) => update({ id: String(row.id), body: { status: e.target.value } })}>
              {['new', 'read', 'replied', 'closed'].map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function AdminReviews() {
  const { data } = useGetAdminReviewsQuery();
  const [update] = useUpdateAdminReviewMutation();
  const items = (data?.data ?? []) as Array<Record<string, unknown>>;
  return (
    <div>
      <h1 className="text-2xl font-extrabold text-navy">Reviews</h1>
      <ul className="mt-4 space-y-2">
        {items.map((row) => (
          <li key={String(row.id)} className="flex justify-between rounded-2xl bg-white p-4 ring-1 ring-line">
            <span>{String(row.authorDisplay)} · {String(row.rating)}★ · {String(row.title)}</span>
            <label className="text-sm">
              <input type="checkbox" defaultChecked={row.approved !== false} onChange={(e) => update({ id: String(row.id), body: { approved: e.target.checked } })} /> Approved
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function AdminUsers() {
  const { data } = useGetAdminUsersQuery();
  const { data: logs } = useGetAdminAuditLogsQuery();
  const [create] = useCreateAdminUserMutation();
  const [update] = useUpdateAdminUserMutation();
  const [remove] = useDeleteAdminUserMutation();
  const [editingId, setEditingId] = useState<string | null>(null);
  const users = (data?.data ?? []) as Array<Record<string, unknown>>;
  const audit = (logs?.data ?? []) as Array<Record<string, unknown>>;
  const staffRoles = ['staff', 'pharmacist', 'manager', 'admin', 'superAdmin'];
  const staff = users.filter((u) => staffRoles.includes(String(u.role)));
  const customers = users.filter((u) => String(u.role) === 'customer');
  const editing = staff.find((u) => String(u.id) === editingId);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const password = String(form.get('password') ?? '');
    const payload: Record<string, unknown> = {
      name: form.get('name'),
      email: form.get('email'),
      phone: form.get('phone') || '',
      role: form.get('role') || 'staff',
      jobTitle: form.get('jobTitle') || '',
      bio: form.get('bio') || '',
      photoUrl: form.get('photoUrl') || '',
      showOnWebsite: form.get('showOnWebsite') === 'on',
      sortOrder: Number(form.get('sortOrder') || 0),
    };
    try {
      if (editingId) {
        if (password) payload.password = password;
        await update({ id: editingId, body: payload }).unwrap();
        toast.success('Staff profile updated. If “Show on website” is on, they appear on /team.');
        setEditingId(null);
      } else {
        payload.password = password;
        await create(payload).unwrap();
        toast.success('Staff member added. Tick “Show on website” to list them on the public team page.');
      }
      event.currentTarget.reset();
    } catch (error) {
      const message =
        error && typeof error === 'object' && 'data' in error
          ? String((error as { data?: { message?: string } }).data?.message ?? 'Could not save staff')
          : 'Could not save staff. Sign in against the API, or check the email is unique.';
      toast.error(message);
    }
  }

  return (
    <div className="grid gap-8">
      <section>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal">People</p>
        <h1 className="font-display mt-1 text-3xl font-semibold text-navy">{editingId ? 'Edit staff' : 'Add staff'}</h1>
        <p className="mt-2 max-w-2xl text-sm text-ink/60">
          Staff logins belong here. Tick <strong>Show on website</strong> to publish a name and role on the public team page.
          Leave biographies empty until the person confirms them, or keep the catalog sample profiles.
        </p>
        <form key={editingId ?? 'create'} onSubmit={onSubmit} className="mt-5 grid gap-3 rounded-[1.4rem] bg-white p-5 shadow-[0_12px_32px_rgba(18,32,51,0.05)] ring-1 ring-line md:grid-cols-2">
          <Field label="Full name"><input required name="name" className={inputClass} defaultValue={String(editing?.name ?? '')} /></Field>
          <Field label="Login email"><input required name="email" type="email" className={inputClass} defaultValue={String(editing?.email ?? '')} /></Field>
          <Field label={editingId ? 'New password (optional)' : 'Password'}>
            <input name="password" type="password" minLength={8} required={!editingId} className={inputClass} placeholder="At least 8 characters, letters and a number" />
          </Field>
          <Field label="Phone"><input name="phone" className={inputClass} defaultValue={String(editing?.phone ?? '')} /></Field>
          <Field label="Admin role">
            <select name="role" className={inputClass} defaultValue={String(editing?.role ?? 'staff')}>
              <option value="staff">Staff</option>
              <option value="pharmacist">Pharmacist</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          </Field>
          <Field label="Public job title"><input name="jobTitle" className={inputClass} placeholder="Pharmacist, counter, etc." defaultValue={String(editing?.jobTitle ?? '')} /></Field>
          <Field label="Photo URL (optional)"><input name="photoUrl" className={inputClass} placeholder="https://… or /images/…" defaultValue={String(editing?.photoUrl ?? '')} /></Field>
          <Field label="Sort order"><input name="sortOrder" type="number" min={0} className={inputClass} defaultValue={String(editing?.sortOrder ?? 0)} /></Field>
          <label className="md:col-span-2 grid gap-1 text-sm">
            <span className="text-ink/55">Short public bio</span>
            <textarea name="bio" rows={3} className={inputClass} maxLength={600} defaultValue={String(editing?.bio ?? '')} placeholder="Only what the person agrees to publish." />
          </label>
          <label className="flex items-center gap-2 text-sm md:col-span-2">
            <input type="checkbox" name="showOnWebsite" defaultChecked={editing?.showOnWebsite === true} />
            Show this person on the public team page
          </label>
          <div className="flex flex-wrap gap-3 md:col-span-2">
            <Button type="submit" variant="navy">{editingId ? 'Save changes' : 'Add staff member'}</Button>
            {editingId ? (
              <Button type="button" variant="outline" onClick={() => setEditingId(null)}>
                Cancel edit
              </Button>
            ) : null}
          </div>
        </form>
      </section>

      <section>
        <h2 className="font-display text-2xl font-semibold text-navy">Staff accounts</h2>
        <ul className="mt-4 space-y-3">
          {staff.length === 0 ? <li className="text-sm text-ink/55">No staff accounts yet.</li> : null}
          {staff.map((u) => (
            <li key={String(u.id)} className="flex flex-col gap-3 rounded-[1.3rem] bg-white p-4 ring-1 ring-line sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-navy">{String(u.name)}</p>
                <p className="text-sm text-ink/55">
                  {roleLabel(String(u.role))}
                  {u.jobTitle ? ` · ${String(u.jobTitle)}` : ''} · {String(u.email)}
                </p>
                {u.showOnWebsite ? <p className="mt-1 text-xs font-semibold text-teal">Published on /team</p> : <p className="mt-1 text-xs text-ink/40">Hidden from the website</p>}
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" className="rounded-full bg-mist px-3 py-1.5 text-sm" onClick={() => setEditingId(String(u.id))}>
                  Edit
                </button>
                <button
                  type="button"
                  className="rounded-full bg-mist px-3 py-1.5 text-sm"
                  onClick={async () => {
                    try {
                      await update({ id: String(u.id), body: { showOnWebsite: !u.showOnWebsite } }).unwrap();
                      toast.success(u.showOnWebsite ? 'Hidden from the team page' : 'Now listed on the team page');
                    } catch {
                      toast.error('Could not update visibility');
                    }
                  }}
                >
                  {u.showOnWebsite ? 'Hide from site' : 'Show on site'}
                </button>
                <button
                  type="button"
                  className="rounded-full px-3 py-1.5 text-sm text-red-700"
                  onClick={() => {
                    if (window.confirm(`Remove ${String(u.name)}?`)) void remove(String(u.id));
                  }}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-extrabold text-navy">Customer accounts</h2>
        <ul className="mt-3 space-y-2">
          {customers.length === 0 ? <li className="text-sm text-ink/55">No customer accounts yet.</li> : null}
          {customers.map((u) => (
            <li key={String(u.id)} className="rounded-2xl bg-white p-4 ring-1 ring-line">{String(u.name)} · {String(u.email)}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-extrabold text-navy">Audit log</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {audit.length === 0 ? <li className="text-ink/55">No events yet.</li> : null}
          {audit.map((row) => (
            <li key={String(row.id)} className="rounded-2xl bg-white p-4 ring-1 ring-line">
              {String(row.action)} {String(row.resource)} · {String(row.actorEmail ?? 'system')}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export function AdminSettings() {
  const { data } = useGetAdminSettingsQuery();
  const [update] = useUpdateAdminSettingsMutation();
  const [message, setMessage] = useState('');
  const settings = data?.data as Record<string, unknown> | undefined;
  const defaults = useMemo(() => settings ?? {}, [settings]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      await update({
        name: form.get('name'),
        address: form.get('address'),
        phone: form.get('phone'),
        whatsapp: form.get('whatsapp'),
        email: form.get('email'),
        openingHours: form.get('openingHours'),
        announcement: form.get('announcement'),
        licenseNumber: form.get('licenseNumber'),
      }).unwrap();
      setMessage('Settings saved. Placeholder flags stay on until you clear them in the API payload.');
    } catch {
      setMessage('Could not save. Sign in with a live admin account.');
    }
  }

  if (!settings) return <p>Loading settings…</p>;

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-extrabold text-navy">Store settings</h1>
      <p className="mt-3 text-sm text-ink/70">All NAP lives here. Placeholders stay visible until the business replaces them.</p>
      <form onSubmit={onSubmit} className="mt-4 grid gap-3">
        <Field label="Name"><input name="name" className={inputClass} defaultValue={String(defaults.name ?? '')} /></Field>
        <Field label="Address"><input name="address" className={inputClass} defaultValue={String(defaults.address ?? '')} /></Field>
        <Field label="Phone"><input name="phone" className={inputClass} defaultValue={String(defaults.phone ?? '')} /></Field>
        <Field label="WhatsApp"><input name="whatsapp" className={inputClass} defaultValue={String(defaults.whatsapp ?? '')} /></Field>
        <Field label="Email"><input name="email" className={inputClass} defaultValue={String(defaults.email ?? '')} /></Field>
        <Field label="Opening hours"><input name="openingHours" className={inputClass} defaultValue={String(defaults.openingHours ?? '')} /></Field>
        <Field label="License"><input name="licenseNumber" className={inputClass} defaultValue={String(defaults.licenseNumber ?? '')} /></Field>
        <Field label="Announcement"><textarea name="announcement" className={inputClass} rows={3} defaultValue={String(defaults.announcement ?? '')} /></Field>
        <Button type="submit" variant="navy">Save settings</Button>
      </form>
      {message ? <p className="mt-3 text-sm text-teal">{message}</p> : null}
    </div>
  );
}
