// src/app/_not-found/layout.tsx
export default function _NotFoundLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-4">
      {children}
    </div>
  );
}