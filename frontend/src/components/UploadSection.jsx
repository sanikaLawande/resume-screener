import { useState } from 'react'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL

export default function UploadSection({ onUploadComplete }) {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')

  const handleFileChange = (e) => {
    const selected = e.target.files[0]
    if (selected && selected.type === 'application/pdf') {
      setFile(selected)
      setMessage('')
    } else {
      setMessage('Please select a PDF file only')
    }
  }

  const handleUpload = async () => {
    if (!file) { setMessage('Please select a file first'); return }

    setUploading(true)
    setMessage('Getting upload URL...')

    try {
      // Step 1 — Get presigned URL from Lambda
const urlRes = await axios.post(`${API}/upload`, { filename: file.name });
      const { uploadUrl } = urlRes.data

      setMessage('Uploading to S3...')

      // Step 2 — Upload directly to S3
      await axios.put(uploadUrl, file, {
        headers: { 'Content-Type': 'application/pdf' }
      })

      setMessage('Processing resume... Please wait 10 seconds')

      // Step 3 — Wait for Lambda to process, then refresh table
      setTimeout(() => {
        onUploadComplete()
        setMessage('Resume uploaded and processed successfully!')
        setFile(null)
        setUploading(false)
      }, 10000)

    } catch (err) {
      console.error(err)
      setMessage('Upload failed. Please try again.')
      setUploading(false)
    }
  }

  return (
    <div style={{ backgroundColor: '#1e293b', borderRadius: '12px', padding: '30px', marginBottom: '30px', border: '1px solid #334155' }}>
      <h2 style={{ marginBottom: '20px', color: '#e2e8f0' }}>Upload Resume</h2>

      <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          style={{ backgroundColor: '#0f172a', color: 'white', padding: '10px', borderRadius: '8px', border: '1px solid #475569', cursor: 'pointer' }}
        />

        <button
          onClick={handleUpload}
          disabled={uploading || !file}
          style={{
            backgroundColor: uploading ? '#475569' : '#3b82f6',
            color: 'white', border: 'none', padding: '12px 24px',
            borderRadius: '8px', cursor: uploading ? 'not-allowed' : 'pointer',
            fontSize: '15px', fontWeight: 'bold'
          }}
        >
          {uploading ? 'Processing...' : 'Upload & Screen'}
        </button>
      </div>

      {message && (
        <p style={{ marginTop: '15px', padding: '10px', backgroundColor: '#0f172a', borderRadius: '8px', color: '#60a5fa' }}>
          {message}
        </p>
      )}
    </div>
  )
}