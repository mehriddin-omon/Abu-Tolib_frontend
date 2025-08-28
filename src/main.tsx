import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { client } from './config/query-client.ts'
import { Provider } from 'react-redux'
import App from './App.tsx'
import './index.css'
import { store } from './store/store.ts'
import { ThemeProvider } from '@/components'

createRoot(document.getElementById('root')!).render(
  <ThemeProvider defaultTheme='light' storageKey='vite-ui-theme'>
    <QueryClientProvider client={client}>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </QueryClientProvider>
  </ThemeProvider>
)
