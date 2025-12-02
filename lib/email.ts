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
    console.error('[EMAIL] Resend not configured:', {
      hasResend: !!resend,
      hasFromEmail: !!process.env.FROM_EMAIL,
      resendApiKey: process.env.RESEND_API_KEY ? 'SET' : 'NOT SET'
    })
    return { success: false, message: 'Email service not configured' }
  }

  console.log('[EMAIL] Sending welcome email:', {
    to: email,
    from: process.env.FROM_EMAIL,
    name,
    profession
  })

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.FROM_EMAIL!,
      to: [email],
      subject: 'Welcome to Invoicraft Waitlist! 🎉',
      html: generateWelcomeEmailHTML({ name, profession })
    })

    if (error) {
      console.error('[EMAIL] Resend API error:', {
        error,
        email,
        errorMessage: error.message
      })
      return { success: false, error: error.message }
    }

    console.log('[EMAIL] Welcome email sent successfully:', {
      emailId: data?.id,
      to: email
    })
    return { success: true, data }
  } catch (error) {
    console.error('[EMAIL] Exception while sending:', {
      error,
      email,
      errorMessage: error instanceof Error ? error.message : 'Unknown error'
    })
    return { success: false, error: 'Failed to send welcome email' }
  }
}

interface SendPasswordResetEmailParams {
  name: string
  email: string
  resetToken: string
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail({ name, email, resetToken }: SendPasswordResetEmailParams) {
  // Skip email sending if Resend is not configured
  if (!resend || !process.env.FROM_EMAIL) {
    console.log('Email service not configured, skipping password reset email')
    return { success: true, message: 'Email service not configured' }
  }

  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/reset-password?token=${resetToken}`

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.FROM_EMAIL!,
      to: [email],
      subject: 'Reset Your Password - Invoicraft',
      html: generatePasswordResetEmailHTML({ name, resetUrl })
    })

    if (error) {
      console.error('Failed to send password reset email:', error)
      return { success: false, error: error.message }
    }

    console.log('Password reset email sent successfully:', data?.id)
    return { success: true, data }
  } catch (error) {
    console.error('Email service error:', error)
    return { success: false, error: 'Failed to send password reset email' }
  }
}

/**
 * Send admin notification when someone joins waitlist
 */
export async function sendAdminNotification({ name, email, profession }: SendWelcomeEmailParams) {
  // Skip if Resend is not configured or admin email not set
  const adminEmail = process.env.ADMIN_EMAIL || 'suryanshsingh5654@gmail.com'
  
  if (!resend || !process.env.FROM_EMAIL) {
    console.error('[EMAIL] Admin notification - Resend not configured:', {
      hasResend: !!resend,
      hasFromEmail: !!process.env.FROM_EMAIL,
      adminEmail
    })
    return { success: false, message: 'Email service not configured' }
  }

  console.log('[EMAIL] Sending admin notification:', {
    to: adminEmail,
    from: process.env.FROM_EMAIL,
    userEmail: email,
    userName: name
  })

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.FROM_EMAIL!,
      to: [adminEmail],
      subject: '🎉 New Waitlist Signup - Invoicraft',
      html: generateAdminNotificationHTML({ name, email, profession })
    })

    if (error) {
      console.error('[EMAIL] Admin notification - Resend API error:', {
        error,
        adminEmail,
        errorMessage: error.message
      })
      return { success: false, error: error.message }
    }

    console.log('[EMAIL] Admin notification sent successfully:', {
      emailId: data?.id,
      to: adminEmail
    })
    return { success: true, data }
  } catch (error) {
    console.error('[EMAIL] Admin notification - Exception:', {
      error,
      adminEmail,
      errorMessage: error instanceof Error ? error.message : 'Unknown error'
    })
    return { success: false, error: 'Failed to send admin notification' }
  }
}

/**
 * Generate HTML content for admin notification
 */
function generateAdminNotificationHTML({ name, email, profession }: { name: string; email: string; profession: string }) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Waitlist Signup</title>
    </head>
    <body style="font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #2563eb; font-size: 28px; margin-bottom: 10px;">💰 Invoicraft</h1>
        <p style="color: #64748b; font-size: 16px;">New Waitlist Signup</p>
      </div>
      
      <div style="background: #f0fdf4; border-left: 4px solid #22c55e; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
        <h2 style="color: #166534; margin-bottom: 15px;">🎉 Someone just joined your waitlist!</h2>
      </div>
      
      <div style="background: #f8fafc; padding: 30px; border-radius: 12px; margin-bottom: 30px;">
        <h3 style="color: #1e293b; margin-bottom: 20px;">User Details:</h3>
        
        <div style="margin-bottom: 15px;">
          <strong style="color: #64748b;">Name:</strong><br>
          <span style="color: #1e293b; font-size: 18px;">${name}</span>
        </div>
        
        <div style="margin-bottom: 15px;">
          <strong style="color: #64748b;">Email:</strong><br>
          <a href="mailto:${email}" style="color: #2563eb; text-decoration: none; font-size: 16px;">${email}</a>
        </div>
        
        <div style="margin-bottom: 15px;">
          <strong style="color: #64748b;">Profession:</strong><br>
          <span style="color: #1e293b; font-size: 16px;">${profession}</span>
        </div>
        
        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
          <strong style="color: #64748b;">Signed up:</strong><br>
          <span style="color: #1e293b;">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</span>
        </div>
      </div>
      
      <div style="background: #eff6ff; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
        <p style="margin: 0; color: #1e40af; font-size: 14px;">
          <strong>💡 Next Steps:</strong> You can reach out to ${name} at ${email} to welcome them personally or provide early access.
        </p>
      </div>
      
      <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; text-align: center;">
        <p style="color: #94a3b8; font-size: 12px; margin: 0;">
          This is an automated notification from Invoicraft<br>
          © 2025 Invoicraft. All rights reserved.
        </p>
      </div>
    </body>
    </html>
  `
}

/**
 * Generate HTML content for password reset email
 */
function generatePasswordResetEmailHTML({ name, resetUrl }: { name: string; resetUrl: string }) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password</title>
    </head>
    <body style="font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #2563eb; font-size: 28px; margin-bottom: 10px;">💰 Invoicraft</h1>
        <p style="color: #64748b; font-size: 16px;">Password Reset Request</p>
      </div>
      
