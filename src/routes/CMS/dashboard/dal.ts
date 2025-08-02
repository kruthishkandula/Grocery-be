import { dashboard_cms } from "../db/dashboard_cms";

export interface DashboardSection {
  key: string;
  title: string;
  type: 'category' | 'product' | 'banner';
  enabled: boolean;
  order: number;
  showSeeAll: boolean;
  seeAllRoute: string;
  dataSource: string;
  config?: {
    maxItems?: number;
    sortBy?: string;
    bannerType?: string;
    categoryFilter?: number[];
    productFilter?: {
      categoryId?: number;
      priceRange?: { min: number; max: number };
      tags?: string[];
    };
  };
}

export const dashboardCmsSample: DashboardSection[] = [
  {
    key: "shop_by_category",
    title: "Shop By Category",
    type: "category",
    enabled: true,
    order: 1,
    showSeeAll: true,
    seeAllRoute: "Categories",
    dataSource: "categories",
    config: {
      maxItems: 10,
      sortBy: "displayOrder"
    }
  },
  {
    key: "monsoon_special",
    title: "Monsoon Special",
    type: "product",
    enabled: true,
    order: 2,
    showSeeAll: true,
    seeAllRoute: "Products",
    dataSource: "products",
    config: {
      maxItems: 6,
      sortBy: "popularity",
      productFilter: {
        categoryId: 2,
        tags: ["monsoon", "seasonal"]
      }
    }
  },
  {
    key: "offers",
    title: "Offers",
    type: "banner",
    enabled: true,
    order: 0,
    showSeeAll: false,
    seeAllRoute: "",
    dataSource: "offers",
    config: {
      bannerType: "homepage",
      maxItems: 3
    }
  },
  {
    key: "shop_by_products",
    title: "Shop By Products",
    type: "product",
    enabled: true,
    order: 3,
    showSeeAll: true,
    seeAllRoute: "Products",
    dataSource: "products",
    config: {
      sortBy: "popularity",
      maxItems: 20
    }
  }
];

let dashboardCmsData: any = dashboard_cms

export function getDashboardCms(): any {
  return dashboardCmsData.sort((a: any, b: any) => a.order - b.order);
}

export function updateDashboardCms(newData: DashboardSection[]): DashboardSection[] {
  // Validate the data structure
  const validatedData = newData.map((section, index) => ({
    ...section,
    order: section.order !== undefined ? section.order : index,
    enabled: section.enabled !== undefined ? section.enabled : true,
    showSeeAll: section.showSeeAll !== undefined ? section.showSeeAll : true,
    config: section.config || {}
  }));

  dashboardCmsData = validatedData;
  return dashboardCmsData;
}

export function addDashboardSection(section: Omit<DashboardSection, 'order'>): DashboardSection[] {
  const newSection: DashboardSection = {
    ...section,
    order: dashboardCmsData.length
  };
  dashboardCmsData.push(newSection);
  return getDashboardCms();
}

export function updateDashboardSection(key: string, updates: Partial<DashboardSection>): DashboardSection[] {
  const index = dashboardCmsData.findIndex(section => section.key === key);
  if (index !== -1) {
    dashboardCmsData[index] = { ...dashboardCmsData[index], ...updates };
  }
  return getDashboardCms();
}

export function deleteDashboardSection(key: string): DashboardSection[] {
  dashboardCmsData = dashboardCmsData.filter(section => section.key !== key);
  return getDashboardCms();
}

export function reorderDashboardSections(orderedKeys: string[]): DashboardSection[] {
  const reorderedData: DashboardSection[] = [];

  orderedKeys.forEach((key, index) => {
    const section = dashboardCmsData.find(s => s.key === key);
    if (section) {
      reorderedData.push({ ...section, order: index });
    }
  });

  dashboardCmsData = reorderedData;
  return getDashboardCms();
}