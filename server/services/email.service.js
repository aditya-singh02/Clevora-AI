import nodemailer from "nodemailer"
import { ApiError } from "../utils/ApiError.js"
import dotenv from "dotenv"
import dns from "dns"

dotenv.config();

// Force Node to prefer IPv4 addresses first
dns.setDefaultResultOrder('ipv4first');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

console.log("Transporter options:", transporter.options);

const sendPasswordResetEmail = async ({ email, resetUrl, name }) => {
    try {
        await transporter.sendMail({
            from: `"Clevora" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Reset your Clevora password",
            html: `
       <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; background: #0a0e1a; padding: 32px; border-radius: 16px;">

          <table border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
            <tr>
              <td style="width: 36px; height: 36px; background: #6366f1; background: linear-gradient(135deg,#6366f1,#8b5cf6); border-radius: 10px; text-align: center; vertical-align: middle; font-weight: 800; font-size: 16px; color: white;">
                C
              </td>
              <td style="padding-left: 10px; font-size: 18px; font-weight: 700; color: white; vertical-align: middle;">
                Clevora
              </td>
            </tr>
          </table>

          <h2 style="color:white; font-size:22px; margin-top:0; margin-bottom:8px;">Reset your password</h2>
          <p style="color:#94a3b8; margin-bottom:24px; font-size:14px; line-height:1.5;">Hi ${name}, you requested to reset your password. Click the button below to set a new one:</p>
          
          <table border="0" cellpadding="0" cellspacing="0" style="width: 100%; text-align: center; margin-bottom: 24px;">
            <tr>
              <td>
                <a href="${resetUrl}" 
                   style="display: inline-block; padding: 14px 28px; background: #6366f1; background: linear-gradient(135deg,#6366f1,#8b5cf6); color: white; font-weight: 600; font-size: 15px; border-radius: 12px; text-decoration: none; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);">
                  Reset Password →
                </a>
              </td>
            </tr>
          </table>
          
          <table border="0" cellpadding="0" cellspacing="0" style="width: 100%; background: #1e293b; border: 1px solid #334155; border-radius: 10px; margin-bottom: 24px;">
            <tr>
              <td style="padding: 12px 16px; font-size: 11px; color: #64748b; word-break: break-all; line-height: 1.4; text-align: left;">
                If the button above doesn't work, copy and paste this link into your browser:<br/>
                <a href="${resetUrl}" style="color: #8b5cf6; text-decoration: underline;">${resetUrl}</a>
              </td>
            </tr>
          </table>

          <p style="color:#64748b; font-size:13px; margin:0;">Expires in <strong style="color:#94a3b8;">15 minutes</strong>. If you didn't request this, ignore this email safely.</p>

          
        </div>
      `
        })
    } catch (error) {
        throw new ApiError(500, `Failed to send email: ${error.message}`)
    }
}

// OTP email for account verification during registration
const sendOTPEmail = async ({ email, otp, name }) => {
    try {
        const uniqueId = new Date().getTime().toString();
        await transporter.sendMail({
            from: `"Clevora" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Verify your Clevora account",
            html: `
<div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; background: #0a0e1a; padding: 32px; border-radius: 16px;">

          <table border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
            <tr>
              <td style="width: 36px; height: 36px; background: #6366f1; background: linear-gradient(135deg,#6366f1,#8b5cf6); border-radius: 10px; text-align: center; vertical-align: middle; font-weight: 800; font-size: 16px; color: white;">
                C
              </td>
              <td style="padding-left: 10px; font-size: 18px; font-weight: 700; color: white; vertical-align: middle;">
                Clevora
              </td>
            </tr>
          </table>

          <h2 style="color:white; font-size:22px; margin-top:0; margin-bottom:8px;">Verify your account</h2>
          <p style="color:#94a3b8; margin-bottom:24px; font-size:14px; line-height:1.5;">Hi ${name}, enter this OTP to complete your registration:</p>
          
          <table border="0" cellpadding="0" cellspacing="0" style="width: 100%; background: #1e293b; border: 1px solid #334155; border-radius: 12px; margin-bottom: 24px;">
            <tr>
              <td style="padding: 24px 0; text-align: center; vertical-align: middle;">
                <span style="font-size: 40px; font-weight: 800; letter-spacing: 12px; color: white; padding-left: 12px; display: inline-block; line-height: 1;">${otp}</span>
              </td>
            </tr>
          </table>
          
          <p style="color:#64748b; font-size:13px; margin:0;">Expires in <strong style="color:#94a3b8;">10 minutes</strong>. If you didn't request this, ignore this email.</p>
            <div style="display: none !important; max-height: 0px; overflow: hidden; opacity: 0; font-size: 1px; color: #0a0e1a;">
            ref_id_${uniqueId}
          </div>
          </div>
      
      `
        })
    } catch (error) {
        throw new ApiError(500, `Failed to send OTP email: ${error.message}`)
    }
}

export { sendPasswordResetEmail, sendOTPEmail }