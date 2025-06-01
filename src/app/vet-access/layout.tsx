// app/vet-access/layout.tsx
export default function VetLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-4">
      {children}
    </div>
  );
}