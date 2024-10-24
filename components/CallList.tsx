// @ts-nocheck

'use client'
import { useGetCalls } from '@/hooks/useGetCalls'

import { Call, CallRecording } from '@stream-io/video-react-sdk'
import { useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import MeetingCard from './MeetingCard'
import Loader from './Loader'
import { useToast } from './ui/use-toast'


const CallList = ({ type }: { type: 'ended' | 'upcoming' | 'recordings' }) => {
	const { endedCalls, upcomingCalls, callRecordings, isLoading } = useGetCalls()
	const router = useRouter();
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
				return [];
		}
	}

	const getNoCallsMessage = () => {
		switch (type) {
			case 'ended':
				return 'No Previous Calls'

			case 'recordings':
				return 'No Recordings'

			case 'upcoming':
				return 'No Upcomings Calls'

			default:
				return '';
		}
	}

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
					title: 'try again later'
				})
			}
		}

		if (type === 'recordings') { fetchRecordings() };
	}, [type, callRecordings])

	if (isLoading) return <Loader />

	const calls = getCalls();
	const noCallsMessage = getNoCallsMessage();


	// console.log('calls:', calls)
	return (
		<div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
			{calls && calls.length > 0 ? calls.map((meeting: Call | CallRecording) => (
				<MeetingCard key={(meeting as Call)?.id}
					icon={
						type === 'ended'
							? '/icons/previous.svg'
							: type === 'upcoming'
								? '/icons/upcoming.svg'
								: '/icons/recordings.svg'
					}
					title={(meeting as Call).state?.custom.description.substring(0, 26) || meeting.filename.substring(0, 26) || 'No Description'}
					date={meeting.state?.startsAt.toLocaleString() || meeting.start_time.toLocaleString()}
					isPreviousMeeting={type === 'ended'}
					buttonIcon1={type === 'recordings'
						? '/icons/play.svg'
						: undefined}
					handleClick={type === 'recordings'
						? () => router.push(`${meeting.url}`)
						: () => router.push(`/meeting/${meeting.id}`)}
					link={type === 'recordings'
						? meeting.url
						: `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${meeting.id}`}
					buttonText={type === 'recordings'
						? 'Play'
						: 'Start'}
				/>
			)) : (
				<h1>{noCallsMessage}</h1>
			)}
		</div>
	)
}

export default CallList