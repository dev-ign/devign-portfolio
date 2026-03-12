import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type AudienceMode = 'ux' | 'dev';

interface AudienceContextType {
  audienceMode: AudienceMode;
  setAudienceMode: (mode: AudienceMode) => void;
}

const AudienceContext = createContext<AudienceContextType | undefined>(undefined);

export function AudienceProvider({ children }: { children: ReactNode }) {
  const [audienceMode, setAudienceMode] = useState<AudienceMode>('ux');

  useEffect(() => {
    document.body.setAttribute('data-mode', audienceMode);
  }, [audienceMode]);

  return (
    <AudienceContext.Provider value={{ audienceMode, setAudienceMode }}>
      {children}
    </AudienceContext.Provider>
  );
}

export function useAudience() {
  const ctx = useContext(AudienceContext);
  if (!ctx) throw new Error('useAudience must be used within AudienceProvider');
  return ctx;
}
