const rankColor = (rank) => {
  if (rank === 'Excellent') return '#22c55e'
  if (rank === 'Good') return '#3b82f6'
  if (rank === 'Average') return '#f59e0b'
  return '#ef4444'
}

const rankEmoji = (rank) => {
  if (rank === 'Excellent') return '🏆'
  if (rank === 'Good') return '✅'
  if (rank === 'Average') return '📊'
  return '📋'
}

export default function ResumeTable({ resumes, loading }) {
  if (loading) return (
    <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
      Loading resumes...
    </div>
  )

  if (resumes.length === 0) return (
    <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
      No resumes yet. Upload one above to get started!
    </div>
  )

  return (
    <div style={{ overflowX: 'auto' }}>
      <table>
        <thead>
          <tr>
            {['#', 'Candidate', 'Email', 'Score', 'Rating', 'Keywords Matched', 'Uploaded'].map(h => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {resumes.map((resume, index) => (
            <tr key={resume.resumeId}>
              <td style={{ color: '#64748b', fontWeight: 'bold' }}>#{index + 1}</td>
              <td style={{ color: '#e2e8f0', fontWeight: '500' }}>{resume.candidateName || 'Unknown'}</td>
              <td style={{ color: '#60a5fa', fontSize: '13px' }}>{resume.email || 'Not found'}</td>
              <td>
                <span style={{ fontSize: '20px', fontWeight: 'bold', color: rankColor(resume.rank) }}>
                  {resume.score}
                </span>
              </td>
              <td>
                <span style={{
                  backgroundColor: rankColor(resume.rank) + '22',
                  color: rankColor(resume.rank),
                  padding: '4px 12px', borderRadius: '20px',
                  fontSize: '13px', fontWeight: '600'
                }}>
                  {rankEmoji(resume.rank)} {resume.rank}
                </span>
              </td>
              <td style={{ color: '#94a3b8', fontSize: '12px', maxWidth: '200px' }}>
                {resume.matchedKeywords
                  ? resume.matchedKeywords.slice(0, 5).join(', ') +
                    (resume.matchedKeywords.length > 5 ? ` +${resume.matchedKeywords.length - 5} more` : '')
                  : 'None'}
              </td>
              <td style={{ color: '#64748b', fontSize: '12px' }}>
                {resume.uploadedAt ? new Date(resume.uploadedAt).toLocaleDateString('en-IN') : 'N/A'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}