import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { v4 as uuid } from 'uuid'
import { Home } from './pages/Home'
import { Call } from './pages/Call'
import { Stream } from './pages/Stream'
import {RouterProgress} from './components/utils/RouterProgress'
import { Toaster } from "./components/ui/sonner"





function App() {
  return (
    <Router>
      <RouterProgress />
      <Toaster />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/call" element={<Navigate to={`/call/${uuid()}`} />} />
        <Route path="/call/:callId" element={<Call />} />
        <Route path="/stream" element={<Navigate to={`/stream/${uuid()}?streamer=true`} />} />
        <Route path="/stream/:streamId" element={<Stream />} />
      </Routes>
    </Router>
  )
}

export default App