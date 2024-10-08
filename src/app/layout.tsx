import type { Metadata } from "next"
import localFont from "next/font/local"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/components/providers/AuthProvider"
import Header from "@/components/header"

const gilroyLight = localFont({
  src: "./fonts/Gilroy-Light.otf",
  weight: "100 900",
})

export const metadata: Metadata = {
  title: "EventFlow",
  description: "Generated by create next app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <AuthProvider>
        <body
          className={`${gilroyLight.className} min-h-screen bg-gradient-to-b from-purple-100 to-purple-50`}
        >
          <Header />
          <main className={"flex min-h-screen items-center justify-center"}>
            {children}
          </main>
          <Toaster />
        </body>
      </AuthProvider>
    </html>
  )
}
