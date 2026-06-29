import dbConnect from "@/lib/dbConfig";
import { UserModel } from "@/models/Users";
import { usernameSchema } from "@/Schemas/signUpSchema";
import { z } from "zod";

const UsernameQuerySchema = z.object({
  username: usernameSchema,
});

export async function GET(request: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    searchParams
    const queryParams = {
      username: searchParams.get("username"),
    };
 
    const result = UsernameQuerySchema.safeParse(queryParams);

    if (!result.success) {
      const userErrors = result.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            userErrors.length > 0
              ? userErrors.join(", ")
              : "Invalid query parameters",
        },
        { status: 400 },
      );
    }
    const { username } = result.data;
    const existedUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existedUsername) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken",
        },
        { status: 400 },
      );
    }
    else{
      return Response.json(
        {
          success: true,
          message: "Username is Available",
        },
        { status: 200 },
      );
    }
  } catch (error) {
    console.log("Error checking username", error);
    return Response.json(
      {
        success: true,
        message: "Error checking username",
      },
      {
        status: 500,
      },
    );
  }
}
