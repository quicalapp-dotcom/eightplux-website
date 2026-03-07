# Newsletter & Discount System Setup Guide for Eightplux

## Overview
The system includes:
1. **Newsletter Subscription** - Automatic email signup with welcome email
2. **10% Discount Codes** - Auto-generated for new subscribers
3. **Discount Validation at Checkout** - Apply and validate codes
4. **Automatic Discount Usage Tracking** - Marks codes as used after payment

---

## 🔥 Firebase Admin Setup (Required)

### Step 1: Generate Service Account Key (Already Done)

Your Firebase Admin credentials are already configured in `.env.local`:
- Project: eightplux-63c05
- Service Account: firebase-adminsdk-fbsvc@eightplux-63c05.iam.gserviceaccount.com

### Step 2: Deploy Firestore Rules

```bash
firebase deploy --only firestore:rules
```

This creates rules for:
- `subscribers` collection - Stores newsletter subscribers
- `discounts` collection - Stores discount codes
- `orders` collection - Now includes discount fields
