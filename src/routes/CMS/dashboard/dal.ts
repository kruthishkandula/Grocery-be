export const dashboardCmsSample = [
  {
    key: "shop_by_category",
    title: "Shop By Category",
    type: "category",
    enabled: true,
    order: 1,
    showSeeAll: true,
    dataSource: "categories",
    config: { maxItems: 10 }
  },
  {
    key: "offers",
    title: "Offers",
    type: "banner",
    enabled: true,
    order: 2,
    showSeeAll: false,
    dataSource: "banners",
    config: { bannerType: "homepage" }
  },
  {
    key: "shop_by_products",
    title: "Shop By Products",
    type: "product",
    enabled: true,
    order: 3,
    showSeeAll: true,
    dataSource: "products",
    config: { sortBy: "popularity", maxItems: 20 }
  }
  // Add more sections as needed
];

let dashboardCmsData = [...dashboardCmsSample];

export function getDashboardCms() {
  return dashboardCmsData;
}

export function updateDashboardCms(newData: any[]) {
  dashboardCmsData = newData;
  return dashboardCmsData;
}