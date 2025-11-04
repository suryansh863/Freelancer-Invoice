# 💰 Freelance Invoice Tracker

A modern, responsive landing page for an invoicing and payment tracking tool built specifically for Indian freelancers.

## 🚀 Features

- **India-Specific**: Built for Indian tax compliance (GST, TDS, Section 44ADA)
- **UPI Integration**: Support for PhonePe, GPay, Paytm, and Razorpay
- **Professional Invoicing**: GST-compliant invoice templates
- **Automated Reminders**: Email and WhatsApp payment reminders
- **Income Tracking**: Monthly summaries perfect for ITR filing
- **Client Management**: Complete client database and project tracking

## 🛠 Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **TailwindCSS** - Utility-first CSS framework
- **React Hooks** - Modern state management
- **Responsive Design** - Mobile-first approach

### Backend
- **Next.js API Routes** - Serverless backend functions
- **Supabase** - PostgreSQL database with real-time features
- **Zod** - Runtime type validation and parsing
- **Resend** - Email delivery service
- **File Storage Fallback** - Local development without external dependencies

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/suryansh863/Freelancer-Invoice.git
cd Freelancer-Invoice
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

> **Note:** The app works out of the box with file-based storage for development. For production, set up Supabase following the [SETUP.md](SETUP.md) guide.

## 🎯 Target Audience

Indian freelancers including:
- Graphic Designers
- Content Writers
- Developers
- Digital Marketers
- Consultants
- Photographers

## 💡 Key Benefits

- **Affordable**: ₹299/month vs ₹1200+ for Zoho/FreshBooks
- **Compliant**: Automatic TDS calculations and GST invoicing
- **Local**: UPI payments and Indian banking integration
- **Simple**: No complex setup or learning curve
- **Professional**: Beautiful invoice templates and client management

## 🚀 Backend Features

- **Secure Waitlist API** - Capture and store user signups
- **Email Notifications** - Welcome emails with Resend integration
- **Data Validation** - Server-side validation with Zod schemas
- **Duplicate Prevention** - Prevent multiple signups with same email
- **Flexible Storage** - Supabase for production, file storage for development
- **Type Safety** - Full TypeScript implementation
- **Error Handling** - Comprehensive error handling and logging

## 📱 Responsive Design

The landing page is fully responsive and works perfectly on:
- Desktop computers
- Tablets
- Mobile phones
- All modern browsers

## 🔧 Development

### Project Structure
```
├── app/
│   ├── components/
│   │   └── FreelanceInvoiceTracker.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── public/
├── package.json
├── tailwind.config.js
└── next.config.js
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Contact

Built with ❤️ for Indian freelancers

---

**Launch Expected**: January 2025