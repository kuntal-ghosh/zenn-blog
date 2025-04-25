import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search, Bell, MessageSquare } from "lucide-react";
import UserAvatar from "@/components/user/user-avatar";
import { ThemeToggle } from "@/components/theme-toggle";
import Navigation from "@/components/layout/navigation";

/**
 * Header component for the Zenn platform
 * Contains logo, search, notifications, and user profile
 */
export default function Header() {
  return (
      <header className="sticky top-0 z-50 w-full border-b bg-header dark:bg-header">
        <div className="container flex h-16 items-center justify-between px-4 mx-auto">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center">
              <Image src="/logo.svg" alt="Zenn" width={100} height={30} className="dark:invert" />
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" aria-label="Search" >
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Notifications" >
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Messages" >
              <MessageSquare className="h-5 w-5" />
            </Button>
            <ThemeToggle />
            <UserAvatar />
            <Button className="rounded-full bg-blue-500 hover:bg-blue-600 text-white">
              Post
            </Button>
          </div>
        </div>
      </header>
  );
}
