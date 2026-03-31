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

    // Don't re-throw the error - just log it
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

    // Don't re-throw the error - just log it
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

/**
 * Send notification confirmation email
 */
export async function sendNotificationConfirmationEmail({
  to,
  productName
}: {
  to: string;
  productName: string;
}): Promise<void> {
  const transporter = getTransporter();

  const mailOptions = {
    from: `"Eightplux" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
    to,
    subject: `Thanks for your interest in ${productName}!`,
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
            .product-info { background: #f5f5f5; padding: 20px; margin: 20px 0; }
            .footer { background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Thanks for your interest! 🎉</h1>
            </div>
            <div class="content">
              <p>Hi there,</p>
              <p>Thank you for expressing interest in ${productName}!</p>
              <div class="product-info">
                <p><strong>Product:</strong> ${productName}</p>
                <p><strong>Status:</strong> Coming Soon</p>
              </div>
              <p>We'll notify you as soon as this product becomes available for purchase. You won't want to miss it!</p>
              <p><strong>The Eightplux Team</strong></p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Eightplux. All rights reserved.</p>
              <p>You're receiving this email because you requested notifications for this product.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      Thanks for your interest in ${productName}!

      Hi there,

      Thank you for expressing interest in ${productName}!

      Product: ${productName}
      Status: Coming Soon

      We'll notify you as soon as this product becomes available for purchase. You won't want to miss it!

      The Eightplux Team

      © ${new Date().getFullYear()} Eightplux. All rights reserved.
      You're receiving this email because you requested notifications for this product.
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Notification confirmation email sent to: ${to}`);
  } catch (error) {
    console.error('Failed to send notification confirmation email:', error);
  }
}

/**
 * Send product available notification email
 */
export async function sendProductAvailableEmail({
  to,
  productName,
  productSlug
}: {
  to: string;
  productName: string;
  productSlug: string;
}): Promise<void> {
  const transporter = getTransporter();

  const mailOptions = {
    from: `"Eightplux" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
    to,
    subject: `${productName} is now available! 🎉`,
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
            .product-info { background: #f5f5f5; padding: 20px; margin: 20px 0; }
            .cta-button { display: inline-block; background: #C72f32; color: #fff; padding: 15px 40px; text-decoration: none; border-radius: 4px; font-weight: bold; margin-top: 20px; }
            .footer { background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${productName} is available! 🎉</h1>
            </div>
            <div class="content">
              <p>Hi there,</p>
              <p>Great news! ${productName} is now available for purchase!</p>
              <div class="product-info">
                <p><strong>Product:</strong> ${productName}</p>
                <p><strong>Availability:</strong> In stock</p>
              </div>
              <p style="text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/shop/product/${productSlug}" class="cta-button">Shop Now</a>
              </p>
              <p>Don't miss out - this product is now available for purchase!</p>
              <p><strong>The Eightplux Team</strong></p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Eightplux. All rights reserved.</p>
              <p>You're receiving this email because you requested notifications for this product.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      ${productName} is now available! 🎉

      Hi there,

      Great news! ${productName} is now available for purchase!

      Product: ${productName}
      Availability: In stock

      Shop now: ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/shop/product/${productSlug}

      Don't miss out - this product is now available for purchase!

      The Eightplux Team

      © ${new Date().getFullYear()} Eightplux. All rights reserved.
      You're receiving this email because you requested notifications for this product.
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Product available email sent to: ${to}`);
  } catch (error) {
    console.error('Failed to send product available email:', error);
  }
}

/**
 * Send order status update email
 */
