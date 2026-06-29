import dbConnect from "@/lib/dbConfig";
import { UserModel } from "@/models/Users";
import { authOption } from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { User } from "next-auth";

export async function POST(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOption);


  const user: User = session?.user as User;
  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "User not authenticated",
      },
      { status: 401 },
    );
  }
  const userId = user?._id; 

  const { acceptMessages } = await request.json();
  
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessages: acceptMessages },
      { returnDocument: "after" },
    );

    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "Failed to update the user status",
        },
        { status: 401 },
      );
    }
    return Response.json(
      {
        success: true,
        message: "Succssfully toggle accepting messages status",
      },
      { status: 200 },
    );
  } catch (error) {
    console.log("Failed yo toogle the acepting messages flag", error);
    return Response.json(
      {
        success: false,
        message: "Failed to toggle acepting messages",
      },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOption);
  const user: User = session?.user as User;
  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "User not authenticated",
      },
      { status: 401 },
    );
  }

  try {
    const foundUser = await UserModel.findById(user._id);
    if (!foundUser) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 },
      );
    }
    return Response.json(
      {
        success: true,
        isAcceptingMessages: foundUser?.isAcceptingMessages,
      },
      { status: 200 },
    );
  } catch (error) {
    console.log("Failed to get the acepting messages flag", error);
    return Response.json(
      {
        success: false,
        message: "Failed to get the acepting messages status",
      },
      { status: 500 },
    );
  }
}
