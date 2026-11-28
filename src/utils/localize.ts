import type { Locale } from '@/stores/language.store';

export interface LocalizableProduct {
  name?: string | null;
  nameEn?: string | null;
  slug?: string | null;
  description?: string | null;
  descriptionEn?: string | null;
  ingredients?: string | null;
  ingredientsEn?: string | null;
}

export interface LocalizableBranch {
  code?: string | null;
  name?: string | null;
  nameEn?: string | null;
  address?: string | null;
  addressEn?: string | null;
  city?: string | null;
  cityEn?: string | null;
}

export interface LocalizableCategory {
  name?: string | null;
  nameEn?: string | null;
  slug?: string | null;
}

const PRODUCT_EN_FALLBACK: Record<
  string,
  {
    nameEn: string;
    descriptionEn?: string;
    ingredientsEn?: string;
  }
> = {
  'shokupan-classic': {
    nameEn: 'Classic Hokkaido Shokupan Bread',
    descriptionEn:
      'Japanese Hokkaido-style white sandwich loaf with ultra-soft, feathery texture and natural dairy aroma.',
    ingredientsEn: 'Japanese wheat flour, Hokkaido fresh milk, unsalted butter, natural yeast, sea salt',
  },
  'croissant-bo-phap': {
    nameEn: 'French Butter Croissant',
    descriptionEn:
      '27-layer laminated artisan croissant baked golden and flaky with premium French AOP butter.',
    ingredientsEn: 'T55 flour, AOP French butter, fresh milk, organic eggs, natural yeast',
  },
  'pain-au-chocolat': {
    nameEn: 'Belgian Dark Chocolate Croissant',
    descriptionEn:
      'Crispy layered pastry filled with rich 70% Belgian dark chocolate batons.',
    ingredientsEn: 'T55 flour, French butter, 70% Belgian dark chocolate, fresh milk, eggs',
  },
  'banh-mi-hoa-cuc-brioche': {
    nameEn: 'French Braided Brioche Bread',
    descriptionEn:
      'Fragrant orange-blossom braided French brioche enriched with butter and free-range eggs.',
    ingredientsEn: 'Wheat flour, French butter, eggs, orange blossom extract, sliced almonds',
  },
  'melonpan-matcha-uji': {
    nameEn: 'Uji Matcha Melonpan Bun',
    descriptionEn:
      'Soft Japanese bun topped with a crispy Uji Kyoto matcha cookie crust.',
    ingredientsEn: 'Japanese wheat flour, Uji Kyoto matcha powder, butter, fresh milk, cane sugar',
  },
  'sourdough-nguyen-cam': {
    nameEn: 'Artisan Whole-Wheat Country Sourdough',
    descriptionEn:
      'Naturally fermented 36-hour sourdough with a caramelized crust and nutritious whole-grain crumb.',
    ingredientsEn: 'Whole wheat flour, Rye flour, 36h natural starter, sea salt, filtered water',
  },
  'baguette-men-tu-nhien': {
    nameEn: 'Natural Levain French Baguette',
    descriptionEn:
      'Traditional crisp French baguette with an airy honeycomb crumb and toasted wheat aroma.',
    ingredientsEn: 'French T65 flour, Levain natural starter, sea salt, water',
  },
  'cinnamon-roll-kem-pho-mai': {
    nameEn: 'Cream Cheese Cinnamon Roll',
    descriptionEn:
      'Warm spiced cinnamon swirl topped with velvety cream cheese frosting.',
    ingredientsEn: 'Wheat flour, Cassia cinnamon powder, brown sugar, Cream cheese, French butter',
  },
  'frozen-croissant-dough-pack': {
    nameEn: 'Frozen Ready-to-Bake Croissant Dough (Pack of 6)',
    descriptionEn:
      'Pre-laminated and shaped frozen croissant dough ready for home or café oven baking.',
    ingredientsEn: 'T55 flour, AOP French butter, cold-resistant yeast, fresh milk',
  },
};

const CATEGORY_EN_FALLBACK: Record<string, string> = {
  'shokupan-toast': 'Shokupan & Toast',
  'croissant-danish': 'Croissant & Danish',
  'banh-ngot-nhat-ban': 'Japanese Sweet Buns',
  'sourdough-artisan': 'Sourdough & Artisan',
  'banh-dong-lanh-frozen': 'Frozen Dough & Ready-to-Bake',
  'banh-mi-goi': 'Sliced Loaf Bread',
  'banh-mi-ngot': 'Sweet Bread',
  'banh-mi-man': 'Savory Bread',
  'banh-nuong-xop': 'Flaky Pastries',
  'banh-mi-au': 'European Bread',
  'banh-kem': 'Cream Cakes',
  'banh-lanh': 'Chilled Pastries',
  'banh-quy': 'Cookies',
  'banh-theo-mua': 'Seasonal Specials',
};

const BRANCH_EN_FALLBACK: Record<
  string,
  {
    nameEn: string;
    addressEn: string;
    cityEn: string;
  }
