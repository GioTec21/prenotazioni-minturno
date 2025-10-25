import React, { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import CalendarPicker from '../components/CalendarPicker'
import RoomsList from '../components/RoomsList'

export default function Home(){
  const [camere, setCamere] = useState([])
  const [range, setRange] = useState({ startDate: null, endDate: null })

  useEffect(()=>{ fetchCamere() },[])

  async function fetchCamere(){
    const { data, error } = await supabase.from('camere').select('*').eq('disponibile', true).order('id')
    if(error) { console.error(error); return }
    setCamere(data || [])
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Room&Relax — Prenota</h1>
      <CalendarPicker range={range} setRange={setRange} />
      <RoomsList camere={camere} range={range} />
    </div>
  )
}
