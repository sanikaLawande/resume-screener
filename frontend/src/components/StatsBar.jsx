export default function StatsBar({ resumes }) {
  const safeResumes = Array.isArray(resumes) ? resumes : []

  const total = safeResumes.length
  const excellent = safeResumes.filter(r => r.rank === 'Excellent').length
  const good = safeResumes.filter(r => r.rank === 'Good').length
  const average = safeResumes.filter(r => r.rank === 'Average').length

  const stats = [
    { label: 'Total Resumes', value: total, color: '#60a5fa' },
    { label: 'Excellent', value: excellent, color: '#22c55e' },
    { label: 'Good', value: good, color: '#3b82f6' },
    { label: 'Average', value: average, color: '#f59e0b' },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '15px', marginBottom: '30px' }}>
      {stats.map((s, i) => (
        <div key={i} style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '10px', textAlign: 'center', border: '1px solid #334155' }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: s.color }}>{s.value}</div>
          <div style={{ color: '#94a3b8', fontSize: '13px', marginTop: '5px' }}>{s.label}</div>
        </div>
      ))}
    </div>
  )
}