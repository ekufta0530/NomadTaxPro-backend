import dotenv from "dotenv";
import nodemailer from "nodemailer";
import sendgridTransport from "nodemailer-sendgrid-transport";

dotenv.config();

export const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: process.env.SENDGRID_KEY,
    },
  })
);
