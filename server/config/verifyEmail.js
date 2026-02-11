import nodemailer from 'nodemailer';
import { configDotenv } from 'dotenv';
configDotenv()


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS
    }
})
export const sendOTP = async (email, code) => {
    try {
        return await transporter.sendMail({
            from: `Little Lemoen: ${process.env.EMAIL}`,
            to: email,
            subject: "Your Verification Code",
            html: `
             <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
               <h2>Email Verification</h2>
               <p>Thank you for registering! Please use the following verification code to complete your registration:</p>
               <div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
                 <h1 style="color: #333; letter-spacing: 10px;">${code}</h1>
               </div>
               <p>This code will expire in 10 minutes.</p>
               <p>If you didn't request this, please ignore this email.</p>
             </div>
    `
        })
    } catch (error) {
        console.log(error.message)
    }
}