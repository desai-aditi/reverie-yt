import { AuthContext } from '@/hooks/use-auth-context'
import { supabase } from '@/lib/supabase'
import type { Session } from '@supabase/supabase-js'
import { PropsWithChildren, useEffect, useState } from 'react'

export default function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<any>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchSession = async () => {
      console.log('🔍 Fetching initial session...')
      
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession()

      console.log('📦 Initial session result:', { 
        hasSession: !!session, 
        userId: session?.user?.id,
        error 
      })

      if (error) {
        console.error('❌ Error fetching session:', error)
      }

      setSession(session)
      setIsLoading(false)
    }

    fetchSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('🔄 Auth state changed:', { 
        event: _event, 
        hasSession: !!session,
        userId: session?.user?.id 
      })
      setSession(session)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    const fetchProfile = async () => {
      if (session) {
        console.log('👤 Fetching profile for user:', session.user.id)
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()

        if (error) {
          console.error('❌ Error fetching profile:', error)
        } else {
          console.log('✅ Profile loaded:', data)
        }

        setProfile(data)
      } else {
        console.log('🚫 No session, clearing profile')
        setProfile(null)
      }
    }

    fetchProfile()
  }, [session])

  const contextValue = {
    session,
    isLoading,
    profile,
    isLoggedIn: !!session,
  }

  console.log('🎯 AuthProvider context value:', {
    hasSession: !!session,
    isLoading,
    isLoggedIn: contextValue.isLoggedIn,
    hasProfile: !!profile,
  })

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}