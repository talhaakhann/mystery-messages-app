"use client";
import { verifySchema } from "@/Schemas/verifySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod"
import { toast } from "sonner";
import { useParams } from "next/navigation";
import {ApiResponse} from "@/types/ApiResponse";
import { Field, FieldError, FieldLabel, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function Page() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const params = useParams();

    
    const router = useRouter();
    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
        defaultValues: {
            code: ''
        }
    })
    console.log(form.formState.errors);
    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        console.log("Submitted")
        try {
            setIsSubmitting(true)
            const response = await axios.post(`/api/verify-code`, {
                username: params.username,
                code: data.code
            })
            let message = response?.data.message
            toast("Success", {
                description:message
            })
            router.replace('/sign-in')

        } catch (error) {
            console.log("Error in signup user");
            const AxiosError = error as AxiosError<ApiResponse>
            let errorMessage = AxiosError.response?.data.message
            toast("Code Verification Failed",
                {
                    description: errorMessage
            },
            )
        } finally {
            setIsSubmitting(false)
        }
    }
    return (
        <div className='flex justify-center items-center min-h-screen bg-gray-100'>
            <div className='w-full max-w-md p-8 spacey-8 bg-white rounded-lg shadow-md'>
                <div className='text-center text-black'>
                    <h1 className='text-4xl font-extrabold tracking-tight lg-:text-5xl mb-6'>
                        Verify you account
                    </h1>
                    <p className='mb-4'>
                        Enter the verification code send to your email
                    </p>
                </div>
                <form id="form-rhf-demo1" onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                    <FieldGroup>

                        <Controller
                            name="code"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="form-rhf-demo-title">
                                        Code
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="form-rhf-demo-title"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Enter the code"
                                        autoComplete="off"

                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                    </FieldGroup>
                    <Button type="submit" id="form-rhf-demo1" disabled={isSubmitting}>
                        {
                            isSubmitting ? (
                                <>
                                    <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait
                                </>
                            ) : ('Submit')
                        }
                    </Button>
                </form>
            </div>
        </div>
    )
}

;
