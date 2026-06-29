import dbConnect from "@/lib/dbConfig";
import { UserModel } from "@/models/Users";
import { authOption } from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { User } from "next-auth";
import mongoose from "mongoose";
  
export async function GET(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOption);
  
  const user: User = session?.user as User;
  if (!session || !session.user) {
    return ;
  }
  const userId = new mongoose.Types.ObjectId(user?._id);

  try {
    const user = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: '$messages' },
      { $sort: { 'messages.createdAt': -1 } },
      { $group: { _id: '$_id', messages: { $push: '$messages' } } },
    ]).exec();

    
    if(!user||user.length==0){
      return Response.json(
        {
          success: true,
          message: "No new Message",
        },
        { status: 200 },
      );
    }
    
    return Response.json(
      {
        success: true,
        messages:user[0].messages
      },
      { status: 200 },
    );
  } catch (error) {
    console.log("Failed to get messages", error);
    return Response.json(
      {
        success: false,
        message: "Failed to get messages",
      },
      { status: 500 },
    );
  }
}




