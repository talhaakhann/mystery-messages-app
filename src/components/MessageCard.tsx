import React, { startTransition } from 'react'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from './ui/button'
import dayjs from 'dayjs';
import { X } from 'lucide-react'
import { Message } from '@/models/Users'
import axios, { AxiosError } from 'axios'
import { toast } from "sonner";
import { ApiResponse } from '@/types/ApiResponse';

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

export default function MessageCard({ message, onMessageDelete }: MessageCardProps) {

    const handleDeleteConfirm = async () => {
        try {
            const response = await axios.delete<ApiResponse>(
                `/api/delete-message/${message._id}`
            );
            toast(response.data.message);
            onMessageDelete(message._id.toString());

        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast.error(
                axiosError.response?.data.message ?? 'Failed to delete message',
            );
        }
    }
        return (
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>{message.content}</CardTitle>
                            <AlertDialog>
                                <AlertDialogTrigger render={<Button variant="destructive" />}>
                                    <X className='w-5 h-5' />
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Are you really want to delete this message
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDeleteConfirm()}>Continue</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </CardHeader>
                    <div className="text-sm ml-4">
                        {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}
                    </div>
                    <CardContent></CardContent>
                </Card>
        )
    }

