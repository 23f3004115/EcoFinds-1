
'use client';

import { useEffect, useState, use } from 'react';
import Image from 'next/image';
import type { Product } from '@/types';
import { getProductById, addToCart } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, ShoppingCart, ArrowLeft, User, CalendarDays } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductDetailPage({ params: paramsProp }: { params: { id: string } }) {
  const params = use(paramsProp);
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (params.id) {
      setIsLoading(true);
      getProductById(params.id)
        .then(data => {
          if (data) {
            setProduct(data);
          } else {
            toast({ title: 'Product not found', variant: 'destructive' });
          }
        })
        .catch(error => toast({ title: 'Error fetching product', description: (error as Error).message, variant: 'destructive' }))
        .finally(() => setIsLoading(false));
    }
  }, [params.id, toast]);

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      // Assuming current user ID is 'user1' for mock
      await addToCart('user1', product.id, 1);
      toast({ title: 'Added to cart!', description: `${product.title} successfully added to your cart.` });
    } catch (error) {
      toast({ title: 'Failed to add to cart', description: (error as Error).message, variant: 'destructive' });
    }
  };
  
  const formattedPrice = product ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(product.price) : '';
  const formattedDate = product ? new Date(product.createdAt).toLocaleDateString() : '';


  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Skeleton className="h-10 w-32 mb-6" />
        <Card className="overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2 p-4">
              <Skeleton className="w-full h-96 rounded-lg" />
            </div>
            <div className="md:w-1/2 p-6 space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <h1 className="text-2xl font-semibold">Product not found</h1>
        <Button asChild className="mt-4">
          <Link href="/products">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Button asChild variant="outline" className="mb-6">
        <Link href="/products">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
        </Link>
      </Button>
      <Card className="overflow-hidden shadow-xl">
        <div className="grid md:grid-cols-2 gap-0">
          <div className="p-1 bg-muted/30 flex items-center justify-center">
            <Image
              src={product.imageUrl}
              alt={product.title}
              width={600}
              height={600}
              className="object-contain w-full max-h-[70vh] rounded-lg shadow-md"
              data-ai-hint="product detail image"
            />
          </div>
          <div className="p-6 md:p-8 flex flex-col">
            <Badge variant="secondary" className="w-fit mb-2">{product.category}</Badge>
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-primary mb-3">{product.title}</h1>
            <p className="text-3xl font-bold text-foreground mb-4">{formattedPrice}</p>
            
            <div className="text-sm text-muted-foreground space-y-1 mb-6">
                <div className="flex items-center">
                    <User className="mr-2 h-4 w-4"/>
                    <span>Sold by: {product.sellerName}</span>
                </div>
                <div className="flex items-center">
                    <CalendarDays className="mr-2 h-4 w-4"/>
                    <span>Listed on: {formattedDate}</span>
                </div>
            </div>

            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-foreground/80 leading-relaxed mb-6 flex-grow">
              {product.description}
            </p>
            
            <Button size="lg" onClick={handleAddToCart} className="w-full mt-auto">
              <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
