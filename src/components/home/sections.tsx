import type { ReactNode } from 'react'

// Layout pieces shared by the Home sections (Sweetgreen-style alternating bands).

const TONES = {
  white: '',
  rosa: 'bg-rosa text-marrom', // band A
  marrom: 'bg-marrom text-rosa', // band B
}

/** A full-width colour band. */
export function Band({ tone, className = 'py-16 md:py-24', children }: { tone: keyof typeof TONES; className?: string; children: ReactNode }) {
  return <section className={`${TONES[tone]} ${className}`}>{children}</section>
}

/** Text and media side by side (stacked on phones, text first). `mediaFirst` puts the media on the left on wide screens. */
export function Split({ media, mediaFirst = false, children }: { media: ReactNode; mediaFirst?: boolean; children: ReactNode }) {
  return (
    <div className="wrap grid items-center gap-8 md:grid-cols-2 md:gap-14">
      <div>{children}</div>
      <div className={mediaFirst ? 'md:order-first' : undefined}>{media}</div>
    </div>
  )
}

/** "01 · Faster": the promise number comes from the page order, the label from the admin. */
export function Eyebrow({ number, label }: { number?: number; label: string }) {
  return <p className="eyebrow">{number ? `${String(number).padStart(2, '0')} · ${label}` : label}</p>
}
