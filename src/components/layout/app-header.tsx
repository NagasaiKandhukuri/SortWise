"use client";

import { Logo } from "@/components/icons";
import { Button } from "../ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import React from "react";
import Link from "next/link";

export function AppHeader() {
  const { setTheme, theme } = useTheme();

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6">
      <Link href="/" className="flex items-center gap-2">
        <Logo className="h-6 w-6" />
        <h1 className="text-lg font-semibold">SortWise</h1>
      </Link>
      <div className="ml-auto">
        <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label="Toggle theme">
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
    </header>
  );
}
