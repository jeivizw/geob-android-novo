import { createContext, useContext, useEffect, useState } from 'react';
import { Preferences } from '@capacitor/preferences';
import { supabase } from '../lib/supabase'; // Ajuste o caminho se o seu supabase.js estiver noutra pasta

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true); // Controla a Splash Screen / Loading

  useEffect(() => {
    // 1. Auto-Login no Carregamento
    const recuperarSessao = async () => {
      try {
        const { value } = await Preferences.get({ key: 'supabase_session' });
        
        if (value) {
          const sessionData = JSON.parse(value);
          setSession(sessionData);
          // Restaura a sessão no SDK do Supabase
          await supabase.auth.setSession({
            access_token: sessionData.access_token,
            refresh_token: sessionData.refresh_token,
          });
        }
      } catch (error) {
        console.error("Erro ao recuperar sessão nativa:", error);
      } finally {
        setLoading(false);
      }
    };

    recuperarSessao();

    // 2. Captura e Persistência da Sessão
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      setSession(currentSession);
      
      if (event === 'SIGNED_IN' && currentSession) {
        await Preferences.set({
          key: 'supabase_session',
          value: JSON.stringify(currentSession)
        });
      } else if (event === 'SIGNED_OUT') {
        await Preferences.remove({ key: 'supabase_session' });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ session, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);