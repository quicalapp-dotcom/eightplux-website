# Eightplux Payment & Newsletter System - Complete Setup Guide

## ✅ What's Been Implemented

### 1. Crypto Payments (NOWPayments)
- ✅ Accept 300+ cryptocurrencies (BTC, ETH, USDT, etc.)
- ✅ Automatic invoice generation
- ✅ Webhook-based payment confirmation
- ✅ Secure signature verification
- ✅ Duplicate payment protection
- ✅ Amount verification with 1% tolerance
- ✅ Order status updates in Firestore

### 2. Newsletter & Discount System
- ✅ Newsletter subscription form
- ✅ Automatic 10% discount code generation
- ✅ Welcome email with discount code
- ✅ Discount code validation at checkout
- ✅ Automatic discount usage tracking
- ✅ First-order only restriction

---

## 🔧 Required Setup

### 1. Email Service Configuration (Choose One)

**Option A: Gmail (Free, Easy for Testing)**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=16-char-app-password
SMTP_FROM_EMAIL=your-email@gmail.com
```

Get App Password: https://myaccount.google.com/apppasswords

**Option B: SendGrid (Free 100 emails/day)**
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASSWORD=your-sendgrid-api-key
SMTP_FROM_EMAIL=noreply@eightplux.com
```

**Option C: Brevo (Free 300 emails/day)**
```env
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-brevo-username
SMTP_PASSWORD=your-brevo-password
SMTP_FROM_EMAIL=noreply@eightplux.com
```

### 2. Firebase Admin (Already Configured ✅)
Your `.env.local` already has the correct Firebase Admin credentials.

### 3. Deploy Firestore Rules
```bash
firebase deploy --only firestore:rules
```

### 4. Register NOWPayments Webhook
In NOWPayments Dashboard:
1. Go to **Settings** → **Instant Payment Notifications**
2. Add webhook URL: `https://yourdomain.com/api/webhooks/nowpayments`
3. For local testing, use ngrok: `ngrok http 3000`

---

## 📁 Files Created/Modified

### API Routes
- `src/app/api/payments/crypto/create-charge/route.ts` - NOWPayments invoice creation
- `src/app/api/webhooks/nowpayments/route.ts` - Payment webhook handler
- `src/app/api/newsletter/subscribe/route.ts` - Newsletter subscription
- `src/app/api/discounts/validate/route.ts` - Discount code validation

### Components
- `src/components/checkout/PayCryptoButton.tsx` - Crypto payment button
- `src/components/checkout/CryptoPaymentPanel.tsx` - Crypto payment panel
- `src/components/checkout/CheckoutPayment.tsx` - Updated payment selection
- `src/components/checkout/OrderSummary.tsx` - Added discount code input
- `src/components/home/NewsletterSection.tsx` - Newsletter form with validation

### Utilities
- `src/lib/email.ts` - Email sending (nodemailer)
- `src/lib/firebase/admin.ts` - Firebase Admin config

### Pages
- `src/app/checkout/page.tsx` - Updated with discount handling
- `src/app/checkout/success/page.tsx` - Updated order confirmation

### Configuration
- `firestore.rules` - Updated for subscribers & discounts collections
- `.env.local` - Added email & Firebase Admin config

---

## 🧪 How to Test

### Test Newsletter Subscription
1. Go to homepage
2. Scroll to newsletter section
3. Enter email and click "Join"
4. You should see:
   - Success message with discount code (e.g., `WELCOMEX7K9`)
   - Welcome email in inbox
   - New documents in Firestore (`subscribers` and `discounts`)

### Test Discount at Checkout
1. Add items to cart
2. Go to checkout
3. Fill in shipping details
4. In Order Summary, enter discount code (e.g., `WELCOMEX7K9`)
5. Click "Apply"
6. You should see:
   - Green success message
   - 10% discount applied
   - Updated total

