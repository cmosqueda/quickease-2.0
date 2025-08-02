import * as nodemailer from "nodemailer";
import db_client from "../../utils/client";
import dayjs from "dayjs";

import { randomBytes } from "crypto";

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

  const token = randomBytes(32).toString("hex");

  await db_client.userToken.create({
    data: {
      user_id,
      token,
      type: "CHANGE_EMAIL",
      expires_at: dayjs(new Date()).add(24, "hours").toDate(),
    },
  });

  let body = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>QuickEase / Request to change email</title>
  </head>
  <body
    style="
      margin: 0;
      padding: 0;
      background-color: #ffffff;
      font-family: Arial, sans-serif;
    "
  >
    <table
      width="100%"
      cellpadding="0"
      cellspacing="0"
      border="0"
      align="center"
      style="padding: 40px 0"
    >
      <tr>
        <td align="center">
          <table
            width="512"
            cellpadding="0"
            cellspacing="0"
            border="0"
            style="
              border: 1px solid #e5e5e5;
              border-radius: 12px;
              box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
              padding: 32px;
            "
          >
            <!-- Logo -->
            <tr>
              <td
                align="center"
                style="
                  font-size: 30px;
                  font-weight: 900;
                  color: #0ea5e9;
                  padding-bottom: 16px;
                "
              >
                QuickEase
              </td>
            </tr>

            <!-- Divider -->
            <tr>
              <td
                style="border-bottom: 1px solid #e5e5e5; padding-bottom: 16px"
              ></td>
            </tr>

            <!-- Main Content -->
            <tr>
              <td
                style="
                  padding-top: 16px;
                  font-size: 24px;
                  font-weight: bold;
                  color: #44403c;
                "
              >
                Request to change email
              </td>
            </tr>
            <tr>
              <td
                style="
                  padding-top: 16px;
                  font-size: 16px;
                  line-height: 1.5;
                  color: #444444;
                "
              >
                Hello, ${user.first_name} ${user.last_name}.<br /><br />
                We received a request to change the email associated with your
                account on ${dayjs(new Date()).format(
                  "MMMM DD, YYYY hh:mm A"
                )}.<br /><br />
                If you made this request, please click the button below. If not,
                please ignore this message or contact support.
              </td>
            </tr>

            <!-- Button -->
            <tr>
              <td
                align="center"
                style="padding-top: 24px; padding-bottom: 24px"
              >
                <a
                  href="https://quickease.online/auth/change/email?email=${
                    user.email
                  }&token=${token}"
                  style="
                    display: inline-block;
                    padding: 16px 24px;
                    background-color: #0ea5e9;
                    color: #ffffff;
                    text-decoration: none;
                    border-radius: 12px;
                    font-size: 16px;
                  "
                >
                  Change email
                </a>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td
                style="
                  font-size: 14px;
                  color: #a8a29e;
                  text-align: center;
                  border-top: 1px solid #e5e5e5;
                  padding-top: 16px;
                "
              >
                © QuickEase / 2025.<br />
                Supercharge your learning.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>

    `;

  let options = {
    from: `"QuickEase" <${process.env.NODEMAILER_GMAIL_USER}>`,
    to: user?.email,
    subject: "[QuickEase] Request to change email",
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

  const token = randomBytes(32).toString("hex");

  await db_client.userToken.create({
    data: {
      user_id,
      token,
      type: "RESET_PASSWORD",
      expires_at: dayjs(new Date()).add(24, "hours").toDate(),
    },
  });

  let body = `
   <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>QuickEase / Request to change password</title>
      </head>
      <body style="margin:0; padding:0; background-color:#ffffff; font-family: Arial, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" align="center" style="padding: 40px 0;">
          <tr>
            <td align="center">
              <table width="512" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #e5e5e5; border-radius:12px; box-shadow: 0 1px 4px rgba(0,0,0,0.1); padding: 32px;">
                <!-- Logo -->
                <tr>
                  <td align="center" style="font-size:30px; font-weight:900; color:#0ea5e9; padding-bottom:16px;">
                    QuickEase
                  </td>
                </tr>

                <!-- Divider -->
                <tr>
                  <td style="border-bottom:1px solid #e5e5e5; padding-bottom:16px;"></td>
                </tr>

                <!-- Main Content -->
                <tr>
                  <td style="padding-top:16px; font-size:24px; font-weight:bold; color:#44403c;">
                    Request to change password
                  </td>
                </tr>
                <tr>
                  <td style="padding-top:16px; font-size:16px; line-height:1.5; color:#444444;">
                    Hello, ${user.first_name} ${user.last_name}.<br><br>
                    We received a request to change the password associated with your account on ${dayjs(
                      new Date()
                    ).format("MMMM DD, YYYY hh:mm A")}.<br><br>
                    If you made this request, please click the button below. If not, please ignore this message or contact support.
                  </td>
                </tr>

                <!-- Button -->
                <tr>
                  <td align="center" style="padding-top:24px; padding-bottom:24px;">
                    <a href="https://quickease.online/auth/change/password?email=${
                      user.email
                    }&token=${token}" style="display:inline-block; padding:16px 24px; background-color:#0ea5e9; color:#ffffff; text-decoration:none; border-radius:12px; font-size:16px;">
                      Change password
                    </a>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="font-size:14px; color:#a8a29e; text-align: center; border-top:1px solid #e5e5e5; padding-top:16px;">
                    © QuickEase / 2025.<br />
                    Supercharge your learning.
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
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
