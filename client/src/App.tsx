import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { Dashboard } from './pages/Dashboard'
import { Focus } from './pages/Focus'

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!clerkPubKey) {
  throw new Error("Missing Publishable Key")
}

function App() {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <Router>
        <SignedIn>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/projects" element={<div>Projects - Coming Soon</div>} />
              <Route path="/focus" element={<Focus />} />
              <Route path="/sprint" element={<div>Sprint - Coming Soon</div>} />
              <Route path="/analytics" element={<div>Analytics - Coming Soon</div>} />
              <Route path="/settings" element={<div>Settings - Coming Soon</div>} />
            </Routes>
          </Layout>
        </SignedIn>
        <SignedOut>
          <RedirectToSignIn />
        </SignedOut>
      </Router>
    </ClerkProvider>
  )
}

export default App
