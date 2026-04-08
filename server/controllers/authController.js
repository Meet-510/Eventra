const OTP = require('../models/OTP');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { sendOTPEmail } = require('../utils/email');
const jwt = require('jsonwebtoken');

//Register user

const generatetoken = (id, role)=>{
    return jwt.sign({id,role}),
    process.env.JWT_SECRET,
    {expiresIn:'7d'}
}

exports.registerUser = async (req,res) => {
    const {name, email, password} = req.body;

    let userExists = await User.findOne({email});
    if(userExists){
        return res.status(400).json({error:'User already exists'});
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    try{
        const user = new User.create({name,email,password : hashedPassword, roler: 'user',isVerified: false});
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

    //verify OTP
    exports.verifyOtp = async (req,res) =>{
        const {email, otp}= req.body;
        const otpRecord = await OTP.findOne({email,otp, action:'account_verification'});

        if(! otpRecord){
            return res.status(400).json({error:"Invalid or expired OTP"});

        }
        await User.findOneAndUpdate({email}, {isVerified: true});
        await OTP.deleteMany({email, action:'account_verification'});
        res.json({message:"Account verified successfully. You can login now"});
    
};
 