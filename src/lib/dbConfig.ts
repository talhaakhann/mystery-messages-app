import mongoose from "mongoose"
import { log } from "node:console"

type ConnectionObject={
    isConnected?:Number
}

const connection:ConnectionObject={}

export const dbConnect=async()=>{
    if(connection.isConnected){
        console.log("Already db connection")
        return 
    }
    try {
        const db=await mongoose.connect(process.env.MONGODB_URI || "")
        console.log("Successfully connected to Db")
    } catch (error) {
        console.log("Db Connection failed",error)
        process.exit(1)
    }
}

export default dbConnect