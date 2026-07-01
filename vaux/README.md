# Vaux

A self-serve sign-up product for HVAC businesses to get a website built.
Separate brand/product from Hasweeni Digital — dark, modern SaaS styling
aimed at HVAC business owners specifically.

**Live at:** https://momowm.github.io/Hasweeni/vaux/

## Pages
- `index.html` — marketing/landing page with 3 pricing plans
- `auth.html` — combined Sign In / Sign Up page
- `dashboard.html` — the onboarding wizard: business owner enters their
  details and sees a live preview of their website update in real time
- `style.css`, `script.js`, `auth.js`, `dashboard.js`

## Pricing plans (HVAC-focused)
| Plan | Price | For |
|---|---|---|
| Starter | $29/mo | A new HVAC business getting online for the first time |
| Growth (Most Popular) | $59/mo | An established business, custom domain + extras |
| Pro | $99/mo | Businesses wanting local SEO + multiple service pages |

## Important — how sign-up/sign-in actually works right now
This is a **front-end-only prototype**. There is no real backend or
database:
- "Accounts" are stored in `localStorage`, in the visitor's own browser only
- Nothing is sent to a server, and no password is transmitted or stored
  anywhere real
- This means accounts don't persist across devices/browsers, and this is
  **not secure enough for real customer passwords** in its current form

**What actually happens when someone finishes the wizard:** it shows a
confirmation message, but doesn't yet notify anyone automatically. To make
this a real, working funnel, the recommended next step (still $0) is to add
a Formspree endpoint (same free approach used elsewhere in this repo, see
`hvac-template/CUSTOMIZE.md` step 4) to the "Request My Website" button so a
real submission actually reaches an inbox — then the request gets fulfilled
manually the same way the rest of Hasweeni Digital's business works.

If this ever needs real persistent accounts (so a business owner can log
back in from any device), that requires a real backend/auth provider (e.g.
Supabase or Firebase, both have free tiers) — a meaningfully bigger step
than anything else in this repo, since it involves handling real user data.
