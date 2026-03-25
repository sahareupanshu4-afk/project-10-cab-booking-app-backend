'use client'

import { createClient } from '@supabase/supabase-js'
import { ThemeProvider } from 'next-themes'
import { Toaster } from 'react-hot-toast'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Session } from '@supabase/supabase-js'
import { useEffect, useState, createContext, ReactNode } from 'react'
import { SupabaseClient } from '@supabase/supabase-js'

interface ProvidersProps {
  children: ReactNode
}

interface AuthContextType {
  session: Session | null
  supabase: SupabaseClient | null
}

export const AuthContext = createContext<AuthContextType | null>(null)

export function Providers({ children }: ProvidersProps) {
  const [session, setSession] = useState<Session | null>(null)
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null)

  useEffect(() => {
    const initSupabase = async () => {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
      
      if (supabaseUrl && supabaseAnonKey) {
        const supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
        setSupabase(supabaseClient)
        
        supabaseClient.auth.getSession().then(({ data: { session } }) => {
          setSession(session)
        })
        
        const { data: { subscription } } = supabaseClient.auth.onAuthStateChange((_event, session) => {
          setSession(session)
        })

        return () => {
          subscription.unsubscribe()
        }
      }
    }

    initSupabase()
  }, [])

  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 1,
      },
    },
  }))

  return (
    <AuthContext.Provider value={{ session, supabase }}>
      <ThemeProvider attribute="class">
        <QueryClientProvider client={queryClient}>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                style: {
                  background: '#10b981',
                  color: '#fff',
                },
              },
              error: {
                duration: 5000,
                style: {
                  background: '#ef4444',
                  color: '#fff',
                },
              },
            }}
          />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </ThemeProvider>
    </AuthContext.Provider>
  )
}