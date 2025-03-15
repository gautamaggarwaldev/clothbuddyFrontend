// productData.ts
export interface Product {
  id: number;
  name: string;
  category: string;
  sales: number;
  image: string;
  percentGrowth: number;
  stockRemaining: number;
}

export interface SizeData {
  size: string;
  units: number;
}

export interface MonthlyData {
  month: string;
  units: number;
}

export interface CategoryData {
  category: string;
  label: string;
  sizeData: SizeData[];
  monthlyData: MonthlyData[];
  products: Product[];
}

// This is your centralized data file - update this to change the dashboard
const productData: Record<string, CategoryData> = {
  shirts: {
    category: "shirts",
    label: "Shirts",
    sizeData: [
      { size: "XS", units: 15000 },
      { size: "S", units: 12000 },
      { size: "M", units: 15500 },
      { size: "L", units: 9000 },
      { size: "XL", units: 17000 },
      { size: "XXL", units: 15000 },
      { size: "XXXL", units: 14500 },
    ],
    monthlyData: [
      { month: "Jan", units: 5000 },
      { month: "Feb", units: 7000 },
      { month: "Mar", units: 10000 },
      { month: "Apr", units: 8000 },
      { month: "May", units: 6000 },
      { month: "Jun", units: 9000 },
      { month: "Jul", units: 11000 },
      { month: "Aug", units: 13000 },
      { month: "Sep", units: 15000 },
      { month: "Oct", units: 13000 },
      { month: "Nov", units: 10000 },
      { month: "Dec", units: 10000 },
    ],
    products: [
      {
        id: 1,
        category: "shirts",
        name: "Cotton Shirt",
        sales: 14143,
        image: "/shirt1.png",
        percentGrowth: 12.5,
        stockRemaining: 133,
      },
      {
        id: 2,
        category: "shirts",
        name: "Nylon Shirt",
        sales: 6124,
        image: "/shirt2.png",
        percentGrowth: 8.8,
        stockRemaining: 153,
      },
      {
        id: 3,
        category: "shirts",
        name: "Poly-Cotton Shirt",
        sales: 7272,
        image: "/shirt3.png",
        percentGrowth: 0.5,
        stockRemaining: 135,
      },
    ],
  },
  pants: {
    category: "pants",
    label: "Pants",
    sizeData: [
      { size: "XS", units: 10000 },
      { size: "S", units: 13000 },
      { size: "M", units: 18000 },
      { size: "L", units: 16000 },
      { size: "XL", units: 12000 },
      { size: "XXL", units: 8000 },
      { size: "XXXL", units: 6000 },
    ],
    monthlyData: [
      { month: "Jan", units: 4000 },
      { month: "Feb", units: 6000 },
      { month: "Mar", units: 8000 },
      { month: "Apr", units: 11000 },
      { month: "May", units: 10000 },
      { month: "Jun", units: 9500 },
      { month: "Jul", units: 8500 },
      { month: "Aug", units: 12000 },
      { month: "Sep", units: 13500 },
      { month: "Oct", units: 11000 },
      { month: "Nov", units: 9000 },
      { month: "Dec", units: 8500 },
    ],
    products: [
      {
        id: 4,
        category: "pants",
        name: "Jeans",
        sales: 16500,
        image: "/pants1.png",
        percentGrowth: 15.2,
        stockRemaining: 220,
      },
      {
        id: 5,
        category: "pants",
        name: "Chinos",
        sales: 8300,
        image: "/pants2.png",
        percentGrowth: 5.5,
        stockRemaining: 120,
      },
      {
        id: 6,
        category: "pants",
        name: "Slacks",
        sales: 5100,
        image: "/pants3.png",
        percentGrowth: -2.1,
        stockRemaining: 85,
      },
    ],
  },
  dresses: {
    category: "dresses",
    label: "Dresses",
    sizeData: [
      { size: "XS", units: 18000 },
      { size: "S", units: 21000 },
      { size: "M", units: 19000 },
      { size: "L", units: 14000 },
      { size: "XL", units: 11000 },
      { size: "XXL", units: 7500 },
      { size: "XXXL", units: 5000 },
    ],
    monthlyData: [
      { month: "Jan", units: 8000 },
      { month: "Feb", units: 7500 },
      { month: "Mar", units: 9000 },
      { month: "Apr", units: 11000 },
      { month: "May", units: 15000 },
      { month: "Jun", units: 17000 },
      { month: "Jul", units: 16000 },
      { month: "Aug", units: 14500 },
      { month: "Sep", units: 12000 },
      { month: "Oct", units: 10000 },
      { month: "Nov", units: 9500 },
      { month: "Dec", units: 11000 },
    ],
    products: [
      {
        id: 7,
        category: "dresses",
        name: "Maxi Dress",
        sales: 12350,
        image: "/dress1.png",
        percentGrowth: 18.7,
        stockRemaining: 95,
      },
      {
        id: 8,
        category: "dresses",
        name: "Cocktail Dress",
        sales: 8420,
        image: "/dress2.png",
        percentGrowth: 7.2,
        stockRemaining: 110,
      },
      {
        id: 9,
        category: "dresses",
        name: "Sundress",
        sales: 9870,
        image: "/dress3.png",
        percentGrowth: 10.3,
        stockRemaining: 78,
      },
    ],
  },
  accessories: {
    category: "accessories",
    label: "Accessories",
    sizeData: [
      { size: "XS", units: 5000 },
      { size: "S", units: 12000 },
      { size: "M", units: 22000 },
      { size: "L", units: 15000 },
      { size: "XL", units: 8000 },
      { size: "XXL", units: 4000 },
      { size: "XXXL", units: 2000 },
    ],
    monthlyData: [
      { month: "Jan", units: 7000 },
      { month: "Feb", units: 8500 },
      { month: "Mar", units: 9000 },
      { month: "Apr", units: 8000 },
      { month: "May", units: 9500 },
      { month: "Jun", units: 11000 },
      { month: "Jul", units: 13000 },
      { month: "Aug", units: 15000 },
      { month: "Sep", units: 16500 },
      { month: "Oct", units: 14000 },
      { month: "Nov", units: 12000 },
      { month: "Dec", units: 13500 },
    ],
    products: [
      {
        id: 10,
        category: "accessories",
        name: "Watches",
        sales: 5240,
        image: "/acc1.png",
        percentGrowth: 20.1,
        stockRemaining: 180,
      },
      {
        id: 11,
        category: "accessories",
        name: "Handbags",
        sales: 7850,
        image: "/acc2.png",
        percentGrowth: 15.8,
        stockRemaining: 120,
      },
      {
        id: 12,
        category: "accessories",
        name: "Jewelry",
        sales: 9630,
        image: "/acc3.png",
        percentGrowth: 12.3,
        stockRemaining: 250,
      },
    ],
  },
  menswear: {
    category: "menswear",
    label: "Men's Wear",
    sizeData: [
      { size: "XS", units: 8000 },
      { size: "S", units: 11000 },
      { size: "M", units: 18000 },
      { size: "L", units: 21000 },
      { size: "XL", units: 19000 },
      { size: "XXL", units: 12000 },
      { size: "XXXL", units: 8000 },
    ],
    monthlyData: [
      { month: "Jan", units: 9000 },
      { month: "Feb", units: 10000 },
      { month: "Mar", units: 11500 },
      { month: "Apr", units: 10000 },
      { month: "May", units: 9500 },
      { month: "Jun", units: 11000 },
      { month: "Jul", units: 13500 },
      { month: "Aug", units: 15000 },
      { month: "Sep", units: 14000 },
      { month: "Oct", units: 13000 },
      { month: "Nov", units: 12000 },
      { month: "Dec", units: 15500 },
    ],
    products: [
      {
        id: 13,
        category: "menswear",
        name: "Suits",
        sales: 3250,
        image: "/men1.png",
        percentGrowth: 8.5,
        stockRemaining: 75,
      },
      {
        id: 14,
        category: "menswear",
        name: "Blazers",
        sales: 4120,
        image: "/men2.png",
        percentGrowth: 5.2,
        stockRemaining: 90,
      },
      {
        id: 15,
        category: "menswear",
        name: "T-shirts",
        sales: 18750,
        image: "/men3.png",
        percentGrowth: 12.7,
        stockRemaining: 320,
      },
    ],
  },
  womenswear: {
    category: "womenswear",
    label: "Women's Wear",
    sizeData: [
      { size: "XS", units: 16000 },
      { size: "S", units: 21000 },
      { size: "M", units: 22000 },
      { size: "L", units: 17000 },
      { size: "XL", units: 13000 },
      { size: "XXL", units: 9000 },
      { size: "XXXL", units: 6000 },
    ],
    monthlyData: [
      { month: "Jan", units: 12000 },
      { month: "Feb", units: 13000 },
      { month: "Mar", units: 14500 },
      { month: "Apr", units: 15000 },
      { month: "May", units: 17000 },
      { month: "Jun", units: 18500 },
      { month: "Jul", units: 17000 },
      { month: "Aug", units: 16000 },
      { month: "Sep", units: 14500 },
      { month: "Oct", units: 15000 },
      { month: "Nov", units: 16500 },
      { month: "Dec", units: 18000 },
    ],
    products: [
      {
        id: 16,
        category: "womenswear",
        name: "Blouses",
        sales: 14230,
        image: "/women1.png",
        percentGrowth: 15.3,
        stockRemaining: 185,
      },
      {
        id: 17,
        category: "womenswear",
        name: "Skirts",
        sales: 9850,
        image: "/women2.png",
        percentGrowth: 8.9,
        stockRemaining: 140,
      },
      {
        id: 18,
        category: "womenswear",
        name: "Tops",
        sales: 21560,
        image: "/women3.png",
        percentGrowth: 17.2,
        stockRemaining: 230,
      },
    ],
  },
};

export default productData;
