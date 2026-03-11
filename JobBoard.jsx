import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { getColor, initials } from '../components/Layout'

export default function Directory() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [searchParams] = useSearchParams()
  const q = searchParams.get('q') || ''

  useEffect(() => { fetchMembers() }, [filter, q])

  async function fetchMembers() {
    setLoading(true)
    let query = supabase.from('profiles').select('*').order('first_name')
    if (filter !== 'all') query = query.eq('status', filter.charAt(0).toUpperCase()+filter.slice(1))
    if (q) query = query.or(`first_name.ilike.%${q}%,last_name.ilike.%${q}%,employer.ilike.%${q}%,location.ilike.%${q}%,major.ilike.%${q}%`)
    const { data } = await query
    setMembers(data||[])
    setLoading(false)
  }

  const filters = ['all','Active','Alumni','Pledge']

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:22 }}>
        <div>
          <h2 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:26, fontWeight:700, color:'var(--navy)' }}>Member Directory</h2>
          {q && <p style={{ fontSize:13, color:'var(--gray-400)', marginTop:2 }}>Results for "{q}"</p>}
        </div>
      </div>

      <div style={{ display:'flex', gap:8, marginBottom:22, flexWrap:'wrap' }}>
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f === 'all' ? 'all' : f)}
            style={{
              padding:'6px 16px', borderRadius:20, fontSize:13, cursor:'pointer',
              border:'1px solid var(--gray-200)', fontFamily:'DM Sans,sans-serif',
              background: filter === f || (filter === 'all' && f === 'all') ? 'var(--navy)' : 'white',
              color: filter === f || (filter === 'all' && f === 'all') ? 'white' : 'var(--gray-600)',
              transition:'var(--transition)'
            }}>
            {f === 'all' ? 'All Members' : f}
          </button>
        ))}
      </div>

      {loading ? <div className="loading"><div className="spinner" /></div> : (
        members.length === 0 ? (
          <div className="loading">
            <p>No members found.</p>
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
            {members.map(m => {
              const [bg, fg] = getColor(`${m.first_name}${m.last_name}`)
              return (
                <Link to={`/profile/${m.id}`} key={m.id} style={{ textDecoration:'none' }}>
                  <div className="card" style={{ padding:22, textAlign:'center', cursor:'pointer', transition:'var(--transition)' }}
                    onMouseEnter={e=>e.currentTarget.style.transform='translateY(-2px)'}
                    onMouseLeave={e=>e.currentTarget.style.transform='none'}>
                    <div className="avatar" style={{ width:58, height:58, background:bg, color:fg, fontSize:22, margin:'0 auto 12px' }}>
                      {initials(m.first_name, m.last_name)}
                    </div>
                    <h4 style={{ fontSize:15, fontWeight:600, color:'var(--navy)', marginBottom:3 }}>{m.first_name} {m.last_name}</h4>
                    <p style={{ fontSize:12, color:'var(--gray-400)', marginBottom:10 }}>
                      {m.employer && m.employer !== '—' ? m.employer : m.major || 'KST'}
                      {m.class_year ? ` · '${m.class_year.toString().slice(-2)}` : ''}
                    </p>
                    <div style={{ display:'flex', gap:6, justifyContent:'center', flexWrap:'wrap' }}>
                      <span className={`badge badge-${(m.status||'active').toLowerCase()}`}>{m.status}</span>
                      {m.location && <span style={{ fontSize:11, padding:'3px 10px', borderRadius:5, background:'var(--gray-100)', color:'var(--gray-600)' }}>{m.location}</span>}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )
      )}
    </div>
  )
}
