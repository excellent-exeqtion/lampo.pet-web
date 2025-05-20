// app/vet/access/layout.tsx
export default function VetLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body className="p-4">
        {children}
      </body>
    </html>
  );
}