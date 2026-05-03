import "./globals.css";

export const metadata = {
  title: "KeeperHub Bot Marketplace",
  description: "Marketplace for KeeperHub automation bots"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
