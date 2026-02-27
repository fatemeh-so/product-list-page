"use server";

// 1. Define the type for the structure you want to select
export interface ProductSubset {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  slug: string;
  category: string;
  images: string[];
  discountPercentage: number;
  total: number;
  brand: string;
  stock: number;
  shippingInformation: string;
  returnPolicy: string;
  warrantyInformation: string;
  reviews: Review[];
  availabilityStatus: string;
  description: string;
  rating: number;
}

export interface Review {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

export interface ProductResponse {
  products: ProductSubset[];
  total: number;
  minPrice: number;
  maxPrice: number;
}

export async function fetchProducts(
  page: number = 1,
  limit: number = 16,
  searchQuery: string = "",
  sortBy: string = "desc", // e.g., 'price'
  order: "asc" | "desc" = "desc",
  fields: string = "",
  category: string = "",
  brand: string = "",
  range: [number, number] = [0.79, 36999.99],
  inStock: boolean = false,
): Promise<ProductResponse> {
  // Calculate skip for pagination
  const skip = (page - 1) * limit;

  // Build the base URL
  let url = `https://dummyjson.com/products`;

  // 2. Handle Search or Category at URL level
  if (searchQuery) {
    url = `https://dummyjson.com/products/search?q=${encodeURIComponent(searchQuery)}`;
  } else if (category) {
    // DummyJSON supports category filtering via URL path
    const categories = category
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);
    if (categories.length === 1) {
      url = `https://dummyjson.com/products/category/${encodeURIComponent(categories[0])}`;
    }
    // If multiple categories, we'll fetch all and filter client-side
  }

  // 3. Add Pagination to the URL
  const separator = url.includes("?") ? "&" : "?";
  const params = new URLSearchParams();
  params.set("limit", "0"); // Fetch all to allow proper client-side filtering
  params.set("skip", "0");

  // Only add select if fields is provided
  if (fields) {
    params.set("select", fields);
  }

  url += separator + params.toString();

  const res = await fetch(url);
  const data = await res.json();

  let products = data.products || [];

  // 4. Handle Sorting
  if (sortBy === "LowPrice") {
    products.sort((a: ProductSubset, b: ProductSubset) => a.price - b.price);
  } else if (sortBy === "HighPrice") {
    products.sort((a: ProductSubset, b: ProductSubset) => b.price - a.price);
  } else if (sortBy === "discount") {
    products.sort(
      (a: ProductSubset, b: ProductSubset) =>
        b.discountPercentage - a.discountPercentage,
    );
  }

  // 5. Handle Category Filter (client-side for multiple categories)
  if (category) {
    const categoryList = category
      .split(",")
      .map((c) => c.trim().toLowerCase())
      .filter(Boolean);
    if (categoryList.length > 0) {
      products = products.filter((product: ProductSubset) =>
        categoryList.includes(product.category.toLowerCase()),
      );
    }
  }

  // 6. Handle Brand Filter
  if (brand) {
    const brandList = brand;
    console.log("brandList", brandList);

    if (brandList.length > 0) {
      products = products.filter((product: ProductSubset) =>
        brandList.includes(product.brand),
      );
    }
  }

  // 7. Handle Price Range Filter
  if (range[0] !== 0 || range[1] !== 10000000) {
    products = products.filter(
      (product: ProductSubset) =>
        product.price >= range[0] && product.price <= range[1],
    );
  }

  // 8. Handle In Stock Filter
  if (inStock) {
    products = products.filter((product: ProductSubset) => product.stock > 0);
  }

  // 9. Calculate min/max price AFTER all filters (for accurate range display)
  const minPrice =
    products.length > 0
      ? products.reduce(
          (min: number, product: ProductSubset) => Math.min(min, product.price),
          Infinity,
        )
      : 0;
  const maxPrice =
    products.length > 0
      ? products.reduce(
          (max: number, product: ProductSubset) => Math.max(max, product.price),
          -Infinity,
        )
      : 0;

  // 10. Apply pagination AFTER all filtering
  const totalFiltered = products.length;
  const paginatedProducts = products.slice(skip, skip + limit);
  console.log("fhfb", minPrice, maxPrice);

  return {
    products: paginatedProducts,
    total: totalFiltered,
    minPrice,
    maxPrice,
  };
}

export async function fetchCategories() {
  const res = await fetch("https://dummyjson.com/products/categories");
  const data = await res.json();
  return data;
}

export async function fetchBrands() {
  const res = await fetch("https://dummyjson.com/products?limit=0");
  const data = await res.json();
  const brands = data.products.map((product: ProductSubset) => product.brand);
  return [...new Set(brands)];
}

export async function getProduct(id: number | undefined) {
  const res = await fetch(`https://dummyjson.com/products/${id}`);
  const data = await res.json();
  return data;
}
