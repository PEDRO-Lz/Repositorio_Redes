import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
})

export const sendEmail = async (to, subject, text) => {
  console.log('Chamando sendEmail para:', to, subject);
  try {
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to,
      subject,
      text,
    });
    console.log('Email enviado para:', to);
  } catch (err) {
    console.error('Erro ao enviar email:', err);
    throw err;
  }
}