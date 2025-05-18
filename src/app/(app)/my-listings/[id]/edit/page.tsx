
'use client';

import { useEffect, useState, use } from 'react';
import type { Product } from '@/types';
import { getProductById, getCurrentUser } from '@/lib/mock-data';
import { ProductForm } from '@/components/products/product-form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditProductPage({ params: paramsProp }: { params: { id: string } }) {
  const params = use(paramsProp);
  const { id } = params; 
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const fetchedProduct = await getProductById(id); 
        const currentUser = await getCurrentUser();

        if (fetchedProduct && currentUser && fetchedProduct.sellerId === currentUser.id) {
          setProduct(fetchedProduct);
          setIsAuthorized(true);
        } else if (fetchedProduct) {
          toast({ title: 'Unauthorized', description: "You can only edit your own listings.", variant: 'destructive' });
          router.push('/my-listings');
        } else {
          toast({ title: 'Product not found', variant: 'destructive' });
          router.push('/my-listings');
        }
      } catch (error) {
        toast({ title: 'Error fetching product data', description: (error as Error).message, variant: 'destructive' });
        router.push('/my-listings');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) { 
      fetchData();
    }
  }, [id, toast, router]); 

  if (isLoading) {
    return (
        <div className="max-w-3xl mx-auto py-8 px-4">
            <Skeleton className="h-10 w-40 mb-6" />
            <Card className="shadow-xl">
                <CardHeader>
                    <Skeleton className="h-9 w-1/2 mb-2" />
                    <Skeleton className="h-5 w-3/4" />
                </CardHeader>
                <CardContent className="space-y-8">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <div className="grid grid-cols-2 gap-8">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-12 w-1/3" />
                </CardContent>
            </Card>
        </div>
    );
  }

  if (!isAuthorized || !product) {
    // This case should ideally be handled by redirects in useEffect,
    // but as a fallback or for brief moments before redirect.
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <Button asChild variant="outline" className="mb-6">
        <Link href="/my-listings">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to My Listings
        </Link>
      </Button>
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold tracking-tight text-primary">Edit Your Listing</CardTitle>
          <CardDescription>Update the details for your item: "{product.title}".</CardDescription>
        </CardHeader>
        <CardContent>
          <ProductForm initialData={product} productId={id} />
        </CardContent>
      </Card>
    </div>
  );
}

