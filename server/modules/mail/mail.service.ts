import * as nodemailer from "nodemailer";
import db_client from "../../utils/client";
import dayjs from "dayjs";

import { randomBytes } from "crypto";

/**
 * Sends an email to the user with a link to request an email change.
 *
 * This function generates a secure token, stores it in the database with an expiration time,
 * and sends an HTML email to the user's current email address. The email contains a link
 * that allows the user to proceed with changing their email address.
 *
 * @param user_id - The unique identifier of the user requesting the email change.
 * @returns The result of the email sending operation, or `false` if sending fails.
 *
 * @remarks
 * - The token is valid for 24 hours.
 * - The email includes a button linking to the email change page with the token and current email.
 * - Uses Gmail via Nodemailer for sending emails.
 */
export async function requestChangeEmail(user_id: string) {
  const user = await db_client.user.findUnique({
    where: { id: user_id },
  });

  if (!user) {
    throw new Error("User not found for mail request");
  }

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

/**
 * Sends a password change request email to the user with a secure token.
 *
 * This function generates a password reset token, stores it in the database,
 * and sends an email to the user containing a link to change their password.
 *
 * @param user_id - The unique identifier of the user requesting a password change.
 * @returns The result of the email sending operation, or `false` if sending fails.
 *
 * @throws Will not throw; returns `false` on failure.
 *
 * @remarks
 * - The password reset token expires in 24 hours.
 * - The email includes a link with the user's email and the generated token.
 * - Uses Gmail via Nodemailer for sending emails.
 */
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
    from: `"QuickEase" <${process.env.NODEMAILER_GMAIL_USER}>`,
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

/**
 * Sends a verification email to the user with the specified `user_id`.
 *
 * This function performs the following steps:
 * 1. Retrieves the user from the database.
 * 2. Generates a random verification token.
 * 3. Stores the token in the database with an expiration time of 24 hours.
 * 4. Constructs an HTML email containing a verification link.
 * 5. Sends the email to the user's registered email address using Nodemailer.
 *
 * @param user_id - The unique identifier of the user to verify.
 * @returns The result of the email sending operation (`info` object from Nodemailer) if successful, or `false` if an error occurs.
 */
export async function requestVerifyEmail(user_id: string) {
  const user = await db_client.user.findUnique({
    where: { id: user_id },
  });

  const token = randomBytes(32).toString("hex");

  await db_client.userToken.create({
    data: {
      user_id,
      token,
      type: "VERIFY_EMAIL",
      expires_at: dayjs(new Date()).add(24, "hours").toDate(),
    },
  });

  let body = `
   <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>QuickEase / Verify email</title>
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
                    Verify email
                  </td>
                </tr>
                <tr>
                  <td style="padding-top:16px; font-size:16px; line-height:1.5; color:#444444;">
                    Hello, ${user.first_name} ${user.last_name}.<br><br>
                    To complete your registration and keep your account secure,
                    please verify your email address by clicking the button below.
                    This helps us ensure it’s really you and allows us to send you
                    important updates about your account and activity. <br><br>If you didn’t
                    create this account, you can safely ignore this email.
                  </td>
                </tr>

                <!-- Button -->
                <tr>
                  <td align="center" style="padding-top:24px; padding-bottom:24px;">
                    <a href="https://quickease.online/auth/verify?email=${user.email}&token=${token}" style="display:inline-block; padding:16px 24px; background-color:#0ea5e9; color:#ffffff; text-decoration:none; border-radius:12px; font-size:16px;">
                      Verify email
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
    from: `"QuickEase" <${process.env.NODEMAILER_GMAIL_USER}>`,
    to: user?.email,
    subject: "Verify email",
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

/**
 * Sends a password reset request email to the specified user.
 *
 * This function generates a secure token, stores it in the database with an expiration time,
 * and sends an HTML email containing a password reset link to the user's email address.
 *
 * @param email - The email address of the user requesting a password reset.
 * @returns The result of the email sending operation, or `false` if sending fails.
 *
 * @throws Will not throw; returns `false` on failure.
 */
export async function requestForgotPassword(email: string) {
  const user = await db_client.user.findUnique({
    where: { email },
  });

  const token = randomBytes(32).toString("hex");

  await db_client.userToken.create({
    data: {
      user_id: user.id,
      token,
      type: "RESET_PASSWORD",
      expires_at: dayjs().add(24, "hours").toDate(),
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
    from: `"QuickEase" <${process.env.NODEMAILER_GMAIL_USER}>`,
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
