# Nuvou.food

Ecommerce site for **Nuvou** ("Boa vida na comida"): whole-food, additive-free, protein-rich, nutritionally balanced, low-carbon, **100% plant-based** prepared meals for busy people and families in Portugal. Frozen main dishes and rice, plus fresh salads made each morning. Founded by Vivi and Alex, who have batch-cooked for their family for 3 years.

The site has 3 pages: **Home, Shop (with product pages), About us**. It's bilingual (**pt-PT + en**, chosen from the browser language) and mobile-first. v1 launches with 3 recipes.

## How we work
- **Alex owns the codebase and wants to understand it.** Before each phase or significant change, explain what you're about to do and why. Present each major decision (stack, services, architecture, data model) with a recommendation, its costs and its trade-offs, and let Alex decide. Small mechanical steps don't need sign-off.
- **Record each decision** in the Decisions section below, in the same commit as the code it affects. Keep this file true: if the code and this file disagree, fix one of them.
- **Claude drafts first** (copy, layouts, product content), then we iterate.
- **Ask for accounts and services just in time**, when the step that needs them starts.
- **Git workflow (local review, no GitHub pull requests):** `main` always works, and once the site is hosted, merging into `main` deploys it.
  - **Real chunks of work** (a phase, a page, checkout…) go on a short-lived local branch (`feat/…`, `fix/…`, `phase-N/…`). When it's ready, run lint and build, open the branch's diff in the app's diff pane, and walk Alex through the files worth reading (skip generated ones, listed in `.gitattributes`). After Alex approves, squash-merge into `main` as one commit whose message explains what and why, then push and delete the branch.
  - **Small changes** (docs, decisions, minor fixes): show Alex the diff, and commit directly to `main` once Alex approves.
- **Edit files with the Edit/Write tools, not shell commands** (sed, python, heredocs). Alex often has files open in the desktop app, which only refreshes them after Edit/Write changes. A stale view also risks Alex saving over Claude's changes. Shell edits are fine only for generated files.
- **Show changes in the app's diff pane** when asking Alex to approve them.
- **Documentation is this file plus a short `README.md`.** Don't add other documentation files.
- **`inputs/` is private and git-ignored:** raw logos, photos, recipe sheets, notes, and the working plan (`inputs/notes/PLAN.md`). Read from it, never commit it, and don't copy private details (such as phone numbers) into versioned files. The site copy to implement is in `inputs/notes/COPY.md`.
- **Payload specifics:** use the Payload skill in `.claude/skills/payload/` (start with `SKILL.md`).

## Code map and commands
- **Node 24** (`.nvmrc`), **npm**. On Alex's Mac, run commands through fnm: `fnm exec --using=24 npm run dev`. Secrets live in `.env.local` (git-ignored, see `.env.example`).
- `npm run dev` · `npm run build` · `npm run lint` · `npm run generate:types` (after changing collections) · `npm run generate:importmap` (after adding admin components).
- **Dependencies are pinned to exact versions** (`save-exact=true` in `.npmrc`): upgrade deliberately, all `@payloadcms/*` packages together. Run `npm audit` before going live and after each Payload/Next.js upgrade. Known leftovers on 2026-10-12: dev/build-only tools (braces, sass, chokidar, esbuild, drizzle-kit) and `undici` inside Payload 3.90.2, waiting for upstream fixes.

```
src/
  app/(site)/[locale]/   public pages, one tree per language (layout.tsx loads fonts, i18n and globals.css)
  app/(site)/globals.css Tailwind + design tokens (@theme): bg-marrom, text-rosa, font-display, rounded-card…
  app/(payload)/         Payload admin (/admin) and API (/api). Generated, don't edit by hand
  collections/           one file per Payload collection
  i18n/                  routing.ts (locales, localized URLs), request.ts, navigation.ts (use its Link)
  proxy.ts               language detection and redirects (Next.js 16's name for middleware)
  payload.config.ts      Payload config: database, collections, content localization (pt default, en)
messages/pt.json, en.json  interface texts (buttons, labels, errors)
public/brand/              logo files
```

