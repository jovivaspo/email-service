import { translations } from '../translations';

interface PaymentData {
  customerName: string;
  orderNumber: string;
  totalAmount: number;
  locale?: string;
}

export function generatePaymentConfirmationEmail(data: PaymentData) {
  const { customerName, orderNumber, totalAmount, locale = 'es' } = data;

  const t = translations[locale as keyof typeof translations] || translations.es;
  const txt = t.paymentConfirmation;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #001a1d; background-color: #f9f8ed; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f8ed; }
        .header { background-color: #b2dff4; color: #001a1d; padding: 30px 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .logo { max-width: 150px; margin-bottom: 15px; }
        .content { padding: 20px; background-color: #fff; }
        .success-box { background-color: #b2dff4; border: 2px solid #001a1d; padding: 15px; border-radius: 5px; margin: 20px 0; text-align: center; }
        .footer { text-align: center; padding: 20px; color: #001a1d; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="https://res.cloudinary.com/dme5pqzrj/image/upload/v1761419600/logo_lhjse8.png" alt="Atelier Monti" class="logo">
          <h1>${txt.title}</h1>
        </div>
        
        <div class="content">
          <p>${txt.greeting} ${customerName},</p>
          
          <div class="success-box">
            <strong>${txt.successMessage}</strong>
          </div>
          
          <p><strong>${txt.orderNumber}</strong> ${orderNumber}</p>
          <p><strong>${txt.amount}</strong> €${(totalAmount / 100).toFixed(2)}</p>
          
          <p>${txt.preparingMessage}</p>
          
          <p>${txt.thanks}</p>
        </div>
        
        <div class="footer">
          <p>© ${new Date().getFullYear()} Atelier Monti. ${txt.footer}</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return {
    subject: `${txt.subject} #${orderNumber}`,
    html,
  };
}
