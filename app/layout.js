// app/layout.js
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import SessionWrapper from "@/components/SessionWrapper"; // client
import { ThemeProvider } from "@/components/theme-provider"; // client

const inter = Inter({ subsets: ["latin"] });

export const metadata = { title: "QEvent" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* server renders body className from Inter */}
      <body className={inter.className}>
        {/* Client-only wrappers must be inside body */}
        <SessionWrapper>
          <ThemeProvider attribute="class" defaultTheme="light">
            <Header />
            {children}
          </ThemeProvider>
        </SessionWrapper>
      </body>
    </html>
  );
}
