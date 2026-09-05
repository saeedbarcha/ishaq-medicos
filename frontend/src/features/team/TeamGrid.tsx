import { useState } from 'react';
import type { TeamMember } from '@shared/types';
import { cn } from '@/lib/utils';

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

function safePhoto(url?: string) {
  if (!url) return '';
  if (url.startsWith('https://') || url.startsWith('http://') || url.startsWith('/')) return url;
  return '';
}

export function TeamCard({ member }: { member: TeamMember }) {
  const photo = safePhoto(member.photoUrl);
  const [broken, setBroken] = useState(false);
  const showPhoto = Boolean(photo) && !broken;
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[1.5rem] bg-white shadow-[0_12px_32px_rgba(18,32,51,0.06)] ring-1 ring-line">
      {showPhoto ? (
        <img src={photo} alt="" className="h-52 w-full object-cover" onError={() => setBroken(true)} />
      ) : (
        <div className="grid h-52 place-items-center bg-[linear-gradient(135deg,#00A7D4,#E12201)]">
          <span className="font-display text-4xl font-semibold text-white">{initials(member.name)}</span>
        </div>
      )}
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal">{member.jobTitle}</p>
        <h3 className="font-display mt-1 text-xl font-semibold text-navy">{member.name}</h3>
        {member.bio ? <p className="mt-3 text-sm leading-relaxed text-ink/65">{member.bio}</p> : null}
      </div>
    </article>
  );
}

export function TeamGrid({ members, className }: { members: TeamMember[]; className?: string }) {
  if (members.length === 0) {
    return (
      <div className={cn('rounded-[1.5rem] bg-white px-6 py-12 text-center ring-1 ring-line', className)}>
        <p className="font-display text-2xl font-semibold text-navy">The counter team is not listed yet</p>
        <p className="mx-auto mt-2 max-w-lg text-sm text-ink/60">
          Names and roles appear here from the catalog or after the store publishes them from admin.
        </p>
      </div>
    );
  }
  return (
    <div className={cn('grid gap-4 sm:grid-cols-2 lg:grid-cols-3', className)}>
      {members.map((member) => (
        <TeamCard key={member.id} member={member} />
      ))}
    </div>
  );
}