### Test Crypto Payment
1. Proceed to payment step
2. Select "crypto (300+ coins)"
3. Click "Proceed to Crypto Payment"
4. You'll be redirected to NOWPayments
5. Choose a cryptocurrency
6. Complete payment (use testnet for testing)
7. Webhook will update order status in Firestore

---

## 📊 Firestore Collections Structure

### `subscribers`
```javascript
{
  email: "user@example.com",
  subscribedAt: Timestamp,
  source: "newsletter_section",
  discountCode: "WELCOMEX7K9",
  discountId: "DISCOUNT_xxxxx",
  discountUsed: false,
  isActive: true
}
```

### `discounts`
```javascript
{
  id: "DISCOUNT_xxxxx",
  code: "WELCOMEX7K9",
  type: "percentage",
  value: 10,
  description: "Welcome discount for new subscribers",
  minPurchase: 0,
  maxDiscount: null,
  usageLimit: 1,
  usageCount: 0,
  validFrom: Timestamp,
  validUntil: Timestamp (30 days from creation),
  applicableTo: "first_order",
  isActive: true,
  createdAt: Timestamp
}
```

### `orders` (new fields)
```javascript
{
  // ... existing fields
  discount: 2.90,           // Discount amount in USD
  discountCode: "WELCOMEX7K9",
  discountId: "DISCOUNT_xxxxx",
  total: 26.10,             // Total after discount
}
```

---

## 🔒 Security Features

### NOWPayments Webhook
- ✅ HMAC SHA512 signature verification
- ✅ Duplicate webhook protection
- ✅ Amount verification (1% tolerance)
- ✅ Payment status validation
- ✅ Only updates payment-related fields

### Discount System
- ✅ Code expiration (30 days)
- ✅ Usage limit enforcement
- ✅ First-order only restriction
- ✅ Minimum purchase validation
- ✅ Email-based usage tracking

---

## 🚨 Important Notes

1. **Email Configuration Required**: Without SMTP setup, welcome emails won't send (subscriptions still work)

2. **Webhook URL for Production**: Update NOWPayments dashboard with your production URL

3. **Discount Code Format**: Codes are generated as `WELCOME` + 4 random chars (e.g., `WELCOMEX7K9`)

4. **Firestore Rules**: Must be deployed for proper access control

5. **NOWPayments Sandbox**: Your current API key is for sandbox testing. For production:
   - Get a live API key from NOWPayments
   - Set `NOWPAYMENTS_SANDBOX=false` or remove it

---

## 📈 Next Steps (Optional Enhancements)

1. **Email Templates**: Customize the welcome email HTML in `src/lib/email.ts`

2. **Discount Types**: Add support for fixed-amount discounts in addition to percentage

3. **Bulk Discount Creation**: Admin panel to create custom discount codes

4. **Email Campaigns**: Integrate with SendGrid/Brevo for newsletter campaigns

5. **Analytics**: Track newsletter conversion rates and discount usage

---

## 🆘 Troubleshooting

### Newsletter subscription fails
- Check Firebase Admin credentials in `.env.local`
- Ensure Firestore rules are deployed
- Check browser console and terminal for errors

### Discount code not working
- Verify code is active and not expired
- Check if email already used the discount
- Ensure minimum purchase requirement is met
- Check `discounts` collection in Firestore

### Webhook not updating orders
- Verify webhook signature matches in NOWPayments dashboard
- Check `NOWPAYMENTS_IPN_SECRET` in `.env.local`
- Review webhook logs in terminal
- Test with ngrok for local development

### Email not received
- Check spam folder
- Verify SMTP credentials
- For Gmail, ensure App Password is used (not regular password)
- Check terminal for email sending errors

---

## 📞 Support

For issues with:
- **NOWPayments**: Contact NOWPayments support
- **Firebase**: Check Firebase Console logs
- **Email**: Verify SMTP service status
- **Code issues**: Check terminal logs and Firestore data
