# Email Service

Servicio serverless de envío de emails usando Gmail SMTP con Nodemailer, desplegado en Vercel.

## 🚀 Características

- **Endpoint**: `POST /api/send-email`
- **Proveedor**: Gmail SMTP con Nodemailer
- **Tipos de email**:
  - `order-confirmation` - Confirmación de pedido
  - `payment-confirmation` - Confirmación de pago
- **Autenticación**: Bearer token
- **Idiomas**: Español e Inglés
- **Deploy**: Vercel Serverless Functions

## 📦 Instalación

```bash
npm install
# o
pnpm install
```

## 🔧 Configuración

1. Crea un archivo `.env`:

```bash
# SMTP Configuration
SMTP_USER=tu-email@gmail.com
SMTP_PASSWORD=tu-contraseña-de-aplicacion

# API Authentication
EMAIL_SERVICE_API_KEY=tu-secret-key-aqui

# Email defaults
EMAIL_DEFAULT_FROM=tu-email@gmail.com
EMAIL_DEFAULT_REPLY_TO=tu-email@gmail.com
```

**Nota**: Para obtener una contraseña de aplicación de Gmail:
1. Ve a https://myaccount.google.com/apppasswords
2. Crea una nueva contraseña de aplicación para "Mail"
3. Usa esa contraseña en `SMTP_PASSWORD`

## 🏃 Desarrollo Local

```bash
npm run dev
# o
vercel dev
```

El servicio estará disponible en `http://localhost:3000`

## 🧪 Pruebas

Envía un email de prueba:

```bash
pnpm exec ts-node test-email.ts
```

## 📤 Deploy a Vercel

```bash
npm run deploy
# o
vercel --prod
```

## 🧪 Uso

### Request

```bash
POST /api/send-email
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json

{
  "type": "order-confirmation",
  "data": {
    "customerName": "Juan Pérez",
    "customerEmail": "juan@example.com",
    "orderNumber": "ORD-123456",
    "totalAmount": 9999,
    "items": [
      {
        "productName": "Producto 1",
        "quantity": 2,
        "unitPrice": 49.99,
        "totalPrice": 99.98
      }
    ],
    "shippingAddress": {
      "fullName": "Juan Pérez",
      "addressLine1": "Calle Principal 123",
      "city": "Madrid",
      "postalCode": "28001",
      "country": "España"
    },
    "locale": "es",
    "receiptUrl": "https://stripe.com/receipt/..."
  }
}
```

### Response

```json
{
  "success": true,
  "id": "email-id-from-resend",
  "message": "Email sent successfully"
}
```

## 🔐 Seguridad

- Autenticación mediante Bearer token
- Validación de datos de entrada
- CORS configurado
- Rate limiting (via Vercel)

## 📝 Tipos de Email

### order-confirmation

Envía un email de confirmación de pedido con:

- Detalles del pedido
- Lista de productos
- Dirección de envío
- Recibo de pago (opcional)

### payment-confirmation

Envía un email de confirmación de pago con:

- Número de pedido
- Importe pagado
- Estado del pedido
