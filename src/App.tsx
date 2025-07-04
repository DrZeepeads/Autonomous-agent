import { Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import Layout from '@/components/layout/Layout'
import Chat from '@/pages/Chat'
import Library from '@/pages/Library'
import ExploreGPTs from '@/pages/ExploreGPTs'
import Settings from '@/pages/Settings'
import Profile from '@/pages/Profile'
import SplashScreen from '@/components/SplashScreen'
import { useSplashScreen } from '@/hooks/useSplashScreen'

function App() {
  const { showSplash } = useSplashScreen()

  if (showSplash) {
    return <SplashScreen />
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Layout>
        <Routes>
          <Route path="/" element={<Chat />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/library" element={<Library />} />
          <Route path="/explore" element={<ExploreGPTs />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Layout>
      <Toaster />
    </div>
  )
}

export default App

