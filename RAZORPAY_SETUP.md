# Razorpay Payment Integration Setup

This guide will help you set up Razorpay payment integration for your Invoicraft.

## Features

- **Payment Links**: Generate secure payment links for invoices
- **UPI Support**: Direct UPI payment integration
- **Multiple Payment Methods**: Card, UPI, Net Banking, Wallets
- **Payment Verification**: Secure signature verification
- **Demo Mode**: Works without configuration for testing

## Setup Instructions

### 1. Create a Razorpay Account

1. Go to [https://razorpay.com](https://razorpay.com)
2. Sign up for a free account
3. Complete the KYC verification (required for live payments)

### 2. Get API Keys

1. Log in to your Razorpay Dashboard
2. Go to **Settings** → **API Keys**
3. Generate API keys (you'll get Key ID and Key Secret)
4. For testing, use **Test Mode** keys
5. For production, use **Live Mode** keys

### 3. Configure Environment Variables

Add the following to your `.env.local` file:

```env
# Razorpay Configuration
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_secret_key_here

# Optional: Your app URL for callbacks
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Important**: 
- `NEXT_PUBLIC_RAZORPAY_KEY_ID` is public and used in the browser
- `RAZORPAY_KEY_SECRET` is private and should NEVER be exposed to the client

### 4. Restart Your Server

```bash
npm run dev
```

## How It Works

### Payment Flow

1. **Create Invoice**: Add client details and invoice items
2. **Generate Payment Link**: Click "Pay with Razorpay" button
3. **Customer Pays**: Customer completes payment via Razorpay
4. **Verification**: Payment is verified using signature
5. **Success**: Invoice status is updated

### Payment Methods Supported

- 💳 **Credit/Debit Cards**: Visa, Mastercard, Amex, RuPay
- 📱 **UPI**: Google Pay, PhonePe, Paytm, BHIM
- 🏦 **Net Banking**: All major Indian banks
- 💰 **Wallets**: Paytm, PhonePe, Amazon Pay, etc.

### UPI Direct Payment

If you add a UPI ID to your invoice, customers can:
- Click "Pay via UPI" button
- Opens their UPI app directly
- Pre-filled with amount and details

## Demo Mode

Without Razorpay configuration, the app runs in **Demo Mode**:
- Payment buttons still work
- Shows demo payment page
- Simulates payment flow
- Perfect for testing UI/UX

## Testing

### Test Mode

Use Razorpay test keys for development:

**Test Cards**:
- Card Number: `4111 1111 1111 1111`
- CVV: Any 3 digits
- Expiry: Any future date

**Test UPI**:
- UPI ID: `success@razorpay`
- Status: Success

**Test Net Banking**:
- Select any bank
- Use credentials provided by Razorpay

### Test Payment Links

```bash
# Test creating a payment link
curl -X POST http://localhost:3000/api/payments/create-payment-link \
  -H "Content-Type: application/json" \
  -d '{
    "invoiceId": "test-invoice-1",
    "amount": 100000,
    "currency": "INR",
    "description": "Test Payment",
    "customer": {
      "name": "Test Customer",
      "email": "test@example.com",
      "contact": "+919876543210"
    }
  }'
```

## Production Deployment

### 1. Switch to Live Mode

1. Complete KYC verification on Razorpay
2. Get Live Mode API keys
3. Update environment variables with live keys

### 2. Update Environment Variables

```env
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_live_secret_key
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### 3. Configure Webhooks (Optional)

For automatic payment status updates:

1. Go to Razorpay Dashboard → **Webhooks**
2. Add webhook URL: `https://yourdomain.com/api/webhooks/razorpay`
3. Select events: `payment.captured`, `payment.failed`
4. Save webhook secret in environment variables

## Security Best Practices

1. **Never expose secret key**: Keep `RAZORPAY_KEY_SECRET` server-side only
2. **Verify signatures**: Always verify payment signatures
3. **Use HTTPS**: In production, always use HTTPS
4. **Validate amounts**: Verify payment amounts match invoice totals
5. **Log transactions**: Keep audit logs of all payments

## Pricing

Razorpay charges:
- **Domestic Cards**: 2% per transaction
- **International Cards**: 3% per transaction
- **UPI**: 0% (free for first ₹50 lakhs/month)
- **Net Banking**: 2% per transaction
- **Wallets**: 2% per transaction

No setup fees or annual maintenance charges.

## Support

- **Razorpay Docs**: [https://razorpay.com/docs](https://razorpay.com/docs)
- **Support**: [https://razorpay.com/support](https://razorpay.com/support)
- **Test Mode**: Use test keys for unlimited free testing

## Troubleshooting

### Payment link not working?

1. Check if API keys are correctly set in `.env.local`
2. Restart your development server
3. Check browser console for errors
4. Verify Razorpay account is active

### Signature verification failing?

1. Ensure you're using the correct secret key
2. Check that the signature format matches Razorpay docs
3. Verify webhook secret if using webhooks

### UPI link not opening?

1. Ensure UPI ID is in correct format: `username@bankname`
2. Check if device has UPI apps installed
3. Try copying the link manually

## Additional Features

### Payment Reminders

Enable automatic payment reminders in Razorpay dashboard:
- SMS reminders
- Email reminders
- WhatsApp reminders (if enabled)

### Partial Payments

Allow customers to pay in installments:
- Configure in Razorpay dashboard
- Set minimum payment amount
- Track partial payments

### Refunds

Process refunds directly from Razorpay dashboard:
- Full or partial refunds
- Instant refunds (for UPI)
- Automatic refund notifications

## Need Help?

If you encounter any issues:
1. Check the [Razorpay Documentation](https://razorpay.com/docs)
2. Review the error logs in your console
3. Contact Razorpay support for payment-related issues
4. Check the demo mode is working first before troubleshooting live payments
