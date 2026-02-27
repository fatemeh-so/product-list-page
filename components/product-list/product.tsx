// import { useProductsFilter } from "@/context/products-filter-context";
import { PaginationDemo } from "./pagination";
import ProductList from "./product-list";
import { useProduct } from "@/services/use-product";
import ProductListHeader from "./product-list-header";
import { useProductsFilter } from "@/context/products-filter-context";
import { LoadingState } from "./product-list-skeleton";
import { EmptyState } from "./empty-state-data";
import { ErrorState } from "./error-state-data";

export default function Product() {
  const {
    page,
    searchTerm: searchQuery,
    sortBy,
    order,
    selectedCategories,
    selectedBrands,
    range,
    inStock,
  } = useProductsFilter();

  const { data, isPending, error, refetch } = useProduct({
    page,
    searchQuery,
    sortBy,
    order,
    category: selectedCategories.join(","),
    brand: selectedBrands.join(","),
    range,
    inStock,
  });

  if (isPending) return <LoadingState />;
  if (error) return <ErrorState message={error.message} onRetry={refetch} />;
  if (!data || data.products.length === 0) return <EmptyState />;

  return (
    <div className="max-w-6xl mx-auto">
      <ProductListHeader
        total={data.total}
        productBrands={data.products.map((product) => product.brand)}
        minPrice={data.minPrice}
        maxPrice={data.maxPrice}
      />
      <ProductList products={data.products} />
      <PaginationDemo total={data.total} />
    </div>
  );
}
