"use client";

import React, { createContext, useContext } from "react";

interface SessionContextType {
  session: any;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({
  session,
  children,
}: {
  session: any;
  children: React.ReactNode;
}) {
  return (
    <SessionContext.Provider value={{ session }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context.session;
}
