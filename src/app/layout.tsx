import "./globals.css";

export const metadata = { title: "RoomSplit" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh">
        <header className="border-b">
          <div className="mx-auto max-w-3xl px-4 h-14 flex items-center justify-between">
            <div className="font-semibold">RoomSplit</div>
            <nav className="text-sm text-neutral-500">
              <a href="/api/rooms" className="hover:underline">Rooms</a>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-3xl px-4 py-6">{children}</main>
        <footer className="border-t">
          <div className="mx-auto max-w-3xl px-4 py-4 text-xs text-neutral-500">
            Simple MVP • No auth • SQLite
          </div>
        </footer>
      </body>
    </html>
  );
}
