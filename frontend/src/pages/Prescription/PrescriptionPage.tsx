import { useState } from 'react';
import { Seo } from '@/components/common/Seo';
import { Button } from '@/components/ui/Button';
import { Input, Label, Textarea } from '@/components/ui/Field';
import { storeSettings } from '@/data/storeSettings';
import { whatsappUrl } from '@/lib/utils';
import { toast } from 'sonner';

const allowed = ['image/jpeg', 'image/png', 'application/pdf'];

function textValue(data: FormData, name: string) {
  return String(data.get(name) ?? '').trim();
}

function prescriptionWhatsAppMessage(data: FormData, fileName: string) {
  const email = textValue(data, 'email');
  const notes = textValue(data, 'notes');
  return [
    `Prescription request — ${storeSettings.shortName}`,
    '',
    `Name: ${textValue(data, 'name')}`,
    `Phone: ${textValue(data, 'phone')}`,
    `Email (optional): ${email || '—'}`,
    `Prescription file: ${fileName}`,
    `Notes: ${notes || '—'}`,
    '',
    `I understand this file will be reviewed by pharmacy staff and should not include extra personal documents: ${data.get('consent') ? 'Yes' : 'No'}`,
    '',
    'Please attach the prescription file in this chat.',
  ].join('\n');
}

export function PrescriptionPage() {
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Seo
        title="Upload a prescription | Ishaq Medical"
        description="Send a prescription photo or PDF to Ishaq Medical in Gilgit-Baltistan on WhatsApp."
        path="/prescription"
      />
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal">Pharmacist review</p>
      <h1 className="font-display mt-2 text-4xl font-semibold text-navy">Upload a prescription</h1>
      <p className="mt-3 text-ink/70">
        Fill the form, then send it on WhatsApp. The chat opens with these titles and your answers already filled in. Attach the
        JPG, PNG or PDF in that same chat — WhatsApp cannot take the file from this page automatically.
      </p>
      {done ? (
        <div className="mt-8 rounded-[1.5rem] bg-white p-8 shadow-[0_14px_36px_rgba(18,32,51,0.06)] ring-1 ring-line">
          <p className="font-display text-2xl font-semibold text-navy">WhatsApp opened</p>
          <p className="mt-2 text-sm text-ink/70">
            Your name, phone, email, file name and notes are in the message. Attach the prescription file in WhatsApp, then send.
          </p>
          <Button type="button" className="mt-6" onClick={() => setDone(false)}>
            Send another
          </Button>
        </div>
      ) : (
        <form
          className="mt-8 space-y-4 rounded-[1.5rem] bg-white p-6 shadow-[0_14px_36px_rgba(18,32,51,0.06)] ring-1 ring-line"
          onSubmit={(event) => {
            event.preventDefault();
            const form = event.currentTarget;
            const data = new FormData(form);
            const file = data.get('file') as File | null;
            if (!textValue(data, 'name') || !textValue(data, 'phone')) {
              toast.error('Name and phone are required.');
              return;
            }
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
            const url = whatsappUrl(
              storeSettings.whatsapp,
              prescriptionWhatsAppMessage(data, file.name),
            );
            if (!url) {
              toast.message('WhatsApp could not be opened', {
                description: 'Check the form and try again.',
              });
              return;
            }
            setSending(true);
            window.open(url, '_blank', 'noopener,noreferrer');
            setSending(false);
            setDone(true);
          }}
        >
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" required autoComplete="name" />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" name="phone" required autoComplete="tel" inputMode="tel" />
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
          <Button type="submit" disabled={sending}>
            {sending ? 'Opening WhatsApp…' : 'Send on WhatsApp'}
          </Button>
        </form>
      )}
    </div>
  );
}
