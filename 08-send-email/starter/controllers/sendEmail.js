const nodemailer = require('nodemailer');


const sendEmail = async (req, res) => {
    let testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'boris.thompson@ethereal.email',
            pass: 'yTRE1kyPVebCkyuB9n'
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