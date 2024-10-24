'use client'

import MeetingTypeList from '@/components/MeetingTypeList';
import NextMeeting from '@/components/NextMeeting';
import React, { useEffect, useState } from 'react'

const Home = () => {

  const [currentTime, setCurrentTime] = useState({
    time: '',
    date: ''
  });

  const { time, date } = currentTime

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const time = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
      const date = new Intl.DateTimeFormat('en-US', {
        dateStyle: 'full',
      }).format(now);

      setCurrentTime({ time, date });
    };

    // Actualizar la hora al cargar la página
    updateTime();

    // Establecer un intervalo para actualizar cada minuto (60000 ms)
    const intervalId = setInterval(updateTime, 3000);

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(intervalId);
  }, []);


  return (
    <section className='flex size-full flex-col gap-10 text-white'>
      <div className="h-[300px] w-full rounded-[20px] bg-hero bg-cover">
        <div className="flex h-full flex-col justify-between max-md:px-5 max-md:py-8 lg:p-11">
          <div className='glassmorphism max-w-[400px] rounded py-2 items-center justify-center text-base font-normal flex gap-2'>
            <h2 className='text-base font-normal'>Upcoming Meeting at: </h2>
            <NextMeeting type='upcoming' />
          </div>
          <div className="flex flex-col gap2">
            <h1 className='text-4xl font-extrabold lg:text-7xl'>
              {time}
            </h1>
            <p className='text-lg font-medium text-sky-1 lg:text-2xl'>{date}</p>
          </div>
        </div>
      </div>

      <MeetingTypeList />
    </section>
  )

}


export default Home