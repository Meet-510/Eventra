const OTP = require('../models/OTP');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { sendOTPEmail, sendPasswordResetEmail } = require('../utils/email');
const jwt = require('jsonwebtoken');

//Register user

const generatetoken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '7d'
    });
};

exports.registerUser = async (req,res) => {
    const {name, email, password} = req.body;

    let userExists = await User.findOne({email});
    if(userExists){
        return res.status(400).json({error:'User already exists'});
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    try{
        const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: 'user',
    isVerified: false
});
        // await user.save();
        // res.status(201).json({message:"user registered successfully"});

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        console.log(`OTP for ${email}: ${otp}`);

        await OTP.create({email,otp,action:'account_verification'});

        await sendOTPEmail(email, otp, "account_verification");

        res.status(201).json({
            message:"User registered successfully. Please check your email for OTP to verify your account.",
            email: user.email
        });

      



    }catch(error){
        res.status(400).json({error:error.message});
    }
};

//login user
exports.loginUser = async (req, res) => {
    const {email, password} = req.body;

    let user = await User.findOne({email});
    if(!user){
        return res.status(400).json({error:"Invalid credentials"});

    }
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        return res.status(400).json({error:'Invalid credentials'});
    }
    if(!user.isVerified && user.role === 'user'){
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        await OTP.deleteMany({email,otp,action:'account_verification'});
        await OTP.create({email,otp,action:"account_verification"});
        await sendOTPEmail(email,otp,'account_verification');
        return res.status(400).json({
            error:'Account not verified. A new OTP has been sent to your email.'
        });
    }

    res.json({
        message: "Login Successful",
        _id : user._id,
        name: user.name,
        email:user.email,
        role:user.role,
        token: generatetoken(user._id, user.role),


    });
}

//forgot password — email a one-time reset link
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    // Always respond the same way so attackers can't probe which emails exist
    const genericMessage = 'If an account with that email exists, a password reset link has been sent.';

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ message: genericMessage });
        }

        // Signing with JWT_SECRET + current password hash makes the link
        // single-use: once the password changes, the signature no longer verifies.
        const token = jwt.sign(
            { id: user._id, action: 'password_reset' },
            process.env.JWT_SECRET + user.password,
            { expiresIn: '15m' }
        );

        const baseUrl = process.env.CLIENT_URL
            || `${req.headers['x-forwarded-proto'] || req.protocol}://${req.get('host')}`;
        const resetLink = `${baseUrl}/reset-password/${user._id}/${token}`;

        await sendPasswordResetEmail(user.email, user.name, resetLink);

        res.json({ message: genericMessage });
    } catch (error) {
        res.status(500).json({ error: 'Could not send reset email. Please try again later.' });
    }
};

//reset password — verify the link token and set the new password
exports.resetPassword = async (req, res) => {
    const { id, token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(400).json({ error: 'Invalid or expired reset link.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET + user.password);
        if (decoded.action !== 'password_reset' || decoded.id !== user._id.toString()) {
            return res.status(400).json({ error: 'Invalid or expired reset link.' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();

        res.json({ message: 'Password reset successfully. You can now log in with your new password.' });
    } catch (error) {
        res.status(400).json({ error: 'Invalid or expired reset link.' });
    }
};

    //verify OTP
    exports.verifyOtp = async (req,res) =>{
        const {email, otp}= req.body;
        const otpRecord = await OTP.findOne({email,otp, action:'account_verification'});

        if(! otpRecord){
            return res.status(400).json({error:"Invalid or expired OTP"});

        }
        const user = await User.findOneAndUpdate({email}, {isVerified: true});
        await OTP.deleteMany({email, action:'account_verification'});
        res.json({
            message: "Account verified successfully. You can now log in.",
            _id: user._id,
            name: user.name,
            email:user.email,
            role:user.role,
            token:generatetoken(user._id, user.role)
        });

        
    
};