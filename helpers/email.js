import { Resend } from 'resend';

const resend = new Resend('re_ZqKzeU6F_FaPmeEmkNppN6qxSHnM7Ed92');

export async function sendWelcomeEmail(userEmail, userName) {
  try {
    const data = await resend.emails.send({
      from: "onboarding@resend.dev",   // ✅ allowed in dev mode
      to: userEmail,
      subject: "Welcome to Our Website!",
      html: `
        <h1>Hello i am making a RealEstate Api and only connect with me through emails, ${userName}!</h1>
        <p>Gol Thanks for joining us. This is a welcome email test.</p>
      `,
    });
    console.log("Email sent:", data);
  } catch (error) {
    console.error("Failed to send welcome email:", error);
    throw error;
  }
}

export const sendResetEmail = async (to, newPassword) => {
  return await resend.emails.send({
    from: 'RealEstateApi <onboarding@resend.dev>',
    to,
    subject: 'Your New Password',
    html: `
      <h2>Password Reset</h2>
      <p>Your new password is: <strong>${newPassword}</strong></p>
      <p>Please login and change it immediately.</p>
    `,
  });
};