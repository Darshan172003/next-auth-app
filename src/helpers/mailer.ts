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
            from: 'darshan@gamil.com',
            to: email,
            subject: emailType === 'VERIFY' ? "VERIFY YOUR EMAIL" : "RESET YOUR PASSWORD",
            html: `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashToken}">here</a> to ${emailType === "VERIFY" ? "verify your email" : "reset your password"}
            or copy and paste the link below in your browser. <br> ${process.env.DOMAIN}/verifyemail?token=${hashToken}
            </p>`,
        }

        const mailReponse = await transport.sendMail(mailOptions)
        return mailReponse
    } catch (error: any) {
        throw new Error(error.message)
    }
}