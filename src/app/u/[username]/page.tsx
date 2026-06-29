'use client'
import { messageSchema } from '@/Schemas/messageSchema';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useParams } from 'next/navigation';
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useCompletion } from '@ai-sdk/react'
import * as z from "zod"
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const specialChar = '||';

const parseStringMessages = (messageString: string): string[] => {
  return messageString.split(specialChar)
}

const initialMessageString =
  "What's your favorite movie?||Do you have any pets?||What's your dream job?";

function SendMessage() {
  const [isLoading, setIsLoading] = useState(false);
  const params = useParams();
  const username = params.username

  const {
    complete,
    completion,
    isLoading: isSuggestLoading,
    error
  } = useCompletion({
    api: '/api/suggest-messages',
    initialCompletion: initialMessageString,
    streamProtocol: "text"
  })

  const form = useForm({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: ""
    }
  })

  const messageContent = form.watch('content')

  const handleMessageClick = (message: string) => {
    form.setValue('content', message)
  }

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    try {
      setIsLoading(true)
      await axios.post('/api/send-message', { ...data, username })
      toast("Successfully sent the message")
    } catch (error) {
      console.log("Error in sending message");
      const axiosError = error as AxiosError<ApiResponse>
      let errorMessage = axiosError.response?.data.message
      toast(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchSuggestedMessages = () => {
    try {
      complete('')
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }

  return (
    <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Public Profile Link
      </h1>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <Controller
          name="content"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="message-input">
                Message
              </FieldLabel>
              <Textarea
                {...field}
                id="message-input"
                aria-invalid={fieldState.invalid}
                placeholder="Write your anonymous message here"
                autoComplete="off"
                className="resize-none"
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        <Button type="submit" disabled={isLoading || !messageContent}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </>
          ) : (
            'Send It'
          )}
        </Button>
      </form>

      <Separator className="my-6" />

      <div className="space-y-4 my-8">
        <div className="space-y-2">
          <Button
            type="button"
            onClick={fetchSuggestedMessages}
            className="my-4"
            disabled={isSuggestLoading}
          >
            Suggest Messages AI
          </Button>
          <p>Click on any message below to select it.</p>
          <Card>
            <CardHeader>
              <h3 className="text-xl font-semibold">Messages</h3>
            </CardHeader>
            <CardContent className="flex flex-col space-y-4">
              {isSuggestLoading ? (
                <div className="flex justify-center">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              )
              :error ? (
                <p className="text-red-500">{error.message}</p>
              ) : (
                parseStringMessages(completion).map((message, index) => (
                  <Button
                    key={index}
                    type="button"
                    variant='outline'
                    className="mb-2"
                    onClick={() => handleMessageClick(message)}
                  >
                    {message}
                  </Button>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        <Separator className="my-6" />

        <div className="text-center">
          <div className="mb-4">Get Your Message Board</div>
          <Link href='/sign-up'>
            <Button type="button" >Create Your Account</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default SendMessage