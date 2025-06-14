// src/app/vet-access/layout.tsx
import { RoleProvider } from "@/context/RoleProvider";
import { SessionProvider } from "@/context/SessionProvider";
import { StorageProvider } from "@/context/StorageProvider";

// app/vet-access/layout.tsx
export default function VetLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-4">
      <SessionProvider>
        <StorageProvider>
          <RoleProvider>
                {children}
          </RoleProvider>
        </StorageProvider>
      </SessionProvider>
    </div>
  );
}