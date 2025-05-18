import { EcoSwapLogo } from '@/components/icons/logo';
import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="mb-8">
        <Link href="/">
          <EcoSwapLogo className="h-12 w-auto" />
        </Link>
      </div>
      <div className="w-full max-w-md bg-card p-6 sm:p-8 rounded-xl shadow-2xl">
        {children}
      </div>
       <p className="mt-8 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} EcoSwap. All rights reserved.
        </p>
    </div>
  );
}
