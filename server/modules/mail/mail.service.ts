import * as nodemailer from "nodemailer";
import db_client from "../../utils/client";

export async function testEmail(to: string, subject: string, body: string) {
  let options = {
    from: process.env.NODEMAILER_GMAIL_USER,
    to: to,
    subject: subject,
    html: body,
  };

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.NODEMAILER_GMAIL_USER,
      pass: process.env.NODEMAILER_GMAIL_APP_PASSWORD,
    },
  });

  try {
    const info = await transporter.sendMail(options);

    return info;
  } catch (err) {
    return false;
  }
}

export async function requestChangeEmail(user_id: string) {
  const user = await db_client.user.findUnique({
    where: { id: user_id },
  });

  let body = `
    <!DOCTYPE html>
    <html>
        <head>
        <meta charset="UTF-8">
        <title>Request to change password</title>
        <style>
            body {
            font-family: Roboto, Arial, sans-serif;
            margin: 0;
            padding: 0;
            }
            .email-container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            border: 2px solid #f1f1f1;
            padding: 40px 30px;
            }
            .logo {
            text-align: center;
            margin-bottom: 30px;
            }
            .logo img {
            height: 24px;
            }
            .title {
            font-size: 22px;
            color: #202124;
            text-align: center;
            margin-bottom: 20px;
            font-weight: 500;
            }
            .content {
            font-size: 14px;
            color: #3c4043;
            line-height: 1.6;
            margin-bottom: 30px;
            text-align: center;
            }
            .email {
            font-weight: 500;
            color: #1a73e8;
            margin: 15px 0;
            font-size: 15px;
            text-align: center;
            }
            .button-container {
            text-align: center;
            margin-bottom: 30px;
            }
            .button {
            background-color: #1a73e8;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 4px;
            font-weight: 500;
            font-size: 14px;
            }
            .footer {
            font-size: 12px;
            color: #5f6368;
            text-align: center;
            margin-top: 20px;
            line-height: 1.4;
            }
            .small-link {
            color: #1a73e8;
            text-decoration: none;
            }
        </style>
        </head>
        <body>
            <div class="email-container">
                <div class="logo">
                    <h1>QUICKEASE</h1>
                </div>
                <div class="title">A request to change email</div>
                <div class="email">${user?.email}</div>
                <div style="border: 1px solid #dedede; margin: 1rem;"></div>
                <div class="content">
                You requested to change your email address. If this was not you, immediately change your password.
                </div>
                <div class="button-container">
                <a class="button">Change your email</a>
                </div>
                <div class="footer">
                You received this email to let you know about important changes to your QuickEase account.<br>
                ${user?.first_name} ${user?.last_name}, if you didn't request to change your email then disregard this email.
                </div>
            </div>
        </body>
    </html>
    `;

  let options = {
    from: process.env.NODEMAILER_GMAIL_USER,
    to: user?.email,
    subject: "Request to change email",
    html: body,
  };

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.NODEMAILER_GMAIL_USER,
      pass: process.env.NODEMAILER_GMAIL_APP_PASSWORD,
    },
  });

  try {
    const info = await transporter.sendMail(options);

    return info;
  } catch (err) {
    return false;
  }
}

export async function requestChangePassword(user_id: string) {
  const user = await db_client.user.findUnique({
    where: { id: user_id },
  });

  let body = `
    <!DOCTYPE html>
    <html>
        <head>
        <meta charset="UTF-8">
        <title>Request to change password</title>
        <style>
            body {
            font-family: Roboto, Arial, sans-serif;
            margin: 0;
            padding: 0;
            }
            .email-container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            border: 2px solid #f1f1f1;
            padding: 40px 30px;
            }
            .logo {
            text-align: center;
            margin-bottom: 30px;
            }
            .logo img {
            height: 24px;
            }
            .title {
            font-size: 22px;
            color: #202124;
            text-align: center;
            margin-bottom: 20px;
            font-weight: 500;
            }
            .content {
            font-size: 14px;
            color: #3c4043;
            line-height: 1.6;
            margin-bottom: 30px;
            text-align: center;
            }
            .email {
            font-weight: 500;
            color: #1a73e8;
            margin: 15px 0;
            font-size: 15px;
            text-align: center;
            }
            .button-container {
            text-align: center;
            margin-bottom: 30px;
            }
            .button {
            background-color: #1a73e8;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 4px;
            font-weight: 500;
            font-size: 14px;
            }
            .footer {
            font-size: 12px;
            color: #5f6368;
            text-align: center;
            margin-top: 20px;
            line-height: 1.4;
            }
            .small-link {
            color: #1a73e8;
            text-decoration: none;
            }
        </style>
        </head>
        <body>
            <div class="email-container">
                <div class="logo">
                    <h1>QUICKEASE</h1>
                </div>
                <div class="title">A request to change email</div>
                <div class="email">${user?.email}</div>
                <div style="border: 1px solid #dedede; margin: 1rem;"></div>
                <div class="content">
                You requested to change your email address. If this was not you, immediately change your password.
                </div>
                <div class="button-container">
                <a class="button">Change your password</a>
                </div>
                <div class="footer">
                You received this email to let you know about important changes to your QuickEase account.<br>
                ${user?.first_name} ${user?.last_name}, if you didn't request to change your email then disregard this email.
                </div>
            </div>
        </body>
    </html>
    `;

  let options = {
    from: process.env.NODEMAILER_GMAIL_USER,
    to: user?.email,
    subject: "Request to change password",
    html: body,
  };

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.NODEMAILER_GMAIL_USER,
      pass: process.env.NODEMAILER_GMAIL_APP_PASSWORD,
    },
  });

  try {
    const info = await transporter.sendMail(options);

    return info;
  } catch (err) {
    return false;
  }
}
