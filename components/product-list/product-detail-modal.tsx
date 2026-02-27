"use client";

import { useEffect, useState, useRef, useCallback } from "react";
// import { Product, getProductById } from "@/app/action";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { Drawer, DrawerContent, DrawerTitle } from "../ui/drawer";
// import { Badge } from "./ui/badge";
// import { Button } from "./ui/button";
import Image from "next/image";
import {
  Heart,
  Star,
  Truck,
  Shield,
  RotateCcw,
  X,
  Minus,
  Plus,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { ProductSubset } from "@/app/action";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

interface ProductDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: number | undefined;
  product: ProductSubset | undefined;
  loading: boolean;
}

// Product content component extracted to avoid creating during render
interface ProductContentProps {
  product: ProductSubset | undefined;
  loading: boolean;
  selectedImage: number;
  setSelectedImage: (index: number) => void;
  quantity: number;
  setQuantity: (qty: number) => void;
}

function ProductContent({
  product,
  loading,
  selectedImage,
  setSelectedImage,
  quantity,
  setQuantity,
}: ProductContentProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 ">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900  "></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-500">
        Product not found
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Image Gallery Section */}
      <div className="flex flex-col gap-4 lg:w-1/2">
        {/* Main Image */}
        <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
          <Image
            src={product.images[selectedImage] || product.thumbnail}
            alt={product.title}
            fill
            className="object-cover"
            unoptimized
          />
        </div>

        {/* Thumbnail Gallery */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {product.images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`relative w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${
                selectedImage === index
                  ? "border-black"
                  : "border-transparent hover:border-gray-300"
              }`}
            >
              <Image
                src={image}
                alt={`${product.title} ${index + 1}`}
                fill
                className="object-cover"
                unoptimized
              />
            </button>
          ))}
        </div>
      </div>

      {/* Product Info Section */}
      <div className="flex flex-col gap-4 lg:w-1/2">
        {/* Category */}
        <span className="text-sm text-gray-500 uppercase tracking-wide">
          {product.category}
        </span>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900">{product.title}</h2>

        {/* Rating and Reviews */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{product.rating.toFixed(1)}</span>
          </div>
          <span className="text-gray-400">|</span>
          <span className="text-gray-500 text-sm">
            {product.reviews?.length || 0} Reviews
          </span>
        </div>

        {/* Price Section */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-2xl font-bold">
            ${product.price.toFixed(1)}
          </span>
          <span className="text-gray-400 line-through text-lg">
            $
            {(product.price / (1 - product.discountPercentage / 100)).toFixed(
              1,
            )}
          </span>
          <Badge className="bg-black text-white rounded-md px-2 py-1 text-sm">
            {product.discountPercentage}% OFF
          </Badge>
        </div>

        {/* Stock Status */}
        <div>
          <Badge
            variant="outline"
            className="bg-green-100 text-green-700 border-green-200 px-3 py-1"
          >
            {product.availabilityStatus || "In Stock"}
          </Badge>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm leading-relaxed">
          {product.description}
        </p>

        {/* Quantity Selector */}
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-700">Quantity:</span>
          <div className="flex items-center border rounded-lg">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-2 hover:bg-gray-100 transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="px-4 py-2 min-w-[50px] text-center font-medium">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-2 hover:bg-gray-100 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 mt-2">
          <Button className="flex-1 bg-black hover:bg-gray-800 text-white py-3 rounded-lg font-medium">
            ADD TO CART
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-12 w-12 rounded-lg border-2"
          >
            <Heart className="w-5 h-5" />
          </Button>
        </div>

        {/* Policy Section */}
        <div className="border-t pt-4 mt-2 space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <Truck className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <div>
              <span className="font-medium text-gray-700">Shipping: </span>
              <span className="text-gray-500">
                {product.shippingInformation || "Ships in 2 weeks"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Shield className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <div>
              <span className="font-medium text-gray-700">Warranty: </span>
              <span className="text-gray-500">
                {product.warrantyInformation || "3 year warranty"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <RotateCcw className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <div>
              <span className="font-medium text-gray-700">Return: </span>
              <span className="text-gray-500">
                {product.returnPolicy || "7 days return policy"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductDetailModal({
  open,
  onOpenChange,
  productId,
  product,
  loading,
}: ProductDetailModalProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const isMobile = useIsMobile();

  const handleClose = () => {
    onOpenChange(false);
  };

  // Mobile: Drawer
  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[90vh]">
          <VisuallyHidden>
            <DrawerTitle>Product Details</DrawerTitle>
          </VisuallyHidden>
          <div className="p-4 overflow-y-auto">
            {/* Close Button */}
            <div className="flex justify-end mb-2">
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <ProductContent
              product={product}
              loading={loading}
              selectedImage={selectedImage}
              setSelectedImage={setSelectedImage}
              quantity={quantity}
              setQuantity={setQuantity}
            />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  // Desktop: Dialog
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        // FIX: Ensured the height and overflow are constrained
        // to allow internal scrolling.
        className="!w-[60vw] !max-w-5xl !max-h-[90vh] overflow-y-auto p-6 border-none"
        showCloseButton={true}
      >
        <VisuallyHidden>
          <DialogTitle>Product Details</DialogTitle>
        </VisuallyHidden>
        <ProductContent
          product={product}
          loading={loading}
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
          quantity={quantity}
          setQuantity={setQuantity}
        />
      </DialogContent>
    </Dialog>
  );
}
