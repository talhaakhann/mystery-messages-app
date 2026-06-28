import { NextAuthOptions } from "next-auth";
import dbConnect from "@/lib/dbConfig";
import bcrypt from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";
import { UserModel } from "@/models/Users";


export const authOption: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        username: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnect();
        console.log(credentials);
        
        const user = await UserModel.findOne({
          $or: [
            { email: credentials.identifier },
            { username: credentials.identifier },
          ],
        });
        if (!user) {
          throw new Error("User does not exist");
        }
        if (!user.isVerified) {
          throw new Error("Verify the account before login");
        }
        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.password
        );
        console.log(credentials.password);
        console.log(user.password);
        
        if (!isPasswordCorrect) {
          throw new Error("Incorrect Password");
        } else {
          return user;
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
       if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessages = token.isAcceptingMessages;
        session.user.username = token.username;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString(); // Convert ObjectId to string
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
        token.username = user.username;
      }
      return token;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
};
