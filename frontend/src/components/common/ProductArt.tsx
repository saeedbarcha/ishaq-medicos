import type { ProductKind } from '@shared/types';
import { productPhoto } from '@/data/storeImages';
import { cn } from '@/lib/utils';

export function ProductArt({
  kind,
  name,
  className,
  src,
}: {
  kind: ProductKind;
  name: string;
  className?: string;
  src?: string;
}) {
  return <StorePhoto src={productPhoto(kind, name, src)} alt={name} className={className} />;
}

export function StorePhoto({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <div className={cn('img-vignette relative overflow-hidden bg-mist', className)}>
      <img src={src} alt={alt} className="size-full object-cover transition duration-700 ease-out group-hover:scale-[1.06]" />
    </div>
  );
}
