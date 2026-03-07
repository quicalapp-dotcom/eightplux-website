const nodemailer = require('nodemailer');
require('dotenv').config({ path: '.env.local' });

async function testEmail() {
    console.log('Testing SMTP configuration...');
    console.log('SMTP Host:', process.env.SMTP_HOST);
    console.log('SMTP Port:', process.env.SMTP_PORT);
    console.log('SMTP Secure:', process.env.SMTP_SECURE);
    console.log('SMTP User:', process.env.SMTP_USER);
    console.log('SMTP From Email:', process.env.SMTP_FROM_EMAIL);

    // Create transporter
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
        },
        pool: true,
        maxConnections: 1,
        connectionTimeout: 60000, // 1 minute
        greetingTimeout: 30000,
        socketTimeout: 60000,
    });

    try {
        // Verify connection
        console.log('\nVerifying SMTP connection...');
        const verifyResult = await transporter.verify();
        console.log('Connection verified:', verifyResult);

        // Test email
        console.log('\nSending test email...');
        const info = await transporter.sendMail({
            from: `"Test" <${process.env.SMTP_FROM_EMAIL}>`,
            to: process.env.SMTP_USER, // Send to yourself
            subject: 'Test Email from Eightplux',
            text: 'This is a test email from Eightplux. If you received this, your SMTP configuration is working!',
            html: '<p>This is a test email from Eightplux. If you received this, your SMTP configuration is working!</p>',
        });

        console.log('Email sent successfully!');
        console.log('Message ID:', info.messageId);
        console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    } catch (error) {
        console.error('\nError sending email:', error);
        if (error.code) {
            console.error('Error code:', error.code);
        }
        if (error.response) {
            console.error('SMTP response:', error.response);
        }
        if (error.stack) {
            console.error('Stack trace:', error.stack);
        }
    }
}

testEmail();
