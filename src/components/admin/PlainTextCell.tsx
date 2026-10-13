import type { DefaultCellComponentProps } from 'payload'

// Admin list cell for optional text columns: shows the text, or nothing at all
// when the field is empty (instead of Payload's default "<No Note>").
// Registered on fields with `admin.components.Cell`.
export function PlainTextCell({ cellData }: DefaultCellComponentProps) {
  return <span>{typeof cellData === 'string' ? cellData : ''}</span>
}
