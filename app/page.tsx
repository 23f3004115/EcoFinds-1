'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/mock-data'; // Mocked auth
import { Skeleton } from '@/components/ui/skeleton';

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const user = await getCurrentUser();
      if (user) {
        router.replace('/products'); // Redirect to product feed if logged in
      } else {
        router.replace('/login'); // Redirect to login if not
      }
      // setLoading(false); // setLoading(false) is removed to avoid flash of content if redirect is fast
    };
    checkAuth();
  }, [router]);

  // Display a loading state to prevent flash of unstyled content or incorrect redirects
  // This will be visible until the redirect completes.
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="w-full max-w-md space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-10 w-1/2" />
      </div>
    </div>
  );
}
