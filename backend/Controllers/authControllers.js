const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const ExpressError = require('../utills/ExpressError');
const sendEmail = require('../config/email/email');

module.exports.register = async(req,res)=>{
    const {name, email, password, bio, role} = req.body;

    const hashedPassword = await bcrypt.hash(password , 10);

    if(role === "admin"){
        throw new ExpressError(404, "you have no access to admin");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) throw new ExpressError(400, "Email already registered");

    const newUser = new User({
        name,
        email,
        password: hashedPassword,
        bio,
        role : role || 'user',
    })

    await newUser.save();

    const verificationToken = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" } // expires in 1 day
    );

    newUser.verificationToken = verificationToken;
    await newUser.save();

    const verifyLink = `${process.env.BACKEND_URL}/verify/${verificationToken}`;

    // prepare HTML message
    const message = `
      <h2>Welcome, ${name}!</h2>
      <p>Click below to verify your email:</p>
      <a href="${verifyLink}" target="_blank">Verify My Account</a>
      <p>This link expires in 24 hours.</p>
    `;

    //Send verification email
    await sendEmail(email, "Verify your courseWave account", message);

    return res.status(201).json({
      success: true,
      message: "Verification email sent! Please check your inbox to verify your account.",
    });

}

module.exports.verifyEmail = async(req,res) =>{
        const { token } = req.params;
        if (!token) throw new ExpressError(400, "Verification token missing");

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id);
        if (!user) throw new ExpressError(404, "User not found");

        //check if already verfified
        if (user.isVerified) {
            return res.status(200).json({
            success: true,
            message: "Email already verified. You can log in now.",
            });
        }

        //Mark as verified
        user.isVerified = true;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Email verified successfully!",
            verifiedUser: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified,
            },
        });
}



