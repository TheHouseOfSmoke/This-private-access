# 🔐 THS Private Access Portal

Premium access gateway for The House of Smoke (THS) connecting Instagram → Password Gate → Telegram

## Features

✨ **Luxe Design** - Gold & black aesthetic matching premium brand  
🔒 **Security** - Password-protected access with 3-strike lockout  
📱 **Mobile-Optimized** - Responsive design for all devices  
⚡ **Fast & Reliable** - Express.js backend with session tracking  
🎯 **Instagram Integration** - Direct link from Instagram bio  
📲 **Telegram Redirect** - Seamless redirect to Telegram channel  

## Setup & Installation

### Prerequisites
- Node.js 18+
- npm or yarn

### Local Development

```bash
# Clone the repository
git clone https://github.com/TheHouseOfSmoke/This-private-access.git
cd This-private-access

# Install dependencies
npm install

# Update .env with your details
# TELEGRAM_LINK=https://t.me/your_channel

# Start development server
npm run dev
```

The app will run on `http://localhost:3000`

### Environment Variables

```env
PORT=3000
NODE_ENV=production
ACCESS_CODE=THS2026
TELEGRAM_LINK=https://t.me/YOUR_TELEGRAM_LINK
```

## Deployment

### Option 1: Vercel (Recommended - Free)

```bash
npm install -g vercel
vercel
```

### Option 2: Heroku

```bash
heroku create your-app-name
git push heroku main
```

### Option 3: Railway / Render

Connect your GitHub repo directly for automatic deploys.

## Security Features

🔐 **3-Strike Lockout System**
- Users get 3 attempts to enter the correct access code
- After 3 failed attempts, the session locks permanently
- Attempt tracking via session ID

🛡️ **Session-Based Security**
- Each visitor gets a unique session ID
- Lockout information stored server-side
- Prevents brute force attacks

⚠️ **Government Warnings**
- Legal disclaimer displayed to users
- Age verification messaging included

## API Endpoints

### POST `/api/validate`
Validates access code and returns Telegram redirect link

**Request:**
```json
{
  "code": "THS2026",
  "sessionId": "session_1234567890_abc123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "redirect": "https://t.me/YOUR_TELEGRAM_LINK",
  "message": "Access granted! Redirecting to Telegram..."
}
```

**Error Response (401):**
```json
{
  "success": false,
  "error": "Incorrect access code. 2 attempts remaining.",
  "attempts": 1,
  "remaining": 2
}
```

**Locked Response (403):**
```json
{
  "success": false,
  "error": "Account locked. Too many attempts.",
  "locked": true,
  "attempts": 3
}
```

### GET `/api/session/:sessionId`
Check session status and remaining attempts

**Response:**
```json
{
  "attempts": 1,
  "remaining": 2,
  "locked": false
}
```

### GET `/api/health`
Health check endpoint for monitoring

## Customization

### Update Access Code
Edit `.env`:
```env
ACCESS_CODE=YOUR_NEW_CODE
```

### Update Telegram Link
Edit `.env`:
```env
TELEGRAM_LINK=https://t.me/your_channel_name
```

### Change Branding
Edit colors in `public/styles.css`:
```css
:root {
    --gold: #D4AF37;
    --dark: #0a0a0a;
    /* ... */
}
```

## Instagram Bio Link

Add this to your Instagram bio:
```
https://your-deployed-url.com
```

Example:
```
https://ths-private-access.vercel.app
```

## Development

```bash
# Install dependencies
npm install

# Run development server with auto-reload
npm run dev

# Start production server
npm start
```

## Project Structure

```
.
├── server.js              # Express backend
├── package.json           # Dependencies
├── .env                   # Environment variables
├── public/
│   ├── index.html        # Main page
│   ├── styles.css        # Styling
│   └── app.js            # Frontend logic
└── README.md             # This file
```

## Browser Support

✅ Chrome/Edge  
✅ Firefox  
✅ Safari  
✅ Mobile browsers  

## Legal Compliance

⚖️ This application includes government warnings required for cannabis products  
⚖️ Age verification messaging for 21+ products  
⚖️ Users must be of legal age in their jurisdiction  

## Support

For issues or questions:
1. Check existing GitHub issues
2. Create a new issue with details
3. Contact The House of Smoke directly

## License

Proprietary - The House of Smoke (THS)

---

**Built with ❤️ by THS Team**  
🔗 Instagram: [@thehouseofsmoke](https://instagram.com/thehouseofsmoke)  
📲 Telegram: [Join Community](https://t.me/thehouseofsmoke)
