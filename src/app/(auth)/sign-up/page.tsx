"use client"

import React, { useEffect, useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"
import { useDebounceValue } from 'usehooks-ts'
import { toast } from "sonner"
import { useRouter } from 'next/navigation'
import { signUpSchema } from '@/Schemas/signUpSchema'
import axios, { AxiosError } from "axios"
import {ApiResponse} from '@/types/ApiResponse'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from '@/components/ui/input'
import { Button } from "@/components/ui/button";
import { Loader2 } from 'lucide-react'
import Link from 'next/link'


function Page() {
  const [username, setUsername] = useState('');
  const [usernameMessage, setUsernameMessage] = useState('')
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [debouncedUsername] = useDebounceValue(username, 300)
  const router = useRouter()
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: ""
    }
  })
  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (!debouncedUsername) {
        setIsCheckingUsername(false)
        setUsernameMessage('')
        return ;
      }
      try {
        const response = await axios.get(`/api/check-username-unique?username=${debouncedUsername}`)
        let message = response.data.message
        setUsernameMessage(message)

      } catch (error) {
        const AxiosError = error as AxiosError<ApiResponse>
        setUsernameMessage(AxiosError.response?.data.message || "Error checking username")
      } finally {
        setIsCheckingUsername(false)
      }
    }
    checkUsernameUnique();
  }, [debouncedUsername])

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true)
    try {
      const response = await axios.post('/api/sign-up', data)
      toast("Success", {
        description: response.data.message
      })
      router.replace(`/verify/${username}`)
    } catch (error) {
      console.log("Error in signup user");
      const AxiosError = error as AxiosError<ApiResponse>
      let errorMessage = AxiosError.response?.data.message
      toast("Signup Failed",
        {
          description: errorMessage
        })
    } finally {
      setIsSubmitting(false)
    }

  }

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100'>
      <div className='w-full max-w-md p-8 spacey-8 bg-white rounded-lg shadow-md'>
        <div className='text-center text-black'>
          <h1 className='text-4xl font-extrabold tracking-tight lg-:text-5xl mb-6'>
            Join Mystery Message
          </h1>
          <p className='mb-4'>
            Sign up to start your anonymous adventure
          </p>
        </div>
        <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <FieldGroup>
            <Controller
              name="username"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-title">
                    Username
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-demo-title"
                    aria-invalid={fieldState.invalid}
                    placeholder="Username"
                    autoComplete="off"
                    onChange={(e) => {
                      field.onChange(e)
                      setUsername(e.target.value)
                    }}
                  />
                  {isCheckingUsername && <Loader2 className='animate-spin' />}
                  <p className={`text-sm ${usernameMessage === "Username is Available"
                      ? "text-green-500"
                      : "text-red-500"
                    }`}>
                   {usernameMessage}
                  </p>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-title">
                    Email
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-demo-title"
                    aria-invalid={fieldState.invalid}
                    placeholder="Email"
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
                    placeholder="Password"
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
              ) : ('Sign-up')
            }
          </Button>
        </form>
        <div className='text-center mt-4'>
          <p>
            Already member ?{' '}
            <Link href='/sign-in' className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Page

