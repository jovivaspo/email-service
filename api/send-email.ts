import { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';
import { generateOrderConfirmationEmail } from '../lib/templates/order-confirmation';
import { generatePaymentConfirmationEmail } from '../lib/templates/payment-confirmation';

// Create SMTP transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

interface EmailRequest {
  type: 'order-confirmation' | 'payment-confirmation';
  data: {
    customerName: string;
    customerEmail: string;
    orderNumber: string;
    totalAmount: number;
    items?: any[];
    shippingAddress?: any;
    paymentStatus?: string;
    status?: string;
    locale?: string;
    receiptUrl?: string | null;
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check authentication
  const authHeader = req.headers.authorization;
  const expectedToken = process.env.EMAIL_SERVICE_API_KEY;

  if (!authHeader || !authHeader.startsWith('Bearer ') || authHeader.slice(7) !== expectedToken) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { type, data }: EmailRequest = req.body;

    if (!type || !data) {
      return res.status(400).json({ error: 'Missing type or data in request body' });
    }

    if (!data.customerEmail || !data.customerName || !data.orderNumber) {
      return res.status(400).json({
        error: 'Missing required fields: customerEmail, customerName, orderNumber',
      });
    }

    let emailHtml: string;
    let subject: string;

    // Generate email based on type
    switch (type) {
      case 'order-confirmation':
        const orderEmail = generateOrderConfirmationEmail(data);
        emailHtml = orderEmail.html;
        subject = orderEmail.subject;
        break;

      case 'payment-confirmation':
        const paymentEmail = generatePaymentConfirmationEmail(data);
        emailHtml = paymentEmail.html;
        subject = paymentEmail.subject;
        break;

      default:
        return res.status(400).json({ error: 'Invalid email type' });
    }

    // Send email via SMTP
    const info = await transporter.sendMail({
      from: process.env.EMAIL_DEFAULT_FROM || process.env.SMTP_USER,
      to: data.customerEmail,
      subject,
      html: emailHtml,
      replyTo: process.env.EMAIL_DEFAULT_REPLY_TO || process.env.SMTP_USER,
    });

    console.log(`✅ Email sent successfully: ${info.messageId}`);

    return res.status(200).json({
      success: true,
      messageId: info.messageId,
      message: 'Email sent successfully',
    });
  } catch (error: any) {
    console.error('❌ Error sending email:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  }
}
