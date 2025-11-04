import { Resend } from 'resend'

// Initialize Resend client (only if API key is provided)
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

interface SendWelcomeEmailParams {
  name: string
  email: string
  profession: string
}

/**
 * Send welcome email to new waitlist subscriber
 */
export async function sendWelcomeEmail({ name, email, profession }: SendWelcomeEmailParams) {
  // Skip email sending if Resend is not configured
  if (!resend || !process.env.FROM_EMAIL) {
    console.log('Email service not configured, skipping welcome email')
    return { success: true, message: 'Email service not configured' }
  }

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.FROM_EMAIL!,
      to: [email],
      subject: 'Welcome to Freelance Invoice Tracker Waitlist! 🎉',
      html: generateWelcomeEmailHTML({ name, profession })
    })

    if (error) {
      console.error('Failed to send welcome email:', error)
      return { success: false, error: error.message }
    }

    console.log('Welcome email sent successfully:', data?.id)
    return { success: true, data }
  } catch (error) {
    console.error('Email service error:', error)
    return { success: false, error: 'Failed to send welcome email' }
  }
}

/**
 * Generate HTML content for welcome email
 */
function generateWelcomeEmailHTML({ name, profession }: { name: string; profession: string }) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Freelance Invoice Tracker</title>
    </head>
    <body style="font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #2563eb; font-size: 28px; margin-bottom: 10px;">💰 Freelance Invoice Tracker</h1>
        <p style="color: #64748b; font-size: 16px;">Built for Indian Freelancers</p>
      </div>
      
      <div style="background: #f8fafc; padding: 30px; border-radius: 12px; margin-bottom: 30px;">
        <h2 style="color: #1e293b; margin-bottom: 15px;">Welcome aboard, ${name}! 🎉</h2>
        <p style="margin-bottom: 15px;">Thank you for joining the Freelance Invoice Tracker waitlist! We're excited to have a ${profession.toLowerCase()} like you in our community.</p>
        
        <p style="margin-bottom: 15px;">You're now part of an exclusive group of Indian freelancers who will get:</p>
        <ul style="color: #475569; margin-bottom: 20px;">
          <li>Early access to the platform (launching January 2025)</li>
          <li>Special launch pricing (₹199/month instead of ₹299)</li>
          <li>Free setup and onboarding support</li>
          <li>Direct feedback channel to shape the product</li>
        </ul>
      </div>
      
      <div style="background: #2563eb; color: white; padding: 25px; border-radius: 12px; margin-bottom: 30px;">
        <h3 style="margin-bottom: 15px; color: white;">What makes us different?</h3>
        <ul style="margin-bottom: 0;">
          <li>🧮 Automatic TDS calculations for Indian tax rules</li>
          <li>📄 GST-compliant invoice templates</li>
          <li>📱 UPI payment integration (PhonePe, GPay, Paytm)</li>
          <li>🔔 Automated payment reminders</li>
          <li>📊 ITR-ready income reports</li>
        </ul>
      </div>
      
      <div style="text-align: center; margin-bottom: 30px;">
        <p style="color: #64748b; margin-bottom: 15px;">We'll keep you updated on our progress and notify you as soon as we launch!</p>
        <p style="color: #64748b; font-size: 14px;">Questions? Reply to this email - we'd love to hear from you.</p>
      </div>
      
      <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; text-align: center;">
        <p style="color: #94a3b8; font-size: 12px; margin: 0;">
          Built with ❤️ for Indian freelancers<br>
          © 2025 Freelance Invoice Tracker. All rights reserved.
        </p>
      </div>
    </body>
    </html>
  `
}