> = {
  'HCM-Q1': {
    nameEn: 'Cobi Bread Flagship Dong Khoi (District 1)',
    addressEn: '45 Dong Khoi St., Ben Nghe Ward, District 1',
    cityEn: 'Ho Chi Minh City',
  },
  'HCM-Q7': {
    nameEn: 'Cobi Bread Phu My Hung (Cobi Tower)',
    addressEn: 'Cobi Tower II, 2-4 Street No. 8, Tan Phu Ward, District 7',
    cityEn: 'Ho Chi Minh City',
  },
  'HCM-TD': {
    nameEn: 'Cobi Bread Thao Dien (Thu Duc)',
    addressEn: '18 Xuan Thuy St., Thao Dien Ward, Thu Duc City',
    cityEn: 'Ho Chi Minh City',
  },
  'HN-HK': {
    nameEn: 'Cobi Bread Hoan Kiem (Hanoi)',
    addressEn: '22 Ly Thuong Kiet St., Phan Chu Trinh Ward, Hoan Kiem District',
    cityEn: 'Hanoi',
  },
  'DN-HC': {
    nameEn: 'Cobi Bread Bach Dang (Da Nang)',
    addressEn: '108 Bach Dang St., Hai Chau 1 Ward, Hai Chau District',
    cityEn: 'Da Nang',
  },
};

export function getLocalizedField(
  item: Record<string, unknown> | null | undefined,
  field: string,
  locale: Locale
): string {
  if (!item) return '';
  if (locale === 'en') {
    const enKey = `${field}En`;
    const enValue = item[enKey];
    if (typeof enValue === 'string' && enValue.trim().length > 0) {
      return enValue;
    }
  }
  const baseVal = item[field];
  return typeof baseVal === 'string' ? baseVal : '';
}

export function getLocalizedProductName(
  product: LocalizableProduct | null | undefined,
  locale: Locale
): string {
  if (!product) return '';
  if (locale === 'en') {
    if (product.nameEn && product.nameEn.trim()) return product.nameEn;
    if (product.slug && PRODUCT_EN_FALLBACK[product.slug]?.nameEn) {
      return PRODUCT_EN_FALLBACK[product.slug].nameEn;
    }
  }
  return product.name || '';
}

export function getLocalizedProductDescription(
  product: LocalizableProduct | null | undefined,
  locale: Locale
): string {
  if (!product) return '';
  if (locale === 'en') {
    if (product.descriptionEn && product.descriptionEn.trim()) return product.descriptionEn;
    if (product.slug && PRODUCT_EN_FALLBACK[product.slug]?.descriptionEn) {
      return PRODUCT_EN_FALLBACK[product.slug].descriptionEn!;
    }
  }
  return product.description || '';
}

export function getLocalizedProductIngredients(
  product: LocalizableProduct | null | undefined,
  locale: Locale
): string {
  if (!product) return '';
  if (locale === 'en') {
    if (product.ingredientsEn && product.ingredientsEn.trim()) return product.ingredientsEn;
    if (product.slug && PRODUCT_EN_FALLBACK[product.slug]?.ingredientsEn) {
      return PRODUCT_EN_FALLBACK[product.slug].ingredientsEn!;
    }
  }
  return product.ingredients || '';
}

export function getLocalizedBranchName(
  branch: LocalizableBranch | null | undefined,
  locale: Locale
): string {
  if (!branch) return '';
  if (locale === 'en') {
    if (branch.nameEn && branch.nameEn.trim()) return branch.nameEn;
    if (branch.code && BRANCH_EN_FALLBACK[branch.code]?.nameEn) {
      return BRANCH_EN_FALLBACK[branch.code].nameEn;
    }
  }
  return branch.name || '';
}

export function getLocalizedBranchAddress(
  branch: LocalizableBranch | null | undefined,
  locale: Locale
): string {
  if (!branch) return '';
  if (locale === 'en') {
    if (branch.addressEn && branch.addressEn.trim()) return branch.addressEn;
    if (branch.code && BRANCH_EN_FALLBACK[branch.code]?.addressEn) {
      return BRANCH_EN_FALLBACK[branch.code].addressEn;
    }
  }
  return branch.address || '';
}

export function getLocalizedBranchCity(
  branch: LocalizableBranch | null | undefined,
  locale: Locale
): string {
  if (!branch) return '';
  if (locale === 'en') {
    if (branch.cityEn && branch.cityEn.trim()) return branch.cityEn;
    if (branch.code && BRANCH_EN_FALLBACK[branch.code]?.cityEn) {
      return BRANCH_EN_FALLBACK[branch.code].cityEn;
    }
  }
  return branch.city || '';
}

export function getLocalizedCategoryName(
  category: LocalizableCategory | null | undefined,
  locale: Locale
): string {
  if (!category) return '';
  if (locale === 'en') {
    if (category.nameEn && category.nameEn.trim()) return category.nameEn;
    if (category.slug && CATEGORY_EN_FALLBACK[category.slug]) {
      return CATEGORY_EN_FALLBACK[category.slug];
    }
  }
  return category.name || '';
}
