import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../App'

const COLORS = [
  ['#e8f0fe','#1a3260'],['#fce8e6','#8a1a1a'],['#e6f4ea','#1e5c3a'],
  ['#fef9e0','#8a6914'],['#f3e8fd','#5c1a8a'],['#e8fdf5','#1a5c4a'],
]
export function getColor(str) {
  let h = 0; for (let i = 0; i < (str||'').length; i++) h = str.charCodeAt(i) + h
  return COLORS[Math.abs(h) % COLORS.length]
}
export function initials(first, last) {
  return `${(first||'?')[0]}${(last||'')[0] || ''}`.toUpperCase()
}

export default function Layout() {
  const { user, profile } = useAuth()
  const navigate = useNavigate()
  const [searchQ, setSearchQ] = useState('')

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/login')
  }

  function handleSearch(e) {
    if (e.key === 'Enter' && searchQ.trim()) {
      navigate(`/directory?q=${encodeURIComponent(searchQ.trim())}`)
      setSearchQ('')
    }
  }

  const navItems = [
    { to:'/', label:'Dashboard', icon:<svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg> },
    { to:'/directory', label:'Member Directory', icon:<svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
    { to:'/jobs', label:'Job Board', icon:<svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg> },
    { to:'/events', label:'Events', icon:<svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
    { to:'/donations', label:'Donations', icon:<svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> },
  ]

  const [bg, fg] = getColor(`${profile?.first_name}${profile?.last_name}`)

  return (
    <div style={{ display:'flex', minHeight:'100vh' }}>
      {/* SIDEBAR */}
      <aside style={{
        width:240, background:'var(--navy)', display:'flex',
        flexDirection:'column', position:'fixed', top:0, left:0, bottom:0, zIndex:100
      }}>
        <div style={{ padding:'28px 24px 24px', borderBottom:'1px solid rgba(255,255,255,0.08)', marginBottom:8 }}>
          <div style={{
            width:42, height:42, background:'var(--gold)', borderRadius:'50%',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontFamily:'Cormorant Garamond,serif', fontWeight:700, fontSize:18,
            color:'var(--navy)', marginBottom:10
          }}>ΚΣΤ</div>
          <h1 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:18, fontWeight:700, color:'white', lineHeight:1.2 }}>Kappa Sigma Tau</h1>
          <p style={{ fontSize:11, color:'var(--gold-light)', letterSpacing:'0.08em', textTransform:'uppercase', marginTop:2 }}>Alumni Network</p>
        </div>

        <nav style={{ padding:'6px 12px', flex:1 }}>
          <div style={{ fontSize:10, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--gold)', padding:'14px 12px 6px', fontWeight:600 }}>Main</div>
          {navItems.map(({ to, label, icon }) => (
            <NavLink key={to} to={to} end={to==='/'} style={({ isActive }) => ({
              display:'flex', alignItems:'center', gap:10, padding:'9px 12px',
              borderRadius:7, cursor:'pointer', textDecoration:'none',
              color: isActive ? 'var(--gold-light)' : 'rgba(255,255,255,0.65)',
              background: isActive ? 'rgba(201,168,76,0.18)' : 'none',
              fontWeight: isActive ? 500 : 400, fontSize:14, marginBottom:2,
              transition:'var(--transition)'
            })}>
              {icon}{label}
            </NavLink>
          ))}
          {profile?.role === 'admin' && (
            <>
              <div style={{ fontSize:10, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--gold)', padding:'14px 12px 6px', fontWeight:600 }}>Admin</div>
              <NavLink to="/admin" style={({ isActive }) => ({
                display:'flex', alignItems:'center', gap:10, padding:'9px 12px',
                borderRadius:7, cursor:'pointer', textDecoration:'none',
                color: isActive ? 'var(--gold-light)' : 'rgba(255,255,255,0.65)',
                background: isActive ? 'rgba(201,168,76,0.18)' : 'none',
                fontSize:14, marginBottom:2
              })}>
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                Admin Panel
              </NavLink>
            </>
          )}
        </nav>

        <div style={{ padding:'16px 24px 0', borderTop:'1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
            <div className="avatar" style={{ width:32, height:32, background:bg, color:fg, fontSize:13 }}>
              {initials(profile?.first_name, profile?.last_name)}
            </div>
            <div>
              <p style={{ fontSize:13, color:'white', fontWeight:500 }}>{profile?.first_name} {profile?.last_name}</p>
              <span style={{ fontSize:11, color:'var(--gold-light)' }}>Class of '{(profile?.class_year||'').toString().slice(-2)} · {profile?.status || 'Member'}</span>
            </div>
          </div>
          <button onClick={handleLogout} style={{
            width:'100%', background:'rgba(255,255,255,0.07)', border:'none',
            borderRadius:7, padding:'8px 12px', color:'rgba(255,255,255,0.6)',
            fontSize:13, cursor:'pointer', textAlign:'left', marginBottom:16
          }}>Sign out</button>
        </div>
      </aside>

      {/* MAIN */}
      <div style={{ marginLeft:240, flex:1, display:'flex', flexDirection:'column', minHeight:'100vh' }}>
        <header style={{
          background:'white', borderBottom:'1px solid var(--gray-200)',
          padding:'0 32px', height:62, display:'flex', alignItems:'center',
          justifyContent:'space-between', position:'sticky', top:0, zIndex:50
        }}>
          <div />
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div style={{
              display:'flex', alignItems:'center', gap:8,
              background:'var(--gray-100)', border:'1px solid var(--gray-200)',
              borderRadius:8, padding:'7px 14px', width:220
            }}>
              <svg width="14" height="14" fill="none" stroke="var(--gray-400)" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input
                type="text" placeholder="Search members… (Enter)"
                value={searchQ} onChange={e=>setSearchQ(e.target.value)} onKeyDown={handleSearch}
                style={{ border:'none', background:'none', outline:'none', fontFamily:'DM Sans,sans-serif', fontSize:13, color:'var(--gray-800)', width:'100%' }}
              />
            </div>
            <NavLink to="/directory" className="btn btn-gold btn-sm">+ Add Member</NavLink>
          </div>
        </header>
        <div style={{ padding:32, flex:1 }}>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
