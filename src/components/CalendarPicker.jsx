import React from 'react'
import { DateRange } from 'react-date-range'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'

export default function CalendarPicker({ range, setRange }){
  const selection = {
    startDate: range.startDate || new Date(),
    endDate: range.endDate || new Date(new Date().getTime()+24*60*60*1000),
    key: 'selection'
  }
  return (
    <div className="mb-6">
      <DateRange ranges={[selection]} onChange={ranges => { const s = ranges.selection.startDate; const e = ranges.selection.endDate; setRange({ startDate: s, endDate: e }) }} months={2} direction="horizontal" scroll={{ enabled: true }} />
    </div>
  )
}
