// Store this code in src/app/(app)/my-listings/page.tsx
'use client';

import { useEffect, useState } from 'react';
import type { Product } from '@/types';
import { getUserListings, getCurrentUser, deleteProduct } from '@/lib/mock-data';
import { ProductCard } from '@/components/products/product-card';
import { Button } from '@/components/ui/button';
import { Loader2, PlusCircle, ListFilter, Trash2, Edit } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

export default function MyListingsPage() {
  const [listings, setListings] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<import('@/types').User | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const user = await getCurrentUser();
      setCurrentUser(user);
      if (user) {
        try {
          const userListings = await getUserListings(user.id);
          setListings(userListings);
        } catch (error) {
          toast({ title: 'Error fetching listings', description: (error as Error).message, variant: 'destructive' });
        }
      } else {
        // Should be handled by layout, but as a fallback:
        toast({ title: 'Not Authenticated', description: 'Please log in to see your listings.', variant: 'destructive' });
        router.push('/login');
      }
      setIsLoading(false);
    };
    fetchData();
  }, [toast, router]);

  const handleEdit = (productId: string) => {
    router.push(`/my-listings/${productId}/edit`);
  };

  const handleDelete = async (productId: string) => {
    try {
      await deleteProduct(productId);
      setListings(prevListings => prevListings.filter(p => p.id !== productId));
      toast({ title: 'Product Deleted', description: 'Your listing has been successfully deleted.' });
    } catch (error) {
      toast({ title: 'Failed to delete product', description: (error as Error).message, variant: 'destructive' });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-card rounded-lg shadow">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-10 w-36" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="overflow-hidden shadow-lg">
              <Skeleton className="h-48 w-full" />
              <CardContent className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-2/3 mb-3" />
                <Skeleton className="h-8 w-1/2" />
              </CardContent>
              <CardFooter className="p-4 flex gap-2">
                <Skeleton className="h-10 w-1/2" />
                <Skeleton className="h-10 w-1/2" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-card rounded-lg shadow">
        <h1 className="text-3xl font-bold tracking-tight text-primary">My Listings</h1>
        <Button asChild>
          <Link href="/products/new">
            <PlusCircle className="mr-2 h-5 w-5" />
            Add New Listing
          </Link>
        </Button>
      </div>

      {listings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onEdit={handleEdit}
              onDelete={(productId) => {
                // Trigger alert dialog before actual deletion
                const productToDelete = listings.find(p => p.id === productId);
                if (productToDelete) {
                   document.getElementById(`delete-trigger-${productId}`)?.click();
                }
              }}
            >
              {/* Hidden trigger for AlertDialog */}
               <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button id={`delete-trigger-${product.id}`} style={{ display: 'none' }}></button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure you want to delete "{product.title}"?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your product listing.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(product.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
            </ProductCard>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-card rounded-lg shadow">
          <h2 className="text-2xl font-semibold text-muted-foreground">You haven&apos;t listed any items yet.</h2>
          <p className="text-muted-foreground mb-6">Ready to declutter and earn? List your first item today!</p>
          <Button asChild size="lg">
            <Link href="/products/new">
              <PlusCircle className="mr-2 h-5 w-5" />
              List an Item
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
