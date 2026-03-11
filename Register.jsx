import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../App'
import { getColor, initials } from '../components/Layout'

export default function Dashboard() {
  const { profile } = useAuth()
  const [stats, setStats] = useState({ total:0, alumni:0 })
  const [recent, setRecent] = useState([])
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([fetchStats(), fetchRecent(), fetchEvents()]).then(() => setLoading(false))
  }, [])

  async function fetchStats() {
    const { count: total } = await supabase.from('profiles').select('*', { count:'exact', head:true })
    const { count: alumni } = await supabase.from('profiles').select('*', { count:'exact', head:true }).eq('status','Alumni')
    setStats({ total: total||0, alumni: alumni||0 })
  }
  async function fetchRecent() {
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending:false }).limit(5)
    setRecent(data||[])
  }
  async function fetchEvents() {
    const { data } = await supabase.from('events').select('*').gte('event_date', new Date().toISOString()).order('event_date').limit(4)
    setEvents(data||[])
  }

  if (loading) return <div className="loading"><div className="spinner" /></div>

  const statCards = [
    { label:'Total Members', value: stats.total, delta:'Growing strong' },
    { label:'Active Alumni', value: stats.alumni, delta:'Connected network' },
    { label:'Chapter', value:'ΚΣΤ', delta:'Kappa Sigma Tau' },
    { label:'Founded', value:'UT', delta:'Austin, Texas' },
  ]

  return (
    <div>
      <div style={{ marginBottom:28 }}>
        <h2 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:28, fontWeight:700, color:'var(--navy)' }}>
          Welcome back, {profile?.first_name} 👋
        </h2>
        <p style={{ color:'var(--gray-400)', fontSize:14, marginTop:4 }}>Here's what's happening in the brotherhood</p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:28 }}>
        {statCards.map(s => (
          <div key={s.label} className="card" style={{ padding:'20px 22px', cursor:'default', transition:'var(--transition)' }}>
            <div style={{ fontSize:11, textTransform:'uppercase', letterSpacing:'0.1em', color:'var(--gray-400)', fontWeight:600, marginBottom:8 }}>{s.label}</div>
            <div style={{ fontFamily:'Cormorant Garamond,serif', fontSize:38, fontWeight:700, color:'var(--navy)', lineHeight:1 }}>{s.value}</div>
            <div style={{ fontSize:12, color:'var(--success)', marginTop:6 }}>{s.delta}</div>
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:20 }}>
        <div className="card">
          <div className="card-header">
            <h3>Recent Members</h3>
            <Link to="/directory" className="btn btn-outline btn-sm">View All</Link>
          </div>
          <div className="card-body">
            {recent.length === 0 && <p style={{ color:'var(--gray-400)', fontSize:14 }}>No members yet.</p>}
            {recent.map(m => {
              const [bg, fg] = getColor(`${m.first_name}${m.last_name}`)
              return (
                <Link to={`/profile/${m.id}`} key={m.id} style={{
                  display:'flex', alignItems:'center', gap:12,
                  padding:'10px 0', borderBottom:'1px solid var(--gray-100)',
                  textDecoration:'none', transition:'var(--transition)'
                }}>
                  <div className="avatar" style={{ width:38, height:38, background:bg, color:fg, fontSize:14 }}>
                    {initials(m.first_name, m.last_name)}
                  </div>
                  <div style={{ flex:1 }}>
                    <strong style={{ fontSize:14, fontWeight:500, color:'var(--gray-800)', display:'block' }}>{m.first_name} {m.last_name}</strong>
                    <span style={{ fontSize:12, color:'var(--gray-400)' }}>{m.title || 'Member'} · {m.location || 'Location TBD'}</span>
                  </div>
                  <span className={`badge badge-${(m.status||'active').toLowerCase()}`}>{m.status}</span>
                </Link>
              )
            })}
          </div>
        </div>

        <div className="card">
          <div className="card-header"><h3>Upcoming Events</h3></div>
          <div className="card-body">
            {events.length === 0 && <p style={{ color:'var(--gray-400)', fontSize:14 }}>No upcoming events.</p>}
            {events.map(ev => {
              const d = new Date(ev.event_date)
              return (
                <div key={ev.id} style={{ display:'flex', gap:14, padding:'12px 0', borderBottom:'1px solid var(--gray-100)' }}>
                  <div style={{ width:42, textAlign:'center', flexShrink:0 }}>
                    <div style={{ fontFamily:'Cormorant Garamond,serif', fontSize:26, fontWeight:700, color:'var(--navy)', lineHeight:1 }}>
                      {d.getDate()}
                    </div>
                    <div style={{ fontSize:10, textTransform:'uppercase', letterSpacing:'0.1em', color:'var(--gold)', fontWeight:600 }}>
                      {d.toLocaleString('default',{month:'short'})}
                    </div>
                  </div>
                  <div>
                    <strong style={{ fontSize:14, fontWeight:500, color:'var(--gray-800)', display:'block' }}>{ev.title}</strong>
                    <span style={{ fontSize:12, color:'var(--gray-400)' }}>{ev.location}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
