import UserProvider from "@/components/providers/UserProvider"

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <UserProvider>{children}</UserProvider>
  // return <>{children}</>
}
