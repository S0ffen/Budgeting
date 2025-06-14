// src/app/layout.tsx
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex h-screen">
        <div className="flex flex-col flex-1 h-full">{children}</div>
      </body>
    </html>
  );
}
