"use client"

import * as React from "react"
import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Laptop } from "lucide-react"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { useRef } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex items-center ">
      {/* Dropdown for specific theme options */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Select theme"
            tabIndex={-1}
            className="no-focus-visible"
          >
            {theme === "light" && <Sun className="h-5 w-5 " />}
            {theme === "dark" && <Moon className="h-5 w-5 " />}
            {theme === "system" && <Laptop className="h-5 w-5" />}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end"
          className="bg-background text-foreground border border-border"
        >
          <DropdownMenuItem 
            onClick={() => setTheme("light")} 
          >
            <Sun className="mr-2 h-4 w-4" />
            <span>Light</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => setTheme("dark")}
          >
            <Moon className="mr-2 h-4 w-4" />
            <span>Dark</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => setTheme("system")}
          >
            <Laptop className="mr-2 h-4 w-4" />
            <span>System</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}