import { useState, useEffect } from 'react'
import axios from 'axios'
import UploadSection from './components/UploadSection'
import StatsBar from './components/StatsBar'
import ResumeTable from './components/ResumeTable'

const API = import.meta.env.VITE_API_URL

export default function App() {
  const [resumes, setResumes] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchResumes = async () => {
    setLoading(true)

    try {
      const res = await axios.get(`${API}/resumes`)
      console.log("API RESPONSE:", res.data)

      let data = []

      // ✅ Handle Lambda proxy (body is string)
      if (res.data && typeof res.data.body === 'string') {
        data = JSON.parse(res.data.body)
      }
      // ✅ Handle direct array response
      else if (Array.isArray(res.data)) {
        data = res.data
      }
      // ✅ Handle unexpected formats safely
      else if (res.data && typeof res.data === 'object') {
        data = res.data.body || []
      }

      // ✅ NEW: Sort by Date (Newest Tested First)
      if (Array.isArray(data)) {
        data.sort((a, b) => {
          // Converts ISO strings from your Python backend into JS Dates for comparison
          // 'b - a' ensures the most recent date is at index 0
          return new Date(b.uploadedAt) - new Date(a.uploadedAt);
        });
      }

      // ✅ Final safety check
      setResumes(Array.isArray(data) ? data : [])

    } catch (err) {
      console.error('Error fetching resumes:', err)
      setResumes([]) // prevents crash
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchResumes()
  }, [])

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a' }}>

      {/* Header */}
      <div style={{
        backgroundColor: '#1e293b',
        padding: '20px 40px',
        borderBottom: '1px solid #334155'
      }}>
        <h1 style={{ color: '#60a5fa', fontSize: '26px', margin: 0 }}>
          AI Resume Screener
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '13px', marginTop: '4px' }}>
          Powered by React + AWS Lambda (Python) + DynamoDB + S3
        </p>
      </div>

      {/* Main Content */}
      <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>

        {/* Upload Section */}
        <UploadSection onUploadComplete={fetchResumes} />

        {/* Stats */}
        <StatsBar resumes={resumes} />

        {/* Resume Table */}
        <div style={{
          backgroundColor: '#1e293b',
          borderRadius: '12px',
          border: '1px solid #334155'
        }}>
          <div style={{
            padding: '20px 30px',
            borderBottom: '1px solid #334155',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h2 style={{ margin: 0, color: '#e2e8f0' }}>
              Screened Resumes ({resumes.length})
            </h2>

            <button
              onClick={fetchResumes}
              style={{
                backgroundColor: '#334155',
                color: 'white',
                border: 'none',
                padding: '8px 18px',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Refresh
            </button>
          </div>

          <ResumeTable resumes={resumes} loading={loading} />
        </div>

      </div>
    </div>
  )
}