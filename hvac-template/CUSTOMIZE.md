# How to Customize This Template Per Client

This template is built so you can re-skin it for a new HVAC business in about
10-15 minutes. Everything that needs to change is a `{{PLACEHOLDER}}` in
`index.html`, or a color variable at the top of `style.css`.

## 1. Find & replace these placeholders in `index.html`

Open `index.html`, use Find & Replace (Ctrl+H in most editors), and swap each of these:

| Placeholder | Example |
|---|---|
| `{{BUSINESS_NAME}}` | Johnson Heating & Air |
| `{{CITY}}` | Tulsa |
| `{{STATE}}` | OK |
| `{{PHONE_DISPLAY}}` | (918) 555-0134 |
| `{{PHONE_RAW}}` | +19185550134  *(must be a `tel:`-friendly number, no spaces/dashes)* |
| `{{EMAIL}}` | info@johnsonheatingair.com |
| `{{YEARS}}` | 15 |
| `{{SERVICE_AREA_LIST}}` | Tulsa, Broken Arrow, Jenks, Owasso, and surrounding areas |

Tip: replace `{{PHONE_RAW}}` and `{{PHONE_DISPLAY}}` FIRST and separately —
they look similar but one is for the clickable `tel:` link and one is for display text.

## 2. Change the colors (30 seconds)

At the very top of `style.css`, edit these two lines to match the client's
branding (or just pick colors that look sharp — most small businesses don't
have real brand guidelines):

```css
--primary: #1e5fbf;   /* main color: header, buttons, hero background */
--accent: #ff7a1a;    /* emergency/CTA highlight color */
```

## 3. Testimonials & stats

The three testimonials near the bottom of `index.html` are placeholders —
swap in real reviews once you have them (or leave generic ones for the demo
version you send to prospects).

## 4. (Optional) Make the contact form actually send emails — still $0

Right now the form just shows an alert. To make it really email the business
owner, for free:

1. Go to [formspree.io](https://formspree.io) and make a free account (50 free submissions/month — plenty for a small business).
2. Create a new form, copy the endpoint URL they give you (looks like `https://formspree.io/f/xxxxxxx`).
3. In `index.html`, change:
   ```html
   <form class="contact-form" id="contactForm">
   ```
   to:
   ```html
   <form class="contact-form" id="contactForm" action="https://formspree.io/f/xxxxxxx" method="POST">
   ```
4. In `script.js`, delete (or comment out) the whole `form.addEventListener(...)` block at the bottom — Formspree handles the submission itself now.

## 5. Publish it live — free, forever

See `README.md` for step-by-step free hosting instructions (GitHub Pages).
