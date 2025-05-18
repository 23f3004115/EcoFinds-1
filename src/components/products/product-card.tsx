
import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Edit, Trash2, Eye } from 'lucide-react';
import type React from 'react';

type ProductCardProps = {
  product: Product;
  variant?: 'default' | 'compact' | 'cart' | 'purchase';
  onEdit?: (productId: string) => void;
  onDelete?: (productId: string) => void;
  onRemoveFromCart?: (cartItemId: string) => void; // Assuming cart item ID is same as product ID for simplicity in this mock
  onAddToCart?: (productId: string) => void;
  quantity?: number; // For cart items
  purchaseDate?: string; // For purchased items
  children?: React.ReactNode; // Added to allow passing AlertDialog
};

export function ProductCard({ 
  product, 
  variant = 'default',
  onEdit,
  onDelete,
  onRemoveFromCart,
  onAddToCart,
  quantity,
  purchaseDate,
  children, // Destructure children
}: ProductCardProps) {
  const formattedPrice = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(product.price);
  const formattedDate = (dateString: string | undefined) => dateString ? new Date(dateString).toLocaleDateString() : '';

  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full bg-card">
      <Link href={`/products/${product.id}`} className="block group" aria-label={`View details for ${product.title}`}>
        <CardHeader className="p-0 relative">
            <Image
              src={product.imageUrl}
              alt={product.title}
              width={400}
              height={300}
              className="object-cover w-full h-48 group-hover:scale-105 transition-transform duration-300"
              data-ai-hint="product image"
            />
           {variant !== 'cart' && variant !== 'purchase' && (
             <Badge variant="secondary" className="absolute top-2 right-2">{product.category}</Badge>
           )}
        </CardHeader>
      </Link>
      <CardContent className="p-4 flex-grow">
        <Link href={`/products/${product.id}`} className="block group">
          <CardTitle className="text-lg font-semibold mb-1 group-hover:text-primary transition-colors">{product.title}</CardTitle>
        </Link>
        {variant !== 'compact' && (
          <CardDescription className="text-sm text-muted-foreground mb-2 h-10 overflow-hidden text-ellipsis">
            {product.description}
          </CardDescription>
        )}
        <p className="text-xl font-bold text-primary mb-2">{formattedPrice}</p>
        {variant === 'cart' && quantity && (
          <p className="text-sm text-muted-foreground">Quantity: {quantity}</p>
        )}
        {variant === 'purchase' && purchaseDate && (
           <p className="text-sm text-muted-foreground">Purchased: {formattedDate(purchaseDate)}</p>
        )}
         {variant === 'default' && (
             <p className="text-xs text-muted-foreground">Listed by {product.sellerName} on {formattedDate(product.createdAt)}</p>
         )}

      </CardContent>
      <CardFooter className="p-4 pt-0 mt-auto">
        {variant === 'default' && onAddToCart && (
           <Button onClick={() => onAddToCart(product.id)} className="w-full">
            Add to Cart
          </Button>
        )}
        {variant === 'default' && !onAddToCart && (
           <Button asChild className="w-full">
             <Link href={`/products/${product.id}`}>
               View Details <ArrowRight className="ml-2 h-4 w-4" />
             </Link>
           </Button>
        )}
        {onEdit && onDelete && variant !== 'cart' && variant !== 'purchase' && (
          <div className="flex gap-2 w-full">
            <Button variant="outline" size="sm" onClick={() => onEdit(product.id)} className="flex-1">
              <Edit className="mr-2 h-4 w-4" /> Edit
            </Button>
            <Button variant="destructive" size="sm" onClick={() => onDelete(product.id)} className="flex-1">
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </Button>
          </div>
        )}
        {variant === 'cart' && onRemoveFromCart && (
          <Button variant="outline" size="sm" onClick={() => onRemoveFromCart(product.id)} className="w-full">
            <Trash2 className="mr-2 h-4 w-4" /> Remove
          </Button>
        )}
        {variant === 'purchase' && (
          <Button asChild variant="outline" size="sm" className="w-full">
            <Link href={`/products/${product.id}`}>
              <Eye className="mr-2 h-4 w-4" /> View Product
            </Link>
          </Button>
        )}
      </CardFooter>
      {children} {/* Render children here so AlertDialog trigger is in DOM */}
    </Card>
  );
}
