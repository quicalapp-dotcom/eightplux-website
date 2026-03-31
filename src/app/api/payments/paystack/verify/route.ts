import { NextResponse } from "next/server";
import admin from "firebase-admin";
import { getApps, initializeApp, cert } from "firebase-admin/app";

// Initialize Firebase Admin if not already initialized
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

// Send admin new order notification email
async function sendAdminNewOrderEmail(orderId: string, orderData: any) {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'eightplux@gmail.com';
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
              .total { font-size: 20px; font-weight: bold; color: #C72f32; margin-top: 15px; }
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
                <p>A new order has been placed and paid for on Eightplux. Please review and process it.</p>

                <div class="order-details">
                  <p><strong>Order ID:</strong> #${orderId}</p>
                  <p><strong>Order Status:</strong> ${orderData.orderStatus || 'pending'}</p>
                  <p><strong>Payment Status:</strong> ${orderData.paymentStatus || 'pending'}</p>
                  <p><strong>Payment Method:</strong> ${orderData.paymentMethod || 'N/A'}</p>
                </div>

                <div class="order-details">
                  <p>Subtotal: $${orderData.subtotal?.toFixed(2) || '0.00'}</p>
                  <p>Shipping: $${orderData.shipping?.toFixed(2) || '0.00'}</p>
                  ${orderData.discount > 0 ? `<p>Discount: -$${orderData.discount?.toFixed(2)}</p>` : ''}
                  <p class="total">Total: $${orderData.total?.toFixed(2) || '0.00'}</p>
                </div>

                <div style="margin-top: 20px;">
                  <h3>👤 Customer Details:</h3>
                  <div class="order-details">
                    <p><strong>Name:</strong> ${orderData.shippingAddress?.firstName || ''} ${orderData.shippingAddress?.lastName || ''}</p>
                    <p><strong>Email:</strong> ${orderData.email || 'N/A'}</p>
                    <p><strong>Phone:</strong> ${orderData.shippingAddress?.phone || 'N/A'}</p>
                    <p><strong>Address:</strong> ${orderData.shippingAddress?.address1 || 'N/A'}</p>
                    <p><strong>City:</strong> ${orderData.shippingAddress?.city || 'N/A'}</p>
                    <p><strong>Country:</strong> ${orderData.shippingAddress?.country || 'N/A'}</p>
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
    };

    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '465'),
      secure: process.env.SMTP_SECURE !== 'false',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    await transporter.sendMail(mailOptions);
    console.log(`Admin new order notification email sent to: ${adminEmail}`);
  } catch (error) {
    console.error('Failed to send admin new order notification email:', error);
  }
}

// Send order status email to customer
async function sendOrderStatusEmail(to: string, orderId: string, status: string, trackingNumber?: string) {
  try {
    let subject = '';
    let statusText = '';

    switch (status) {
      case 'confirmed':
        subject = `Order Confirmed - #${orderId}`;
        statusText = 'Order Confirmed! ✓';
        break;
      case 'processing':
        subject = `Order Processing - #${orderId}`;
        statusText = 'Order is being processed! 📦';
        break;
      case 'shipped':
        subject = `Order Shipped - #${orderId}`;
        statusText = 'Order Shipped! 🚚';
        break;
      case 'delivered':
        subject = `Order Delivered - #${orderId}`;
        statusText = 'Order Delivered! 🎉';
        break;
      case 'cancelled':
        subject = `Order Cancelled - #${orderId}`;
        statusText = 'Order Cancelled! ❌';
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
    };

    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '465'),
      secure: process.env.SMTP_SECURE !== 'false',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    await transporter.sendMail(mailOptions);
    console.log(`Order status email sent to: ${to}`);
  } catch (error) {
    console.error('Failed to send order status email:', error);
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const reference = searchParams.get("reference");

  if (!reference) {
    return NextResponse.json({ error: "Missing reference" }, { status: 400 });
  }

  const response = await fetch(
    `https://api.paystack.co/transaction/verify/${reference}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    }
  );

  const data = await response.json();

  if (data.data.status === "success") {
    try {
      // Update Firestore order
      const orderId = data.data.reference;
      const ordersRef = admin.firestore().collection("orders");

      // Find order by orderId or reference
      const q = ordersRef.where("orderId", "==", orderId).limit(1);
      const querySnapshot = await q.get();

      if (!querySnapshot.empty) {
        const orderDoc = querySnapshot.docs[0];
        const orderData = orderDoc.data();

        // Prevent duplicate updates
        if (orderData.paymentStatus === "paid") {
          return NextResponse.json({
            success: true,
            data: data.data,
          });
        }

        // Validate amount using stored totalNGN
        const expectedAmount = orderData.totalNGN * 100; // Convert to kobo
        const actualAmount = data.data.amount;

        // Allow 1% tolerance for exchange rate fluctuations
        const tolerance = expectedAmount * 0.01;
        if (Math.abs(expectedAmount - actualAmount) > tolerance) {
          console.error('Amount mismatch:', {
            expected: expectedAmount / 100, // Convert back to NGN
            actual: actualAmount / 100, // Convert back to NGN
            tolerance: tolerance / 100, // Convert back to NGN
          });
          return NextResponse.json({
            success: false,
            error: "Amount mismatch",
          });
        }

        // Update order status
        await orderDoc.ref.update({
          paymentStatus: "paid",
          orderStatus: "confirmed",
          paymentProvider: "paystack",
          paystackReference: reference,
          paymentConfirmedAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        console.log(`Order ${orderDoc.id} updated to paid via Paystack`);

        // Send admin notification email
        const fullOrderData = { id: orderDoc.id, ...orderData };
        await sendAdminNewOrderEmail(orderId, fullOrderData);

        // Send confirmation email to customer
        const customerEmail = orderData.email;
        if (customerEmail) {
          await sendOrderStatusEmail(customerEmail, orderId, 'confirmed');
        }
      }
    } catch (error) {
      console.error("Error updating order:", error);
    }

    return NextResponse.json({
      success: true,
      data: data.data,
    });
  }

  return NextResponse.json({ success: false });
}

