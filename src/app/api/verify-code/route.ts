import { UserModel } from "@/models/Users";
import dbConnect from "@/lib/dbConfig";
import { success } from "zod";
import { decode } from "punycode";

export async function POST(request: Request) {
  try {
    await dbConnect();

    const { username, code } = await request.json();

    const decodedUsername = decodeURIComponent(username);
    const user = await UserModel.findOne({
      username: decodedUsername,
    });
    
    if (!user) {
      return Response.json(
        {
          success: false,
          messsage: "User does not exist",
        },
        {
          status: 500,
        },
      );
    }
    const verifyCodeValid = user.verifyCode == code;

    const verifyCodeExpiryValid = new Date(user.verifyCodeExpiry) > new Date();
    
    if (verifyCodeValid && verifyCodeExpiryValid) {
      user.isVerified = true;
      await user.save();
      return Response.json(
        {
          success: true,
          messsage: "Account verified Successfull",
        },
        {
          status: 200,
        },
      );
    } else if (!verifyCodeExpiryValid) {
      return Response.json(
        {
          success: false,
          messsage:
            "Verification code has been expired please sigin-up again to get a new code",
        },
        {
          status: 400,
        },
      );
    } else {
      return Response.json(
        {
          success: false,
          messsage: "Invalid user verification code",
        },
        {
          status: 400,
        },
      );
    }
  } catch (error) {
    console.log("Error in verifying the user", error);
    return Response.json(
      {
        success: false,
        message: "Error verifying the user",
      },
      {
        status: 500,
      },
    );
  }
}
