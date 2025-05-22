'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { FiMessageCircle, FiUsers, FiPieChart, FiFolder, FiSettings, FiArchive, FiHome, FiPhone } from 'react-icons/fi';

const navItems = [
  { href: '/dashboard', icon: FiHome, label: 'Home' },
  { href: '/chats', icon: FiMessageCircle, label: 'Chats' },
  { href: '/contacts', icon: FiUsers, label: 'Contacts' },
  { href: '/analytics', icon: FiPieChart, label: 'Analytics' },
  { href: '/files', icon: FiFolder, label: 'Files' },
  { href: '/calls', icon: FiPhone, label: 'Calls' },
  { href: '/archive', icon: FiArchive, label: 'Archive' },
];

export default function ChatNavigation() {
  const pathname = usePathname();

  return (
    <div className="flex w-[60px] flex-col items-center border-r bg-background py-4">
      <div className="mb-8 flex h-10 w-10 items-center justify-center rounded-full bg-primary">
        <FiMessageCircle className="h-5 w-5 text-white" />
      </div>
      <nav className="flex flex-1 flex-col items-center space-y-4">
        <TooltipProvider>
          {navItems.map((item) => (
            <Tooltip key={item.href} delayDuration={0}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    'h-9 w-9 rounded-full',
                    pathname === item.href && 'bg-secondary text-secondary-foreground'
                  )}
                  asChild
                >
                  <Link href={item.href}>
                    <item.icon className="h-5 w-5" />
                    <span className="sr-only">{item.label}</span>
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{item.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </nav>
      <div className="mt-auto">
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full" asChild>
                <Link href="/settings">
                  <FiSettings className="h-5 w-5" />
                  <span className="sr-only">Settings</span>
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Settings</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}