## Architecture
*Built so far (PR 1, foundation): Next.js + Payload + Postgres wiring, PT/EN routing, design tokens, and a temporary page. Everything below the first three bullets is still planned.*

- **Next.js (App Router) + TypeScript + Tailwind**, with **next-intl** routes `/pt` and `/en`, detected from `Accept-Language`. URLs are localized: `/pt/sobre-nos` vs `/en/about`.
- **Payload CMS 3** runs inside the same Next.js app: the admin is at `/admin`, and code reads content through Payload's Local API. Payload's built-in auth is for admins only.
- **Postgres on Neon.**
- Content model:
  - **Global `SiteSettings`:**
    - portion sizes S 180 mL / M 750 mL / L 1200 mL, each with a default price and an approximate number of adult portions (used to show the price per portion)
    - delivery fee, free-delivery threshold, delivery window, same-day cut-off
    - default storage and reheating text per product type (localized)
    - contact email, and an optional Instagram link (the footer hides it while it's empty)
  - **`Recipes`:** a **type** (main dish, rice, or salad; the shop is grouped by type, and the type sets the storage instructions: freezer for mains and rice, fridge for salads, which keep 5 days unseasoned), localized name and description, internal source links, ingredients with grams, photos, nutrition percentages, health tags, carbon footprint (kg CO₂e per portion), optional price override per size, an optional storage/reheating text that overrides the type's default (e.g. pies go in the oven), a short serving suggestion, a **"suggest rice"** toggle for main dishes (on by default, off for dishes that already include their own starch, such as potatoes or pies), **stock per size** (number of portions available, decremented when an order is paid), and a **featured** toggle.
  - **`ProductionRequests`:** made when a recipe is fully out of stock. Recipe, requested sizes and quantities, customer email (required, so we can reply), optional name, and a status (awaiting verification, new, planned, ready — setting "ready" emails the customer). Requests still awaiting verification after 7 days are deleted.
  - **`HealthTags`:** localized name, icon, explanation.
  - **`Orders`:** written by the Stripe webhook. Status is paid, delivered, or refunded – outside area.
  - **Globals `HomePage` and `AboutPage`** (a Payload "global" is a single document, unlike a collection): the localized marketing copy and images of those pages, editable in `/admin` without a deploy. Interface text (buttons, labels, errors) lives in next-intl message files (`messages/pt.json`, `messages/en.json`).
  - **`Media`** and **`Users`** (admins).
- **Checkout:**
  1. The client-side cart is sent to a server action, which re-prices it from the database.
  2. The server action creates a Stripe Checkout session, with the delivery fee as a line item (free when the cart reaches the threshold) and Stripe collecting the address and phone number.
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
- **"Complete your meal":** main-dish pages suggest a salad, plus a rice when the dish's "suggest rice" toggle is on, each added to the cart in one click (in the same size by default). Products stay independent, with no pairing between a dish and a specific rice or salad. The suggestion uses the same rule as the Home page: in stock only, "featured" first, then most ordered.
- **Home "Most ordered":** products of every type (main dishes, rice, salads), **in stock only**. Products marked **"featured"** in `/admin` come first (for example, a signature quinoa salad), then the rest by number of paid orders.
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
| 2026-10-09 | Delivery: Mon–Fri 17:00–20:30, same-day before 16:30, €5 fee, **free over €30** (added 2026-10-11), no date picker. The cart shows how much is left to reach free delivery | Matches how Vivi and Alex deliver. The threshold encourages bigger orders that stock several dinners |
| 2026-10-09 | No delivery-zone restriction. Out-of-area orders are refunded in full and logged | Don't turn customers away. Recurring demand from an area shows where to expand delivery |
| 2026-10-09 | Stripe Checkout: cards, Apple Pay, Google Pay, MB WAY. Multibanco off | MB WAY and EU cards cost 1.5% + €0.25 per payment. Multibanco costs 2.95% + €0.25 and is paid asynchronously, which clashes with same-day delivery |
| 2026-10-09 | Guest checkout plus optional login (Google, emailed link). The provider (Neon Auth or Better Auth) is chosen in Phase 5 | A mandatory account is a major cause of abandoned carts. Orders linked by email still give customers their order history |
| 2026-10-10 | Products have a type (main dish, rice, salad), with the shop grouped by type, plus a "Complete your meal" cross-sell on main-dish pages. No full categories system | Nuvou sells complete meals: a portion is served with rice and optionally salad. A simple type field is enough to organise the menu and build the cross-sell. No desserts for now |
| 2026-10-09 | Stock per recipe and size. A size at 0 is disabled. When a recipe is fully out of stock, customers can request production (several sizes and quantities) | Meals are made in batches. Requests show real demand and help plan the next cooking session |
| 2026-10-09 | Resend in v1 (free tier, 3,000 emails/month) for sign-in and verification links, plus production-request notifications to Alex. Order confirmations still come from Stripe receipts | Replaces "no email service in v1", which contradicted the emailed sign-in link |
| 2026-10-09 | Each production request emails Alex at submission time. Verified or known senders are shown with their name and email. Unverified senders are shown by email with an "unverified" flag | Alex sees demand immediately and can judge whether an unverified request is legitimate |
| 2026-10-09 | No invoicing integration in v1 | Avoid fees until volume justifies them (InvoiceXpress starts at €7/month). Invoices are issued by hand in the meantime |
| 2026-10-09 | Anti-spam layers: Cloudflare Turnstile on every form that sends an email (production request, sign-in link), plus a honeypot field and minimum fill time, rate limits stored in Postgres (per email, per IP, and on checkout), strict server-side validation, and Stripe Radar. If spam slips through, unverified-request notifications switch to a daily summary | Bots could otherwise use our forms to send emails to strangers, which hurts the nuvou.food sending reputation, uses up Resend's quota and floods Alex's inbox. All layers are free |
| 2026-10-09 | Analytics: Umami (cookie-less) + Microsoft Clarity behind a consent banner | Clarity gives session recordings, but needs consent from EEA visitors to record them |
| 2026-10-09 | Health tags are marketing-led, based on the ingredients' real nutrients | Alex's choice: marketing first. See Known gaps |
| 2026-10-11 | Positioning, in this order: (1) faster: the meal is ready instantly, (2) cheaper: better than takeaway, for a fraction of the price, (3) kid-approved (never "kids love it": be honest that healthy food is a battle with kids; ours eat it, some dishes are favourites, their friends ask for more), (4) we take care of the nutrition. Plant-based and carbon footprint are secondary proof points. Never say "vegan" up front: use "100% plant-based" in both languages (the English term is used as-is in Portugal; "100% de origem vegetal" sounds like a label). Never call ourselves "cheap": the price comes from know-how (simple whole ingredients cooked well), and we compare with takeaway and delivery, not supermarkets. Always express the price **per person** for a complete dinner (main + rice + salad), e.g. "€4.75 per person", so every family size can relate | "Vegan" polarises. Parents buy convenience, kids' approval, health and value. Against a family takeaway bill (€70–80+), we're a fraction of the price without looking low-end |
| 2026-10-11 | Audience widened from "busy parents" to **busy people and families**. Copy speaks "from our kitchen to yours" ("da nossa cozinha para a tua"), not "by parents for parents". Parents remain a core group, so "kid-approved" stays, including in the hero subtitle. Never call people "clientes/customers/consumers/users" in copy: say "quem já comeu", "quem já provou", or "a família Nuvou" | Don't exclude customers without children. The kid angle is still a strong proof point for families |
| 2026-10-11 | Carbon comparison: the reference is 3.0 kg CO₂e, the average of 92 meals commonly eaten in Portugal (Mesquita & Carvalho, *Int J LCA*, 2023). Until our recipes are measured, say "about 4× less", based on the same study's plant-based meals (0.6–0.7 kg). Our own figures use the same emission factors | A cited, conservative and like-for-like comparison is stronger than "lowest footprint possible", and meets the EU ban on vague green claims |
| 2026-10-12 | **Local review instead of GitHub pull requests** (replaces the 2026-10-09 PR workflow): real chunks of work on a local branch, reviewed in the app's diff pane with a walkthrough, then squash-merged into `main` after Alex's OK. Private GitHub repo `happy-dev/nuvou.food` remains the remote. To revisit if someone else joins or if per-PR preview links become useful (Phase 6) | Only Alex and Claude work on the code: GitHub PRs added friction (switching tools, pending reviews) without extra value. Branches still keep `main` clean, and detailed squash commits keep the "why" |
| 2026-10-09 | Documentation is this file plus a short README. The working plan stays private | One source of truth, kept in sync with the code |
| 2026-10-11 | Official palette: Laranja vibrante `#FB3B00`, Azul elétrico `#0025E9`, Roxo vibrante `#BC3FDE`, Marrom-escuro `#661414`, Rosa chiclete `#FFB3F7`, Branco `#FFFFFF` (source: `inputs/design/NUV_paleta_11OUT26_vm.png`) | Defined by Vivi. Vibrant colours carry the humour, marrom and white keep the site readable |
| 2026-10-11 | Visual direction inspired by Sweetgreen: food photos as the hero, oversized calm headlines, pill buttons, alternating colour bands, product cards with no frame. Its proprietary fonts (SweetSans, Grenette) can't be used, so we use Google Fonts equivalents. The brand must be clearly visible in the first section: a hero block in palette colours with a large logo | Food has to look appetising. Vivi's feedback: in the first version the white hero block hid the brand |
| 2026-10-11 | Design tokens. **Colour roles:** page background Branco, body text and headings Marrom, primary button Laranja with Branco text, band A Rosa with Marrom text, band B Marrom with Rosa text, badges and top bar Laranja with Branco text, footer Marrom with Rosa text, hero block Marrom with Rosa text (it blends with the rosa logo's marrom background). **Fonts (Google Fonts):** Fraunces weight 400 for headings, Fraunces light italic (300) for highlighted words, DM Sans for body and UI. **Shape:** pill buttons, 20px image corners, 24px card corners | Chosen by Alex and Vivi from the prototype (`inputs/design/prototype/index.html`, private, reference only; no longer updated) |
| 2026-10-11 | Start from Payload's **blank** template, not its full ecommerce template. In Phase 5, add Payload's official **ecommerce plugin** (cart, orders, transactions, Stripe) instead of writing those parts ourselves | A small codebase Alex understands line by line. The sensitive payment and order logic still comes from a maintained, tested plugin. The full template brings a page builder, search, variants, dark mode and password accounts we don't need, and no PT/EN support |
| 2026-10-11 | Tooling: Node 24 LTS (pinned in `.nvmrc`, via fnm), npm, next-intl with localized URLs, Tailwind v4 with the design tokens as a `@theme`, fonts self-hosted through `next/font` | LTS is what Next.js and Payload are tested on. npm avoids an extra tool. Self-hosted fonts mean no request from the visitor to Google: faster and better for privacy |
| — | Open: logo variant (Vivi; the rosa/marrom logo is used meanwhile, SVGs to come), hosting (free or one cheap multi-app server) | To decide later |

## Known gaps (deferred on purpose; resolve before the public launch)
- **Invoices:** every sale needs an invoice from AT-certified software, even if it's issued by hand.
- **Livro de Reclamações Eletrónico:** the link to the official online complaints book is mandatory for online sellers.
- **Allergens:** allergen information must be shown before purchase (EU Regulation 1169/2011).
- **Health-claim wording:** EU Regulation 1924/2006 only allows authorised claims, and ASAE can fine others. Tag wording may need adjusting.
- **Legal pages:** terms and conditions, privacy policy, cookie policy.
