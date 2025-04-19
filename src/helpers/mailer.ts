import user from '@/models/user.model';
import nodemailer from 'nodemailer'
import bcrypt from 'bcryptjs';

export const sendEmail = async ({ email, emailType, userId }: any) => {
    try {

        const hashToken = await bcrypt.hash(userId.toString(), 10)
        if (emailType === 'VERIFY') {
            await user.findByIdAndUpdate(userId,
                { verifyToken: hashToken },
                { verifTokenExpiry: Date.now() + 3600000 } // 1 hour
            )
        } else if (emailType === 'RESET') {
            await user.findByIdAndUpdate(userId,
                { forgotPasswordToken: hashToken },
                { forgotPasswordTokenExpiry: Date.now() + 3600000 } // 1 hour
            )
        }


        // Looking to send emails in production? Check out our Email API/SMTP product!
        var transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: process.env.MAILTRAP_USERID,
                pass: process.env.MAILTRAP_PASSWORD,
            }
        });

        const mailOptions = {
            from: 'darshan@gmail.com',
            to: email,
            subject: emailType === 'VERIFY' ? "Verify Your Email Address" : "Reset Your Password",
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                    <h2 style="color: #4CAF50; text-align: center;">${emailType === 'VERIFY' ? "Verify Your Email Address" : "Reset Your Password"}</h2>
                    <p>Hi,</p>
                    <p>${emailType === 'VERIFY' 
                        ? "Thank you for signing up! Please verify your email address by clicking the button below." 
                        : "We received a request to reset your password. Click the button below to proceed."}</p>
                    <div style="text-align: center; margin: 20px 0;">
                        <a href="${process.env.DOMAIN}/verifyemail?token=${hashToken}" 
                           style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 16px;">
                           ${emailType === 'VERIFY' ? "Verify Email" : "Reset Password"}
                        </a>
                    </div>
                    <p>If the button above doesn't work, copy and paste the following link into your browser:</p>
                    <p style="word-break: break-word; color: #555;">${process.env.DOMAIN}/verifyemail?token=${hashToken}</p>
                    <p>If you did not request this, please ignore this email.</p>
                    <p>Thanks,<br>The Team</p>
                </div>
            `,
        };

        const mailReponse = await transport.sendMail(mailOptions)
        return mailReponse
    } catch (error: any) {
        throw new Error(error.message)
    }
}