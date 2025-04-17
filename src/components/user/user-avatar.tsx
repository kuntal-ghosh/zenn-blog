import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

/**
 * UserAvatar component
 * Displays the user's avatar with fallback
 */
export default function UserAvatar() {
  // In a real app, this would come from authentication state
  const user = {
    name: "User",
    avatar: "/placeholder.svg?height=32&width=32",
  }

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <Avatar className="h-8 w-8 border">
      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  )
}
