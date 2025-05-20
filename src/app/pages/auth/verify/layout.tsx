// app/auth/verify/layout.tsx
export default function AuthVerifyLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body className="p-4">
        {children}
      </body>
    </html>
  );
}