import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Search, Bell, MessageSquare } from "lucide-react"
import UserAvatar from "@/components/user/user-avatar"

/**
 * Header component for the Zenn platform
 * Contains logo, search, notifications, and user profile
 */
export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center">
            <Image src="/logo.svg" alt="Zenn" width={100} height={30} />
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" aria-label="Search">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Notifications">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Messages">
            <MessageSquare className="h-5 w-5" />
          </Button>
          <UserAvatar />
          <Button className="rounded-full bg-blue-500 hover:bg-blue-600">Post</Button>
        </div>
      </div>
    </header>
  )
}
