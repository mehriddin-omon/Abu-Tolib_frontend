'use client';

import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  function toggle() {
    const dark = document.documentElement.classList.toggle('dark');
    try {
      localStorage.setItem('theme', dark ? 'dark' : 'light');
    } catch {
      /* private rejim */
    }
  }
  return (
    <Button variant="outline" size="icon" onClick={toggle} aria-label="Rejimni almashtirish">
      <Sun className="hidden dark:block" />
      <Moon className="dark:hidden" />
    </Button>
  );
}
