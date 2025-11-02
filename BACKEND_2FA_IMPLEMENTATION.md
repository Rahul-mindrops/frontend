# Backend 2FA Implementation Guide

## 📦 Required NPM Packages

Install these packages in your Node.js backend:

```bash
npm install speakeasy qrcode
```

## 📊 Database Schema Changes

### Add 2FA fields to your admin/user table:

```sql
ALTER TABLE admins ADD COLUMN twofa_secret VARCHAR(255) NULL;
ALTER TABLE admins ADD COLUMN twofa_enabled BOOLEAN DEFAULT FALSE;
```

Or in MongoDB:
```javascript
{
  username: String,
  password: String,
  role: String,
  twofa_secret: String,      // Base32 encoded secret
  twofa_enabled: Boolean,    // Whether 2FA is active
  // ... other fields
}
```

## 🔌 Required API Endpoints

### 1. Update Existing Login Endpoint

**Endpoint:** `POST /api/admin/login`

**Description:** Modify your existing login to check for 2FA status

```javascript
// File: routes/admin.js or controllers/adminController.js

const bcrypt = require('bcryptjs');

async function adminLogin(req, res) {
  const { username, password } = req.body;

  try {
    // Find admin by username
    const admin = await Admin.findOne({ username });
    
    if (!admin) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // Check 2FA status
    if (admin.twofa_enabled && admin.twofa_secret) {
      // User has 2FA enabled, require OTP verification
      return res.json({
        success: true,
        message: 'Login successful',
        requires2FA: true,
        admin: {
          username: admin.username,
          role: admin.role
        }
      });
    } else if (!admin.twofa_secret) {
      // First time user, need to setup 2FA
      return res.json({
        success: true,
        message: 'Login successful',
        setup2FA: true,
        admin: {
          username: admin.username,
          role: admin.role
        }
      });
    } else {
      // 2FA not enabled, login directly
      // Set session or JWT token here
      req.session.admin = admin;
      
      return res.json({
        success: true,
        message: 'Login successful',
        requires2FA: false,
        admin: {
          username: admin.username,
          role: admin.role,
          email: admin.email
        }
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
}

module.exports = { adminLogin };
```

---

### 2. Setup 2FA Endpoint

**Endpoint:** `POST /api/admin/setup-2fa`

**Description:** Generate secret and QR code for new 2FA setup

```javascript
// File: routes/admin.js or controllers/adminController.js

const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

async function setup2FA(req, res) {
  const { username } = req.body;

  try {
    // Find admin by username
    const admin = await Admin.findOne({ username });
    
    if (!admin) {
      return res.status(404).json({ 
        success: false, 
        message: 'Admin not found' 
      });
    }

    // Check if already has a secret
    if (admin.twofa_secret) {
      // Return existing setup
      const otpauthUrl = speakeasy.otpauthURL({
        secret: admin.twofa_secret,
        label: \`Demonoid Admin (\${username})\`,
        issuer: 'Demonoid',
        encoding: 'base32'
      });

      const qrCode = await QRCode.toDataURL(otpauthUrl);

      return res.json({
        success: true,
        message: '2FA already setup',
        qrCode: qrCode,
        secret: admin.twofa_secret
      });
    }

    // Generate new secret
    const secret = speakeasy.generateSecret({
      name: \`Demonoid Admin (\${username})\`,
      issuer: 'Demonoid'
    });

    // Generate QR code
    const qrCode = await QRCode.toDataURL(secret.otpauth_url);

    // Save secret to database (but don't enable 2FA yet)
    admin.twofa_secret = secret.base32;
    admin.twofa_enabled = false; // Will be enabled after first successful verification
    await admin.save();

    return res.json({
      success: true,
      message: '2FA setup initiated',
      qrCode: qrCode,           // Base64 image data
      secret: secret.base32,    // For manual entry
      otpauth_url: secret.otpauth_url
    });
  } catch (error) {
    console.error('2FA setup error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to setup 2FA' 
    });
  }
}

module.exports = { setup2FA };
```

---

### 3. Verify 2FA OTP Endpoint

**Endpoint:** `POST /api/admin/verify-2fa`

**Description:** Verify the 6-digit OTP code from Google Authenticator

