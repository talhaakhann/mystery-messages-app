import dbConnect from "@/lib/dbConfig";
import { UserModel } from "@/models/Users";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import bcrypt from "bcryptjs";

export const POST = async (request: Request) => {
  try {
    await dbConnect();
    const { username, email, password } = await request.json();

    const existUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existUserVerifiedByUsername) {
      return Response.json(
        {
          success: false,
          message: "Usernane is already taken",
        },
        { status: 400 },
      );
    }

    const existingUserByEmail = await UserModel.findOne({
      email,
    });

    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "Email is already registered",
          },
          { status: 400 },
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verificationCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
        await existingUserByEmail.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);

      const expiryDate = new Date();

      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = await UserModel.create({
        username,
        email,
        password: hashedPassword,
        verifyCode: verificationCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessages: true,
      });
      await newUser.save();
    }

    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verificationCode.toString(),
    );

    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 },
      );
    }

    return Response.json(
      {
        success: true,
        message: "User registered successfully. Please verify your account.",
      },
      { status: 201 },
    );
  } catch (error) {
    console.log("Error while registering user", error);
    return Response.json(
      { success: false, message: "Error registering error" },
      {
        status: 500,
      },
    );
  }
};
