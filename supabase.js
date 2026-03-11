import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Register() {
  const [form, setForm] = useState({
    email:'', password:'', confirm:'', first_name:'', last_name:'',
    class_year:'', status:'Active', major:'', employer:'', title:'', location:'', bio:''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  async function handleRegister(e) {
    e.preventDefault()
    if (form.password !== form.confirm) { setError('Passwords do not match'); return }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return }
    setLoading(true); setError('')

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    })
    if (signUpError) { setError(signUpError.message); setLoading(false); return }

    const userId = data?.user?.id
    if (userId) {
      const { error: profileError } = await supabase.from('profiles').insert({
        id: userId,
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        class_year: form.class_year ? parseInt(form.class_year) : null,
        status: form.status,
        major: form.major,
        employer: form.employer,
        title: form.title,
        location: form.location,
        bio: form.bio,
        role: 'member',
      })
      if (profileError) setError(profileError.message)
      else setDone(true)
    }
    setLoading(false)
  }

  if (done) return (
    <div style={{
      minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center',
      background:'linear-gradient(135deg, var(--navy) 0%, var(--navy-light) 100%)'
    }}>
      <div className="card" style={{ padding:40, maxWidth:420, textAlign:'center' }}>
        <div style={{ fontSize:48, marginBottom:16 }}>✓</div>
        <h2 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:24, color:'var(--navy)', marginBottom:12 }}>Welcome to the Brotherhood</h2>
        <p style={{ color:'var(--gray-600)', fontSize:14, marginBottom:24 }}>Check your email to confirm your account, then sign in.</p>
        <Link to="/login" className="btn btn-primary" style={{ justifyContent:'center' }}>Go to Sign In</Link>
      </div>
    </div>
  )

  return (
    <div style={{
      minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center',
      background:'linear-gradient(135deg, var(--navy) 0%, var(--navy-light) 100%)',
      padding:'40px 20px'
    }}>
      <div style={{ width:'100%', maxWidth:560 }}>
        <div style={{ textAlign:'center', marginBottom:28 }}>
          <div style={{
            width:56, height:56, background:'var(--gold)', borderRadius:'50%',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontFamily:'Cormorant Garamond,serif', fontWeight:700, fontSize:22,
            color:'var(--navy)', margin:'0 auto 14px'
          }}>ΚΣΤ</div>
          <h1 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:26, fontWeight:700, color:'white' }}>Create Your Profile</h1>
          <p style={{ color:'rgba(255,255,255,0.6)', fontSize:13, marginTop:4 }}>Join the Kappa Sigma Tau alumni network</p>
        </div>

        <div className="card" style={{ padding:32 }}>
          {error && <div className="error-msg" style={{ marginBottom:16 }}>{error}</div>}
          <form onSubmit={handleRegister}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
              <div className="form-group">
                <label>First Name *</label>
                <input value={form.first_name} onChange={e=>set('first_name',e.target.value)} placeholder="John" required />
              </div>
              <div className="form-group">
                <label>Last Name *</label>
                <input value={form.last_name} onChange={e=>set('last_name',e.target.value)} placeholder="Smith" required />
              </div>
              <div className="form-group" style={{ gridColumn:'1/-1' }}>
                <label>Email *</label>
                <input type="email" value={form.email} onChange={e=>set('email',e.target.value)} placeholder="you@email.com" required />
              </div>
              <div className="form-group">
                <label>Password *</label>
                <input type="password" value={form.password} onChange={e=>set('password',e.target.value)} placeholder="Min. 6 characters" required />
              </div>
              <div className="form-group">
                <label>Confirm Password *</label>
                <input type="password" value={form.confirm} onChange={e=>set('confirm',e.target.value)} placeholder="Repeat password" required />
              </div>
              <div className="form-group">
                <label>Class Year</label>
                <select value={form.class_year} onChange={e=>set('class_year',e.target.value)}>
                  <option value="">Select...</option>
                  {Array.from({length:20},(_,i)=>2027-i).map(y=><option key={y}>{y}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select value={form.status} onChange={e=>set('status',e.target.value)}>
                  <option>Active</option><option>Alumni</option><option>Pledge</option>
                </select>
              </div>
              <div className="form-group">
                <label>Major / Field</label>
                <input value={form.major} onChange={e=>set('major',e.target.value)} placeholder="Finance, CS…" />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input value={form.location} onChange={e=>set('location',e.target.value)} placeholder="City, State" />
              </div>
              <div className="form-group">
                <label>Current Employer</label>
                <input value={form.employer} onChange={e=>set('employer',e.target.value)} placeholder="Company" />
              </div>
              <div className="form-group">
                <label>Job Title</label>
                <input value={form.title} onChange={e=>set('title',e.target.value)} placeholder="Role" />
              </div>
              <div className="form-group" style={{ gridColumn:'1/-1' }}>
                <label>Bio</label>
                <textarea value={form.bio} onChange={e=>set('bio',e.target.value)} placeholder="Brief bio…" />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width:'100%', justifyContent:'center', marginTop:20 }}>
              {loading ? 'Creating account…' : 'Create Profile'}
            </button>
          </form>
          <p style={{ textAlign:'center', marginTop:16, fontSize:13, color:'var(--gray-400)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color:'var(--navy)', fontWeight:500 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
