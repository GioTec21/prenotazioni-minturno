export function buildIcs(events, camId){
  const lines = ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Room&Relax//IT']
  events.forEach((ev,i)=>{
    const uid = `room-${camId}-${i}@room-relax`
    lines.push('BEGIN:VEVENT')
    lines.push('UID:'+uid)
    lines.push('DTSTAMP:'+ (ev.start.replace(/-/g,'') + 'T000000'))
    lines.push('DTSTART;VALUE=DATE:'+ev.start)
    lines.push('DTEND;VALUE=DATE:'+ev.end)
    lines.push('SUMMARY:'+ (ev.title || 'Prenotazione'))
    lines.push('END:VEVENT')
  })
  lines.push('END:VCALENDAR')
  return lines.join('\r\n')
}
