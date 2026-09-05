import { useState } from 'react';
import { Seo } from '@/components/common/Seo';
import { Button } from '@/components/ui/Button';
import { Input, Label, Textarea } from '@/components/ui/Field';
import { useSubmitPrescriptionMutation } from '@/store/api/storeApi';
import { toast } from 'sonner';

const allowed = ['image/jpeg', 'image/png', 'application/pdf'];

export function PrescriptionPage() {
  const [submit, { isLoading }] = useSubmitPrescriptionMutation();
  const [done, setDone] = useState(false);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Seo
        title="Upload a prescription | Ishaq Medical"
        description="Send a prescription photo or PDF for pharmacist review at Ishaq Medical in Gilgit-Baltistan."
        path="/prescription"
      />
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal">Pharmacist review</p>
      <h1 className="font-display mt-2 text-4xl font-semibold text-navy">Upload a prescription</h1>
      <p className="mt-3 text-ink/70">
        JPG, PNG or PDF. Do not send prescriptions on public WhatsApp product links. The file is checked in the browser; only the file name is stored unless a private upload is enabled.
      </p>
      {done ? (
        <div className="mt-8 rounded-[1.5rem] bg-white p-8 shadow-[0_14px_36px_rgba(18,32,51,0.06)] ring-1 ring-line">
          <p className="font-display text-2xl font-semibold text-navy">Request received</p>
          <p className="mt-2 text-sm text-ink/70">A pharmacist will review this privately. The image file stays on this device unless a private upload store is enabled.</p>
        </div>
      ) : (
        <form
          className="mt-8 space-y-4 rounded-[1.5rem] bg-white p-6 shadow-[0_14px_36px_rgba(18,32,51,0.06)] ring-1 ring-line"
          onSubmit={async (event) => {
            event.preventDefault();
            const form = event.currentTarget;
            const data = new FormData(form);
            const file = data.get('file') as File | null;
            if (!file || file.size === 0) {
              toast.error('Please choose a file.');
              return;
            }
            if (!allowed.includes(file.type) && !/\.(jpe?g|png|pdf)$/i.test(file.name)) {
              toast.error('Use JPG, PNG or PDF.');
              return;
            }
            if (file.size > 8 * 1024 * 1024) {
              toast.error('File must be under 8MB.');
              return;
            }
            if (!data.get('consent')) {
              toast.error('Privacy consent is required.');
              return;
            }
            try {
              await submit({
                name: data.get('name'),
                phone: data.get('phone'),
                email: data.get('email') || '',
                notes: data.get('notes') || '',
                fileName: file.name,
              }).unwrap();
              setDone(true);
            } catch {
              toast.error('Could not submit the prescription. Check the form and try again.');
            }
          }}
        >
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" required autoComplete="name" />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" name="phone" required autoComplete="tel" />
          </div>
          <div>
            <Label htmlFor="email">Email (optional)</Label>
            <Input id="email" name="email" type="email" autoComplete="email" />
          </div>
          <div>
            <Label htmlFor="file">Prescription file</Label>
            <Input id="file" name="file" type="file" accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf" required />
          </div>
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" name="notes" />
          </div>
          <label className="flex items-start gap-2 text-sm">
            <input type="checkbox" name="consent" required />
            I understand this file will be reviewed by pharmacy staff and should not include extra personal documents.
          </label>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Submitting…' : 'Submit prescription'}
          </Button>
        </form>
      )}
    </div>
  );
}