```javascript
// File: routes/admin.js or controllers/adminController.js

const speakeasy = require('speakeasy');

async function verify2FA(req, res) {
  const { username, token } = req.body;

  try {
    // Find admin by username
    const admin = await Admin.findOne({ username });
    
    if (!admin) {
      return res.status(404).json({ 
        success: false, 
        message: 'Admin not found' 
      });
    }

    if (!admin.twofa_secret) {
      return res.status(400).json({ 
        success: false, 
        message: '2FA not setup for this user' 
      });
    }

    // Verify the token
    const verified = speakeasy.totp.verify({
      secret: admin.twofa_secret,
      encoding: 'base32',
      token: token,
      window: 2 // Allow 2 time steps (60 seconds) tolerance
    });

    if (!verified) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid OTP code' 
      });
    }

    // Enable 2FA if this is the first successful verification
    if (!admin.twofa_enabled) {
      admin.twofa_enabled = true;
      await admin.save();
    }

    // Set session or JWT token here
    req.session.admin = admin;

    return res.json({
      success: true,
      message: '2FA verified successfully',
      admin: {
        username: admin.username,
        role: admin.role,
        email: admin.email
      }
    });
  } catch (error) {
    console.error('2FA verification error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Verification failed' 
    });
  }
}

module.exports = { verify2FA };
```

---

### 4. Disable 2FA Endpoint (Optional)

**Endpoint:** `POST /api/admin/disable-2fa`

**Description:** Allow admin to disable 2FA from settings

```javascript
async function disable2FA(req, res) {
  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({ username });
    
    if (!admin) {
      return res.status(404).json({ 
        success: false, 
        message: 'Admin not found' 
      });
    }

    // Verify password before disabling 2FA
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid password' 
      });
    }

    // Disable 2FA
    admin.twofa_enabled = false;
    // Optionally remove secret: admin.twofa_secret = null;
    await admin.save();

    return res.json({
      success: true,
      message: '2FA disabled successfully'
    });
  } catch (error) {
    console.error('Disable 2FA error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to disable 2FA' 
    });
  }
}

module.exports = { disable2FA };
```

---

## 🛣️ Express Routes Setup

```javascript
// File: routes/admin.js

const express = require('express');
const router = express.Router();
const {
  adminLogin,
  setup2FA,
  verify2FA,
  disable2FA
} = require('../controllers/adminController');

// Existing login route (modified to handle 2FA)
router.post('/login', adminLogin);

// New 2FA routes
router.post('/setup-2fa', setup2FA);
router.post('/verify-2fa', verify2FA);
router.post('/disable-2fa', disable2FA);

module.exports = router;
```

---

## 🔒 Security Best Practices

1. **Use HTTPS** - Always use HTTPS in production
2. **Rate Limiting** - Add rate limiting to prevent brute force attacks
3. **Session Management** - Use secure session cookies or JWT tokens
4. **Time Window** - The \`window: 2\` parameter allows 60 seconds tolerance
5. **Backup Codes** - Consider implementing backup codes for account recovery
6. **Audit Logging** - Log all 2FA setup and verification attempts

---

## 📝 Example Express Server Setup

```javascript
// File: server.js or app.js

const express = require('express');
const session = require('express-session');
const cors = require('cors');
const adminRoutes = require('./routes/admin');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000', // Your frontend URL
  credentials: true
}));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Routes
app.use('/api/admin', adminRoutes);

// Start server
const PORT = process.env.PORT || 3542;
app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});
```

---

## 🧪 Testing the Implementation

### Test 2FA Setup:
```bash
curl -X POST http://localhost:3542/api/admin/setup-2fa \\
  -H "Content-Type: application/json" \\
  -d '{"username": "admin"}'
```

### Test 2FA Verification:
```bash
curl -X POST http://localhost:3542/api/admin/verify-2fa \\
  -H "Content-Type: application/json" \\
  -d '{"username": "admin", "token": "123456"}'
```

---

## 📱 Google Authenticator Apps

- **iOS**: [Google Authenticator](https://apps.apple.com/app/google-authenticator/id388497605)
- **Android**: [Google Authenticator](https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2)
- **Alternatives**: Microsoft Authenticator, Authy, 1Password

---

## ✅ Frontend Integration Complete

Your Next.js frontend is now ready with:
- ✅ 2FA Setup Page (\`/auth/setup-2fa\`)
- ✅ OTP Verification Page (\`/auth/verify-2fa\`)
- ✅ Updated Admin Login Flow

Just implement the backend API endpoints above and your 2FA system will be fully functional! 🎉



