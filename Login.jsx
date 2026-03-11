import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { getColor, initials } from '../components/Layout'

const TIERS = [
  { name:'Founder', min:1000, color:'var(--gold-pale)', textColor:'#8a6914', perks:'Name on chapter plaque, premium swag' },
  { name:'Patron', min:500, color:'var(--gray-100)', textColor:'var(--navy)', perks:'Recognition in newsletter & chapter app' },
  { name:'Brother', min:250, color:'var(--gray-100)', textColor:'var(--navy)', perks:'Annual fund recognition' },
  { name:'Supporter', min:100, color:'var(--gray-100)', textColor:'var(--navy)', perks:'Help keep the chapter running' },
]

export default function Donations() {
  const [donors, setDonors] = useState([])
  const [goal] = useState(50000)
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchDonors() }, [])

  async function fetchDonors() {
    const { data } = await supabase.from('donations')
      .select('*, profiles(first_name, last_name, class_year)')
      .order('amount', { ascending:false })
    setDonors(data||[])
    setLoading(false)
  }

  const total = donors.reduce((s, d) => s + (d.amount||0), 0)
  const pct = Math.min(100, Math.round((total / goal) * 100))

  function getTier(amount) {
    return TIERS.find(t => amount >= t.min) || { name:'Supporter' }
  }

  return (
    <div>
      <div style={{
        background:'linear-gradient(135deg, var(--navy) 0%, var(--navy-light) 100%)',
        borderRadius:'var(--radius)', padding:'28px 32px', color:'white', marginBottom:24,
        display:'flex', alignItems:'center', justifyContent:'space-between'
      }}>
        <div style={{ flex:1 }}>
          <h3 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:22, fontWeight:700, marginBottom:4 }}>2025–26 Annual Fund</h3>
          <p style={{ fontSize:13, color:'rgba(255,255,255,0.65)' }}>Help us reach our ${goal.toLocaleString()} chapter goal</p>
          <div style={{ background:'rgba(255,255,255,0.15)', borderRadius:6, height:8, marginTop:16, overflow:'hidden' }}>
            <div style={{ height:'100%', background:'var(--gold)', borderRadius:6, width:`${pct}%`, transition:'width 1s ease' }} />
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, marginTop:6, color:'rgba(255,255,255,0.7)' }}>
            <span>${total.toLocaleString()} raised</span>
            <span>Goal: ${goal.toLocaleString()}</span>
          </div>
        </div>
        <button className="btn btn-gold" style={{ marginLeft:32, padding:'12px 24px', fontSize:14, flexShrink:0 }}>
          Donate Now
        </button>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:20 }}>
        <div className="card">
          <div className="card-header"><h3>Recent Donors</h3></div>
          <div className="card-body">
            {loading ? <div className="loading"><div className="spinner" /></div> : (
              donors.length === 0 ? <p style={{ color:'var(--gray-400)', fontSize:14 }}>No donations yet. Be the first!</p> :
              donors.map((d, i) => {
                const [bg, fg] = getColor(`${d.profiles?.first_name}${d.profiles?.last_name}`)
                const tier = getTier(d.amount)
                return (
                  <div key={d.id} style={{ display:'flex', alignItems:'center', gap:14, padding:'12px 0', borderBottom:'1px solid var(--gray-100)' }}>
                    <div className="avatar" style={{ width:36, height:36, background:bg, color:fg, fontSize:13 }}>
                      {initials(d.profiles?.first_name, d.profiles?.last_name)}
                    </div>
                    <div style={{ flex:1 }}>
                      <strong style={{ fontSize:14, fontWeight:500, color:'var(--gray-800)' }}>
                        {d.profiles?.first_name} {d.profiles?.last_name}
                      </strong>
                      <span style={{ display:'block', fontSize:12, color:'var(--gray-400)' }}>
                        {d.profiles?.class_year ? `Class of '${d.profiles.class_year.toString().slice(-2)}` : ''} · {tier.name}
                      </span>
                    </div>
                    <div style={{ fontFamily:'Cormorant Garamond,serif', fontSize:18, fontWeight:700, color:'var(--navy)' }}>
                      ${d.amount?.toLocaleString()}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header"><h3>Giving Tiers</h3></div>
          <div className="card-body">
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {TIERS.map(t => (
                <div key={t.name} style={{ background:t.color, borderRadius:8, padding:'14px 16px' }}>
                  <div style={{ fontFamily:'Cormorant Garamond,serif', fontSize:17, fontWeight:700, color:t.textColor }}>
                    {t.name} · ${t.min.toLocaleString()}+
                  </div>
                  <div style={{ fontSize:12, color:'var(--gray-600)', marginTop:3 }}>{t.perks}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
