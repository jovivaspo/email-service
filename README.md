# Email Service

Servicio serverless de envío de emails usando Gmail SMTP con Nodemailer, desplegado en Vercel. Ahora recibe el HTML ya renderizado desde admin-panel y solo lo entrega.

## 🚀 Características

- **Endpoint**: `POST /api/send-email`
- **Proveedor**: Gmail SMTP con Nodemailer
- **Tipos de email**: agnóstico; recibe `subject/html` ya preparados.
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
  "to": "juan@example.com",
  "subject": "Confirmación de pedido #ORD-123456",
  "html": "<html>...contenido renderizado...</html>",
  "text": "(opcional) versión en texto",
  "from": "(opcional) override remitente",
  "replyTo": "(opcional) override reply-to"
}
```

### Response

```json
{
  "success": true,
  "messageId": "<smtp-id>",
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
