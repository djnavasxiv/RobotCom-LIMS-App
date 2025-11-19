# Email System Setup Guide

## Overview

The RobotComLab LIMS now includes an automated email system that sends:
- ✅ Test results as PDF attachments after payment
- ✅ Payment confirmation emails
- ✅ Professional email templates

## Setup Instructions

### Step 1: Generate Gmail App Password

Since we're using Gmail, we need to generate an app-specific password:

1. Go to: https://myaccount.google.com/apppasswords
2. Sign in with djnavasv14@gmail.com (or your Gmail account)
3. Select **Mail** and your device type (Windows, Mac, or Linux)
4. Google will generate a 16-character password
5. Copy this password (you'll need it in Step 2)

### Step 2: Create .env File

Create a `.env` file in `/packages/robotcom-lims/` with the following content:

```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=djnavasv14@gmail.com
SMTP_PASSWORD=paste_your_16_char_password_here
SENDER_EMAIL=djnavasv14@gmail.com
SENDER_NAME=RobotComLab LIMS
```

**Important:**
- Replace `paste_your_16_char_password_here` with the password you generated
- Never commit the `.env` file to version control
- The `.env.example` file is safe to commit (without real credentials)

### Step 3: Verify Installation

The required packages have already been installed:
- `nodemailer` - Email sending
- `dotenv` - Environment variables
- `jspdf` - PDF generation
- `html2canvas` - HTML to canvas conversion (for custom PDFs)

### Step 4: Test the Connection

From the app, you can test the email connection:

```typescript
import { useEmail } from '@/presentation/hooks/useEmail';

function MyComponent() {
  const { testConnection } = useEmail();

  const handleTest = async () => {
    const result = await testConnection();
    if (result.success) {
      console.log('✅ Email service is working!');
    } else {
      console.error('❌ Email service error:', result.error);
    }
  };

  return <button onClick={handleTest}>Test Email</button>;
}
```

## Usage Examples

### Send Test Results Email

```typescript
import { useEmail } from '@/presentation/hooks/useEmail';

function ResultsPage() {
  const { sendResults } = useEmail();

  const handleSendResults = async () => {
    const result = await sendResults({
      patientName: 'John Doe',
      patientEmail: 'john@example.com',
      sampleId: 'SAM-001-001',
      results: [
        { testName: 'Hemoglobin', value: '14.5 g/dL', isNormal: true },
        { testName: 'Glucose', value: '125 mg/dL', isNormal: false },
        // ... more results
      ],
    });

    if (result.success) {
      console.log('✅ Results email sent!');
    } else {
      console.error('❌ Failed to send email:', result.error);
    }
  };

  return <button onClick={handleSendResults}>Send Results</button>;
}
```

### Send Payment Confirmation Email

```typescript
import { useEmail } from '@/presentation/hooks/useEmail';

function PaymentPage() {
  const { sendPaymentConfirmation } = useEmail();

  const handlePayment = async () => {
    const result = await sendPaymentConfirmation(
      'john@example.com',           // patientEmail
      'John Doe',                   // patientName
      'INV-202311-001',            // invoiceNumber
      150.00                        // amount
    );

    if (result.success) {
      console.log('✅ Confirmation email sent!');
    }
  };

  return <button onClick={handlePayment}>Confirm Payment</button>;
}
```

## Email Templates

### Results Email Template

The system automatically generates a professional email with:
- Patient name and greeting
- Sample ID and date
- Summary of results (total tests, normal/abnormal count)
- PDF attachment with detailed results
- Professional footer

### Payment Confirmation Email Template

Includes:
- Thank you message
- Invoice number and amount
- Payment date
- Expected results timeline
- Professional branding

## PDF Generation

PDFs are generated automatically with:
- ✅ Professional header with lab name
- ✅ Patient information
- ✅ Test results in table format
- ✅ Normal/Abnormal status indicators
- ✅ Generated date

## Troubleshooting

### Email Not Sending

**Problem:** "Email service not configured"
```
❌ Email service: SMTP credentials not configured
   Set SMTP_USER and SMTP_PASSWORD in .env file
```

**Solution:**
1. Check that `.env` file exists in `/packages/robotcom-lims/`
2. Verify SMTP_USER and SMTP_PASSWORD are set
3. Make sure the Gmail app password is correct (16 characters)

### "Failed to send GpuControl.CreateCommandBuffer"

This is a display-related error in WSL2, not an email error. The email will still be sent.

### Gmail Says "Invalid Credentials"

**Solution:**
1. Go to https://myaccount.google.com/apppasswords again
2. Generate a NEW app password
3. Update the SMTP_PASSWORD in `.env` with the new password

### Email Taking Too Long

First email may take 5-10 seconds to send as it's initializing the SMTP connection.
Subsequent emails will be faster.

## For Production Deployment

### Use a Service Email Account

Instead of a personal Gmail account, create a dedicated email:
- `noreply@robotcomlims.com` or similar
- Set up in your professional email service
- More reliable than personal Gmail accounts

### Update Environment Variables

In production, use environment variables from your hosting platform:
- AWS: Parameter Store or Secrets Manager
- Heroku: Config Vars
- Docker: Environment file
- Never hardcode credentials

### Enable Less Secure Apps (Optional)

If using regular Gmail (not app password):
1. Go to https://myaccount.google.com/lesssecureapps
2. Enable "Allow less secure apps"
3. Not recommended - use app password instead

## Security Notes

⚠️ **Important:**
- Never commit `.env` file to git
- The `.env.example` is for documentation only
- Use `.gitignore` to prevent accidents:
  ```
  .env
  .env.local
  .env.*.local
  ```

✅ **Best Practices:**
- Use app passwords for Gmail, not main password
- Rotate credentials periodically
- Use different emails for dev/production
- Monitor email logs for failures

## Email Service Architecture

### File Structure
```
src/main/services/
  └── EmailService.ts        # Core email service
src/renderer/src/presentation/hooks/
  └── useEmail.ts            # React hook for UI components
src/main/index.ts            # IPC handlers
```

### Process Flow
```
React Component
    ↓
useEmail hook
    ↓
IPC: electron.ipcRenderer.invoke()
    ↓
Main Process IPC Handler
    ↓
EmailService.sendResultsEmail()
    ↓
Nodemailer SMTP
    ↓
Gmail SMTP Server
    ↓
Patient Email
```

## API Reference

### useEmail Hook

```typescript
const { sendResults, sendPaymentConfirmation, testConnection } = useEmail();
```

#### sendResults(payload)
Sends test results with PDF attachment

**Parameters:**
- `patientName` (string) - Patient's full name
- `patientEmail` (string) - Recipient email
- `sampleId` (string) - Sample identifier
- `results` (array) - Test results with name, value, isNormal flag

**Returns:** Promise<{success: boolean, error?: string}>

#### sendPaymentConfirmation(email, name, invoice, amount)
Sends payment confirmation

**Parameters:**
- `email` (string) - Patient email
- `name` (string) - Patient name
- `invoice` (string) - Invoice number
- `amount` (number) - Amount paid

**Returns:** Promise<{success: boolean, error?: string}>

#### testConnection()
Tests the email service connection

**Returns:** Promise<{success: boolean, error?: string}>

## Next Steps

1. ✅ Generate Gmail app password
2. ✅ Create `.env` file with credentials
3. ✅ Test the connection with `testConnection()`
4. ✅ Integrate email sending into payment workflows
5. ✅ Add email sending to result entry pages

---

**Last Updated:** November 19, 2025  
**Status:** ✅ Ready for Use  
**Support Email:** djnavasv14@gmail.com (for now)
