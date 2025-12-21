#!/usr/bin/env ts-node

// Test script para enviar un email de prueba
import 'dotenv/config';
import nodemailer from 'nodemailer';
import { generateOrderConfirmationEmail } from './lib/templates/order-confirmation';

// Create SMTP transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

async function sendTestEmail() {
  console.log('🧪 Enviando email de prueba...');
  console.log('📧 Destinatario: u1930264080@gmail.com');
  
  const testData = {
    customerName: 'Jorge Vivas',
    customerEmail: 'u1930264080@gmail.com',
    orderNumber: 'TEST-001',
    totalAmount: 9999, // €99.99 en centavos
    items: [
      {
        productName: 'Producto de Prueba',
        quantity: 2,
        unitPrice: 49.99,
        totalPrice: 99.98
      }
    ],
    shippingAddress: {
      fullName: 'Jorge Vivas',
      addressLine1: 'Calle de Prueba 123',
      addressLine2: 'Piso 2',
      city: 'Madrid',
      state: 'Madrid',
      postalCode: '28001',
      country: 'España'
    },
    locale: 'es' as 'es' | 'en',
    receiptUrl: 'https://stripe.com/receipt/test'
  };
  
  const emailContent = generateOrderConfirmationEmail(testData);
  
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_DEFAULT_FROM || process.env.SMTP_USER,
      to: testData.customerEmail,
      subject: emailContent.subject,
      html: emailContent.html,
      replyTo: process.env.EMAIL_DEFAULT_REPLY_TO || process.env.SMTP_USER,
    });

    console.log('✅ Email enviado exitosamente!');
    console.log('📬 Message ID:', info.messageId);
    console.log('');
    console.log('🔍 Revisa tu bandeja de entrada en: u1930264080@gmail.com');
    
  } catch (error: any) {
    console.error('❌ Error al enviar email:', error.message);
    process.exit(1);
  }
}

sendTestEmail();
