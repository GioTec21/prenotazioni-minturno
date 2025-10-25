import React, { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import BookingForm from './BookingForm'
import RoomCard from './RoomCard'
import { format } from 'date-fns'

export default function RoomsList({ camere, range }){
  const [available, setAvailable] = useState({})

  useEffect(()=>{
    if(!range.startDate || !range.endDate) return
    checkAvailability()
  },[camere, range])

  async function checkAvailability(){
    const s = format(range.startDate, 'yyyy-MM-dd')
    const e = format(range.endDate, 'yyyy-MM-dd')
    const avail = {}
    for(const c of camere){
      const { data } = await supabase.from('prenotazioni')
        .select('id')
        .eq('camera_id', c.id)
        .or(`(data_inizio.lt.${e},data_fine.gt.${s})`)
      avail[c.id] = !(data && data.length > 0)
    }
    setAvailable(avail)
  }

  return (
    <div>
      {camere.map(camera => (
        <RoomCard key={camera.id} camera={camera}>
          {range.startDate && range.endDate ? (
            available[camera.id] ? <BookingForm camera={camera} range={range} /> : <div className="text-red-600">Non disponibile per le date selezionate</div>
          ) : <div className="text-gray-500">Seleziona date per vedere disponibilità</div>}
        </RoomCard>
      ))}
    </div>
  )
}
