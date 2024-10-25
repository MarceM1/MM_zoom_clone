/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

'use client'
import { useGetCalls } from '@/hooks/useGetCalls'

import {  CallRecording } from '@stream-io/video-react-sdk'
// import { useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import Loader from './Loader'
import { useToast } from './ui/use-toast'


const NextMeeting = ({ type }: { type: 'ended' | 'upcoming' | 'recordings' }) => {
    const { endedCalls, upcomingCalls, callRecordings, isLoading } = useGetCalls()
    // const router = useRouter();
    const [recordings, setRecordings] = useState<CallRecording[]>([])

    const { toast } = useToast();

    const getCalls = () => {
        switch (type) {
            case 'ended':
                return endedCalls

            case 'recordings':
                return recordings

            case 'upcoming':
                return upcomingCalls

            default:
                return ['empty'];
        }
    }

    // const getNoCallsMessage = () => {
    //     switch (type) {
    //         case 'ended':
    //             return 'No Previous Calls'

    //         case 'recordings':
    //             return 'No Recordings'

    //         case 'upcoming':
    //             return 'No Upcomings Calls'

    //         default:
    //             return '';
    //     }
    // }

    useEffect(() => {
        const fetchRecordings = async () => {
            try {
                const callData = await Promise.all(callRecordings?.map((meeting) => meeting.queryRecordings()) ?? [])
                const recordings = callData
                    .filter(call => call.recordings.length > 0)
                    .flatMap(call => call.recordings)


                setRecordings(recordings)
            } catch (error) {
                console.log(error)
                toast({
                    title: 'Try again later'
                })
            }
        }

        if (type === 'recordings') { fetchRecordings() };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [type, callRecordings])

    if (isLoading) return <Loader />

    const calls = getCalls();
    // const noCallsMessage = getNoCallsMessage();


    // console.log('calls:', calls)
    return (

        <h2 className='text-base font-normal'>{
            calls && calls.length > 0 ? calls[0].state?.startsAt.toLocaleString() || calls[0].start_time?.toLocaleString() : 'All clean!'
        }</h2>

    )
}

export default NextMeeting