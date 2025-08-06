import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendWelcomeEmail = async (to: string, subject: string, text: string, html?: string) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to,
            subject,
            text,
            html,
        });
        console.log('Email sent successfully');
    } catch (error) {
        console.log('Error sending e-mail:', error)
    }
}

export const sendRecoveryPasswordEmail = async (to: string, subject: string, text: string, html?: string) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to,
            subject,
            text,
            html,
        });
        console.log('Email sent successfully');
    } catch (error) {
        console.log('Error sending e-mail:', error)
    }
}