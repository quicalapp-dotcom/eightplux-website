import nodemailer from 'nodemailer';

// Email transporter configuration - created lazily to avoid issues in serverless environments
let _transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (!_transporter) {
    _transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '465'),
      secure: process.env.SMTP_SECURE !== 'false', // default to true for 465
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
      pool: true,
      maxConnections: 1,
      connectionTimeout: 60000, // 1 minute
      greetingTimeout: 30000,
      socketTimeout: 60000,
    });
  }
  return _transporter;
}

interface WelcomeEmailData {
  to: string;
  discountCode: string;
}

/**
 * Send welcome email with discount code to new subscriber
 */
export async function sendWelcomeEmail({ to, discountCode }: WelcomeEmailData): Promise<void> {
  // Check if SMTP configuration is provided
  if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
    console.error('SMTP configuration not set. Cannot send welcome email.');
    console.error('SMTP_USER:', process.env.SMTP_USER ? 'set' : 'missing');
    console.error('SMTP_PASSWORD:', process.env.SMTP_PASSWORD ? 'set' : 'missing');
    throw new Error('SMTP configuration not set');
  }

  const transporter = getTransporter();

  const mailOptions = {
    from: `"Eightplux" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
    to,
    subject: 'Welcome to Eightplux! Here\'s 10% Off Your First Order 🎉',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #1C1C1C; color: #fff; padding: 30px; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; font-weight: bold; }
            .content { padding: 30px; background: #fff; }
            .discount-box { background: #f5f5f5; border: 2px dashed #C72f32; padding: 20px; text-align: center; margin: 20px 0; }
            .discount-code { font-size: 32px; font-weight: bold; color: #C72f32; letter-spacing: 2px; margin: 10px 0; }
            .cta-button { display: inline-block; background: #C72f32; color: #fff; padding: 15px 40px; text-decoration: none; border-radius: 4px; font-weight: bold; margin-top: 20px; }
            .footer { background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Eightplux! 🎉</h1>
            </div>
            <div class="content">
              <p>Hi there,</p>
              <p>Thank you for subscribing to Eightplux! We're excited to have you as part of our community.</p>

              <p>As a welcome gift, here's <strong>10% OFF</strong> your first order:</p>

              <div class="discount-box">
                <p style="margin: 0; font-size: 14px; color: #666;">Use this code at checkout:</p>
                <div class="discount-code">${discountCode}</div>
                <p style="margin: 10px 0 0 0; font-size: 12px; color: #888;">Valid for 30 days</p>
              </div>

              <p style="text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/shop" class="cta-button">Shop Now</a>
              </p>

              <p>Stay tuned for:</p>
              <ul>
                <li>Exclusive member-only discounts</li>
                <li>Early access to new collections</li>
                <li>Latest fashion trends and style tips</li>
                <li>Special promotions and events</li>
              </ul>

              <p>Welcome to the Eightplux family!</p>
              <p><strong>The Eightplux Team</strong></p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Eightplux. All rights reserved.</p>
              <p>You're receiving this email because you subscribed to our newsletter.</p>
              <p><a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/unsubscribe?email=${encodeURIComponent(to)}" style="color: #666;">Unsubscribe</a></p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      Welcome to Eightplux!

      Thank you for subscribing to Eightplux! We're excited to have you as part of our community.

      As a welcome gift, here's 10% OFF your first order:

      Use code: ${discountCode}
      (Valid for 30 days)

      Shop now: ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/shop

      Stay tuned for:
      - Exclusive member-only discounts
      - Early access to new collections
      - Latest fashion trends and style tips
      - Special promotions and events

      Welcome to the Eightplux family!
      The Eightplux Team

      © ${new Date().getFullYear()} Eightplux. All rights reserved.
      You're receiving this email because you subscribed to our newsletter.
    `,
  };

  try {
    console.log('Attempting to send welcome email to:', to);
    console.log('SMTP host:', process.env.SMTP_HOST);
    console.log('SMTP port:', process.env.SMTP_PORT);
    console.log('SMTP secure:', process.env.SMTP_SECURE);

    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to: ${to}`);
  } catch (error: any) {
    console.error('Failed to send welcome email:', error);

    // Detailed error logging for debugging
    if (error.code) {
      console.error('Error code:', error.code);
    }
    if (error.response) {
      console.error('SMTP response:', error.response);
    }
    if (error.stack) {
      console.error('Stack trace:', error.stack);
    }

    throw error; // Re-throw to let the API route handle it
  }
}

/**
 * Send newsletter email to multiple subscribers
 */
export async function sendNewsletterEmail({
  to,
  subject,
  htmlContent,
  textContent
}: {
  to: string;
  subject: string;
  htmlContent: string;
  textContent: string;
}): Promise<void> {
  // Check if SMTP configuration is provided
  if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
    console.error('SMTP configuration not set. Cannot send newsletter email.');
    console.error('SMTP_USER:', process.env.SMTP_USER ? 'set' : 'missing');
    console.error('SMTP_PASSWORD:', process.env.SMTP_PASSWORD ? 'set' : 'missing');
    throw new Error('SMTP configuration not set');
  }

  const transporter = getTransporter();

  const mailOptions = {
    from: `"Eightplux" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
    to,
    subject,
    html: htmlContent,
    text: textContent,
  };

  try {
    console.log('Attempting to send newsletter email to:', to);
    await transporter.sendMail(mailOptions);
    console.log(`Newsletter email sent to: ${to}`);
  } catch (error: any) {
    console.error('Failed to send newsletter email:', error);
    
    // Detailed error logging for debugging
    if (error.code) {
      console.error('Error code:', error.code);
    }
    if (error.response) {
      console.error('SMTP response:', error.response);
    }
    if (error.stack) {
      console.error('Stack trace:', error.stack);
    }

    throw error; // Re-throw to let the API route handle it
  }
}

/**
 * Send order confirmation email
 */
export async function sendOrderConfirmationEmail({
  to,
  orderId,
  total,
  items
}: {
  to: string;
  orderId: string;
  total: number;
  items: any[];
}): Promise<void> {
  const transporter = getTransporter();

  const mailOptions = {
    from: `"Eightplux" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
    to,
    subject: `Order Confirmed - #${orderId}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #1C1C1C; color: #fff; padding: 30px; text-align: center; }
            .content { padding: 30px; background: #fff; }
            .order-details { background: #f5f5f5; padding: 20px; margin: 20px 0; }
            .footer { background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Order Confirmed! ✓</h1>
            </div>
            <div class="content">
              <p>Thank you for your order!</p>
              <div class="order-details">
                <p><strong>Order Number:</strong> #${orderId}</p>
                <p><strong>Total:</strong> $${total.toLocaleString()}</p>
                <p><strong>Items:</strong> ${items.length}</p>
              </div>
              <p>We'll notify you when your order ships.</p>
              <p><strong>The Eightplux Team</strong></p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Eightplux. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Order confirmation email sent to: ${to}`);
  } catch (error) {
    console.error('Failed to send order confirmation email:', error);
  }
}
