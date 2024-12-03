const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: 'anastasiia.klishch.21@pnu.edu.ua',
        pass: 'azhc ktyw jlag ckuc',
    },
});

module.exports = transporter;