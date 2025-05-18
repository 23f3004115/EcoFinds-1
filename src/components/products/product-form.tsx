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
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Product, ProductCategory } from '@/types';
import { productCategories } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { createProduct, updateProduct, getCurrentUser } from '@/lib/mock-data';
import { useState, useEffect } from 'react';
import { Loader2, UploadCloud } from 'lucide-react';
import Image from 'next/image';

const formSchema = z.object({
  title: z.string().min(5, { message: 'Title must be at least 5 characters.' }).max(100),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }).max(1000),
  category: z.enum(productCategories, { required_error: 'Category is required.' }),
  price: z.coerce.number().positive({ message: 'Price must be a positive number.' }),
  // imageUrl: z.string().url({ message: "Please enter a valid image URL." }) // For actual image upload, this would be different
});

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
  initialData?: Product | null;
  productId?: string;
}

export function ProductForm({ initialData, productId }: ProductFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.imageUrl || null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);


  useEffect(() => {
    const fetchUser = async () => {
      const user = await getCurrentUser();
      if (user) {
        setCurrentUserId(user.id);
      } else {
         // Handle case where user is not logged in, perhaps redirect or show error
        toast({ title: "Authentication Error", description: "You must be logged in to list items.", variant: "destructive" });
        router.push('/login');
      }
    };
    fetchUser();
  }, [router, toast]);


  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          title: initialData.title,
          description: initialData.description,
          category: initialData.category,
          price: initialData.price,
        }
      : {
          title: '',
          description: '',
          price: 0,
        },
  });

  // This is a mock image upload handler
  const handleImageUpload = () => {
    // In a real app, this would open a file dialog and handle upload
    const placeholderUrl = `https://placehold.co/600x400.png?text=${encodeURIComponent(form.getValues('title') || 'Product Image')}`;
    setImagePreview(placeholderUrl);
    toast({ title: 'Image Placeholder Set', description: 'A placeholder image has been set. In a real app, you would upload an image here.' });
  };

  async function onSubmit(values: ProductFormValues) {
    if(!currentUserId) {
      toast({ title: "Authentication Error", description: "User ID not found. Cannot submit.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      const productData = {
        ...values,
        imageUrl: imagePreview || 'https://placehold.co/600x400.png', // Use preview or default
        sellerId: currentUserId, // This should be the actual logged-in user's ID
      };

      if (initialData && productId) {
        // Update existing product
        await updateProduct(productId, productData);
        toast({ title: 'Product Updated', description: 'Your product has been successfully updated.' });
        router.push(`/my-listings`);
      } else {
        // Create new product
        await createProduct(productData);
        toast({ title: 'Product Listed!', description: 'Your product is now live on EcoSwap.' });
        router.push('/my-listings');
      }
      router.refresh(); // Refresh server components
    } catch (error) {
      toast({
        title: initialData ? 'Failed to update product' : 'Failed to list product',
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
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Vintage Denim Jacket" {...field} />
              </FormControl>
              <FormDescription>A clear and concise title helps buyers find your item.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your item in detail, including condition, size, material, etc."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {productCategories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price (USD)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0.00" {...field} step="0.01" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormItem>
          <FormLabel>Product Image</FormLabel>
          <FormControl>
            <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed border-input p-6">
              {imagePreview ? (
                <Image src={imagePreview} alt="Product preview" width={200} height={200} className="rounded-md object-contain max-h-48" data-ai-hint="product preview"/>
              ) : (
                <div className="text-center text-muted-foreground">
                  <UploadCloud className="mx-auto h-12 w-12 mb-2" />
                  <p>No image selected</p>
                </div>
              )}
              <Button type="button" variant="outline" onClick={handleImageUpload}>
                <UploadCloud className="mr-2 h-4 w-4" />
                {imagePreview ? 'Change Image Placeholder' : 'Add Image Placeholder'}
              </Button>
            </div>
          </FormControl>
          <FormDescription>Currently, only placeholder images are supported. Click button to set/change.</FormDescription>
          <FormMessage />
        </FormItem>


        <Button type="submit" className="w-full sm:w-auto" disabled={isLoading || !currentUserId}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? 'Update Listing' : 'Submit Listing'}
        </Button>
      </form>
    </Form>
  );
}
