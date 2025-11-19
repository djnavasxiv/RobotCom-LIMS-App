import nodemailer from 'nodemailer';
import path from 'path';
import fs from 'fs';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import 'dotenv/config';

interface EmailPayload {
  to: string;
  patientName: string;
  patientEmail: string;
  sampleId: string;
  results: Array<{
    testName: string;
    value: string;
    isNormal: boolean;
  }>;
  htmlContent?: string;
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    this.initializeTransporter();
  }

  private initializeTransporter(): void {
    const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
    const smtpPort = parseInt(process.env.SMTP_PORT || '587');
    const smtpUser = process.env.SMTP_USER || process.env.SENDER_EMAIL;
    const smtpPassword = process.env.SMTP_PASSWORD;

    if (!smtpUser || !smtpPassword) {
      console.warn('⚠️  Email service: SMTP credentials not configured');
      console.warn('   Set SMTP_USER and SMTP_PASSWORD in .env file');
      return;
    }

    this.transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPassword,
      },
    });
  }

  /**
   * Generate a PDF from HTML content
   */
  private async generatePDFFromHTML(htmlContent: string, filename: string): Promise<Buffer> {
    try {
      // Create a temporary canvas from HTML
      const canvas = await html2canvas(document.body, {
        backgroundColor: '#ffffff',
        logging: false,
      });

      // Convert canvas to PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      return Buffer.from(pdf.output('arraybuffer'));
    } catch (error) {
      console.error('Error generating PDF from HTML:', error);
      throw error;
    }
  }

  /**
   * Generate a simple PDF with test results
   */
  private generateResultsPDF(payload: EmailPayload): Buffer {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let yPosition = 20;

    // Header
    pdf.setFontSize(20);
    pdf.text('RobotComLab LIMS', pageWidth / 2, yPosition, { align: 'center' });

    yPosition += 15;
    pdf.setFontSize(12);
    pdf.text('Test Results Report', pageWidth / 2, yPosition, { align: 'center' });

    // Patient Info
    yPosition += 15;
    pdf.setFontSize(11);
    pdf.text(`Patient Name: ${payload.patientName}`, 20, yPosition);

    yPosition += 10;
    pdf.text(`Email: ${payload.patientEmail}`, 20, yPosition);

    yPosition += 10;
    pdf.text(`Sample ID: ${payload.sampleId}`, 20, yPosition);

    yPosition += 10;
    pdf.text(`Date: ${new Date().toLocaleDateString()}`, 20, yPosition);

    // Results Table
    yPosition += 20;
    pdf.setFontSize(12);
    pdf.text('Test Results', 20, yPosition);

    yPosition += 10;
    pdf.setFontSize(10);

    // Table headers
    const colWidth = 50;
    pdf.text('Test Name', 20, yPosition);
    pdf.text('Value', 20 + colWidth, yPosition);
    pdf.text('Status', 20 + colWidth * 2, yPosition);

    yPosition += 7;
    pdf.setDrawColor(200);
    pdf.line(20, yPosition, pageWidth - 20, yPosition);

    yPosition += 5;

    // Table rows
    payload.results.forEach((result) => {
      if (yPosition > pageHeight - 30) {
        pdf.addPage();
        yPosition = 20;
      }

      const status = result.isNormal ? '✓ Normal' : '⚠ Abnormal';
      pdf.text(result.testName, 20, yPosition);
      pdf.text(result.value, 20 + colWidth, yPosition);
      pdf.text(status, 20 + colWidth * 2, yPosition);
      yPosition += 7;
    });

    // Footer
    yPosition = pageHeight - 20;
    pdf.setFontSize(8);
    pdf.setTextColor(128);
    pdf.text('This is an automated report. For questions, contact RobotComLab support.', 20, yPosition);

    return Buffer.from(pdf.output('arraybuffer'));
  }

  /**
   * Send results email with PDF attachment
   */
  async sendResultsEmail(payload: EmailPayload): Promise<boolean> {
    if (!this.transporter) {
      console.error('❌ Email service not configured. Cannot send email.');
      return false;
    }

    try {
      // Generate PDF
      const pdfBuffer = this.generateResultsPDF(payload);

      // Prepare email
      const mailOptions = {
        from: `${process.env.SENDER_NAME || 'RobotComLab LIMS'} <${process.env.SENDER_EMAIL}>`,
        to: payload.patientEmail,
        subject: `Your Lab Results - Sample ${payload.sampleId}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px;">
              <h2 style="color: #333;">Hello ${payload.patientName},</h2>
              
              <p style="color: #666; line-height: 1.6;">
                Your lab test results are now ready! Your sample <strong>${payload.sampleId}</strong> 
                has been processed and analyzed.
              </p>

              <div style="background-color: #fff; padding: 15px; border-left: 4px solid #007bff; margin: 20px 0;">
                <p style="margin: 0; color: #333;">
                  <strong>✓ Results Summary:</strong><br>
                  Total Tests: ${payload.results.length}<br>
                  Normal Results: ${payload.results.filter(r => r.isNormal).length}<br>
                  Abnormal Results: ${payload.results.filter(r => !r.isNormal).length}
                </p>
              </div>

              <p style="color: #666; line-height: 1.6;">
                Your complete results are attached as a PDF document. Please review carefully and 
                consult with your healthcare provider if you have any questions about your results.
              </p>

              <p style="color: #999; font-size: 12px; margin-top: 30px;">
                This is an automated message from RobotComLab LIMS.<br>
                Please do not reply to this email. Contact our support team for assistance.
              </p>
            </div>
          </div>
        `,
        attachments: [
          {
            filename: `Results_${payload.sampleId}.pdf`,
            content: pdfBuffer,
            contentType: 'application/pdf',
          },
        ],
      };

      // Send email
      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email sent successfully:', info.messageId);
      return true;
    } catch (error) {
      console.error('❌ Error sending email:', error);
      return false;
    }
  }

  /**
   * Send payment confirmation email
   */
  async sendPaymentConfirmationEmail(
    patientEmail: string,
    patientName: string,
    invoiceNumber: string,
    amount: number
  ): Promise<boolean> {
    if (!this.transporter) {
      console.error('❌ Email service not configured. Cannot send email.');
      return false;
    }

    try {
      const mailOptions = {
        from: `${process.env.SENDER_NAME || 'RobotComLab LIMS'} <${process.env.SENDER_EMAIL}>`,
        to: patientEmail,
        subject: `Payment Confirmation - Invoice ${invoiceNumber}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px;">
              <h2 style="color: #333;">Payment Received</h2>
              
              <p style="color: #666; line-height: 1.6;">
                Dear ${patientName},
              </p>

              <p style="color: #666; line-height: 1.6;">
                Thank you for your payment! We have received your payment and your lab tests are now being processed.
              </p>

              <div style="background-color: #fff; padding: 15px; border-left: 4px solid #28a745; margin: 20px 0;">
                <p style="margin: 0; color: #333;">
                  <strong>✓ Invoice Number:</strong> ${invoiceNumber}<br>
                  <strong>✓ Amount Paid:</strong> $${amount.toFixed(2)}<br>
                  <strong>✓ Date:</strong> ${new Date().toLocaleDateString()}
                </p>
              </div>

              <p style="color: #666; line-height: 1.6;">
                Your results will be sent to this email address as soon as they are ready. 
                Typically, results are available within 24-48 hours.
              </p>

              <p style="color: #999; font-size: 12px; margin-top: 30px;">
                This is an automated message from RobotComLab LIMS.
              </p>
            </div>
          </div>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      console.log('✅ Payment confirmation email sent to:', patientEmail);
      return true;
    } catch (error) {
      console.error('❌ Error sending payment confirmation email:', error);
      return false;
    }
  }

  /**
   * Test the email connection
   */
  async testConnection(): Promise<boolean> {
    if (!this.transporter) {
      console.error('❌ Email service not configured');
      return false;
    }

    try {
      await this.transporter.verify();
      console.log('✅ Email service connected successfully');
      return true;
    } catch (error) {
      console.error('❌ Email service connection failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const emailService = new EmailService();
export default EmailService;
