import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  employee: any | null;
  signInEmployee: (name: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [employee, setEmployee] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      // Check if there's a stored employee session
      const storedEmployee = localStorage.getItem('employee_session');
      if (storedEmployee) {
        const employeeData = JSON.parse(storedEmployee);
        
        // Verify the employee still exists and is active
        const { data: emp, error } = await supabase
          .from('employees')
          .select(`
            *,
            companies (
              id,
              name,
              email,
              phone,
              address
            )
          `)
          .eq('id', employeeData.id)
          .eq('is_active', true)
          .single();

        if (!error && emp) {
          setEmployee(emp);
        } else {
          localStorage.removeItem('employee_session');
        }
      }
    } catch (error) {
      console.error('Error checking session:', error);
      localStorage.removeItem('employee_session');
    } finally {
      setLoading(false);
    }
  };

  const signInEmployee = async (name: string, password: string) => {
    try {
      setLoading(true);
      
      // Query employee by name and password
      const { data: emp, error } = await supabase
        .from('employees')
        .select(`
          *,
          companies (
            id,
            name,
            email,
            phone,
            address
          )
        `)
        .eq('name', name)
        .eq('password', password)
        .eq('is_active', true)
        .single();

      if (error || !emp) {
        return { error: { message: 'Invalid name or password' } };
      }

      // Store employee session
      setEmployee(emp);
      localStorage.setItem('employee_session', JSON.stringify(emp));
      
      return { error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error: { message: 'An error occurred during sign in' } };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setEmployee(null);
    setUser(null);
    setSession(null);
    localStorage.removeItem('employee_session');
  };

  const value = {
    user,
    session,
    employee,
    signInEmployee,
    signOut,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}