export async function sendOrderStatusEmail({
  to,
  orderId,
  status,
  trackingNumber
}: {
  to: string;
  orderId: string;
  status: 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  trackingNumber?: string;
}): Promise<void> {
  const transporter = getTransporter();

  let subject = '';
  let statusText = '';
  let statusIcon = '';

  switch (status) {
    case 'confirmed':
      subject = `Order Confirmed - #${orderId}`;
      statusText = 'Order Confirmed! ✓';
      statusIcon = '✓';
      break;
    case 'processing':
      subject = `Order Processing - #${orderId}`;
      statusText = 'Order is being processed! 📦';
      statusIcon = '📦';
      break;
    case 'shipped':
      subject = `Order Shipped - #${orderId}`;
      statusText = 'Order Shipped! 🚚';
      statusIcon = '🚚';
      break;
    case 'delivered':
      subject = `Order Delivered - #${orderId}`;
      statusText = 'Order Delivered! 🎉';
      statusIcon = '🎉';
      break;
    case 'cancelled':
      subject = `Order Cancelled - #${orderId}`;
      statusText = 'Order Cancelled! ❌';
      statusIcon = '❌';
      break;
  }

  const mailOptions = {
    from: `"Eightplux" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
    to,
    subject,
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
              <h1>${statusText}</h1>
            </div>
            <div class="content">
              <p>Your order status has been updated!</p>
              <div class="order-details">
                <p><strong>Order Number:</strong> #${orderId}</p>
                <p><strong>Status:</strong> ${status.charAt(0).toUpperCase() + status.slice(1)}</p>
                ${trackingNumber ? `<p><strong>Tracking Number:</strong> ${trackingNumber}</p>` : ''}
              </div>
              <p>Thank you for shopping with Eightplux!</p>
              <p><strong>The Eightplux Team</strong></p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Eightplux. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      ${statusText}

      Your order status has been updated!

      Order Number: #${orderId}
      Status: ${status.charAt(0).toUpperCase() + status.slice(1)}
      ${trackingNumber ? `Tracking Number: ${trackingNumber}` : ''}

      Thank you for shopping with Eightplux!

      The Eightplux Team

      © ${new Date().getFullYear()} Eightplux. All rights reserved.
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Order status email sent to: ${to}`);
  } catch (error) {
    console.error('Failed to send order status email:', error);
  }
}

/**
 * Send admin notification email when a new order is placed
 */
