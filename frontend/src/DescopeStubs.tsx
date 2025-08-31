import React, { ReactNode } from "react";

export const AuthProvider: React.FC<{ projectId: string; children?: ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

export const Descope: React.FC<{
  flowId: string;
  theme?: string;
  onSuccess?: (e: any) => void;
  onError?: (e: any) => void;
}> = () => {
  return <div>Please implement login UI here.</div>;
};
