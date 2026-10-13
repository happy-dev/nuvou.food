import { Fragment } from 'react'

import { fillPlaceholders, paragraphs, parseInline, type CopyValues } from '@/lib/copy'

// Renders marketing copy from the admin (markup: see src/lib/copy.ts).

/** One line: *highlighted* → <em>, **bold** → <strong>, {placeholders} filled in. Put it inside a heading or a <p>. */
export function Inline({ text, values }: { text: string; values: CopyValues }) {
  return (
    <>
      {parseInline(fillPlaceholders(text, values)).map(({ text, style }, i) =>
        style === 'em' ? <em key={i}>{text}</em> : style === 'strong' ? <strong key={i}>{text}</strong> : <Fragment key={i}>{text}</Fragment>,
      )}
    </>
  )
}

/** Several paragraphs (separated by blank lines). `lead` styles the first one as an introduction. */
export function Paragraphs({ text, values, lead = false, className = '' }: { text: string; values: CopyValues; lead?: boolean; className?: string }) {
  return (
    <div className={`space-y-3 ${className}`}>
      {paragraphs(text).map((p, i) => (
        <p key={i} className={lead && i === 0 ? 'lead' : undefined}>
          <Inline text={p} values={values} />
        </p>
      ))}
    </div>
  )
}
