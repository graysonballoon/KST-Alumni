import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../App'
import { getColor, initials } from '../components/Layout'

export default function Profile() {
  const { id } = useParams()
  const { user, profile: myProfile, fetchProfile } = useAuth()
  const navigate = useNavigate()
  const [member, setMember] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({})
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  const isOwn = user?.id === id
  const isAdmin = myProfile?.role === 'admin'

  useEffect(() => { fetchMember() }, [id])

  async function fetchMember() {
    const { data } = await supabase.from('profiles').select('*').eq('id', id).single()
    setMember(data)
    setForm(data || {})
    setLoading(false)
  }

  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  async function handleSave() {
    setSaving(true)
    const { error } = await supabase.from('profiles').update({
      first_name: form.first_name, last_name: form.last_name,
      class_year: form.class_year ? parseInt(form.class_year) : null,
      status: form.status, major: form.major, employer: form.employer,
      title: form.title, location: form.location, bio: form.bio, linkedin: form.linkedin,
    }).eq('id', id)
    if (error) setMsg('Error saving: ' + error.message)
    else {
      setMsg('Profile updated!'); setEditing(false)
      fetchMember(); if (isOwn) fetchProfile(user.id)
      setTimeout(() => setMsg(''), 3000)
    }
    setSaving(false)
  }

  if (loading) return <div className="loading"><div className="spinner" /></div>
  if (!member) return <div className="loading"><p>Member not found.</p></div>

  const [bg, fg] = getColor(`${member.first_name}${member.last_name}`)

  const fields = [
    ['Class Year', member.class_year], ['Location', member.location],
    ['Major / Field', member.major], ['Employer', member.employer],
    ['Job Title', member.title], ['Email', member.email],
  ]

  return (
    <div style={{ maxWidth:640 }}>
      <button onClick={() => navigate(-1)} className="btn btn-outline btn-sm" style={{ marginBottom:20 }}>← Back</button>

      {msg && <div className={msg.includes('Error') ? 'error-msg' : 'success-msg'} style={{ marginBottom:16 }}>{msg}</div>}

      <div className="card" style={{ marginBottom:20 }}>
        <div style={{
          height:100, background:`linear-gradient(135deg, ${fg} 0%, ${bg} 100%)`,
          borderRadius:'10px 10px 0 0', position:'relative'
        }}>
          {(isOwn || isAdmin) && !editing && (
            <button onClick={() => setEditing(true)} className="btn btn-outline btn-sm"
              style={{ position:'absolute', top:14, right:14, background:'rgba(255,255,255,0.15)', border:'1px solid rgba(255,255,255,0.3)', color:'white' }}>
              Edit Profile
            </button>
          )}
          <div className="avatar" style={{
            width:72, height:72, background:bg, color:fg, fontSize:28,
            border:'4px solid white', position:'absolute', bottom:-36, left:28,
            boxShadow:'var(--shadow-md)'
          }}>
            {initials(member.first_name, member.last_name)}
          </div>
        </div>
        <div style={{ padding:'52px 28px 28px' }}>
          {editing ? (
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
              <div className="form-group"><label>First Name</label><input value={form.first_name||''} onChange={e=>set('first_name',e.target.value)} /></div>
              <div className="form-group"><label>Last Name</label><input value={form.last_name||''} onChange={e=>set('last_name',e.target.value)} /></div>
              <div className="form-group"><label>Class Year</label>
                <select value={form.class_year||''} onChange={e=>set('class_year',e.target.value)}>
                  <option value="">Select…</option>
                  {Array.from({length:20},(_,i)=>2027-i).map(y=><option key={y}>{y}</option>)}
                </select>
              </div>
              <div className="form-group"><label>Status</label>
                <select value={form.status||'Active'} onChange={e=>set('status',e.target.value)}>
                  <option>Active</option><option>Alumni</option><option>Pledge</option>
                </select>
              </div>
              <div className="form-group"><label>Major</label><input value={form.major||''} onChange={e=>set('major',e.target.value)} /></div>
              <div className="form-group"><label>Location</label><input value={form.location||''} onChange={e=>set('location',e.target.value)} /></div>
              <div className="form-group"><label>Employer</label><input value={form.employer||''} onChange={e=>set('employer',e.target.value)} /></div>
              <div className="form-group"><label>Job Title</label><input value={form.title||''} onChange={e=>set('title',e.target.value)} /></div>
              <div className="form-group" style={{ gridColumn:'1/-1' }}>
                <label>LinkedIn URL</label><input value={form.linkedin||''} onChange={e=>set('linkedin',e.target.value)} placeholder="https://linkedin.com/in/..." />
              </div>
              <div className="form-group" style={{ gridColumn:'1/-1' }}>
                <label>Bio</label><textarea value={form.bio||''} onChange={e=>set('bio',e.target.value)} />
              </div>
              <div style={{ gridColumn:'1/-1', display:'flex', gap:10, justifyContent:'flex-end' }}>
                <button className="btn btn-outline" onClick={() => setEditing(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : 'Save Changes'}</button>
              </div>
            </div>
          ) : (
            <>
              <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:6 }}>
                <div>
                  <h2 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:26, fontWeight:700, color:'var(--navy)' }}>
                    {member.first_name} {member.last_name}
                  </h2>
                  <p style={{ fontSize:13, color:'var(--gray-400)', marginTop:2 }}>
                    {member.title}{member.employer ? ' · ' + member.employer : ''}
                  </p>
                </div>
                <span className={`badge badge-${(member.status||'active').toLowerCase()}`}>{member.status}</span>
              </div>
              {member.bio && <p style={{ fontSize:14, color:'var(--gray-600)', lineHeight:1.6, marginBottom:20 }}>{member.bio}</p>}
              <hr style={{ border:'none', borderTop:'1px solid var(--gray-200)', margin:'16px 0' }} />
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                {fields.filter(([,v])=>v).map(([label, value]) => (
                  <div key={label}>
                    <div style={{ fontSize:10, textTransform:'uppercase', letterSpacing:'0.1em', color:'var(--gray-400)', fontWeight:600, marginBottom:3 }}>{label}</div>
                    <div style={{ fontSize:14, color:'var(--gray-800)' }}>{value}</div>
                  </div>
                ))}
              </div>
              {member.linkedin && (
                <a href={member.linkedin} target="_blank" rel="noreferrer" className="btn btn-outline" style={{ marginTop:20 }}>
                  View LinkedIn
                </a>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
