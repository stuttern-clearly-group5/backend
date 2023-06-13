import Translator from "../model/Translator.js";
//import errorHandler from "../middleware/error.js";
import bcrypt from "bcryptjs";
import jwtGen from "../utils/jwtGen.js";
import otpGenerator from "otp-generator";
import mailHandler from "../utils/nodemailer.js";


const translatorRegister = async (req, res, next) => {
  const { fullname, username, password, email } = req.body;
  try {
    const existingTranslator = await Translator.findOne({
      email,
    }).lean(true);

    if (existingTranslator) {
      return res.status(403).json({ message: "Translator Already Exists" });
    } else {
      //hashing Translator's password
      const saltRound = 10;
      const salt = await bcrypt.genSalt(saltRound);
      const bcryptPassword = await bcrypt.hash(password, salt);
      const verificationCode = otpGenerator.generate(4, {
        digits: true,
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
      });

      const newTranslator = new Translator({
        fullname,
        username,
        password: bcryptPassword,
        email,
        confirmationCode: verificationCode,
      });
      const token = jwtGen(newTranslator._id);
      if (!token)
        return res.status(400).json({ message: "Error Creating Translator" });
      const mailDetails = {
        username: newTranslator.username,
        email: newTranslator.email,
        confirmationCode: newTranslator.confirmationCode,
      };
      mailHandler({ ...mailDetails });
      await newTranslator.save();
      return res
        .status(201)
        .json({
          message:
            "Translator created successfully! Please check your email for the confirmation code",
          token,
        });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Error Registering" });
  }
};

const translatorStatusChange = async (req, res, next) => {
  const { confirmationCode } = req.body;
  try {
    const Translator = await Translator.findOne({
      confirmationCode,
    }).lean(true);

    if (!Translator) {
      return res.status(401).json({ message: "Invalid Confirmation Code" });
    }
    const updateTranslator = await Translator.findOneAndUpdate(
      {
        confirmationCode,
      },
      { accountStatus: "Active" },
      { new: true }
    ).select("-password");

    return res
      .status(200)
      .json({ message: "Account Verified", translator: updateTranslator });
  } catch (error) {
    return res.status(400).json({ message: "Error Occured while Verifying" });
  }
};

const translatorSignin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const existingTranslator = await Translator.findOne({
      email,
    }).lean(true);

    if (existingTranslator.status === "Pending") {
      return res.status(401).send({
        message: "Please Verify Your Email before you can Sign In!",
      });
    }
    if (!existingTranslator) {
      return res.status(404).json({ message: "Translator not found" });
    }
    const validPassword = await bcrypt.compare(password, existingTranslator.password);
    if (!validPassword)
      return res.status(401).json({ message: "Incorrect password" });
    const token = jwtGen(existingTranslator._id);
    return res
      .status(200)
      .json({
        message: "Sign in successfully",
        translator: { name: existingTranslator.name, email: existingTranslator.email },
        token,
      });
  } catch (error) {
    return res.status(400).json(errorFunction(true, "Error Signing in"));
  }
};
const requestTranslatorPasswordReset = async (req, res, next) => {
  const { email } = req.body;
  try {
    const translator = await Translator.findOne({ email });
    if (!translator) return res.status(403).json({ message: "Email does not exist" });
    const resetToken = otpGenerator.generate(4, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });
    const currentDateTime = new Date();
    const oneHourLater = new Date(currentDateTime.getTime() + 60 * 60 * 1000);

    await Translator.findOneAndUpdate(
      { email },
      {
        resetToken,
        tokenExpiryTime: oneHourLater,
      }
    );

    //const link = `${process.env.clientURL}/passwordReset?token=${resetToken}&id=${Translator._id}`;
    const mailDetails = {
      resetToken,
      email: translator.email,
      fullname: translator.fullname
    };
    mailHandler({ ...mailDetails });
    return res.status(200).json({message: "We sent a message to your email"})
  } catch (error) {
    console.log(error);
    return res.status(400).json({message: "Error occured while resetting the password"})
  }


};

const verifyTranslatorToken = async (req, res, next) => {
  const { resetToken } = req.body; 
  try {
    const translator = await Translator.findOne({resetToken})
    if (!translator) {
      return res.status(404).json({message: "Translator not Found"})
    }
    if (new Date().getTime() > translator.tokenExpiryTime){
      return res.status(403).json({message: "Verification Code has expired. Please request for a new verification code"})
    }
    return res.status(200).json({message: "Verification Code confirmed"})
  } catch (error) {
    return res.status(400).json({message: "Wrong Verification Code"}) 
  }
}

const resetTranslatorPasword = async (req, res, next) => {
  const { password, resetToken } = req.body;
try {
  const translator = await Translator.findOne({resetToken})
  if (!translator) {
    return res.status(404).json({message: "Translator not Found"})
  }
  const saltRound = 10;
  const salt = await bcrypt.genSalt(saltRound);
  const bcryptPassword = await bcrypt.hash(password, salt);

  await Translator.findOneAndUpdate({email: translator.email},{password: bcryptPassword})
  return res.status(200).json({message: "Password Reset Successfully"})
} catch (error) {
  console.log(error);
  return res.status(400).json({message: "Error occured while resetting the password"}) 
}
}
export {translatorRegister, translatorSignin, translatorStatusChange, requestTranslatorPasswordReset,verifyTranslatorToken, resetTranslatorPasword};
