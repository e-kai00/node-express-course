const sendEmail = require('./sendEmail');


const sendVerificationEmail = async ({name, email, verificationToken, origin}) => {

    // construct link; (comes from frontend)
    const verifyEmail = `${origin}/user/verify-email?token=${verificationToken}&email=${email}`
    const message = `<p>Please confirm your email by clicking the link: <a href="${verifyEmail}">Verify email</a></p>`

    return sendEmail({
        to: email,
        subject: 'Email Confirmation',
        html: `<h4>Hello ${name}</h4>
        ${message}`
    });
};


module.exports = sendVerificationEmail;