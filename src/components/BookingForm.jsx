import React, { useState } from 'react'
import { supabase } from '../supabaseClient'
import { format } from 'date-fns'

export default function BookingForm({ camera, range }){
  const [nome, setNome] = useState(''); const [cognome, setCognome] = useState(''); const [email, setEmail] = useState(''); const [telefono, setTelefono] = useState('')
  const [loading, setLoading] = useState(false); const [msg, setMsg] = useState(null)

  async function submit(e){
    e.preventDefault(); setLoading(true); setMsg(null)
    const start = format(range.startDate,'yyyy-MM-dd'); const end = format(range.endDate,'yyyy-MM-dd')
    try{
      const { data, error } = await supabase.from('prenotazioni').insert([{ camera_id: camera.id, nome, cognome, email, telefono, data_inizio: start, data_fine: end }])
      if(error) throw error
      setMsg({ type: 'success', text: 'Prenotazione registrata. Riceverai conferma via email se configurata.' })
      setNome(''); setCognome(''); setEmail(''); setTelefono('')
    }catch(err){ console.error(err); setMsg({ type:'error', text: err.message || 'Errore nella prenotazione' }) }
    setLoading(false)
  }

  return (
    <form onSubmit={submit} className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2">
      <input required placeholder="Nome" value={nome} onChange={e=>setNome(e.target.value)} className="border p-2" />
      <input required placeholder="Cognome" value={cognome} onChange={e=>setCognome(e.target.value)} className="border p-2" />
      <input required placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} className="border p-2" />
      <input placeholder="Telefono" value={telefono} onChange={e=>setTelefono(e.target.value)} className="border p-2" />
      <div className="col-span-1 md:col-span-2 flex items-center gap-2">
        <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">Conferma prenotazione</button>
        {msg && <div className={msg.type==='error'? 'text-red-600' : 'text-green-600'}>{msg.text}</div>}
      </div>
    </form>
  )
}
