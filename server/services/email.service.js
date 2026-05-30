import nodemailer from "nodemailer"
import { ApiError } from "../utils/apiError.js"
import dotenv from "dotenv"

dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS    
    }
})

const sendPasswordResetEmail = async ({ email, resetUrl, name }) => {
    try {
        await transporter.sendMail({
            from: `"Clevora" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Reset your Clevora password",
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto;">
          <h2 style="color: #3b82f6;">Clevora — Password Reset</h2>
          <p>Hi ${name},</p>
          <p>You requested to reset your password. Click the button below:</p>
          <a href="${resetUrl}" 
             style="display:inline-block; padding: 12px 24px; background: #3b82f6; 
                    color: white; border-radius: 8px; text-decoration: none; margin: 16px 0;">
            Reset Password
          </a>
          <p style="color: #888; font-size: 13px;">
            This link expires in 15 minutes. If you didn't request this, ignore this email.
          </p>
        </div>
      `
        })
    } catch (error) {
        throw new ApiError(500, `Failed to send email: ${error.message}`)
    }
}

export { sendPasswordResetEmail }