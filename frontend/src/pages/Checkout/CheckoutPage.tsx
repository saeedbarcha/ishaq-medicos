import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Seo } from '@/components/common/Seo';
import { Button } from '@/components/ui/Button';
import { Input, Label, Textarea } from '@/components/ui/Field';
import { productRepository } from '@/repositories/productRepository';
import { findLocalProduct } from '@/lib/catalog/hydrateProduct';
import { formatPrice } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearCart } from '@/store/slices/cartSlice';
import { resetCheckout, updateCheckout } from '@/store/slices/checkoutSlice';
import { useCreateOrderMutation } from '@/store/api/storeApi';
import type { PaymentMethod } from '@shared/types';

const payments: Array<{ id: PaymentMethod; label: string }> = [
  { id: 'cod', label: 'Cash on delivery' },
  { id: 'store_pickup', label: 'Pay at store pickup' },
  { id: 'bank_transfer', label: 'Bank transfer' },
  { id: 'jazzcash', label: 'JazzCash' },
  { id: 'easypaisa', label: 'Easypaisa' },
];

export function CheckoutPage() {
  const checkout = useAppSelector((s) => s.checkout);
  const items = useAppSelector((s) => s.cart.items);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [placeOrder] = useCreateOrderMutation();
  const rows = items
    .map((item) => ({
      item,
      product: productRepository.getById(item.productId) ?? findLocalProduct(item.productId),
    }))
    .filter((r) => r.product);
  const subtotal = rows.reduce((sum, row) => sum + (row.product!.salePrice ?? row.product!.price) * row.item.quantity, 0);
  const rx = rows.some((row) => row.product?.prescriptionRequired);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Seo title="Checkout | Ishaq Medical" description="Complete your order." path="/checkout" noIndex />
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal">Place order</p>
      <h1 className="font-display mt-2 text-4xl font-semibold text-navy">Checkout</h1>
      <p className="mt-2 text-sm text-ink/60">
        Checkout totals on this page are a preview. The server recalculates the payable amount when the order is placed.
      </p>
      {rows.length === 0 ? (
        <p className="mt-6">Your bag is empty.</p>
      ) : (
        <form
          className="mt-8 grid gap-8 lg:grid-cols-[1fr_280px]"
          onSubmit={async (event) => {
            event.preventDefault();
            if (!checkout.agreed) {
              toast.error('Please agree to the terms to continue.');
              return;
            }
            setSubmitting(true);
            try {
              const result = await placeOrder({
                items: rows.map(({ item, product }) => ({
                  productId: product!.slug,
                  quantity: item.quantity,
                })),
                customerName: checkout.fullName,
                phone: checkout.phone,
                email: checkout.email || '',
                addressSummary: [checkout.addressLine, checkout.area, checkout.city, checkout.district].filter(Boolean).join(', '),
                notes: checkout.notes,
                paymentMethod: checkout.paymentMethod,
              }).unwrap();
              const order = result.data;
              dispatch(clearCart());
              dispatch(resetCheckout());
              toast.success(rx ? 'Order held for prescription review.' : 'Order placed.');
              navigate('/checkout/success', {
                state: { publicRef: order.publicRef, accessToken: order.accessToken, isDemo: Boolean((order as { isDemo?: boolean }).isDemo) },
              });
            } catch {
              toast.error('Could not place the order. Check the form or try again.');
            } finally {
              setSubmitting(false);
            }
          }}
        >
          <div className="space-y-5 rounded-[1.5rem] bg-white p-6 shadow-[0_14px_36px_rgba(18,32,51,0.06)] ring-1 ring-line">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="fullName">Full name</Label>
                <Input id="fullName" required value={checkout.fullName} onChange={(e) => dispatch(updateCheckout({ fullName: e.target.value }))} autoComplete="name" />
              </div>
              <div>
                <Label htmlFor="phone">Mobile</Label>
                <Input id="phone" required value={checkout.phone} onChange={(e) => dispatch(updateCheckout({ phone: e.target.value }))} autoComplete="tel" />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email (optional)</Label>
              <Input id="email" type="email" value={checkout.email} onChange={(e) => dispatch(updateCheckout({ email: e.target.value }))} autoComplete="email" />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <Label htmlFor="district">District</Label>
                <Input id="district" value={checkout.district} onChange={(e) => dispatch(updateCheckout({ district: e.target.value }))} />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input id="city" value={checkout.city} onChange={(e) => dispatch(updateCheckout({ city: e.target.value }))} />
              </div>
              <div>
                <Label htmlFor="area">Area</Label>
                <Input id="area" value={checkout.area} onChange={(e) => dispatch(updateCheckout({ area: e.target.value }))} />
              </div>
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input id="address" required={checkout.deliveryOption === 'delivery'} value={checkout.addressLine} onChange={(e) => dispatch(updateCheckout({ addressLine: e.target.value }))} />
            </div>
            <div>
              <Label htmlFor="landmark">Landmark (optional)</Label>
              <Input id="landmark" value={checkout.landmark} onChange={(e) => dispatch(updateCheckout({ landmark: e.target.value }))} />
            </div>
            <fieldset>
              <legend className="mb-3 text-sm font-semibold text-navy">How you receive it</legend>
              <div className="grid gap-2 sm:grid-cols-2">
                <label className="pay-card">
                  <input type="radio" checked={checkout.deliveryOption === 'pickup'} onChange={() => dispatch(updateCheckout({ deliveryOption: 'pickup' }))} />
                  Store pickup
                </label>
                <label className="pay-card">
                  <input type="radio" checked={checkout.deliveryOption === 'delivery'} onChange={() => dispatch(updateCheckout({ deliveryOption: 'delivery' }))} />
                  Delivery (areas to be confirmed)
                </label>
              </div>
            </fieldset>
            <fieldset>
              <legend className="mb-3 text-sm font-semibold text-navy">Payment</legend>
              <div className="grid gap-2">
                {payments.map((method) => (
                  <label key={method.id} className="pay-card">
                    <input type="radio" checked={checkout.paymentMethod === method.id} onChange={() => dispatch(updateCheckout({ paymentMethod: method.id }))} />
                    {method.label}
                  </label>
                ))}
              </div>
            </fieldset>
            <div>
              <Label htmlFor="notes">Order notes</Label>
              <Textarea id="notes" value={checkout.notes} onChange={(e) => dispatch(updateCheckout({ notes: e.target.value }))} />
            </div>
            <label className="flex items-start gap-2 text-sm">
              <input type="checkbox" checked={checkout.agreed} onChange={(e) => dispatch(updateCheckout({ agreed: e.target.checked }))} />
              I agree to the <Link to="/terms" className="text-teal">terms</Link> and <Link to="/privacy" className="text-teal">privacy</Link> notices.
            </label>
          </div>
          <aside className="h-fit rounded-[1.5rem] bg-navy p-6 text-white shadow-[0_22px_50px_rgba(18,32,51,0.22)] lg:sticky lg:top-28">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-mint">Summary</p>
            <ul className="mt-4 space-y-3 text-sm text-white/80">
              {rows.map(({ item, product }) => (
                <li key={item.productId} className="flex justify-between gap-2">
                  <span>
                    {product!.name} × {item.quantity}
                  </span>
                  <span className="shrink-0 font-semibold text-white">{formatPrice((product!.salePrice ?? product!.price) * item.quantity)}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-3xl font-extrabold tracking-tight">{formatPrice(subtotal)}</p>
            <p className="mt-2 text-xs text-white/50">Backend recalculates totals in API mode. Frontend totals are never trusted for payment.</p>
            {rx && <p className="mt-3 rounded-xl bg-white/10 px-3 py-2 text-sm text-mint">Prescription items stay pending pharmacist review.</p>}
            <Button type="submit" variant="brass" className="mt-5 w-full" size="lg" disabled={submitting}>
              {submitting ? 'Placing…' : 'Place order'}
            </Button>
          </aside>
        </form>
      )}
    </div>
  );
}

export function CheckoutSuccessPage() {
  const location = useLocation();
  const state = location.state as { publicRef?: string; accessToken?: string; isDemo?: boolean } | null;
  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <Seo title="Order received | Ishaq Medical" description="Order confirmation." path="/checkout/success" noIndex />
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal">Thank you</p>
      <h1 className="font-display mt-2 text-4xl font-semibold text-navy">Received</h1>
      {state?.publicRef ? (
        <p className="mt-3 text-ink/70">
          Reference <strong>{state.publicRef}</strong>
          {state.accessToken ? <> · token <code className="rounded bg-mist px-1">{state.accessToken}</code></> : null}
        </p>
      ) : (
        <p className="mt-3 text-ink/70">Keep the public reference from your confirmation to track this order.</p>
      )}
      <p className="mt-2 text-sm text-ink/55">
        {state?.isDemo ? 'Demo order — nothing was charged.' : 'No card payment left this form. Cash on delivery and pickup stay pending confirmation.'}
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <Button asChild>
          <Link to="/track-order">Track order</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/account">Account</Link>
        </Button>
      </div>
    </div>
  );
}
