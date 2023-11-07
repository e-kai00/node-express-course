const nodemailer = require('nodemailer');


const sendEmail = async (req, res) => {
    let testAccount = await nodemailer.createTestAccount();

    // testing; for production store in .env
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'test@ethereal.email',
            pass: 'test'
        }
    });

    const info = await transporter.sendMail({
        from: '"Katti" <katti@example.com>', 
        to: "bar@example.com",
        subject: "Hello ✔", 
        html: "<h2>Sending Emails with Node.js</h2>", 
      });

    res.json(info)
};


module.exports = sendEmail;