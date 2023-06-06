
import User from "../model/user.js";
import errorHandler from "../middleware/error.js";
import bcrypt from "bcryptjs";
import jwtGen from "../utils/jwtGen.js";
import e from "express";
import sendMail from "../utils/nodemailer.js";

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

      const newUser = new User({
        fullname,
        username,
        password: bcryptPassword,
        email,
        verificationStatus,
        confirmationCode,
      });
      const token = jwtGen(newUser._id);    
      if (!token) 
      return res.status(400).json({ message: "Error Creating User"})
      await newUser.save()
      return res
        .status(201)
        .json({ message: "User created successfully! Please check your email for the confirmation code", token });
    }
    mailTransporter.sendMail(
      username,
      email,
      confirmationCode
    );  
  } catch (error) {
    console.log(error)
    return res.status(400).json(errorHandler(true, "Error Registering"));
  }
};


const signin = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const existingUser = await User.findOne({
            email,
          }).lean(true);

        if (user.status != "Active") {
        return res.status(401).send({
        message: "Please Verify Your Email before you can Sign In!",
        });
  }
          if(!existingUser) {
            return res.status(404).json({ message: "User not found"})
          }
          const validPassword = await bcrypt.compare(password, existingUser.password)
          if(!validPassword) return res.status(401).json({message: "Incorrect password"})
          const token = jwtGen(existingUser._id)
          return res.status(200).json({ message: 'Sign in successfully', user: {name: existingUser.name, email: existingUser.email}, token})
    } catch (error) {
        return res.status(400).json(errorFunction(true, "Error Signing in"));
    }

}

export { register, signin }