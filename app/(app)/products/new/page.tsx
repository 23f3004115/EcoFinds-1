import { ProductForm } from '@/components/products/product-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NewProductPage() {
  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
        <Button asChild variant="outline" className="mb-6">
            <Link href="/products">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
            </Link>
        </Button>
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold tracking-tight text-primary">List a New Item</CardTitle>
          <CardDescription>Share your pre-loved items with the EcoSwap community. Fill out the details below.</CardDescription>
        </CardHeader>
        <CardContent>
          <ProductForm />
        </CardContent>
      </Card>
    </div>
  );
}
