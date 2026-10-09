# Nuvou.food

Ecommerce site for **Nuvou** ("Boa vida na comida"): frozen, whole-food, additive-free, protein-rich, nutritionally balanced, low-carbon prepared meals for busy parents in Portugal. Founded by Vivi and Alex, who have batch-cooked for their family for 3 years.

The site has 3 pages: **Home, Shop (with product pages), About us**. It's bilingual (**pt-PT + en**, chosen from the browser language) and mobile-first. v1 launches with 3 recipes.

## How we work
- **Alex owns the codebase and wants to understand it.** Before each phase or significant change, explain what you're about to do and why. Present each major decision (stack, services, architecture, data model) with a recommendation, its costs and its trade-offs, and let Alex decide. Small mechanical steps don't need sign-off.
- **Record each decision** in the Decisions section below, in the same commit as the code it affects. Keep this file true: if the code and this file disagree, fix one of them.
- **Claude drafts first** (copy, layouts, product content), then we iterate.
- **Ask for accounts and services just in time**, when the step that needs them starts.
- **Documentation is this file plus a short `README.md`.** Don't add other documentation files.
- **`inputs/` is private and git-ignored:** raw logos, photos, recipe sheets, notes, and the working plan (`inputs/notes/PLAN.md`). Read from it, never commit it, and don't copy private details (such as phone numbers) into versioned files.

## Architecture
*Planned; nothing is built yet. Update this section to describe the real code once Phase 4 starts.*

- **Next.js (App Router) + TypeScript + Tailwind**, with **next-intl** routes `/pt` and `/en`, detected from `Accept-Language`.
- **Payload CMS 3** runs inside the same Next.js app: the admin is at `/admin`, and code reads content through Payload's Local API. Payload's built-in auth is for admins only.
- **Postgres on Neon.**
- Content model:
  - **Global `SiteSettings`:**
    - portion sizes S 180 mL / M 750 mL / L 1200 mL, each with a default price
    - delivery fee, delivery window, same-day cut-off
    - contact email and Instagram link
  - **`Recipes`:** localized name and description, internal source links, ingredients with grams, photos, nutrition percentages, health tags, carbon footprint (kg CO₂e per portion), optional price override per size, **stock per size** (number of portions available, decremented when an order is paid).
  - **`ProductionRequests`:** made when a recipe is fully out of stock. Recipe, requested sizes and quantities, customer email (required, so we can reply), optional name, and a status (awaiting verification, new, planned, ready — setting "ready" emails the customer). Requests still awaiting verification after 7 days are deleted.
  - **`HealthTags`:** localized name, icon, explanation.
  - **`Orders`:** written by the Stripe webhook. Status is paid, delivered, or refunded – outside area.
  - **Globals `HomePage` and `AboutPage`** (a Payload "global" is a single document, unlike a collection): the localized marketing copy and images of those pages, editable in `/admin` without a deploy. Interface text (buttons, labels, errors) lives in next-intl message files (`messages/pt.json`, `messages/en.json`).
  - **`Media`** and **`Users`** (admins).
- **Checkout:**
  1. The client-side cart is sent to a server action, which re-prices it from the database.
  2. The server action creates a Stripe Checkout session, with the delivery fee as a line item and Stripe collecting the address and phone number.
  3. A webhook creates the `Order`.
  4. The success page states the expected delivery slot.
- **Stock and out-of-stock behaviour:**
  - A size with 0 stock is shown disabled, with the hint "Out of stock for this size". The hint appears on hover on desktop and on tap on mobile, because there is no hover on phones.
  - When every size is at 0, the product shows "Currently out of stock" and a button that opens a form to request production: one or more sizes with a quantity each, plus an email address.
  - If the customer is signed in, or their email is already verified, the request is accepted immediately. Otherwise it's saved as "awaiting verification" and an email link is sent. **The verification link is also the sign-in link:** clicking it confirms the request and signs the customer in.
  - Once a request is accepted (immediately, or after verification), the customer receives a **confirmation email** summarising what they asked for.
  - When the portions are produced, Alex sets the request to **ready** in `/admin`. That automatically sends the customer a "your meal is ready, order it now" email linking to the product page.
  - Every new request emails Alex straight away (via Resend). The email gives the recipe, sizes and quantities, and the sender: first and last name plus email if verified or known, otherwise the email with an **unverified** flag.
  - Stock is checked again in the checkout server action, and decremented by the webhook.
