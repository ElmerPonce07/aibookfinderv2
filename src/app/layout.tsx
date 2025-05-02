import "./globals.css";

export const metadata = {
  title: "AI BookFinder",
  description: "Personal AI book suggestion app",
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
