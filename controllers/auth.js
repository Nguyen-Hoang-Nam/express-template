import bcrypt from "bcrypt";
import nodemailer from "nodemailer";

import User from "../models/user.js";
import VerifyEmail from "../models/verifyEmail.js";

const SALT = 10;

export const login = (_req, _res, _next) => {
  _res.json({ title: "Hello world" });
};

const register = (_req, _res, _next) => {
  const { email, password } = _req.body;

  User.exists({ email }, (error, existUser) => {
    if (error) {
      _res.json({ error: "Can not create user" });
      return;
    }

    if (existUser) {
      _res.json({ error: "Email exist" });
      return;
    }

    bcrypt.genSalt(SALT, (error, salt) => {
      if (error) {
        _res.json({ error: "Can not create user" });
        return;
      }

      bcrypt.hash(password, salt, (error, passwordHash) => {
        if (error) {
          _res.json({ error: "Can not create user" });
          return;
        }

        const newUser = new User({ email, password: passwordHash });

        newUser.save((error) => {
          if (error) {
            _res.json({ error: "Can not create user" });
            return;
          }

          _res.json({ success: "Create user successfully" });
        });
      });
    });
  });
};

const logout = (_req, _res, _next) => {
  _res.json({ title: "Hello world" });
};

const forgotPassword = (_req, _res, _next) => {
  const { email } = _req.body;

  User.exists({ email }, (error, existUser) => {
    if (error) {
      _res.json({ error: "Can not check email" });
    }

    if (!existUser) {
      _res.json({ error: "This email is not existed" });
    }

    const verifyCode = Math.floor(100000 + Math.random() * 899999);
    const newVerifyEmail = new VerifyEmail({ email, code: verifyCode });

    newVerifyEmail.save(async (error) => {
      if (error) {
        _res.json({ error: "Can not create code to verify email" });
        return;
      }

      _req.session.verifyUser = newVerifyEmail._id;

      try {
        let transporter = nodemailer.createTransport({
          host: "smtp.ethereal.email",
          port: 587,
          secure: false,
          auth: {
            user: "branson.sipes68@ethereal.email",
            pass: "bfJR7tatUuxjC8RT7u",
          },
        });

        await transporter.sendMail({
          from: '"Express teamplate" <teamplate@node.js>',
          to: email,
          subject: "Verify email",
          text: "Your code: " + verifyCode,
        });
      } catch (err) {
        console.log(err);
      }
    });
  });
};

const verifyEmail = (_req, _res, _next) => {
  const { code } = _req.body;

  const verifyEmailId = _req.session.verifyUser;
  if (verifyEmailId) {
    VerifyEmail.findOne({ _id: verifyEmailId })
      .select({ code: 1 })
      .lean()
      .then((doc) => {
        if (!doc) {
          _res.json({ error: "Wrong code" });
          return;
        }

        if (doc.code === code) {
          _res.json({ success: "Verify email successfully" });
        } else {
          _res.json({ error: "Wrong code" });
        }

        VerifyEmail.deleteOne({ _id: verifyEmailId });
      });
  }
};

const resetPassword = (_req, _res, _next) => {
  _res.json({ title: "Hello world" });
};

export default {
  login,
  register,
  logout,
  forgotPassword,
  verifyEmail,
  resetPassword,
};