      <div style="background: #f8fafc; padding: 30px; border-radius: 12px; margin-bottom: 30px;">
        <h2 style="color: #1e293b; margin-bottom: 15px;">Hi ${name},</h2>
        <p style="margin-bottom: 15px;">We received a request to reset your password. Click the button below to create a new password:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(to right, #2563eb, #4f46e5); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
            Reset Password
          </a>
        </div>
        
        <p style="margin-bottom: 15px; color: #64748b; font-size: 14px;">Or copy and paste this link into your browser:</p>
        <p style="word-break: break-all; background: #e2e8f0; padding: 12px; border-radius: 6px; font-size: 13px; color: #475569;">
          ${resetUrl}
        </p>
      </div>
      
      <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 8px; margin-bottom: 30px;">
        <p style="margin: 0; color: #92400e; font-size: 14px;">
          <strong>⚠️ Security Notice:</strong> This link will expire in 1 hour. If you didn't request this password reset, please ignore this email or contact support if you have concerns.
        </p>
      </div>
      
      <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; text-align: center;">
        <p style="color: #94a3b8; font-size: 12px; margin: 0;">
          Built with ❤️ for Indian freelancers<br>
          © 2025 Invoicraft. All rights reserved.
        </p>
      </div>
    </body>
    </html>
  `
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
      <title>Welcome to Invoicraft</title>
    </head>
    <body style="font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #2563eb; font-size: 28px; margin-bottom: 10px;">💰 Invoicraft</h1>
        <p style="color: #64748b; font-size: 16px;">Built for Indian Freelancers</p>
      </div>
      
      <div style="background: #f8fafc; padding: 30px; border-radius: 12px; margin-bottom: 30px;">
        <h2 style="color: #1e293b; margin-bottom: 15px;">Welcome aboard, ${name}! 🎉</h2>
        <p style="margin-bottom: 15px;">Thank you for joining the Invoicraft waitlist! We're excited to have a ${profession.toLowerCase()} like you in our community.</p>
        
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
          © 2025 Invoicraft. All rights reserved.
        </p>
      </div>
    </body>
    </html>
  `
}