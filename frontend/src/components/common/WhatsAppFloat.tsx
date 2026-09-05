import { MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import { storeSettings } from '@/data/storeSettings';
import { whatsappUrl } from '@/lib/utils';

export function WhatsAppFloat() {
  return (
    <button
      type="button"
      className="pulse-ring fixed bottom-5 right-5 z-40 grid size-14 place-items-center rounded-full bg-[#128C7E] text-white shadow-[0_16px_36px_rgba(18,140,126,0.42)] transition hover:scale-105 hover:shadow-[0_20px_44px_rgba(18,140,126,0.5)]"
      aria-label="WhatsApp the store"
      onClick={() => {
        const url = whatsappUrl(
          storeSettings.placeholders.whatsapp ? undefined : storeSettings.whatsapp,
          `Hello ${storeSettings.shortName}, I have a product enquiry.`,
        );
        if (!url) {
          toast.message('WhatsApp number is not published yet', {
            description: 'A placeholder is in store settings until the business confirms it.',
          });
          return;
        }
        window.open(url, '_blank', 'noopener,noreferrer');
      }}
    >
      <MessageCircle className="size-6" />
    </button>
  );
}