export async function sendAdminNewOrderEmail({
  orderId,
  orderData
}: {
  orderId: string;
  orderData: any;
}): Promise<void> {
  const transporter = getTransporter();
  const adminEmail = 'eightplux@gmail.com';

  const itemsList = orderData.items
    .map((item: any, index: number) => 
      `${index + 1}. ${item.name} (Qty: ${item.quantity}, Size: ${item.size || 'N/A'}, Color: ${item.color || 'N/A'}) - $${item.price}`
    )
    .join('\n');

  const mailOptions = {
    from: `"Eightplux Orders" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
    to: adminEmail,
    subject: `🛒 New Order Received - #${orderId}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #C72f32; color: #fff; padding: 30px; text-align: center; }
            .header h1 { margin: 0; font-size: 24px; }
            .content { padding: 30px; background: #fff; }
            .order-details { background: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 8px; }
            .order-item { padding: 10px 0; border-bottom: 1px solid #eee; }
            .order-item:last-child { border-bottom: none; }
            .total { font-size: 20px; font-weight: bold; color: #C72f32; margin-top: 15px; }
            .customer-info { margin-top: 20px; }
            .button { display: inline-block; background: #C72f32; color: #fff; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-weight: bold; margin-top: 15px; }
            .footer { background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🛒 New Order Received!</h1>
            </div>
            <div class="content">
              <p>Hello Admin,</p>
              <p>A new order has been placed on Eightplux. Please review and process it.</p>
              
              <div class="order-details">
                <p><strong>Order ID:</strong> #${orderId}</p>
                <p><strong>Order Status:</strong> ${orderData.orderStatus || 'pending'}</p>
                <p><strong>Payment Status:</strong> ${orderData.paymentStatus || 'pending'}</p>
                <p><strong>Payment Method:</strong> ${orderData.paymentMethod || 'N/A'}</p>
                <p><strong>Order Date:</strong> ${orderData.createdAt ? new Date(orderData.createdAt.seconds ? orderData.createdAt.seconds * 1000 : orderData.createdAt).toLocaleString() : 'Just now'}</p>
              </div>

              <h3>📦 Order Items:</h3>
              <div class="order-details">
                ${orderData.items.map((item: any) => `
                  <div class="order-item">
                    <strong>${item.name}</strong><br/>
                    Quantity: ${item.quantity} | Size: ${item.size || 'N/A'} | Color: ${item.color || 'N/A'}<br/>
                    Price: $${item.price}
                  </div>
                `).join('')}
              </div>

              <div class="order-details">
                <p>Subtotal: $${orderData.subtotal?.toFixed(2) || '0.00'}</p>
                <p>Shipping: $${orderData.shipping?.toFixed(2) || '0.00'}</p>
                ${orderData.discount > 0 ? `<p>Discount: -$${orderData.discount?.toFixed(2)}</p>` : ''}
                <p class="total">Total: $${orderData.total?.toFixed(2) || '0.00'}</p>
              </div>

              <div class="customer-info">
                <h3>👤 Customer Details:</h3>
                <div class="order-details">
                  <p><strong>Name:</strong> ${orderData.shippingAddress?.firstName || ''} ${orderData.shippingAddress?.lastName || ''}</p>
                  <p><strong>Email:</strong> ${orderData.email || 'N/A'}</p>
                  <p><strong>Phone:</strong> ${orderData.shippingAddress?.phone || 'N/A'}</p>
                  <p><strong>Address:</strong> ${orderData.shippingAddress?.address1 || 'N/A'}</p>
                  <p><strong>City:</strong> ${orderData.shippingAddress?.city || 'N/A'}</p>
                  <p><strong>Country:</strong> ${orderData.shippingAddress?.country || 'N/A'}</p>
                  <p><strong>Postal Code:</strong> ${orderData.shippingAddress?.postalCode || 'N/A'}</p>
                </div>
              </div>

              <p style="text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin/orders/${orderId}" class="button">View Order Details</a>
              </p>
              
              <p><strong>The Eightplux System</strong></p>
            </div>
            <div class="footer">
              <p>This is an automated notification from Eightplux.</p>
              <p>© ${new Date().getFullYear()} Eightplux. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
New Order Received - #${orderId}

Hello Admin,

A new order has been placed on Eightplux. Please review and process it.

ORDER DETAILS:
==============
Order ID: #${orderId}
Order Status: ${orderData.orderStatus || 'pending'}
Payment Status: ${orderData.paymentStatus || 'pending'}
Payment Method: ${orderData.paymentMethod || 'N/A'}
Order Date: ${orderData.createdAt ? new Date(orderData.createdAt.seconds ? orderData.createdAt.seconds * 1000 : orderData.createdAt).toLocaleString() : 'Just now'}

ORDER ITEMS:
============
${orderData.items.map((item: any) => `
${item.name}
Quantity: ${item.quantity} | Size: ${item.size || 'N/A'} | Color: ${item.color || 'N/A'}
Price: $${item.price}
`).join('')}

TOTALS:
=======
Subtotal: $${orderData.subtotal?.toFixed(2) || '0.00'}
Shipping: $${orderData.shipping?.toFixed(2) || '0.00'}
${orderData.discount > 0 ? `Discount: -$${orderData.discount?.toFixed(2)}\n` : ''}
Total: $${orderData.total?.toFixed(2) || '0.00'}

CUSTOMER DETAILS:
=================
Name: ${orderData.shippingAddress?.firstName || ''} ${orderData.shippingAddress?.lastName || ''}
Email: ${orderData.email || 'N/A'}
Phone: ${orderData.shippingAddress?.phone || 'N/A'}
Address: ${orderData.shippingAddress?.address1 || 'N/A'}
City: ${orderData.shippingAddress?.city || 'N/A'}
Country: ${orderData.shippingAddress?.country || 'N/A'}
Postal Code: ${orderData.shippingAddress?.postalCode || 'N/A'}

View Order: ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin/orders/${orderId}

This is an automated notification from Eightplux.
© ${new Date().getFullYear()} Eightplux. All rights reserved.
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Admin new order notification email sent to: ${adminEmail}`);
  } catch (error) {
    console.error('Failed to send admin new order notification email:', error);
  }
}

