import Link from 'next/link';
import { ThemeSwitcher } from './ThemeSwitcher';

export function Header() {
  return (
    <header className="bg-primary text-primary-foreground p-4 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold">Fintech App</Link>
      <nav className="flex items-center">
        <Link href="/charts" className="p-2">Charts</Link>
        <Link href="/ai" className="p-2">AI</Link>
        <Link href="/settings" className="p-2">Settings</Link>
        <ThemeSwitcher />
      </nav>
    </header>
  );
}
