import { Routes, Route, Navigate } from 'react-router-dom'
import Notes from './pages/Notes'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Notes />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
