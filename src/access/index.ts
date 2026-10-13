import type { Access } from 'payload'

// Reusable access rules. Payload's default (when a collection sets none) is
// "logged-in admins only"; these make the intent explicit where we need it.

/** Anyone, including site visitors: for public content (recipes, settings, images). */
export const anyone: Access = () => true

/** Only logged-in admins (Alex, Vivi). */
export const isAdmin: Access = ({ req }) => Boolean(req.user)
