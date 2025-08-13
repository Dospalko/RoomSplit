export const DEFAULT_CATEGORIES = [
  {
    name: "Food & Dining",
    description: "Groceries, restaurants, takeout",
    color: "#EF4444",
    icon: "🍽️"
  },
  {
    name: "Utilities",
    description: "Electricity, water, gas, internet",
    color: "#F59E0B",
    icon: "⚡"
  },
  {
    name: "Rent & Housing",
    description: "Rent, mortgage, property taxes",
    color: "#8B5CF6",
    icon: "🏠"
  },
  {
    name: "Transportation",
    description: "Gas, parking, public transport",
    color: "#06B6D4",
    icon: "🚗"
  },
  {
    name: "Entertainment",
    description: "Movies, concerts, streaming services",
    color: "#EC4899",
    icon: "🎬"
  },
  {
    name: "Shopping",
    description: "Clothes, electronics, household items",
    color: "#10B981",
    icon: "🛍️"
  },
  {
    name: "Health & Medical",
    description: "Doctor visits, medication, insurance",
    color: "#F43F5E",
    icon: "🏥"
  },
  {
    name: "Other",
    description: "Miscellaneous expenses",
    color: "#6B7280",
    icon: "📦"
  }
];

export async function createDefaultCategories(roomId: number) {
  const { prisma } = await import("@/server/db");
  
  const categories = await Promise.all(
    DEFAULT_CATEGORIES.map(category =>
      prisma.category.create({
        data: {
          ...category,
          roomId
        }
      })
    )
  );
  
  return categories;
}
