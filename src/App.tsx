import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { v4 as uuid } from 'uuid'
import { Home } from './pages/Home/Home'
import { Call } from './pages/Call'
import { Stream } from './pages/Stream'
import {RouterProgress} from './components/utils/RouterProgress'
import { Toaster } from "./components/ui/sonner"
import { Ripple } from './components/magicui/ripple'

import { useEffect } from 'react';



function App() {
  useEffect(() => {
    // Add 'dark' class to <html> on mount
    document.documentElement.classList.add('dark');
  }, []);
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
        <Route path='/leave' element={<Ripple />} />
      </Routes>
    </Router>
  )
}

export default App