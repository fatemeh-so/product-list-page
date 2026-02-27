"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Product from "@/components/product-list/product";
import { ProductsFilterProvider } from "@/context/products-filter-context";

export default function Home() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <ProductsFilterProvider>
        <div className="w-full h-full min-h-screen bg-gray-50">
          <Product />
        </div>
      </ProductsFilterProvider>
    </QueryClientProvider>
  );
}
