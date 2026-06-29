📬 MystMail

Mail Without a Face — send anonymous mystery messages to anyone via their personal link.

Features

OTP email verification on sign up
Unique shareable link per user (/u/[username])
Anyone can send anonymous messages — no account needed
AI-powered question suggestions (Gemini)
Dashboard to view and delete received messages

Tech Stack

Next.js (App Router) — frontend & backend
MongoDB — database
NextAuth.js + Resend — auth & OTP email
Zod — validation
Gemini AI — question suggestions

Getting Started

bashgit clone https://github.com/yourusername/mystmail.git
cd mystmail
npm install
cp .env.example .env.local
npm run dev

