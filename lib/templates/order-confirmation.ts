import { translations } from '../translations';

interface OrderData {
  customerName: string;
  customerEmail: string;
  orderNumber: string;
  totalAmount: number;
  items?: any[];
  shippingAddress?: any;
  locale?: string;
  receiptUrl?: string | null;
}

export function generateOrderConfirmationEmail(data: OrderData) {
  const { customerName, orderNumber, totalAmount, items = [], shippingAddress, locale = 'es', receiptUrl } = data;

  const t = translations[locale as keyof typeof translations] || translations.es;
  const txt = t.orderConfirmation;

  // Format items list
  const itemsList = items
    .map(
      (item: any) =>
        `<tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.productName}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">€${parseFloat(item.unitPrice).toFixed(2)}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">€${parseFloat(item.totalPrice).toFixed(2)}</td>
        </tr>`
    )
    .join('');

  // Receipt button
  const receiptButton = receiptUrl
    ? `
    <div style="margin: 25px 0; padding: 20px; background-color: #f9f8ed; border-radius: 5px; text-align: center;">
      <p style="margin-bottom: 15px;">${txt.receiptMessage}</p>
      <a href="${receiptUrl}" style="background-color: #b2dff4; color: #001a1d; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
        📄 ${txt.viewReceipt}
      </a>
    </div>
    `
    : '';

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
        .order-details { background-color: #fff; padding: 20px; margin: 20px 0; border-radius: 5px; border: 2px solid #b2dff4; }
        .footer { text-align: center; padding: 20px; color: #001a1d; font-size: 12px; }
        table { width: 100%; border-collapse: collapse; }
        .total { font-weight: bold; font-size: 18px; color: #001a1d; }
        h1, h2, h3 { color: #001a1d; }
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
          <p>${txt.message}</p>
          
          <div class="order-details">
            <h2>${txt.orderNumber} #${orderNumber}</h2>
            
            <h3>${txt.products}</h3>
            <table>
              <thead>
                <tr style="background-color: #b2dff4;">
                  <th style="padding: 8px; text-align: left;">${txt.product}</th>
                  <th style="padding: 8px; text-align: center;">${txt.quantity}</th>
                  <th style="padding: 8px; text-align: right;">${txt.unitPrice}</th>
                  <th style="padding: 8px; text-align: right;">${txt.total}</th>
                </tr>
              </thead>
              <tbody>
                ${itemsList}
              </tbody>
              <tfoot>
                <tr class="total">
                  <td colspan="3" style="padding: 12px; text-align: right; border-top: 2px solid #b2dff4;">${txt.total}:</td>
                  <td style="padding: 12px; text-align: right; border-top: 2px solid #b2dff4;">€${(totalAmount / 100).toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
            
            ${
              shippingAddress
                ? `
            <h3 style="margin-top: 20px;">${txt.shippingAddress}</h3>
            <p>
              ${shippingAddress.fullName}<br>
              ${shippingAddress.addressLine1}${shippingAddress.addressLine2 ? '<br>' + shippingAddress.addressLine2 : ''}<br>
              ${shippingAddress.postalCode} ${shippingAddress.city}${shippingAddress.state ? ', ' + shippingAddress.state : ''}<br>
              ${shippingAddress.country}
            </p>
            `
                : ''
            }
          </div>
          
          ${receiptButton}
          
          <p>${txt.trackingMessage}</p>
          <p>${txt.questionsMessage}</p>
        </div>
        
        <div class="footer">
          <p>© ${new Date().getFullYear()} Atelier Monti. ${txt.footer}</p>
          <p>${txt.autoMessage}</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return {
    subject: `${txt.subject} #${orderNumber} - Atelier Monti`,
    html,
  };
}
