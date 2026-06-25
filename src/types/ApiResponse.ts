import { Message } from "@/models/Users";

export default interface ApiResponse {
    success:boolean,
    message:string,
    isAceptingMessages?:boolean
    messages?:Array<Message>
}