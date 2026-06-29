"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod"
import { toast } from "sonner";
import { ApiResponse } from "@/types/ApiResponse";
import { Field, FieldError, FieldLabel, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { signInSchema } from "@/Schemas/signInSchema";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";

export default function Page() {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            identifier: "",
            password: ""
        }
    })
    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
        try {
            setIsSubmitting(true)
            const result = await signIn('credentials', {
                redirect: false,
                identifier: data.identifier,
                password: data.password
            })


            if (result?.error) {
                if (result.error === 'CredentialsSignin') {
                    toast.error('Login Failed || Incorrect username or password')
                }
            }

            toast("Login Successfull")

            if (result?.url) {
                router.replace('/dashboard')
            }

        } catch (error) {
            console.log("Error in signIn user");
            const AxiosError = error as AxiosError<ApiResponse>
            let errorMessage = AxiosError.response?.data.message
            toast.error("SignIn Failed",
                {
                    description: errorMessage
                })
        } finally {
            setIsSubmitting(false)
        }
    }
    return (<div className='flex justify-center items-center min-h-screen bg-gray-100'>
        <div className='w-full max-w-md p-8 spacey-8 bg-white rounded-lg shadow-md'>
            <div className='text-center text-black'>
                <h1 className='text-4xl font-extrabold tracking-tight lg-:text-5xl mb-6'>
                    Join Mystery Message
                </h1>
                <p className='mb-4'>
                    Sign In to start your anonymous adventure
                </p>
            </div>
            <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                <FieldGroup>
                    <Controller
                        name="identifier"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="form-rhf-demo-title">
                                    Username/Email
                                </FieldLabel>
                                <Input
                                    {...field}
                                    id="form-rhf-demo-title"
                                    aria-invalid={fieldState.invalid}
                                    placeholder="Enter username or email"
                                    autoComplete="off"

                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                    <Controller
                        name="password"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="form-rhf-demo-title">
                                    Password
                                </FieldLabel>
                                <Input
                                    {...field}
                                    id="form-rhf-demo-title"
                                    aria-invalid={fieldState.invalid}
                                    placeholder="password"
                                    autoComplete="off"

                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                </FieldGroup>
                <Button type="submit" id="form-rhf-demo" disabled={isSubmitting}>
                    {
                        isSubmitting ? (
                            <>
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait
                            </>
                        ) : ('Sign-In')
                    }
                </Button>
            </form>
            <div className='text-center mt-4'>
                <p>
                    New Member ?{' '}
                    <Link href='/sign-up' className="text-blue-600 hover:text-blue-800">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    </div>
    )
}

