import "./globals.css";

export const metadata = {
  title: "MR SHOP",
  description: "Dresses delivered across India. Pay on delivery.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
