require('dotenv').config();
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

transporter.sendMail({
  from: process.env.SMTP_FROM || process.env.SMTP_USER,
  to: 'mateunico01@gmail.com',
  subject: 'Test attachment',
  html: '<img src="cid:logoMateUnico"/> Test body',
  attachments: [{
    filename: 'logo-mate.png',
    path: 'c:/MATE-UNICO/backend/public/logo-mate.png',
    cid: 'logoMateUnico'
  }]
}).then(console.log).catch(console.error);
