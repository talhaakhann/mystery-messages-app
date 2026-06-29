'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { Message } from '@/models/Users'
import { toast } from "sonner"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AcceptMessageSchema } from '@/Schemas/acceptingMessageSchema'
import { useSession } from 'next-auth/react'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch'
import { Separator } from '@base-ui/react'
import { Loader2, RefreshCcw } from 'lucide-react'
import MessageCard from '@/components/MessageCard'

function Dashboard() {
    const [isSwitcingLoading, setIsSwitchingLoading] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [messages, setMessages] = useState<Message[]>([]);

    const handleDeleteMesssages = async (messageId: string) => {
        setMessages(
            messages.filter(
                (message) => message._id.toString() !== messageId
            )
        );
    }
    const { data: session } = useSession()

    const form = useForm({
        resolver: zodResolver(AcceptMessageSchema),
        defaultValues: {
            acceptMessages: false
        }
    })

    const { register, watch, setValue } = form
    const acceptMessages = watch('acceptMessages');

    const acceptFetchMessages = useCallback(async () => {
        setIsSwitchingLoading(true)
        try {
            const response = await axios.get<ApiResponse>('/api/accept-messages', {
                withCredentials: true,
            });
            setValue('acceptMessages', response.data.isAcceptingMessages ?? false);
        } catch (error) {
            console.log("Error in acceptingMessages ");
            const AxiosError = error as AxiosError<ApiResponse>
            toast("Error",
                {
                    description: AxiosError.response?.data?.message || "Failed to get new messages"
                })
        } finally {
            setIsSwitchingLoading(false)
        }
    }, [setValue])


    const fetchMessages = useCallback(async (refresh: boolean = false) => {
        setIsLoading(true)
        setIsSwitchingLoading(false)
        try {
            const response = await axios.get<ApiResponse>('/api/get-messages')
            setMessages(response.data.messages || [])

            toast("Successfully Refresh")
        } catch (error) {
            console.log("Error in Fetching messages", error);
            const AxiosError = error as AxiosError<ApiResponse>
            toast.error("Error",
                {
                    description: AxiosError?.response?.data.message || "Failed to get new messages"
                })
        } finally {
            setIsLoading(false)
            setIsSwitchingLoading(false)
        }
    }, [setIsLoading, setValue, toast])


    useEffect(() => {
        if (!session || !session.user) {
            return;
        }

        fetchMessages(),
        acceptFetchMessages()
    }, [session, fetchMessages, acceptFetchMessages]);


    const handleSwitchChange = async () => {
        try {
            const response = await axios.post<ApiResponse>('/api/accept-messages',
                { acceptMessages: !acceptMessages },
                {
                    withCredentials: true,
                }
            );
            setValue('acceptMessages', !acceptMessages)
            toast(response.data.message)
        } catch (error) {
            console.log("Error in switch accept Messages", error);
            const AxiosError = error as AxiosError<ApiResponse>
            toast.error("Error",
                {
                    description: AxiosError?.response?.data.message || "Failed to switch Accept Messages"
                })
        }
    }

    if (!session || !session.user) {
        return (
           <div></div>
        )
    }
    const username = session?.user?.username;
    const baseUrl = `${window.location.protocol}//${window.location.host}`

    const profileUrl = `${baseUrl}/u/${username}`

    const copiedToClipBoard = () => {
        navigator.clipboard.writeText(profileUrl)
        toast.info("Profile Url has been copied")
    }


    return (
        <div className='my-8 mx-4 md:mx-8 lg:mx-auto p-6  rounded w-full max-w-6xl '>
            <h1 className='text-4xl font-bold mb-4'>User Dashboard</h1>

            <div className='mb-4'>
                <h2 className='text-lg font-semibold mb-2'>
                    Copy your Unique Link
                </h2>
                <div className='flex items-center'>
                    <input
                        type="text"
                        value={profileUrl}
                        disabled
                        className="input input-bordered border-2 border-gray-100 rounded-lg w-full p-2 mr-2"
                    />
                    <Button className={'py-5 px-4'} onClick={copiedToClipBoard}>Copy</Button>
                </div>
            </div>

            <div className='mb-4'>
                <Switch
                    {...register('acceptMessages')}
                    checked={acceptMessages}
                    onCheckedChange={handleSwitchChange}
                    disabled={isSwitcingLoading}
                />
                <span className='ml-2'>
                    Accept Messages: {acceptMessages ? 'On' : 'Off'}
                </span>
            </div>
            <Separator />
            <Button className={'mt-4'}
                variant='outline'
                onClick={(e) => {
                    e.preventDefault();
                    fetchMessages(true)
                }}
            >
                {
                    isLoading ? (
                        <Loader2 className='h-4 w-4 animate-spin' />
                    ) : (
                        <RefreshCcw className='h-4 w-4' />
                    )
                }
            </Button>
            <div className='mt-4 grid grid-col-1 md:grid-cols-2 gap-6'>
                {messages.length > 0 ? (
                    messages.map((message, index) => (
                        <MessageCard
                            key={message._id.toString()}
                            message={message}
                            onMessageDelete={handleDeleteMesssages}
                        />
                    ))
                ) : (
                    <p>No messages to display.</p>
                )
                }
            </div>
        </div>
    )
}

export default Dashboard
