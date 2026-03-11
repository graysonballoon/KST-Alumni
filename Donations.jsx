import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../App'

const BANNER_COLORS = ['#0f1f3d','#c9a84c','#2d7a4f','#6b3fa0','#c0392b','#1a6b8a']

export default function Events() {
  const { user, profile } = useAuth()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title:'', description:'', event_date:'', location:'', color:'#0f1f3d' })
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => { fetchEvents() }, [])

  async function fetchEvents() {
    const { data } = await supabase.from('events').select('*').order('event_date')
    setEvents(data||[])
    setLoading(false)
  }

  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  async function handleCreate(e) {
    e.preventDefault()
    setSaving(true)
    const { error } = await supabase.from('events').insert({ ...form, created_by: user.id })
    if (error) setMsg('Error: ' + error.message)
    else { setMsg('Event created!'); setShowForm(false); fetchEvents() }
    setSaving(false)
    setTimeout(() => setMsg(''), 3000)
  }

  async function handleDelete(id) {
    if (!confirm('Delete this event?')) return
    await supabase.from('events').delete().eq('id', id)
    fetchEvents()
  }

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
        <div>
          <h2 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:26, fontWeight:700, color:'var(--navy)' }}>Events</h2>
          <p style={{ fontSize:13, color:'var(--gray-400)', marginTop:2 }}>Chapter & alumni events</p>
        </div>
        {profile?.role === 'admin' && (
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ Create Event'}
          </button>
        )}
      </div>

      {msg && <div className="success-msg" style={{ marginBottom:16 }}>{msg}</div>}

      {showForm && profile?.role === 'admin' && (
        <div className="card" style={{ marginBottom:24 }}>
          <div className="card-header"><h3>New Event</h3></div>
          <div className="card-body">
            <form onSubmit={handleCreate}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>
                <div className="form-group" style={{ gridColumn:'1/-1' }}><label>Event Title *</label><input value={form.title} onChange={e=>set('title',e.target.value)} required /></div>
                <div className="form-group"><label>Date & Time *</label><input type="datetime-local" value={form.event_date} onChange={e=>set('event_date',e.target.value)} required /></div>
                <div className="form-group"><label>Location</label><input value={form.location} onChange={e=>set('location',e.target.value)} /></div>
                <div className="form-group" style={{ gridColumn:'1/-1' }}><label>Description</label><textarea value={form.description} onChange={e=>set('description',e.target.value)} /></div>
                <div className="form-group">
                  <label>Banner Color</label>
                  <div style={{ display:'flex', gap:8, marginTop:4 }}>
                    {BANNER_COLORS.map(c => (
                      <div key={c} onClick={() => set('color', c)} style={{
                        width:24, height:24, borderRadius:'50%', background:c, cursor:'pointer',
                        border: form.color === c ? '3px solid var(--navy)' : '2px solid transparent',
                        outline: form.color === c ? '2px solid var(--gold)' : 'none'
                      }} />
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ display:'flex', justifyContent:'flex-end' }}>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Create Event'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? <div className="loading"><div className="spinner" /></div> : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:16 }}>
          {events.length === 0 && <div className="loading" style={{ gridColumn:'1/-1' }}><p>No events scheduled yet.</p></div>}
          {events.map(ev => {
            const d = new Date(ev.event_date)
            const isPast = d < new Date()
            return (
              <div key={ev.id} className="card" style={{ opacity: isPast ? 0.65 : 1, transition:'var(--transition)' }}
                onMouseEnter={e=>!isPast && (e.currentTarget.style.transform='translateY(-2px)')}
                onMouseLeave={e=>e.currentTarget.style.transform='none'}>
                <div style={{ height:6, background: ev.color || 'var(--navy)', borderRadius:'10px 10px 0 0' }} />
                <div style={{ padding:20 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                    <h4 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:18, fontWeight:600, color:'var(--navy)', marginBottom:6 }}>{ev.title}</h4>
                    {isPast && <span style={{ fontSize:11, padding:'2px 8px', borderRadius:10, background:'var(--gray-100)', color:'var(--gray-400)' }}>Past</span>}
                  </div>
                  {ev.description && <p style={{ fontSize:13, color:'var(--gray-600)', marginBottom:14, lineHeight:1.5 }}>{ev.description}</p>}
                  <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
                    <span style={{ fontSize:12, color:'var(--gray-400)' }}>📅 {d.toLocaleDateString('en-US',{weekday:'short',month:'long',day:'numeric',year:'numeric'})} · {d.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'})}</span>
                    {ev.location && <span style={{ fontSize:12, color:'var(--gray-400)' }}>📍 {ev.location}</span>}
                  </div>
                  <div style={{ display:'flex', gap:8, marginTop:14 }}>
                    {!isPast && <button className="btn btn-primary btn-sm" style={{ flex:1, justifyContent:'center' }}>RSVP</button>}
                    {profile?.role === 'admin' && (
                      <button className="btn btn-outline btn-sm" onClick={() => handleDelete(ev.id)}>Delete</button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
