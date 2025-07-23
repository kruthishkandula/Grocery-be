export const bannersCmsSample = [
  {
    key: "homepage_banner_1",
    imageUrl: "https://img.freepik.com/free-vector/grocery-store-sale-banner-template_23-2151089846.jpg?semt=ais_hybrid&w=740",
    link: "/offers/1",
    enabled: true,
    order: 1,
    title: "Super Sale",
    subtitle: "Up to 50% off"
  },
  {
    key: "homepage_banner_2",
    imageUrl: "https://storage.googleapis.com/shy-pub/389981/indan-grocery-1724788522112.jpeg",
    link: "/offers/2",
    enabled: true,
    order: 2,
    title: "Fresh Arrivals",
    subtitle: "New products in store"
  }
];

let bannersCmsData = [...bannersCmsSample];

export function getBannersCms() {
  return bannersCmsData;
}

export function updateBannersCms(newData: any[]) {
  bannersCmsData = newData;
  return bannersCmsData;
}