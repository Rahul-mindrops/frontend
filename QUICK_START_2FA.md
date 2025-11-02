# 🚀 Quick Start: Google Authenticator 2FA

## ✅ What's Already Done (Frontend)

All frontend components are **100% complete** and ready to use!

### 📱 Pages Created:
1. **Setup 2FA**: `/auth/setup-2fa` ✅
2. **Verify OTP**: `/auth/verify-2fa` ✅  
3. **Updated Login**: `/auth/adminLogin` ✅

---

## 🔧 What You Need to Do (Backend)

### Step 1: Install Packages
```bash
cd your-backend-folder
npm install speakeasy qrcode
```

### Step 2: Update Database
```sql
ALTER TABLE admins ADD COLUMN twofa_secret VARCHAR(255) NULL;
ALTER TABLE admins ADD COLUMN twofa_enabled BOOLEAN DEFAULT FALSE;
```

### Step 3: Create 3 API Endpoints

#### Endpoint 1: Update Login (modify existing)
```javascript
// POST /api/admin/login
// Add these response fields:
{
  success: true,
  message: "Login successful",
  requires2FA: true,     // if user has 2FA enabled
  setup2FA: false,       // if user needs to setup 2FA
  admin: { username, role }
}
```

#### Endpoint 2: Setup 2FA (new)
```javascript
// POST /api/admin/setup-2fa
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

// Generate secret
const secret = speakeasy.generateSecret({
  name: `Demonoid Admin (${username})`,
  issuer: 'Demonoid'
});

// Generate QR code
const qrCode = await QRCode.toDataURL(secret.otpauth_url);

// Save to database
admin.twofa_secret = secret.base32;

// Return
res.json({
  success: true,
  qrCode: qrCode,      // Base64 image
  secret: secret.base32 // For manual entry
});
```

#### Endpoint 3: Verify OTP (new)
```javascript
// POST /api/admin/verify-2fa
const speakeasy = require('speakeasy');

// Verify token
const verified = speakeasy.totp.verify({
  secret: admin.twofa_secret,
  encoding: 'base32',
  token: req.body.token,
  window: 2
});

if (verified) {
  admin.twofa_enabled = true;
  await admin.save();
  
  res.json({
    success: true,
    admin: { username, role }
  });
}
```

---

## 📖 Full Implementation Guide

See **BACKEND_2FA_IMPLEMENTATION.md** for:
- Complete code examples
- Error handling
- Security best practices
- Testing instructions
- Express route setup

---

## 🧪 Test the Flow

1. **Login**: Go to `/auth/adminLogin`
2. **Enter credentials**: Username + Password
3. **First Time**: Redirected to `/auth/setup-2fa`
   - Scan QR code with Google Authenticator
   - Click "I've Scanned"
4. **Enter OTP**: Redirected to `/auth/verify-2fa`
   - Enter 6-digit code from app
   - Click "Verify"
5. **Success**: Redirected to `/admin/dashboard`

**Next login**: Password → OTP → Dashboard (no setup needed)

---

## 📱 Google Authenticator Apps

- **iOS**: [App Store](https://apps.apple.com/app/google-authenticator/id388497605)
- **Android**: [Play Store](https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2)

---

## ⚡ Quick Reference

### Frontend Routes:
- `/auth/adminLogin` - Main login page
- `/auth/setup-2fa?username=admin` - Setup 2FA
- `/auth/verify-2fa?username=admin` - Verify OTP

### Backend API Endpoints Needed:
- `POST /api/admin/login` - Modified (add 2FA flags)
- `POST /api/admin/setup-2fa` - New (generate QR)
- `POST /api/admin/verify-2fa` - New (verify OTP)

### Environment Variables:
```env
NEXT_PUBLIC_API_URL=https://demonoid.in:3542/api
```

---

## 🎯 Status

- ✅ Frontend: **100% Complete**
- ⏳ Backend: **Needs Implementation**
- 📋 Documentation: **Complete**

**Ready to integrate once backend APIs are implemented!** 🚀



