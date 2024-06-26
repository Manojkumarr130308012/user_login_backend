const nodemailer = require('nodemailer')
require('dotenv').config();


async function sendEmail(userEmail,message){
    const transporter = nodemailer.createTransport({
        service:'gmail',
        auth:{
            user: process.env.AUTH_EMAIL,
            pass: process.env.AUTH_PASSWORD
        }
    });

    console.log("userEmail",userEmail);

    const mailOption= {
        from:process.env.AUTH_EMAIL,
        to:userEmail,
        subject:"Verification Code ",
        html:`<h1>Email Verification</h1>
        <p>Your Verification code is: ${message}</p>`
    }


    try {
        await transporter.sendMail(mailOption);
        console.log("Verification email Sent") 
    } catch (error) {
        console.log("Email sending failed with an error: ",error)
    }
}

module.exports = sendEmail;