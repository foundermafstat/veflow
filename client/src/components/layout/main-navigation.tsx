'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  Home, 
  LayoutGrid, 
  MessageSquare, 
  Settings, 
  BookOpen, 
  AlertCircle, 
  Bell, 
  Clock,
  Code
} from 'lucide-react'

const mainNavItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: Home
  },
  {
    title: 'Flows',
    href: '/flows',
    icon: LayoutGrid
  },
  {
    title: 'Watchlist',
    href: '/watchlist',
    icon: Clock
  },
  {
    title: 'Notifications',
    href: '/notifications',
    icon: Bell
  },
  {
    title: 'Domains',
    href: '/domains',
    icon: BookOpen
  },
  {
    title: 'Telegram',
    href: '/telegram',
    icon: MessageSquare
  },
  {
    title: 'Smart Contracts',
    href: '/smart-contract-blueprints-demo',
    icon: Code
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings
  },
  {
    title: 'Support',
    href: '/support',
    icon: AlertCircle
  }
]

export function MainNavigation() {
  const pathname = usePathname()

  return (
    <nav className="fixed left-0 top-0 z-40 h-full w-16 flex-col justify-between border-r bg-background hidden md:flex">
      <div className="flex w-full flex-1 flex-col items-center gap-4 px-2 py-6">
        <Link 
          href="/"
          className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-white font-bold"
          aria-label="Home"
        >
          D
        </Link>
        
        <div className="flex w-full flex-col items-center gap-2 pt-4">
          {mainNavItems.map((item) => {
            const isActive = pathname === item.href || 
                          (item.href !== '/' && pathname?.startsWith(item.href))
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex h-10 w-10 items-center justify-center rounded-md",
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
                )}
                title={item.title}
              >
                <item.icon className="h-5 w-5" />
                <span className="sr-only">{item.title}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
