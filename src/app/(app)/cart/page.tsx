'use client';

import { useEffect, useState } from 'react';
import type { CartItem, User } from '@/types';
import { getCartItems, removeFromCart, updateCartItemQuantity, getCurrentUser } from '@/lib/mock-data';
import { ProductCard } from '@/components/products/product-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, ShoppingCart, Trash2, Minus, Plus } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
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
          const items = await getCartItems(user.id);
          setCartItems(items);
        } catch (error) {
          toast({ title: 'Error fetching cart', description: (error as Error).message, variant: 'destructive' });
        }
      } else {
        toast({ title: 'Not Authenticated', description: 'Please log in to view your cart.', variant: 'destructive' });
        router.push('/login');
      }
      setIsLoading(false);
    };
    fetchData();
  }, [toast, router]);

  const handleRemoveFromCart = async (cartItemId: string) => {
    if (!currentUser) return;
    try {
      await removeFromCart(currentUser.id, cartItemId);
      setCartItems(prevItems => prevItems.filter(item => item.id !== cartItemId));
      toast({ title: 'Item Removed', description: 'Product removed from your cart.' });
    } catch (error) {
      toast({ title: 'Failed to remove item', description: (error as Error).message, variant: 'destructive' });
    }
  };

  const handleQuantityChange = async (cartItemId: string, newQuantity: number) => {
    if (!currentUser) return;
    if (newQuantity <= 0) {
      handleRemoveFromCart(cartItemId); // Or show error: quantity must be positive
      return;
    }
    try {
      const updatedItem = await updateCartItemQuantity(currentUser.id, cartItemId, newQuantity);
      setCartItems(prevItems => prevItems.map(item => item.id === cartItemId ? updatedItem : item));
    } catch (error) {
      toast({ title: 'Failed to update quantity', description: (error as Error).message, variant: 'destructive' });
    }
  };
  
  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const formattedSubtotal = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(subtotal);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Skeleton className="h-9 w-40 mb-6" />
        <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
                {Array.from({length: 2}).map((_, i) => (
                    <Card key={i} className="flex gap-4 p-4">
                        <Skeleton className="h-24 w-24 rounded-md" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-5 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                            <Skeleton className="h-4 w-1/4" />
                        </div>
                        <Skeleton className="h-8 w-20" />
                    </Card>
                ))}
            </div>
            <div className="md:col-span-1">
                <Card className="p-6 space-y-4">
                    <Skeleton className="h-7 w-3/4" />
                    <Skeleton className="h-5 w-1/2" />
                    <Skeleton className="h-5 w-1/2" />
                    <Skeleton className="h-10 w-full" />
                </Card>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center">
          <ShoppingCart className="mr-3 h-8 w-8" /> Your Shopping Cart
        </h1>
      </div>

      {cartItems.length > 0 ? (
        <div className="grid md:grid-cols-3 gap-8 items-start">
          <div className="md:col-span-2 space-y-4">
            {cartItems.map(item => (
              <Card key={item.id} className="flex flex-col sm:flex-row items-center gap-4 p-4 shadow-lg">
                <Image
                  src={item.product.imageUrl}
                  alt={item.product.title}
                  width={100}
                  height={100}
                  className="w-24 h-24 object-cover rounded-md border"
                  data-ai-hint="product cart image"
                />
                <div className="flex-grow text-center sm:text-left">
                  <h3 className="text-lg font-semibold hover:text-primary">
                     <Link href={`/products/${item.product.id}`}>{item.product.title}</Link>
                  </h3>
                  <p className="text-sm text-muted-foreground">{item.product.category}</p>
                  <p className="text-md font-semibold text-primary mt-1">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.product.price)}
                  </p>
                </div>
                <div className="flex items-center gap-2 my-2 sm:my-0">
                  <Button variant="outline" size="icon" onClick={() => handleQuantityChange(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value, 10) || 1)}
                    className="w-16 text-center h-9"
                    min="1"
                  />
                  <Button variant="outline" size="icon" onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleRemoveFromCart(item.id)} aria-label="Remove item">
                  <Trash2 className="h-5 w-5 text-destructive" />
                </Button>
              </Card>
            ))}
          </div>

          <div className="md:col-span-1">
            <Card className="p-6 shadow-xl sticky top-24">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="text-2xl">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-3">
                <div className="flex justify-between text-md">
                  <span>Subtotal</span>
                  <span>{formattedSubtotal}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                <Separator className="my-3" />
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span>{formattedSubtotal}</span>
                </div>
              </CardContent>
              <CardFooter className="p-0 mt-6">
                <Button size="lg" className="w-full" onClick={() => toast({title: "Checkout not implemented"})}>
                  Proceed to Checkout
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-card rounded-lg shadow-md">
          <ShoppingCart className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold text-muted-foreground">Your cart is empty.</h2>
          <p className="text-muted-foreground mb-6">Looks like you haven&apos;t added any sustainable finds yet!</p>
          <Button asChild size="lg">
            <Link href="/products">Start Shopping</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
