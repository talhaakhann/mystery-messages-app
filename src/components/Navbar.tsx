'use client'

import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'
import Link from 'next/link'
import { Button } from './ui/button'

function Navbar() {
    const { data: session } = useSession()
    const user: User = session?.user as User
    return (
        <nav className="shadow-md  bg-gray-900 text-white px-4 py-4 md:px-6">
            <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:flex-row">
                <Link
                    href="/"
                    className="text-xl font-bold text-center md:text-left"
                >
                    MystMail
                </Link>

             
                    {session ? (
                        <div className="flex flex-col items-center gap-3 md:flex-row md:gap-4">
                            <span className="text-sm text-center md:text-base">
                                Welcome, {user?.username} | {user?.email}
                            </span>

                            <Button
                                className="w-full md:w-auto"
                                variant={"secondary"}
                                onClick={() => signOut({
                                    redirect: true,
                                    callbackUrl: "/",
                                })}
                            >
                                Logout
                            </Button>
                        </div>
                    ) : (
                        <>
                        <div className='flex gap-4'>

                            <Link href="/sign-in">
                                <Button className="w-full md:w-auto" variant={"secondary"}>
                                    Login
                                </Button>
                            </Link>
                            <Link href="/sign-up">
                                <Button className="w-full md:w-auto" variant={"secondary"}>
                                    SignUp
                                </Button>
                            </Link>
                        </div>
                        </>
                    )}
                </div>
        </nav>
    )
}

export default Navbar
