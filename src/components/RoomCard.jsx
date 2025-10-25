import React from 'react'
export default function RoomCard({ camera, children }){
  return (
    <div className="border rounded p-4 mb-3 flex gap-4">
      <div className="w-32 h-24 bg-gray-100 flex items-center justify-center overflow-hidden">
        {camera.immagine ? <img src={camera.immagine} alt={camera.nome} className="w-full h-full object-cover" /> : <div className="text-sm">Nessuna immagine</div>}
      </div>
      <div className="flex-1">
        <h3 className="font-semibold">{camera.nome} — €{camera.prezzo}/notte</h3>
        <p className="text-sm">{camera.descrizione}</p>
        <div className="mt-2">{children}</div>
      </div>
    </div>
  )
}
