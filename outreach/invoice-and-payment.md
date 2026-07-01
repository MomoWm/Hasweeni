# Getting Paid — Invoice Template & Payment Setup

## The payment flow (already decided)
Client pays → lands in the account owner's US bank/payment account → owner
wires Hasweeni his share. This means you don't need any US bank account,
Payoneer, or crypto setup to receive client payments — just to invoice
correctly and give the client an easy way to pay into the owner's account.

## Easiest payment methods for a US client (owner sets these up, $0 to create)

| Method | Best for | Notes |
|---|---|---|
| **Zelle** | Fastest, $0 fees | Almost every US bank supports it; client just needs the owner's phone/email tied to Zelle |
| **Stripe Payment Link** | Most professional-looking | Free to create; takes a small % fee (~2.9% + $0.30) per transaction, only charged when a payment succeeds |
| **PayPal.Me link** | Simple, widely trusted | Free to create; small transaction fee, same idea as Stripe |

**Recommendation:** Start with **Zelle** (zero fees, most US small business owners already have it) for simplicity. Move to a Stripe Payment Link if a client prefers paying by card.

## Simple invoice template (copy/paste and fill in)

```
INVOICE

From: [Your Name / "Hasweeni Web" or any business name you choose]
To: [Client Business Name]
Date: [Date]

Description                                   Amount
-----------------------------------------------------
Custom business website (design, build,       $[PRICE]
hosting setup, mobile-friendly)

Total Due: $[PRICE]

Payment methods accepted:
- Zelle: [owner's Zelle email/phone]
- (or) Stripe payment link: [link]

Once payment is received, your site will be published live within
[X hours/days] and the demo preview banner will be removed.

Thank you for your business!
```

## Order of operations (protects you from getting stiffed)
1. Send the free demo (with the "DEMO PREVIEW" banner still on it)
2. Client agrees to pay → send the invoice above
3. **Wait for payment to actually land** before removing the demo banner or
   making the site "final"
4. Once paid, remove the demo banner (see `hvac-template/CUSTOMIZE.md` step 6),
   republish, and send the client the final live link

## A note on taxes/paperwork
Since payments land in the account owner's name, larger payment platforms
(Stripe, PayPal) may issue the owner a 1099-K tax form once yearly volume
crosses IRS reporting thresholds — even though the income is really
Hasweeni's. This is worth keeping in mind as volume grows; the owner may want
to track this separately or consult a tax professional if this becomes a
real, ongoing income stream rather than a one-off project.
