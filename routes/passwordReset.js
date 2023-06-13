import  User from "../models/user.js";
import jwtGen from "../utils/jwtGen.js";
import mailHandler from "../utils/nodemailer.js";
import express from "express";
import crypto from "crypto";
import bcrypt from "bcryptjs"



const requestPasswordReset = async (email) => {

  const user = await User.findOne({ email });

  if (!user) throw new Error("Email does not exist");
  let token = await Token.findOne({ email: email });
  if (token) await token.deleteOne();
  let resetToken = crypto.randomBytes(32).toString("hex");
  const hash = await bcrypt.hash(resetToken, Number(bcryptSalt));

  await new Token({
    email: email,
    token: hash,
    createdAt: Date.now(),
  }).save();

  const link = `${clientURL}/passwordReset?token=${resetToken}&id=${user._id}`;
  sendEmail(user.email,"Password Reset Request",{name: user.username,link: link,},"./template/requestResetPassword.handlebars");
  return link;
};

const resetPassword = async (email, token, password) => {
    let passwordResetToken = await Token.findOne({ email });
    if (!passwordResetToken) {
      throw new Error("Invalid or expired password reset token");
    }
    const isValid = await bcrypt.compare(token, passwordResetToken.token);
    if (!isValid) {
      throw new Error("Invalid or expired password reset token");
    }
    const hash = await bcrypt.hash(password, Number(bcryptSalt));
    await User.updateOne(
      { _id: email },
      { $set: { password: hash } },
      { new: true }
    );
    const user = await User.findById({ _id: email });
    sendEmail(
      user.email,
      "Password Reset Successfully",
      {
        name: user.name,
      },
      "./template/resetPassword.handlebars"
    );
    await passwordResetToken.deleteOne();
    return true;
  };

