'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { User } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { updateUserProfile } from '@/lib/mock-data';
import { useState } from 'react';
import { Loader2, Save } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const formSchema = z.object({
  username: z.string().min(3, { message: 'Username must be at least 3 characters.' }).max(30),
  // email: z.string().email(), // Email is typically not changed by user directly or requires verification
});

type ProfileFormValues = z.infer<typeof formSchema>;

interface ProfileFormProps {
  currentUser: User;
}

export function ProfileForm({ currentUser }: ProfileFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: currentUser.username || '',
    },
  });

  async function onSubmit(values: ProfileFormValues) {
    setIsLoading(true);
    try {
      await updateUserProfile(currentUser.id, { username: values.username });
      toast({ title: 'Profile Updated', description: 'Your profile has been successfully updated.' });
      router.refresh(); // Refresh to show updated data if displayed elsewhere
    } catch (error) {
      toast({
        title: 'Update Failed',
        description: (error as Error).message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-24 w-24 border-2 border-primary shadow-md">
                <AvatarImage src={currentUser.avatarUrl || undefined} alt={currentUser.username} />
                <AvatarFallback className="text-3xl">
                {currentUser.username?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
            </Avatar>
            <Button type="button" variant="outline" size="sm" onClick={() => toast({title: "Feature not available", description: "Changing avatar is not yet implemented."})}>
                Change Avatar (Soon)
            </Button>
        </div>

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Your unique username" {...field} />
              </FormControl>
              <FormDescription>This is your public display name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
                <Input type="email" value={currentUser.email} disabled className="bg-muted/50" />
            </FormControl>
            <FormDescription>Your email address cannot be changed here.</FormDescription>
        </FormItem>
        

        <Button type="submit" className="w-full sm:w-auto" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Save Changes
        </Button>
      </form>
    </Form>
  );
}
