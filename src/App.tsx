import { useState } from 'react'
import { RouterProvider } from 'react-router-dom'
import { AppProviders } from '@/app/providers/AppProviders'
import { createBrowserAppRouter } from '@/app/router'

function App() {
  const [router] = useState(createBrowserAppRouter)

  return (
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  )
}

export default App
