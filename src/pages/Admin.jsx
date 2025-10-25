import React, { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { buildIcs } from '../utils/ical'

export default function Admin(){
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [settings, setSettings] = useState(null)
  const [camere, setCamere] = useState([])
  const [prenotazioni, setPrenotazioni] = useState([])
  const [selectedCamera, setSelectedCamera] = useState(null)
  const [closures, setClosures] = useState([])

  useEffect(()=>{ fetchData() },[])

  async function fetchData(){
    const { data: s } = await supabase.from('admin_settings').select('*').limit(1)
    setSettings(s?.[0])
    const { data: c } = await supabase.from('camere').select('*').order('id')
    setCamere(c || [])
    const { data: p } = await supabase.from('prenotazioni').select('*').order('data_prenotazione', { ascending: false })
    setPrenotazioni(p || [])
    const { data: cl } = await supabase.from('closures').select('*').order('start_date', { ascending: false })
    setClosures(cl || [])
  }

  function checkLogin(e){ e.preventDefault(); if(!settings) return alert('Admin non trovato'); if(password === settings.password) setAuthed(true); else alert('Password errata') }

  async function changePassword(newPass){ await supabase.from('admin_settings').upsert({ id:1, password: newPass }); fetchData(); alert('Password aggiornata') }

  async function toggleDisponibile(id){ const cam = camere.find(x=>x.id===id); await supabase.from('camere').update({ disponibile: !cam.disponibile }).eq('id', id); fetchData() }

  async function deleteBooking(id){ if(!confirm('Eliminare prenotazione?')) return; await supabase.from('prenotazioni').delete().eq('id', id); fetchData() }

  async function addClosure(camId, start, end){ if(!start||!end) return alert('Seleziona date'); await supabase.from('closures').insert([{ camera_id: camId, start_date: start, end_date: end }]); fetchData() }

  function exportIcalForCamera(camId){
    const events = prenotazioni.filter(p=>p.camera_id===camId).map(p=>({ start: p.data_inizio, end: p.data_fine, title: `${p.nome} ${p.cognome}` }))
    const cls = closures.filter(c=>c.camera_id===camId).map(c=>({ start: c.start_date, end: c.end_date, title: 'Chiusura' }))
    const ics = buildIcs([...events, ...cls], camId)
    const blob = new Blob([ics], { type: 'text/calendar' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = `room-${camId}.ics`; a.click(); URL.revokeObjectURL(url)
  }

  if(!authed) return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Accesso Admin — Room&Relax</h2>
      <form onSubmit={checkLogin} className="flex gap-2">
        <input type="password" placeholder="Password admin" value={password} onChange={e=>setPassword(e.target.value)} className="border p-2" />
        <button className="bg-green-600 text-white px-3 py-1 rounded" type="submit">Entra</button>
      </form>
      <p className="text-sm mt-2">Password iniziale: <code>admin</code>.</p>
    </div>
  )

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Dashboard Admin — Room&Relax</h2>

      <section className="mb-6">
        <h3 className="font-semibold">Imposta nuova password admin</h3>
        <input id="newpass" placeholder="Nuova password" className="border p-2 mr-2" />
        <button onClick={()=>changePassword(document.getElementById('newpass').value)} className="bg-yellow-500 text-white px-3 py-1 rounded">Salva</button>
      </section>

      <section className="mb-6">
        <h3 className="font-semibold">Camere</h3>
        {camere.map(c=>(
          <div key={c.id} className="border p-3 mb-2 flex justify-between items-center">
            <div><strong>{c.nome}</strong> — €{c.prezzo} — {c.disponibile ? 'Aperta' : 'Chiusa'}</div>
            <div className="flex gap-2">
              <button onClick={()=>toggleDisponibile(c.id)} className="px-2 py-1 border rounded">Toggle</button>
              <button onClick={()=>{ setSelectedCamera(c); }} className="px-2 py-1 border rounded">Calendario</button>
              <button onClick={()=>exportIcalForCamera(c.id)} className="px-2 py-1 border rounded">Esporta iCal</button>
            </div>
          </div>
        ))}
      </section>

      <section className="mb-6">
        <h3 className="font-semibold">Calendario camera selezionata</h3>
        {selectedCamera ? (
          <div>
            <h4 className="font-medium mb-2">{selectedCamera.nome}</h4>
            <p className="text-sm mb-2">Aggiungi periodo di chiusura:</p>
            <input id="close_start" type="date" className="border p-2 mr-2" />
            <input id="close_end" type="date" className="border p-2 mr-2" />
            <button onClick={()=>addClosure(selectedCamera.id, document.getElementById('close_start').value, document.getElementById('close_end').value)} className="bg-red-600 text-white px-3 py-1 rounded">Aggiungi chiusura</button>
            <div className="mt-4">
              <h5 className="font-semibold">Chiusure presenti</h5>
              {closures.filter(cl=>cl.camera_id===selectedCamera.id).map(cl=>(<div key={cl.id} className="border p-2 my-2">{cl.start_date} → {cl.end_date} — {cl.note || ''}</div>))}
            </div>
          </div>
        ) : <div className="text-sm">Seleziona una camera e clicca su “Calendario”</div>}
      </section>

      <section>
        <h3 className="font-semibold">Prenotazioni</h3>
        {prenotazioni.map(p=>(
          <div key={p.id} className="border p-3 mb-2">
            <div className="flex justify-between">
              <div>{p.nome} {p.cognome} — {p.email}</div>
              <div>{p.data_inizio} → {p.data_fine}</div>
            </div>
            <div className="mt-2 flex gap-2">
              <button onClick={()=>deleteBooking(p.id)} className="px-2 py-1 border rounded">Elimina</button>
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}
