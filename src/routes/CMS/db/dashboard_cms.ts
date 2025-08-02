export const dashboard_cms = [
   {
    "key": "offers",
    "title": "Offers",
    "type": "banner",
    "enabled": true,
    "order": 0,
    "showSeeAll": false,
    "seeAllRoute": "",
    "dataSource": "offers",
    "data_source": {
      "data": [
        {
          "enabled": true,
          "imageUrl": "https://img.freepik.com/free-vector/grocery-store-sale-banner-template_23-2151089846.jpg?semt=ais_hybrid&w=740",
          "key": "homepage_banner_1",
          "link": "Products",
          "order": 1,
          "subtitle": "Up to 50% off",
          "title": "Super Sale"
        },
        {
          "enabled": true,
          "imageUrl": "https://storage.googleapis.com/shy-pub/389981/indan-grocery-1724788522112.jpeg",
          "key": "homepage_banner_2",
          "link": "Categories",
          "order": 2,
          "subtitle": "New products in store",
          "title": "Fresh Arrivals"
        },
        {
          "enabled": true,
          "imageUrl": "https://img.freepik.com/free-vector/hand-drawn-supermarket-template_23-2150401496.jpg?semt=ais_hybrid&w=740",
          "key": "homepage_banner_3",
          "link": "Products",
          "order": 3,
          "subtitle": "Fresh Products",
          "title": "Fresh Arrivals"
        }
      ],
      "success": true
    }
  },
  {
    "key": "shop_by_category",
    "title": "Shop By Category",
    "type": "category",
    "enabled": true,
    "order": 1,
    "showSeeAll": true,
    "seeAllRoute": "Categories",
    "dataSource": "categories",
    "data_source": {
      "data": [
        {
          "createdAt": "2025-06-23 06:36:31.861",
          "description": "Vegetable products",
          "displayOrder": 0,
          "documentId": "kr0r3057o6u3xitozhf43ef5",
          "id": 2,
          "imageThumbnailUrl": "https://res.cloudinary.com/groceryplus/image/upload/v1751814191/strapi-uploads/thumbnail_vegetables_download_vegetable_photos_png_image_pngimg_3_bc3a3cbfa9.png",
          "imageUrl": "https://res.cloudinary.com/groceryplus/image/upload/v1751814191/strapi-uploads/vegetables_download_vegetable_photos_png_image_pngimg_3_bc3a3cbfa9.png",
          "isActive": true,
          "name": "Vegetables",
          "updatedAt": "2025-07-06 15:03:15.167"
        },
        {
          "createdAt": "2025-06-23 11:07:01.618",
          "description": "Snack products",
          "displayOrder": 0,
          "documentId": "kljsxcyz9i5p28ek7q3zu6xx",
          "id": 3,
          "imageThumbnailUrl": "https://res.cloudinary.com/groceryplus/image/upload/v1751814167/strapi-uploads/thumbnail_hp_sbf_m_biscuits_and_namkeens_480_250923_fc5a7450dc.webp",
          "imageUrl": "https://res.cloudinary.com/groceryplus/image/upload/v1751814167/strapi-uploads/hp_sbf_m_biscuits_and_namkeens_480_250923_fc5a7450dc.webp",
          "isActive": true,
          "name": "Snacks",
          "updatedAt": "2025-07-06 15:02:50.614"
        },
        {
          "createdAt": "2025-06-23 11:13:46.236",
          "description": "Beverages products",
          "displayOrder": 0,
          "documentId": "chnchvexphw5y6g0merjntx3",
          "id": 4,
          "imageThumbnailUrl": "https://res.cloudinary.com/groceryplus/image/upload/v1751814190/strapi-uploads/thumbnail_hp_bev_m_soft_drinks_and_more_480_250923_53b1d778a4.webp",
          "imageUrl": "https://res.cloudinary.com/groceryplus/image/upload/v1751814190/strapi-uploads/hp_bev_m_soft_drinks_and_more_480_250923_53b1d778a4.webp",
          "isActive": true,
          "name": "Beverages",
          "updatedAt": "2025-07-06 15:03:13.032"
        },
        {
          "createdAt": "2025-06-23 11:14:05.421",
          "description": "Cleaning and Household products",
          "displayOrder": 0,
          "documentId": "ziy54xad2nlh2xxl5leandm3",
          "id": 5,
          "imageThumbnailUrl": "https://res.cloudinary.com/groceryplus/image/upload/v1751814178/strapi-uploads/thumbnail_hp_c_and_h_m_detergents_and_fabric_care_480_250723_8703ae7302.webp",
          "imageUrl": "https://res.cloudinary.com/groceryplus/image/upload/v1751814178/strapi-uploads/hp_c_and_h_m_detergents_and_fabric_care_480_250723_8703ae7302.webp",
          "isActive": true,
          "name": "Cleaning & Household",
          "updatedAt": "2025-07-06 15:03:01.214"
        },
        {
          "createdAt": "2025-06-23 06:10:39.193",
          "description": "Fruit products very fresh",
          "displayOrder": 0,
          "documentId": "vc1m4v6gcuo7tetkf5ef259s",
          "id": 1,
          "imageThumbnailUrl": "https://res.cloudinary.com/groceryplus/image/upload/v1751814192/strapi-uploads/thumbnail_Pngtree_juicy_fruits_and_vitamins_natural_16259640_7394fbe324.png",
          "imageUrl": "https://res.cloudinary.com/groceryplus/image/upload/v1752487728/categories/sa565capeegh09heggem.png",
          "isActive": true,
          "name": "Fresh Fruits",
          "updatedAt": "2025-07-14 10:09:55.834946"
        }
      ],
      "meta": {
        "pagination": {
          "page": 1,
          "pageCount": 1,
          "pageSize": 10,
          "total": 5
        }
      }
    }
  },
  {
    "key": "monsoon_special",
    "title": "Monsoon Special",
    "type": "product",
    "enabled": true,
    "order": 2,
    "showSeeAll": true,
    "seeAllRoute": "Products",
    "dataSource": "products",
    "data_source": {
      "data": [
        {
          "id": 17,
          "documentId": "a67u95upd6yjctzvbuw6llul",
          "name": "Bottle Gourd",
          "description": "Our bottle gourds are tender, juicy, and ideal for a variety of dishes like curries and soups. They are low in calories and rich in water content, making them a must-have for a healthy, balanced diet.",
          "shortDescription": "Our bottle gourds are tender",
          "basePrice": "30.00",
          "discountPrice": "22.00",
          "costPrice": "25.00",
          "weightUnit": "kg",
          "isActive": true,
          "currency": "INR",
          "currencySymbol": "₹",
          "barcode": null,
          "brand": null,
          "categoryId": 2,
          "createdAt": "2025-06-23 08:20:53.499",
          "updatedAt": "2025-07-13 12:49:17.68687",
          "images": [
            {
              "id": 19,
              "url": "https://res.cloudinary.com/groceryplus/image/upload/v1752329038/products/hbdjmt3q9qpelhevkafu.webp",
              "thumbnailUrl": null,
              "displayOrder": 0
            }
          ],
          "variants": []
        },
        {
          "id": 12,
          "documentId": "dx6lmnr4li7dy8s9iojberlf",
          "name": "Tomato",
          "description": "Handpicked tomatoes with vibrant color and tangy-sweet taste. Perfect for salads, sauces, or as a cooking essential. Packed with lycopene, vitamins, and antioxidants for a healthy diet.",
          "shortDescription": "Handpicked tomatoes with vibrant color and tangy-sweet taste. Perfect for salads, sauces, or as a cooking essential. Packed with lycopene, vitamins, and antioxidants for a healthy diet.",
          "basePrice": "35.00",
          "discountPrice": "24.00",
          "costPrice": "27.00",
          "weightUnit": "kg",
          "isActive": true,
          "currency": "INR",
          "currencySymbol": "₹",
          "barcode": null,
          "brand": null,
          "categoryId": 2,
          "createdAt": "2025-06-23 06:58:06.491",
          "updatedAt": "2025-07-13 12:48:50.937928",
          "images": [
            {
              "id": 18,
              "url": "https://res.cloudinary.com/groceryplus/image/upload/v1752409397/products/ie563ooslm0pafveda01.png",
              "thumbnailUrl": null,
              "displayOrder": 0
            }
          ],
          "variants": []
        },
        {
          "id": 3,
          "documentId": "a18d20152cf345e694252053b1a15d36",
          "name": "Banana",
          "description": "Banana",
          "shortDescription": "Boomer",
          "basePrice": "58.00",
          "discountPrice": "58.00",
          "costPrice": "58.00",
          "weightUnit": "kg",
          "isActive": true,
          "currency": "INR",
          "currencySymbol": "₹",
          "barcode": null,
          "brand": null,
          "categoryId": 1,
          "createdAt": "2025-07-13 12:38:45.333005",
          "updatedAt": "2025-07-13 12:48:32.58158",
          "images": [
            {
              "id": 17,
              "url": "https://res.cloudinary.com/groceryplus/image/upload/v1752409398/products/o3sbncjiffayyhhdovwk.jpg",
              "thumbnailUrl": null,
              "displayOrder": 0
            }
          ],
          "variants": []
        }
      ],
      "meta": {
        "pagination": {
          "page": 1,
          "pageSize": 10,
          "pageCount": 1,
          "total": 6
        }
      }
    }
  },
  {
    "key": "shop_by_products",
    "title": "Shop By Products",
    "type": "product",
    "enabled": true,
    "order": 3,
    "showSeeAll": true,
    "seeAllRoute": "Products",
    "dataSource": "products",
    "data_source": {
      "data": [
        {
          "id": 13,
          "documentId": "f8ymc56a7vs0kurr9s9kfbrd",
          "name": "Sweet Potato",
          "description": "Our premium potatoes are earthy, hearty, and ideal for boiling, baking, mashing, or frying. Packed with essential vitamins and fiber, they form the foundation of countless delicious dishes and sides.",
          "shortDescription": "Fresh, versatile potatoes perfect for any meal.",
          "basePrice": "45.00",
          "discountPrice": "32.00",
          "costPrice": "38.00",
          "weightUnit": "kg",
          "isActive": true,
          "currency": "INR",
          "currencySymbol": "₹",
          "barcode": null,
          "brand": null,
          "categoryId": 2,
          "createdAt": "2025-06-23 06:47:43.104",
          "updatedAt": "2025-07-19 04:53:26.677442",
          "images": [
            {
              "id": 24,
              "url": "https://res.cloudinary.com/groceryplus/image/upload/v1752415620/products/yndzee2rpj0zxjaan8uy.png",
              "thumbnailUrl": null,
              "displayOrder": 0
            }
          ],
          "variants": []
        },
        {
          "id": 6,
          "documentId": "isuu6nd2tjc23l3frec0sun9",
          "name": "Premium Apples",
          "description": "Updated description for premium apples from our organic orchards.",
          "shortDescription": "Organic premium apples.",
          "basePrice": "195.00",
          "discountPrice": "175.00",
          "costPrice": "180.00",
          "weightUnit": "kg",
          "isActive": true,
          "currency": "INR",
          "currencySymbol": "₹",
          "barcode": null,
          "brand": null,
          "categoryId": 1,
          "createdAt": "2025-06-23 06:22:16.324",
          "updatedAt": "2025-07-14 07:36:46.203924",
          "images": [
            {
              "id": 21,
              "url": "https://res.cloudinary.com/groceryplus/image/upload/v1752404664/products/d9z2lrut3wztyirrbpk1.jpg",
              "thumbnailUrl": null,
              "displayOrder": 0
            },
            {
              "id": 22,
              "url": "https://res.cloudinary.com/groceryplus/image/upload/v1752409398/products/gj1rex34hjvoof0jntaj.jpg",
              "thumbnailUrl": null,
              "displayOrder": 1
            },
            {
              "id": 23,
              "url": "https://res.cloudinary.com/groceryplus/image/upload/v1752409397/products/i6omyv7x2nnkezck1q4t.jpg",
              "thumbnailUrl": null,
              "displayOrder": 2
            }
          ],
          "variants": []
        },
        {
          "id": 2,
          "documentId": "mggshsumd4mjlq0eoeumdjax",
          "name": "Strawberry",
          "description": "Our strawberries are picked at the peak of ripeness, offering a juicy, sweet flavor that's perfect for snacking, baking, or adding to your favorite desserts. Rich in vitamin C and antioxidants, they're a delicious and healthy choice for any time of day.",
          "shortDescription": "Fresh, juicy strawberries bursting with sweetness.",
          "basePrice": "58.43",
          "discountPrice": "58.43",
          "costPrice": "58.43",
          "weightUnit": "kg",
          "isActive": true,
          "currency": "INR",
          "currencySymbol": "₹",
          "barcode": null,
          "brand": "",
          "categoryId": 1,
          "createdAt": "2025-06-23 06:16:01.799",
          "updatedAt": "2025-07-13 16:58:49.645",
          "images": [
            {
              "id": 8,
              "url": "https://res.cloudinary.com/groceryplus/image/upload/v1752404444/products/xqmy6iagtrghu621r65x.jpg",
              "thumbnailUrl": null,
              "displayOrder": 0
            },
            {
              "id": 9,
              "url": "https://res.cloudinary.com/groceryplus/image/upload/v1752404444/products/kvnm25p8mekgiviovm2o.jpg",
              "thumbnailUrl": null,
              "displayOrder": 1
            },
            {
              "id": 10,
              "url": "https://res.cloudinary.com/groceryplus/image/upload/v1752404443/products/lxky7x7od60dxbpxpt0u.jpg",
              "thumbnailUrl": null,
              "displayOrder": 2
            }
          ],
          "variants": []
        },
        {
          "id": 17,
          "documentId": "a67u95upd6yjctzvbuw6llul",
          "name": "Bottle Gourd",
          "description": "Our bottle gourds are tender, juicy, and ideal for a variety of dishes like curries and soups. They are low in calories and rich in water content, making them a must-have for a healthy, balanced diet.",
          "shortDescription": "Our bottle gourds are tender",
          "basePrice": "30.00",
          "discountPrice": "22.00",
          "costPrice": "25.00",
          "weightUnit": "kg",
          "isActive": true,
          "currency": "INR",
          "currencySymbol": "₹",
          "barcode": null,
          "brand": null,
          "categoryId": 2,
          "createdAt": "2025-06-23 08:20:53.499",
          "updatedAt": "2025-07-13 12:49:17.68687",
          "images": [
            {
              "id": 19,
              "url": "https://res.cloudinary.com/groceryplus/image/upload/v1752329038/products/hbdjmt3q9qpelhevkafu.webp",
              "thumbnailUrl": null,
              "displayOrder": 0
            }
          ],
          "variants": []
        },
        {
          "id": 12,
          "documentId": "dx6lmnr4li7dy8s9iojberlf",
          "name": "Tomato",
          "description": "Handpicked tomatoes with vibrant color and tangy-sweet taste. Perfect for salads, sauces, or as a cooking essential. Packed with lycopene, vitamins, and antioxidants for a healthy diet.",
          "shortDescription": "Handpicked tomatoes with vibrant color and tangy-sweet taste. Perfect for salads, sauces, or as a cooking essential. Packed with lycopene, vitamins, and antioxidants for a healthy diet.",
          "basePrice": "35.00",
          "discountPrice": "24.00",
          "costPrice": "27.00",
          "weightUnit": "kg",
          "isActive": true,
          "currency": "INR",
          "currencySymbol": "₹",
          "barcode": null,
          "brand": null,
          "categoryId": 2,
          "createdAt": "2025-06-23 06:58:06.491",
          "updatedAt": "2025-07-13 12:48:50.937928",
          "images": [
            {
              "id": 18,
              "url": "https://res.cloudinary.com/groceryplus/image/upload/v1752409397/products/ie563ooslm0pafveda01.png",
              "thumbnailUrl": null,
              "displayOrder": 0
            }
          ],
          "variants": []
        },
        {
          "id": 3,
          "documentId": "a18d20152cf345e694252053b1a15d36",
          "name": "Banana",
          "description": "Banana",
          "shortDescription": "Boomer",
          "basePrice": "58.00",
          "discountPrice": "58.00",
          "costPrice": "58.00",
          "weightUnit": "kg",
          "isActive": true,
          "currency": "INR",
          "currencySymbol": "₹",
          "barcode": null,
          "brand": null,
          "categoryId": 1,
          "createdAt": "2025-07-13 12:38:45.333005",
          "updatedAt": "2025-07-13 12:48:32.58158",
          "images": [
            {
              "id": 17,
              "url": "https://res.cloudinary.com/groceryplus/image/upload/v1752409398/products/o3sbncjiffayyhhdovwk.jpg",
              "thumbnailUrl": null,
              "displayOrder": 0
            }
          ],
          "variants": []
        }
      ],
      "meta": {
        "pagination": {
          "page": 1,
          "pageSize": 10,
          "pageCount": 1,
          "total": 6
        }
      }
    }
  }
]