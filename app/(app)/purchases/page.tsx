'use client';

import { useEffect, useState } from 'react';
import type { OrderItem, User } from '@/types';
import { getPreviousPurchases, getCurrentUser } from '@/lib/mock-data';
import { ProductCard } from '@/components/products/product-card';
import { Button } from '@/components/ui/button';
import { Loader2, History, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const user = await getCurrentUser();
      setCurrentUser(user);
      if (user) {
        try {
          const items = await getPreviousPurchases(user.id);
          setPurchases(items.sort((a,b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime()));
        } catch (error) {
          toast({ title: 'Error fetching purchase history', description: (error as Error).message, variant: 'destructive' });
        }
      } else {
        toast({ title: 'Not Authenticated', description: 'Please log in to view your purchase history.', variant: 'destructive' });
        router.push('/login');
      }
      setIsLoading(false);
    };
    fetchData();
  }, [toast, router]);

  if (isLoading) {
    return (
       <div className="container mx-auto py-8 px-4">
        <Skeleton className="h-9 w-56 mb-8" />
        <div className="space-y-4">
          {Array.from({length: 2}).map((_, i) => (
            <Card key={i} className="flex gap-4 p-4">
              <Skeleton className="h-24 w-24 rounded-md" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/3" />
              </div>
              <Skeleton className="h-8 w-24 self-end" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center">
          <History className="mr-3 h-8 w-8" /> Purchase History
        </h1>
      </div>

      {purchases.length > 0 ? (
        <div className="space-y-6">
          {purchases.map(item => (
            <Card key={item.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex flex-col sm:flex-row">
                    <div className="sm:w-1/4 flex items-center justify-center p-2 bg-muted/30">
                         <Image
                            src={item.product.imageUrl}
                            alt={item.product.title}
                            width={150}
                            height={150}
                            className="object-contain rounded-md max-h-36"
                            data-ai-hint="purchased product"
                        />
                    </div>
                    <div className="sm:w-3/4 p-4 flex flex-col">
                        <Link href={`/products/${item.product.id}`}>
                            <h3 className="text-xl font-semibold hover:text-primary transition-colors">{item.product.title}</h3>
                        </Link>
                        <p className="text-sm text-muted-foreground">{item.product.category}</p>
                        <p className="text-lg font-bold text-primary my-1">
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.product.price)}
                        </p>
                        <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                        <p className="text-sm text-muted-foreground">
                            Purchased on: {new Date(item.purchaseDate).toLocaleDateString()}
                        </p>
                        <div className="mt-auto pt-2 flex gap-2">
                            <Button asChild variant="outline" size="sm">
                                <Link href={`/products/${item.product.id}`}>View Product</Link>
                            </Button>
                            <Button variant="secondary" size="sm" onClick={() => toast({title: "Feature not implemented", description: "Leaving a review is coming soon!"})}>
                                Leave a Review
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-card rounded-lg shadow-md">
          <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold text-muted-foreground">No purchases yet.</h2>
          <p className="text-muted-foreground mb-6">Explore EcoSwap and find your next sustainable treasure!</p>
          <Button asChild size="lg">
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
