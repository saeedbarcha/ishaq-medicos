import { Search } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { catalogApi } from '@/store/api/catalogApi';
import { cn } from '@/lib/utils';

const RECENT_KEY = 'ishaq-recent-searches';

function readRecent(): string[] {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) ?? '[]') as string[];
  } catch {
    return [];
  }
}

function saveRecent(term: string) {
  const next = [term, ...readRecent().filter((item) => item !== term)].slice(0, 6);
  localStorage.setItem(RECENT_KEY, JSON.stringify(next));
}

export function SearchBox({ className, onSubmit, size = 'md' }: { className?: string; onSubmit?: () => void; size?: 'md' | 'lg' }) {
  const fieldId = useId();
  const [q, setQ] = useState('');
  const [debounced, setDebounced] = useState('');
  const [open, setOpen] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);
  const navigate = useNavigate();
  const boxRef = useRef<HTMLDivElement>(null);
  const { data } = catalogApi.useGetSuggestionsQuery(debounced, { skip: debounced.trim().length < 2 });
  const suggestions = debounced.trim().length < 2 ? [] : (data?.data ?? []);
  const showRecent = open && !q && recent.length > 0;
  const showSuggestions = open && q.trim().length >= 2 && suggestions.length > 0;
  const showPanel = showRecent || showSuggestions;

  useEffect(() => setRecent(readRecent()), []);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(q.trim()), 200);
    return () => window.clearTimeout(timer);
  }, [q]);

  useEffect(() => {
    const onDoc = (event: MouseEvent) => {
      if (!boxRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  function go(term: string) {
    const value = term.trim();
    if (!value) return;
    saveRecent(value);
    setRecent(readRecent());
    setOpen(false);
    onSubmit?.();
    navigate(`/search?q=${encodeURIComponent(value)}`);
  }

  return (
    <div ref={boxRef} className={cn('relative', className)}>
      <form
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          go(q);
        }}
      >
        <label className="sr-only" htmlFor={fieldId}>
          Search medicines, devices and skin care
        </label>
        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink/40" />
        <input
          id={fieldId}
          value={q}
          onChange={(event) => {
            setQ(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search salt, brand, device or skin care"
          className={cn(
            'w-full rounded-full border border-line bg-mist pl-11 pr-4 text-sm outline-none transition focus:border-teal focus:bg-white focus:shadow-[0_0_0_4px_rgba(1,97,141,0.1)]',
            size === 'lg' ? 'h-14 bg-white text-base shadow-[0_14px_36px_rgba(18,32,51,0.08)]' : 'h-12',
          )}
          autoComplete="off"
        />
      </form>
      <AnimatePresence>
        {showPanel ? (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="absolute z-50 mt-2 w-full overflow-hidden rounded-2xl border border-line bg-white shadow-[0_24px_60px_rgba(18,32,51,0.16)]"
          >
            <ul className="max-h-80 overflow-auto p-2">
              {showSuggestions
                ? suggestions.map((item) => (
                    <li key={`${item.type}-${item.id}`}>
                      <Link
                        to={item.href}
                        className="flex items-center justify-between rounded-xl px-3 py-2 text-sm hover:bg-mist"
                        onClick={() => {
                          setOpen(false);
                          onSubmit?.();
                        }}
                      >
                        <span>
                          <span className="mr-2 text-[10px] font-bold uppercase tracking-wider text-teal">{item.type}</span>
                          {item.label}
                        </span>
                        {item.meta && <span className="text-xs text-ink/45">{item.meta}</span>}
                      </Link>
                    </li>
                  ))
                : null}
              {showRecent ? (
                <>
                  <li className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-ink/45">Recent</li>
                  {recent.map((term) => (
                    <li key={term}>
                      <button type="button" className="w-full rounded-xl px-3 py-2 text-left text-sm hover:bg-mist" onClick={() => go(term)}>
                        {term}
                      </button>
                    </li>
                  ))}
                </>
              ) : null}
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
