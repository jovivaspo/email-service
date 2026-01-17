import { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

interface EmailRequest {
  to: string;
  subject: string;
  html?: string;
  text?: string;
  from?: string;
  replyTo?: string;
  headers?: Record<string, string>;
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
    const { to, subject, html, text, from, replyTo, headers }: EmailRequest = req.body;

    if (!to || !subject || (!html && !text)) {
      return res.status(400).json({ error: 'Missing required fields: to, subject, html or text' });
    }

    const info = await transporter.sendMail({
      from: from || process.env.EMAIL_DEFAULT_FROM || process.env.SMTP_USER,
      to,
      subject,
      html,
      text,
      replyTo: replyTo || process.env.EMAIL_DEFAULT_REPLY_TO || process.env.SMTP_USER,
      headers,
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
