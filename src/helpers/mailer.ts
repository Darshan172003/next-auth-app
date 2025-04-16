import nodemailer from 'nodemailer'

export const sendEmail = async ({ email, emailType, userId }:any) => {
    try {
        // ToDo Config mail for usage


        const transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false,
            auth: {
                user: "maddison53@ethereal.email",
                pass: "jn7jnAPss4f63QBp6D",
            },
        });

        const mailOptions = {
            from: 'darshan@gamil.com',
            to: email,
            subject: emailType === 'VERIFY' ? "VERIFY YOUR EMAIL" : "RESET YOUR PASSWORD",
            html: "<b>Hello world?</b>",
        }

        const mailReponse = await transporter.sendMail(mailOptions)
        return mailReponse
    } catch (error:any) {
        throw new Error(error.message)
    }
}