import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { getColor, initials } from '../components/Layout'

export default function Admin() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')

  useEffect(() => { fetchAll() }, [])

  async function fetchAll() {
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending:false })
    setMembers(data||[])
    setLoading(false)
  }

  async function updateRole(id, role) {
    const { error } = await supabase.from('profiles').update({ role }).eq('id', id)
    if (error) setMsg('Error: ' + error.message)
    else { setMsg(`Role updated to ${role}`); fetchAll() }
    setTimeout(() => setMsg(''), 3000)
  }

  async function updateStatus(id, status) {
    const { error } = await supabase.from('profiles').update({ status }).eq('id', id)
    if (error) setMsg('Error: ' + error.message)
    else { setMsg('Status updated'); fetchAll() }
    setTimeout(() => setMsg(''), 3000)
  }

  async function deleteMember(id) {
    if (!confirm('Permanently delete this member? This cannot be undone.')) return
    await supabase.from('profiles').delete().eq('id', id)
    fetchAll()
  }

  return (
    <div>
      <div style={{ marginBottom:24 }}>
        <h2 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:26, fontWeight:700, color:'var(--navy)' }}>Admin Panel</h2>
        <p style={{ fontSize:13, color:'var(--gray-400)', marginTop:2 }}>Manage members, roles, and permissions</p>
      </div>

      {msg && <div className="success-msg" style={{ marginBottom:16 }}>{msg}</div>}

      <div className="card">
        <div className="card-header">
          <h3>All Members ({members.length})</h3>
        </div>
        <div style={{ overflowX:'auto' }}>
          {loading ? <div className="loading"><div className="spinner" /></div> : (
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
              <thead>
                <tr style={{ borderBottom:'1px solid var(--gray-200)' }}>
                  {['Member','Email','Class','Status','Role','Actions'].map(h => (
                    <th key={h} style={{ padding:'10px 16px', textAlign:'left', fontSize:11, textTransform:'uppercase', letterSpacing:'0.08em', color:'var(--gray-400)', fontWeight:600, whiteSpace:'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {members.map(m => {
                  const [bg, fg] = getColor(`${m.first_name}${m.last_name}`)
                  return (
                    <tr key={m.id} style={{ borderBottom:'1px solid var(--gray-100)' }}>
                      <td style={{ padding:'10px 16px' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                          <div className="avatar" style={{ width:30, height:30, background:bg, color:fg, fontSize:12 }}>
                            {initials(m.first_name, m.last_name)}
                          </div>
                          <span style={{ fontWeight:500, color:'var(--gray-800)' }}>{m.first_name} {m.last_name}</span>
                        </div>
                      </td>
                      <td style={{ padding:'10px 16px', color:'var(--gray-400)' }}>{m.email}</td>
                      <td style={{ padding:'10px 16px', color:'var(--gray-400)' }}>{m.class_year || '—'}</td>
                      <td style={{ padding:'10px 16px' }}>
                        <select value={m.status||'Active'} onChange={e => updateStatus(m.id, e.target.value)}
                          style={{ border:'1px solid var(--gray-200)', borderRadius:6, padding:'4px 8px', fontSize:12, fontFamily:'DM Sans,sans-serif', cursor:'pointer' }}>
                          <option>Active</option><option>Alumni</option><option>Pledge</option>
                        </select>
                      </td>
                      <td style={{ padding:'10px 16px' }}>
                        <select value={m.role||'member'} onChange={e => updateRole(m.id, e.target.value)}
                          style={{ border:'1px solid var(--gray-200)', borderRadius:6, padding:'4px 8px', fontSize:12, fontFamily:'DM Sans,sans-serif', cursor:'pointer' }}>
                          <option value="member">Member</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td style={{ padding:'10px 16px' }}>
                        <button className="btn btn-danger btn-sm" onClick={() => deleteMember(m.id)}>Delete</button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
