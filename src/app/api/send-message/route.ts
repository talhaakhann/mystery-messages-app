import { UserModel } from "@/models/Users";
import dbConnect from "@/lib/dbConfig";
import { Message } from "@/models/Users";

export async function POST(request: Request) {
  await dbConnect();
  
  try {
    const { username, content } = await request.json();
    const user = await UserModel.findOne({
      username,
    });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User does not exist",
        },
        { status: 404 },
      );
    }
    if(!user.isAcceptingMessages){
        return Response.json(
      {
        success: false,
        message:"User does not accepting the messages"
      },
      { status: 403 }
    );
    }
     const newMessage = { content, createdAt: new Date() };

    user?.messages.push(newMessage as Message);
    await user.save();

     return Response.json(
      {
        success: true,
        message:"Message send successfully"
      },
      { status: 200 },
    );
  } catch (error) {
    console.log("Failed to send message",error);
    return Response.json(
      {
        success: false,
        message:"Failed to send message"
      },
      { status: 500 },
    );
  }
}
