import "./globals.css";

export const metadata = {
  title: "Landing Page Audit Tool",
  description: "Audit landing pages for conversion, trust, CTA, and content quality.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}