import sgMail from "@sendgrid/mail";
import { VercelRequest, VercelResponse } from '@vercel/node';
import Cors from 'cors';

const cors = Cors({
    methods: ['GET', 'HEAD', 'POST'],
});

function runMiddleware(req: VercelRequest, res: VercelResponse, fn: any) {
    return new Promise((resolve, reject) => {
        fn(req, res, (result: any) => {
            if (result instanceof Error) {
                return reject(result);
            }
            return resolve(result);
        });
    });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Run the middleware
    await runMiddleware(req, res, cors);

    if (req.method !== 'POST') {
        res.status(405).json({message: 'Method not allowed'})
        return
    }

    try {
        sgMail.setApiKey("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")
        const { firstName, lastName, email, message } = req.body;

        const msg = {
            to: email, // recipient's email
            from: 'contact@gaxios.com', // your verified sender
            subject: 'New Message from Contact Form',
            text: `Message from ${firstName} ${lastName}: ${message}`,
            html: `<strong>Message from ${firstName} ${lastName}:</strong> <p>${message}</p>`,
        };

        sgMail
            .send(msg)
            .then(() => {
                console.log('Email sent!');
                res.status(200).json({ message: 'Email Sent Successfully!' });
            })
            .catch((error: any) => {
                console.error('Error sending email:', error);
                res.status(500).json({ message: 'Error occurred when sending the email!' });
            });
    } catch (ex){
        console.log(ex)
        res.status(500).json({ message: 'Error occurred when sending the email!' });
    }
}
