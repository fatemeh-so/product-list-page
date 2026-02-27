import { ProductSubset } from "@/app/action";
import { Card, CardTitle } from "../ui/card";
import Image from "next/image";
import { Badge } from "../ui/badge";
import { useState } from "react";
import { useProductById } from "@/services/use-product";
import ProductDetailModal from "./product-detail-modal";

interface ProductListProps {
  products: ProductSubset[];
}

export default function ProductList({ products }: ProductListProps) {
  const [open, setOpen] = useState(false);
  const [productId, setProductId] = useState<number | undefined>(undefined);
  const { data, isPending } = useProductById(productId);

  function handleProductClick(id: number) {
    setOpen(true);
    setProductId(id);
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 md:gap-8 px-3 sm:px-4">
      <ProductDetailModal
        open={open}
        onOpenChange={setOpen}
        productId={productId}
        product={data}
        loading={isPending}
      />
      {products.map((product) => (
        <Card
          key={product.id}
          className="p-2.5 sm:p-4 shadow-none rounded-2xl border-none cursor-pointer active:scale-95 transition-transform"
          onClick={() => handleProductClick(product.id)}
        >
          {/* Image container — fixed aspect ratio so images are uniform */}
          <div className="relative w-full aspect-square mb-2 sm:mb-3 overflow-hidden rounded-xl bg-gray-100">
            <Image
              src={product.thumbnail}
              alt={product.title}
              fill
              className="object-cover"
              unoptimized
            />
          </div>

          {/* Title — clamp to 2 lines on mobile */}
          <CardTitle className="text-xs sm:text-sm md:text-base font-semibold leading-tight line-clamp-2 mb-1.5 sm:mb-2">
            {product.title}
          </CardTitle>

          {/* Pricing */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <Badge
                variant="default"
                className="py-0.5 px-1.5 rounded-md text-[10px] sm:text-xs"
              >
                -{product.discountPercentage}%
              </Badge>
              <span className="text-gray-400 line-through text-xs sm:text-sm">
                $
                {(
                  product.price /
                  (1 - product.discountPercentage / 100)
                ).toFixed(1)}
              </span>
            </div>
            <p className="font-bold text-sm sm:text-base md:text-lg">
              ${product.price}
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
}
