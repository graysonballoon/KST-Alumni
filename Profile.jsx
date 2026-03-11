import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../App'

export default function JobBoard() {
  const { user, profile } = useAuth()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title:'', company:'', location:'', type:'Full-time', description:'', link:'' })
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => { fetchJobs() }, [])

  async function fetchJobs() {
    const { data } = await supabase.from('jobs')
      .select('*, profiles(first_name, last_name)')
      .order('created_at', { ascending:false })
    setJobs(data||[])
    setLoading(false)
  }

  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  async function handlePost(e) {
    e.preventDefault()
    setSaving(true)
    const { error } = await supabase.from('jobs').insert({
      ...form, posted_by: user.id
    })
    if (error) setMsg('Error: ' + error.message)
    else { setMsg('Job posted!'); setShowForm(false); setForm({ title:'', company:'', location:'', type:'Full-time', description:'', link:'' }); fetchJobs() }
    setSaving(false)
    setTimeout(() => setMsg(''), 3000)
  }

  async function handleDelete(id) {
    if (!confirm('Delete this posting?')) return
    await supabase.from('jobs').delete().eq('id', id)
    fetchJobs()
  }

  const typeColors = { 'Full-time':'#eef2ff', 'Internship':'#e6f4ee', 'Contract':'#fef9e0', 'Part-time':'#fce8e6' }

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
        <div>
          <h2 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:26, fontWeight:700, color:'var(--navy)' }}>Job Board</h2>
          <p style={{ fontSize:13, color:'var(--gray-400)', marginTop:2 }}>Opportunities shared by brothers & alumni</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Post a Job'}
        </button>
      </div>

      {msg && <div className="success-msg" style={{ marginBottom:16 }}>{msg}</div>}

      {showForm && (
        <div className="card" style={{ marginBottom:24 }}>
          <div className="card-header"><h3>Post a Job</h3></div>
          <div className="card-body">
            <form onSubmit={handlePost}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>
                <div className="form-group"><label>Job Title *</label><input value={form.title} onChange={e=>set('title',e.target.value)} required /></div>
                <div className="form-group"><label>Company *</label><input value={form.company} onChange={e=>set('company',e.target.value)} required /></div>
                <div className="form-group"><label>Location</label><input value={form.location} onChange={e=>set('location',e.target.value)} placeholder="City, ST or Remote" /></div>
                <div className="form-group"><label>Type</label>
                  <select value={form.type} onChange={e=>set('type',e.target.value)}>
                    <option>Full-time</option><option>Internship</option><option>Contract</option><option>Part-time</option>
                  </select>
                </div>
                <div className="form-group" style={{ gridColumn:'1/-1' }}>
                  <label>Description</label>
                  <textarea value={form.description} onChange={e=>set('description',e.target.value)} placeholder="Brief role description…" />
                </div>
                <div className="form-group" style={{ gridColumn:'1/-1' }}>
                  <label>Apply Link</label>
                  <input type="url" value={form.link} onChange={e=>set('link',e.target.value)} placeholder="https://…" />
                </div>
              </div>
              <div style={{ display:'flex', gap:10, justifyContent:'flex-end' }}>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Posting…' : 'Post Job'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? <div className="loading"><div className="spinner" /></div> : (
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {jobs.length === 0 && <div className="loading"><p>No jobs posted yet. Be the first!</p></div>}
          {jobs.map(j => (
            <div key={j.id} className="card" style={{
              padding:'20px 24px', display:'flex', alignItems:'center',
              justifyContent:'space-between', gap:16, transition:'var(--transition)'
            }}
              onMouseEnter={e=>e.currentTarget.style.borderColor='var(--gold)'}
              onMouseLeave={e=>e.currentTarget.style.borderColor='var(--gray-200)'}>
              <div style={{ flex:1 }}>
                <h4 style={{ fontSize:15, fontWeight:600, color:'var(--navy)', marginBottom:4 }}>{j.title}</h4>
                <p style={{ fontSize:13, color:'var(--gray-600)', marginBottom:8 }}>{j.company}{j.location ? ' · ' + j.location : ''}</p>
                {j.description && <p style={{ fontSize:13, color:'var(--gray-400)', marginBottom:10, lineHeight:1.5 }}>{j.description}</p>}
                <div style={{ display:'flex', gap:6 }}>
                  <span style={{ fontSize:11, padding:'3px 10px', borderRadius:5, background: typeColors[j.type]||'var(--gray-100)', color:'var(--gray-600)', fontWeight:500 }}>{j.type}</span>
                </div>
              </div>
              <div style={{ textAlign:'right', flexShrink:0 }}>
                <div style={{ fontSize:12, color:'var(--gray-400)', marginBottom:4 }}>
                  {new Date(j.created_at).toLocaleDateString()}
                </div>
                <div style={{ fontSize:13, fontWeight:500, color:'var(--navy)', marginBottom:10 }}>
                  Posted by {j.profiles?.first_name} {j.profiles?.last_name}
                </div>
                <div style={{ display:'flex', gap:8', justifyContent:'flex-end', gap:8 }}>
                  {j.link && <a href={j.link} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm">Apply</a>}
                  {(user?.id === j.posted_by || profile?.role === 'admin') && (
                    <button className="btn btn-outline btn-sm" onClick={() => handleDelete(j.id)}>Delete</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
