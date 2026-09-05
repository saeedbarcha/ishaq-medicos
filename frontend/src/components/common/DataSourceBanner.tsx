import { Link } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';

export function DataSourceBanner() {
  const status = useAppSelector((s) => s.dataSource.status);
  const show = import.meta.env.DEV && (status === 'local' || status === 'fallback');
  if (!show) return null;
  return (
    <div className="bg-navy px-4 py-1.5 text-center text-xs text-white/85">
      Showing the full demo catalog while the live API list is smaller or offline.{' '}
      <Link className="underline" to="/about">
        Not a live inventory feed.
      </Link>
    </div>
  );
}
