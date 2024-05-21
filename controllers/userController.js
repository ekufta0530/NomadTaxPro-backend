import asyncHandler from "express-async-handler";
import { User } from "../models/userModel.js";
import { generateToken } from "../utils/generateToken.js";
import crypto from "crypto";
import { transporter } from "../utils/sendEmail.js";
import jwt from "jsonwebtoken";
import { api_host, base_url, email_address } from "../utils/secrets.js";
import { jwt_secret } from "../utils/secrets.js";
import { deleteS3File } from "../utils/aws.js";
import { updateDaysCompletedForAllStays } from "../utils/schedular.js";
import { StayCountry } from "../models/countryModel.js";

// @desc Auth user/set token
// router post /api/users/auth
// @access public

export const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });

  if (user && (await user.matchPassword(password))) {
    if (!user.isEmailVerified) {
      return res.status(403).send({
        message: "Please verify your email address.",
      });
    }
    const token = generateToken(res, user._id);
    user.loginAttempts = user.loginAttempts + 1;
    await user.save();
    res.status(200).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      token,
      profileUrl: user.profileUrl,
      loginAttempts: user.loginAttempts,
      periodStartDate: user.periodStartDate,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc register user
// router post /api/users/register
// @access public

export const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName || !email || !password) {
    res.status(400);
    throw new Error("All fields are required!");
  }
  const userExits = await User.findOne({ email });
  if (userExits) {
    res.status(400);
    throw new Error("User already exists");
  }
  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    periodStartDate: new Date(),
  });
  const emailVerificationToken = user.generateVerificationToken();
  if (user) {
    res.status(201).json({
      message:
        "We have sent you an email verification link, please verify your email address to continue!",
    });
    transporter
      .sendMail({
        to: email,
        from: email_address,
        template: "email-verification",
        subject: "Email Verification",
        context: {
          verificationUrl: `${api_host}/api/users/verify-email/${emailVerificationToken}`,
        },
      })
      .then((mailObj) => {
        console.log(mailObj);
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc verify email
// router post /api/users/verify-email:token
// @access public

export const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;
  // Check we have an id
  if (!token) {
    return res.status(422).send({
      message: "Missing Token",
    });
  }
  // Step 1 -  Verify the token from the URL
  let decoded = null;
  try {
    // decoded = jwt.verify(token, process.env.JWT_SECRET ); // ORIGINAL
    decoded = jwt.verify(token, jwt_secret);
  } catch (err) {
    return res.status(500).send(err);
  }
  try {
    // Step 2 - Find user with matching ID
    const user = await User.findOne({ _id: decoded.ID }).exec();
    if (!user) {
      return res.status(404).send({
        message: "User does not exists",
      });
    }
    // Step 3 - Update user verification status to true
    user.isEmailVerified = true;
    await user.save();
    return res.redirect(`${base_url}/login`);
  } catch (err) {
    return res.status(500).send(err);
  }
});

// @desc logout user
// router post /api/users/logout
// @access private

export const logoutUser = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "User logged out" });
});

// @desc reset user password
// router put /api/users/reset-password
// @access public

export const resetPassword = asyncHandler(async (req, res) => {
  crypto.randomBytes(32, async (err, buffer) => {
    if (err) {
      res
        .status(500)
        .json({ message: "Something went wrong, please again later!" });
      return;
    }
    const token = buffer.toString("hex");
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      user.resetToken = token;
      user.resetTokenExpiry = Date.now() + 3600000;
      const tokenSaved = await user.save();
      if (tokenSaved) {
        res.status(201).json({
          message:
            "We have sent you an email with instructions to reset your password!",
        });

        transporter
          .sendMail({
            to: req.body.email,
            from: email_address,
            template: "reset-password",
            subject: "Password Reset",
            context: {
              resetPasswordLink: `${base_url}/reset-password/${token}`,
            },
          })
          .then((mailObj) => {
            console.log(mailObj);
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        res
          .status(400)
          .json({ message: "Something went wrong, please try again later!" });
      }
    } else {
      res
        .status(404)
        .json({ message: "No user found with this email address" });
    }
  });
});

// @desc reset user password
// router put /api/users/new-password
// @access public

export const resetNewPassword = asyncHandler(async (req, res) => {
  const newPassword = req.body.password;
  const token = req.body.token;
  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiry: { $gt: Date.now() },
  });
  if (user) {
    user.password = newPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    const updatedUser = await user.save();
    if (updatedUser) {
      res.status(200).json({ message: "Password updated successfully!" });
    } else {
      res
        .status(400)
        .json({ message: "Something went wrong, please try again later!" });
    }
  } else {
    res
      .status(403)
      .json({ message: "Your token has expired, please try again!" });
  }
});

// @desc reset user password
// router put /api/users//profile/url
// @access private

export const updateProfileUrl = asyncHandler(async (req, res) => {
  const { userId, profileUrl } = req.body;
  const user = await User.findById(userId);

  if (!user) {
    return res.status(400).json({ error: "User not found" });
  }

  if (user?.profileUrl) {
    await deleteS3File(user?.profileUrl);
  }

  if (user) {
    user.profileUrl = profileUrl;
    const token = generateToken(res, user._id);
    const updatedUser = await user.save();
    res.status(200).json({
      _id: updatedUser._id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      token,
      profileUrl: updatedUser.profileUrl,
    });
  } else {
    res.status(400);
    throw new Error("User not found");
  }
});

/*-----------------------------------------------Period Start Date--------------------------------------------------------*/

export const updatePeriodStartDate = asyncHandler(async (req, res) => {
  const { userId, periodStartDate } = req.body;
  const user = await User.findById(userId);

  if (!user) {
    return res.status(400).json({ error: "User not found" });
  }

  if (user) {
    user.periodStartDate = periodStartDate;
    const updatedUser = await user.save();
    const userStays = await StayCountry.findOne({ userId: userId });

    if (userStays) {
      await updateDaysCompletedForAllStays(userStays, periodStartDate);
    }

    res.status(200).json({
      periodStartDate: updatedUser.periodStartDate,
      message: "Period Start Date updated successfully!",
    });
  } else {
    res.status(400);
    throw new Error("User not found");
  }
});
