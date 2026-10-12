import { createNavigation } from 'next-intl/navigation'

import { routing } from './routing'

// Language-aware replacements for Next.js's Link, redirect, etc.
// Always import Link from here (not from 'next/link') so URLs get the right
// language prefix and translated path.
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing)
