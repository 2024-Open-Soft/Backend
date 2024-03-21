const message = require('../utils/message');
const sendingMail = require('../utils/mailer');
const jwt = require('jsonwebtoken');
const prisma = require('../prisma/index');

require('dotenv').config();


const generateOtp = async (req, res) => {
    try {
        if (!req.body || !req.body.credential || !req.body.type) {
            return res.status(400).json({ message: "Please provide a phone number or email" });
        }

        if(req.body.type !== 'phoneNumber' && req.body.type !== 'email') {
            return res.status(400).json({ message: "Please provide a valid type" });
        }

        const otp = Math.floor(100000 + Math.random() * 900000);

        let tokenBody;

        const type = req.body.type;
        if (type === 'phoneNumber') {
            let phone = req.body.credential;

            //send the otp to the user
            message({
                to: phone,
                body: `Your OTP is ${otp}`
            });

            tokenBody = { otp };
        }
        else if (type == 'email') {
            let email = req.body.credential;

            if(!req.body.token) {
                return res.status(400).json({ message: "Please provide a token for the email verification" });
            }

            let token = req.body.token;
            const userId = jwt.verify(token, process.env.JWT_SECRET || 'seroweuhnclkhvasouae').userId;

            //send the otp to the user
            sendingMail({
                from: "no-reply@example.com",
                to: email,
                subject: "OTP",
                text: `Your OTP is ${otp}`
            });

            tokenBody = { otp, userId }
        }

        // use jwt to generate a token
        const token = jwt.sign(tokenBody, process.env.JWT_SECRET || 'seroweuhnclkhvasouae', { expiresIn: '10m' });

        return res.status(200).json({
            message: "OTP sent successfully",
            data: {
                "token": token
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
        if (!req.body || !req.body.otp || !req.body.token) {
            return res.status(400).json({ message: "Please provide an otp and token" });
        }

        if(!req.body.type){
            return res.status(400).json({ message: "Please provide a type for verification" });
        }

        const otp = parseInt(req.body.otp);
        const token = req.body.token;

        // compare the otp using jwt
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'seroweuhnclkhvasouae');

        if (!decoded) {
            return res.status(400).json({ message: "Invalid token" });
        }

        console.log(decoded.otp, otp);

        const isMatch = decoded.otp === otp;

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        if(req.body.type === 'phoneNumber') {
            const user = await prisma.User.create({
                data: {
                    phone: {
                        countryCode: req.body.credential.substring(0, 3),
                        phoneNumber: req.body.credential.substring(3)
                    }
                }
            });

            // get the user id
            const userId = user.id;

            // encrypt the user id using jwt
            const token = jwt.sign({ userId }, process.env.JWT_SECRET || 'seroweuhnclkhvasouae', { expiresIn: '1h' });

            return res.status(200).json({
                message: "OTP verified successfully",
                data: {
                    "token": token
                }
            });
        }
        else if(req.body.type == "email") {
            // find the user from the database by decrypting the token
            const userId = decoded.userId;
            const user = await prisma.user.findUnique({
                where: {
                    id: userId
                }
            });

            if(!user) {
                return res.status(400).json({ message: "Invalid user" });
            }

            // add the email to the user
            const updatedUser = await prisma.User.update({
                where: {
                    id: userId
                },
                data: {
                    email: req.body.credential
                }
            });

            // encrypt the user id using jwt 
            const newToken = jwt.sign({ userId }, process.env.JWT_SECRET || 'seroweuhnclkhvasouae', { expiresIn: '1h' });

            return res.status(200).json({
                message: "OTP verified successfully",
                data: {
                    "token": token
                }
            });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {
    generateOtp,
    verifyOtp
}