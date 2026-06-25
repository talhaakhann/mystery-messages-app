import { Resend } from "resend";
import VerificationEmail from "../../emails/VerificationEmail";
import ApiResponse from "../types/ApiResponse";

export const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string,
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Mystery Messages | Verify Your Email",
      react: VerificationEmail({
        username,
        verifyCode,
      }),
    });
    return {
      success: true,
      message: "Successfully send the verification email",
    };
  } catch (error) {
    console.log("Failed to send verification email", error);
    return { success: false, message: 
        "Failed to send the verification email" };
  }
}
