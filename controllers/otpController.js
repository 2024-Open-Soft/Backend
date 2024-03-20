const generateOtp = async (req, res) => {
    try {
        console.log(req.body);

        if (!req.body || !req.body.credential || !req.body.type) {
            return res.status(400).json({ message: "Please provide a phone number or email" });
        }

        let otp = Math.floor(100000 + Math.random() * 900000);

        const type = req.body.type;
        if (type === 'phoneNumber') {
            let phone = req.body.credential;

            const message = require('../utils/message');

            //send the otp to the user
            message({
                to: phone,
                body: `Your OTP is ${otp}`
            });
        }
        else if (type == 'email') {
            let email = req.body.credential;
            const sendingMail = require('../utils/mailer');

            //send the otp to the user
            sendingMail({
                from: "no-reply@example.com",
                to: email,
                subject: "OTP",
                text: `Your OTP is ${otp}`
            });
        }
        else {
            return res.status(400).json({ message: "Please provide a type for verification" });
        }

        const bcrypt = require('bcryptjs');

        //hash the otp
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(`${otp}`, salt);

        console.log(hash, otp);

        return res.status(200).json({
            message: "OTP sent successfully",
            data: {
                "token": hash
            }
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

const verifyOtp = async (req, res) => {
    try {
        console.log(req.body);

        if (!req.body || !req.body.otp || !req.body.token) {
            return res.status(400).json({ message: "Please provide an otp and token" });
        }

        if(!req.body.type){
            return res.status(400).json({ message: "Please provide a type for verification" });
        }

        const otp = req.body.otp;
        const token = req.body.token;

        const bcrypt = require('bcryptjs');

        //compare the otp
        const isMatch = await bcrypt.compare(`${otp}`, token);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        const { PrismaClient } = require('@prisma/client');
        const prisma = new PrismaClient();

        // save the user to the database
        // const user = await prisma.user.create({
        //     data: {
        //         email: req.body.email,
        //         phone: req.body.phone
        //     }
        // });

        if(req.body.type === 'phoneNumber') {
            const user = await prisma.user.create({
                data: {
                    phone: req.body.credential
                }
            });

            // get the user id
            const userId = user.id;

            // encrypt the user id
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(`${userId}`, salt);

            return res.status(200).json({
                message: "OTP verified successfully",
                data: {
                    "token": hash
                }
            });
        }

        else if(req.body.type == "email") {
            // find the user from the database by decrypting the token
            const userId = await bcrypt.compare(`${token}`, token);

            const user = await prisma.user.findUnique({
                where: {
                    id: userId
                }
            });

            if(!user) {
                return res.status(400).json({ message: "Invalid user" });
            }

            
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }

}

module.exports = {
    generateOtp
}