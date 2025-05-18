'use client';

import { useEffect, useState } from 'react';
import type { User } from '@/types';
import { getCurrentUser } from '@/lib/mock-data';
import { ProfileForm } from '@/components/profile/profile-form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, UserCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProfilePage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        const user = await getCurrentUser();
        if (user) {
          setCurrentUser(user);
        } else {
          // This should be caught by the layout, but as a fallback
          toast({ title: 'Not Authenticated', description: 'Please log in to view your profile.', variant: 'destructive' });
          router.push('/login');
        }
      } catch (error) {
        toast({ title: 'Error fetching profile', description: (error as Error).message, variant: 'destructive' });
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [toast, router]);

  if (isLoading) {
    return (
        <div className="max-w-2xl mx-auto py-8 px-4">
             <Card className="shadow-xl">
                <CardHeader>
                    <Skeleton className="h-9 w-1/3 mb-2" />
                    <Skeleton className="h-5 w-2/3" />
                </CardHeader>
                <CardContent className="space-y-8">
                    <div className="flex flex-col items-center space-y-4">
                        <Skeleton className="h-24 w-24 rounded-full" />
                        <Skeleton className="h-8 w-32" />
                    </div>
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-12 w-1/3" />
                </CardContent>
            </Card>
        </div>
    );
  }

  if (!currentUser) {
    // Should be redirected by useEffect if user is null after loading
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <Card className="shadow-xl">
        <CardHeader className="text-center">
          <UserCircle className="mx-auto h-16 w-16 text-primary mb-4" />
          <CardTitle className="text-3xl font-bold tracking-tight">Your Profile</CardTitle>
          <CardDescription>Manage your account settings and public information on EcoSwap.</CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm currentUser={currentUser} />
        </CardContent>
      </Card>
    </div>
  );
}
