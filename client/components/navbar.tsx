"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export function Navbar() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const isChatPage = pathname === "/chat";

  return (
    <nav className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
        >
          <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
            <FileText className="w-6 h-6 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold">PDF Chat</span>
            <span className="text-xs text-muted-foreground hidden sm:block">
              AI-Powered Document Analysis
            </span>
          </div>
        </Link>

        <div className="flex items-center space-x-4">
          {isHomePage ? (
            <>
              <Link href="/chat">
                <Button variant="ghost" size="sm" className="hidden sm:flex">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Try App
                </Button>
              </Link>
              <ThemeToggle />
              <Button variant="outline" size="sm" className="hidden sm:flex">
                Sign In
              </Button>
            </>
          ) : (
            <>
              <Link href="/">
                <Button variant="ghost" size="sm" className="hidden sm:flex">
                  Home
                </Button>
              </Link>
              <ThemeToggle />
              <Button variant="outline" size="sm" className="hidden sm:flex">
                Sign In
              </Button>
              <Button size="sm" className="hidden sm:flex">
                Get Started
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
