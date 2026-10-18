
import "./globals.css";
import Header from "../components/Header";

export const metadata = {
  title: "BlogSpace",
  description: "Share your ideas with the world.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