- **Abuse protection:** every server action that sends an email or creates a checkout session goes through the same guard: Turnstile check, honeypot and timing check, rate limit, and schema validation. Never add an email-sending endpoint without it.
- **Customer accounts are optional.** Guest checkout sits next to "Continue with Google" and an emailed sign-in link. Orders are linked by email, so "My orders" also shows orders placed as a guest.
- **Seed script:** content Claude drafts is loaded into Payload, then refined in `/admin`.

## Decisions

| Date | Decision | Why |
|---|---|---|
| 2026-10-04 | Market: Portugal, EUR, IVA 23%, pt-PT + en | Launch market. Bilingual, chosen from the browser language |
| 2026-10-04 | One-off orders only, no subscriptions | Keep v1 simple. Subscriptions can be added later with Stripe Billing |
| 2026-10-09 | Custom build (Next.js + Payload + Stripe) rather than Shopify or WooCommerce | Small scope (one-off orders, few products). Stripe handles payments. Payload gives a free admin. Full design freedom and no platform fees |
| 2026-10-09 | Payload CMS 3 for the admin and CMS | Open source and free. Runs inside the Next.js app, so one codebase and one deploy. Built-in localization. Typed API, so AI-drafted content can be seeded |
| 2026-10-09 | Postgres on Neon (free tier) | Generous free tier, managed, nothing to operate |
| 2026-10-09 | Delivery: Mon–Fri 17:00–20:30, same-day before 16:30, €5 fee, no date picker | Matches how Vivi and Alex deliver |
| 2026-10-09 | No delivery-zone restriction. Out-of-area orders are refunded in full and logged | Don't turn customers away. Recurring demand from an area shows where to expand delivery |
| 2026-10-09 | Stripe Checkout: cards, Apple Pay, Google Pay, MB WAY. Multibanco off | MB WAY and EU cards cost 1.5% + €0.25 per payment. Multibanco costs 2.95% + €0.25 and is paid asynchronously, which clashes with same-day delivery |
| 2026-10-09 | Guest checkout plus optional login (Google, emailed link). The provider (Neon Auth or Better Auth) is chosen in Phase 5 | A mandatory account is a major cause of abandoned carts. Orders linked by email still give customers their order history |
| 2026-10-09 | Stock per recipe and size. A size at 0 is disabled. When a recipe is fully out of stock, customers can request production (several sizes and quantities) | Meals are made in batches. Requests show real demand and help plan the next cooking session |
| 2026-10-09 | Resend in v1 (free tier, 3,000 emails/month) for sign-in and verification links, plus production-request notifications to Alex. Order confirmations still come from Stripe receipts | Replaces "no email service in v1", which contradicted the emailed sign-in link |
| 2026-10-09 | Each production request emails Alex at submission time. Verified or known senders are shown with their name and email. Unverified senders are shown by email with an "unverified" flag | Alex sees demand immediately and can judge whether an unverified request is legitimate |
| 2026-10-09 | No invoicing integration in v1 | Avoid fees until volume justifies them (InvoiceXpress starts at €7/month). Invoices are issued by hand in the meantime |
| 2026-10-09 | Anti-spam layers: Cloudflare Turnstile on every form that sends an email (production request, sign-in link), plus a honeypot field and minimum fill time, rate limits stored in Postgres (per email, per IP, and on checkout), strict server-side validation, and Stripe Radar. If spam slips through, unverified-request notifications switch to a daily summary | Bots could otherwise use our forms to send emails to strangers, which hurts the nuvou.food sending reputation, uses up Resend's quota and floods Alex's inbox. All layers are free |
| 2026-10-09 | Analytics: Umami (cookie-less) + Microsoft Clarity behind a consent banner | Clarity gives session recordings, but needs consent from EEA visitors to record them |
| 2026-10-09 | Health tags are marketing-led, based on the ingredients' real nutrients | Alex's choice: marketing first. See Known gaps |
| 2026-10-09 | Documentation is this file plus a short README. The working plan stays private | One source of truth, kept in sync with the code |
| — | Open: hosting (free or one cheap multi-app server), logo variant (Vivi) | To decide later |

## Known gaps (deferred on purpose; resolve before the public launch)
- **Invoices:** every sale needs an invoice from AT-certified software, even if it's issued by hand.
- **Livro de Reclamações Eletrónico:** the link to the official online complaints book is mandatory for online sellers.
- **Allergens:** allergen information must be shown before purchase (EU Regulation 1169/2011).
- **Health-claim wording:** EU Regulation 1924/2006 only allows authorised claims, and ASAE can fine others. Tag wording may need adjusting.
- **Legal pages:** terms and conditions, privacy policy, cookie policy.
