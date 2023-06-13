import User from "../model/user.js";
//import errorHandler from "../middleware/error.js";
import bcrypt from "bcryptjs";
import jwtGen from "../utils/jwtGen.js";
import otpGenerator from "otp-generator";
import mailHandler from "../utils/nodemailer.js";



const register = async (req, res, next) => {
  const { fullname, username, password, email } = req.body;
  try {
    const existingUser = await User.findOne({
      email,
    }).lean(true);

    if (existingUser) {
      return res.status(403).json({ message: "User Already Exists" });
    } else {
      //hashing user's password
      const saltRound = 10;
      const salt = await bcrypt.genSalt(saltRound);
      const bcryptPassword = await bcrypt.hash(password, salt);
      const verificationCode = otpGenerator.generate(4, {
        digits: true,
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
      });

      const newUser = new User({
        fullname,
        username,
        password: bcryptPassword,
        email,
        confirmationCode: verificationCode,
      });
      const token = jwtGen(newUser._id);
      if (!token)
        return res.status(400).json({ message: "Error Creating User" });
      const mailDetails = {
        username: newUser.username,
        email: newUser.email,
        confirmationCode: newUser.confirmationCode,
      };
      mailHandler({ ...mailDetails });
      await newUser.save();
      return res
        .status(201)
        .json({
          message:
            "User created successfully! Please check your email for the confirmation code",
          token,
        });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Error Registering" });
  }
};

const statusChange = async (req, res, next) => {
  const { confirmationCode } = req.body;
  try {
    const user = await User.findOne({
      confirmationCode,
    }).lean(true);

    if (!user) {
      return res.status(401).json({ message: "Invalid Confirmation Code" });
    }
    const updateUser = await User.findOneAndUpdate(
      {
        confirmationCode,
      },
      { accountStatus: "Active" },
      { new: true }
    ).select("-password");

    return res
      .status(200)
      .json({ message: "Account Verified", user: updateUser });
  } catch (error) {
    return res.status(400).json({ message: "Error Occured while Verifying" });
  }
};

const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({
      email,
    }).lean(true);

    if (user.status === "Pending") {
      return res.status(401).send({
        message: "Please Verify Your Email before you can Sign In!",
      });
    }
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }
    const validPassword = await bcrypt.compare(password, existingUser.password);
    if (!validPassword)
      return res.status(401).json({ message: "Incorrect password" });
    const token = jwtGen(existingUser._id);
    return res
      .status(200)
      .json({
        message: "Sign in successfully",
        user: { name: existingUser.name, email: existingUser.email },
        token,
      });
  } catch (error) {
    return res.status(400).json(errorFunction(true, "Error Signing in"));
  }
};
const requestPasswordReset = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(403).json({ message: "Email does not exist" });
    const resetToken = otpGenerator.generate(4, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });
    const currentDateTime = new Date();
    const oneHourLater = new Date(currentDateTime.getTime() + 60 * 60 * 1000);

    await User.findOneAndUpdate(
      { email },
      {
        resetToken,
        tokenExpiryTime: oneHourLater,
      }
    );

    //const link = `${process.env.clientURL}/passwordReset?token=${resetToken}&id=${user._id}`;
    const mailDetails = {
      resetToken,
      email: user.email,
      fullname: user.fullname
    };
    mailHandler({ ...mailDetails });
    return res.status(200).json({message: "We sent a message to your email"})
  } catch (error) {
    console.log(error);
    return res.status(400).json({message: "Error occured while resetting the password"})
  }


};

const verifyToken = async (req, res, next) => {
  const { resetToken } = req.body; 
  try {
    const user = await User.findOne({resetToken})
    if (!user) {
      return res.status(404).json({message: "User not Found"})
    }
    if (new Date().getTime() > user.tokenExpiryTime){
      return res.status(403).json({message: "Verification Code has expired. Please request for a new verification code"})
    }
    return res.status(200).json({message: "Verification Code confirmed"})
  } catch (error) {
    return res.status(400).json({message: "Wrong Verification Code"}) 
  }
}

const resetPasword = async (req, res, next) => {
  const { password, resetToken } = req.body;
try {
  const user = await User.findOne({resetToken})
  if (!user) {
    return res.status(404).json({message: "User not Found"})
  }
  const saltRound = 10;
  const salt = await bcrypt.genSalt(saltRound);
  const bcryptPassword = await bcrypt.hash(password, salt);

  await User.findOneAndUpdate({email: user.email},{password: bcryptPassword})
  return res.status(200).json({message: "Password Reset Successfully"})
} catch (error) {
  console.log(error);
  return res.status(400).json({message: "Error occured while resetting the password"}) 
}
}
export { register, signin, statusChange, requestPasswordReset, verifyToken, resetPasword };
