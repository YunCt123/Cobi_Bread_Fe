import type { Locale } from '@/stores/language.store';

export interface NewsArticle {
  slug: string;
  title: string;
  date: string;
  author: string;
  category: string;
  excerpt: string;
  content: string[];
  highlights?: string[];
  thumbnail: string;
  gallery: string[];
}

export interface MediaVideo {
  id: string;
  title: string;
  description: string;
  youtubeUrl: string;
  youtubeId: string;
  embedUrl: string;
  thumbnailUrl: string;
  fallbackThumbnail: string;
  duration?: string;
}

export interface MediaImage {
  id: string;
  title: string;
  category: string;
  src: string;
  description?: string;
}

export interface CertificateItem {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  issuedBy: string;
  validUntil: string;
  scope: string;
  image: string;
}

export interface PolicySection {
  heading?: string;
  paragraphs?: string[];
  bullets?: string[];
  note?: string;
}

export interface PolicyDocument {
  slug: string;
  group: 'ABOUT' | 'SERVICE';
  shortTitle: string;
  title: string;
  subtitle: string;
  updatedAt: string;
  sections: PolicySection[];
  attachments?: {
    title: string;
    image: string;
    caption?: string;
    isDiagram?: boolean;
  }[];
  contactBox?: {
    company: string;
    address: string;
    phone: string;
    email: string;
    hotline?: string;
    fax?: string;
  };
}

/**
 * Helper chuyển link YouTube gốc sang link nhúng Embed và lấy thumbnail
 */
export function extractYouTubeId(url: string): string {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : '';
}

export function getYouTubeEmbedUrl(url: string, autoplay = true): string {
  const id = extractYouTubeId(url);
  if (!id) return url;
  return `https://www.youtube.com/embed/${id}?autoplay=${autoplay ? 1 : 0}&rel=0`;
}

export function getYouTubeThumbnailUrl(url: string): string {
  const id = extractYouTubeId(url);
  if (!id) return '/cobi/introduce/DSC9528-5-1.png';
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}

// ============================================================================
// 1. BRAND ASSETS & CHANNELS (Chính thức từ thư mục /cobi)
// ============================================================================
export const BRAND_ASSETS = {
  logo: '/cobi/logo/logo-bread1.png',
  moitBadge: '/cobi/logo/bo-cong-thuong.svg',
  ownerErcImage: '/cobi/owner/ERC-Cobi-Inter-10th-12012023-5_page-0001.jpg',
  flipbookUrl: 'https://heyzine.com/flip-book/f31bc01f46.html#page/6',
  heroImage: '/cobi/introduce/DSC9528-5-1.png',
  heroSecondaryImage: '/cobi/introduce/gallery/BANH_1-sang.png',
  heroVideoUrl: 'https://www.youtube.com/watch?v=Nex5roVUPXI',
  heroVideoEmbedUrl: 'https://www.youtube.com/embed/Nex5roVUPXI?autoplay=1&rel=0',
  b2bSolutionsDiagram: '/cobi/introduce/Asset-11@4x-8-1.png',
  foodSafetyDiagram: '/cobi/introduce/Asset-7@4x-8-2.png',
  partnersImage: '/cobi/introduce/Frame-1795888176-1.png',
  positiveReviewsImage: '/cobi/introduce/Frame-1795888743-1.png',
  social: {
    facebook: 'https://www.facebook.com/cobihome',
    tiktok: 'https://www.tiktok.com/@cobihome.official',
    youtube: 'https://www.youtube.com/@cobihome',
    email: 'mailto:cobionline@cobione.com',
    supportHotline: '03 567 567 20',
    hcmHotline: '0909 459 387',
    hnHotline: '0982 219 841',
    bakeryHotline: '0938 891 235',
    exportHotline: '+84 984889941',
    exportEmail: 'mailto:Exportsales@cobione.com',
  },
};

// ============================================================================
// 2. CATEGORY REAL THUMBNAILS (9 danh mục sản phẩm Cobi Bread)
// ============================================================================
export const CATEGORY_THUMBNAILS: Record<string, string> = {
  'banh-mi-kem-tuoi': '/cobi/introduce/DSC9528-5-1.png',
  'banh-pocket-toast': '/cobi/news/new2/2025_11_SECC_CAFE-SHOW_V5_OL-05-300x158.jpg',
  'banh-bong-lan-sua': '/cobi/news/new1/Picture3-768x768.jpg',
  'banh-mi-dong-lanh-b2c': '/cobi/introduce/gallery/image-4.png',
  'banh-mi-dong-lanh-b2b': '/cobi/introduce/gallery/DSC09576.png',
  'snack-banh-quy': '/cobi/introduce/gallery/BANH_1-sang.png',
  'banh-mi-que': '/cobi/introduce/Frame-1795888743-1.png',
  'set-qua-tang': '/cobi/news/new1/Picture2-768x768.jpg',
  'cac-loai-banh-khac': '/cobi/introduce/download-2-1.png',
};

const CATEGORY_EN_NAMES: Record<string, string> = {
  'banh-mi-kem-tuoi': 'Fresh Cream Bread',
  'banh-pocket-toast': 'Pocket Toast',
  'banh-bong-lan-sua': 'Milk Sponge Cake',
  'banh-mi-dong-lanh-b2c': 'Frozen Bread (B2C)',
  'banh-mi-dong-lanh-b2b': 'Frozen Dough (B2B)',
  'snack-banh-quy': 'Snacks & Cookies',
  'banh-mi-que': 'Breadsticks (Banh Mi Que)',
  'set-qua-tang': 'Gift Sets',
  'cac-loai-banh-khac': 'Other Pastries',
};

export function getCategoryDisplayName(
  slug: string | undefined,
  fallbackName: string,
  locale: Locale = 'vi'
): string {
  if (locale !== 'en') return fallbackName;
  const s = (slug || '').toLowerCase();
  if (s && CATEGORY_EN_NAMES[s]) return CATEGORY_EN_NAMES[s];
  const n = fallbackName.toLowerCase();
  if (s.includes('kem-tuoi') || n.includes('kem tươi')) return CATEGORY_EN_NAMES['banh-mi-kem-tuoi'];
  if (s.includes('pocket') || n.includes('pocket')) return CATEGORY_EN_NAMES['banh-pocket-toast'];
  if (s.includes('bong-lan') || n.includes('bông lan')) return CATEGORY_EN_NAMES['banh-bong-lan-sua'];
  if (s.includes('b2b') || n.includes('b2b')) return CATEGORY_EN_NAMES['banh-mi-dong-lanh-b2b'];
  if (s.includes('dong-lanh') || n.includes('đông lạnh')) return CATEGORY_EN_NAMES['banh-mi-dong-lanh-b2c'];
  if (s.includes('snack') || s.includes('quy') || n.includes('snack') || n.includes('bánh quy')) {
    return CATEGORY_EN_NAMES['snack-banh-quy'];
  }
  if (s.includes('que') || n.includes('bánh mì que')) return CATEGORY_EN_NAMES['banh-mi-que'];
  if (s.includes('qua') || n.includes('quà tặng')) return CATEGORY_EN_NAMES['set-qua-tang'];
  return fallbackName;
}

export function getCategoryThumbnail(slug?: string, name?: string): string {
  const s = (slug || '').toLowerCase();
  const n = (name || '').toLowerCase();

  if (s && CATEGORY_THUMBNAILS[s]) {
    return CATEGORY_THUMBNAILS[s];
  }

  if (s.includes('kem-tuoi') || n.includes('kem tươi') || n.includes('fresh cream')) {
    return CATEGORY_THUMBNAILS['banh-mi-kem-tuoi'];
  }
  if (s.includes('pocket') || n.includes('pocket')) {
    return CATEGORY_THUMBNAILS['banh-pocket-toast'];
  }
  if (s.includes('bong-lan') || n.includes('bông lan')) {
    return CATEGORY_THUMBNAILS['banh-bong-lan-sua'];
  }
  if (s.includes('b2b') || n.includes('b2b')) {
    return CATEGORY_THUMBNAILS['banh-mi-dong-lanh-b2b'];
  }
  if (s.includes('dong-lanh') || n.includes('đông lạnh')) {
    return CATEGORY_THUMBNAILS['banh-mi-dong-lanh-b2c'];
  }
  if (s.includes('snack') || s.includes('quy') || n.includes('snack') || n.includes('bánh quy')) {
    return CATEGORY_THUMBNAILS['snack-banh-quy'];
  }
  if (s.includes('que') || n.includes('bánh mì que')) {
    return CATEGORY_THUMBNAILS['banh-mi-que'];
  }
  if (s.includes('qua') || n.includes('quà tặng')) {
    return CATEGORY_THUMBNAILS['set-qua-tang'];
  }

  return CATEGORY_THUMBNAILS['cac-loai-banh-khac'];
}

// ============================================================================
// 3. BRANCH REAL PHOTOS & GOOGLE MAPS CONFIG (/cobi/branch)
// ============================================================================
export interface BranchVisualMeta {
  image: string;
  mapQuery: string;
  mapEmbedUrl: string;
  googleMapsUrl: string;
}

export function getBranchVisualMeta(branch: {
  name?: string;
  address?: string;
  city?: string;
}): BranchVisualMeta {
  const combined = `${branch.name || ''} ${branch.address || ''} ${branch.city || ''}`.toLowerCase();

  let image = '/cobi/branch/5-1.png';
  let mapQuery = `${branch.name || 'Cobi Bread'} ${branch.address || ''} ${branch.city || ''}`.trim();

  if (
    combined.includes('long hậu') ||
    combined.includes('long hau') ||
    combined.includes('cobi bread home') ||
    combined.includes('long an')
  ) {
    image = '/cobi/branch/5-1-1.png';
    mapQuery = 'Cobi Home KCN Long Hậu Cần Giuộc Long An';
  } else if (
    combined.includes('aeon') ||
    combined.includes('hà đông') ||
    combined.includes('ha dong') ||
    combined.includes('cobi bread ha noi')
  ) {
    image = '/cobi/branch/5-1-1-1.png';
    mapQuery = 'TTTM AEON Mall Hà Đông Dương Nội Hà Đông Hà Nội';
  } else if (
    combined.includes('thăng long') ||
    combined.includes('thang long') ||
    combined.includes('trần duy hưng') ||
    combined.includes('222')
  ) {
    image = '/cobi/branch/THANG-LONG.jpg';
    mapQuery = 'GO! Thăng Long 222 Trần Duy Hưng Trung Hoà Cầu Giấy Hà Nội';
  } else if (
    combined.includes('garden') ||
    combined.includes('mễ trì') ||
    combined.includes('me tri') ||
    combined.includes('nam từ liêm')
  ) {
    image = '/cobi/branch/GARDEN.jpg';
    mapQuery = 'TTTM The Garden Đường Mễ Trì Nam Từ Liêm Hà Nội';
  } else if (
    combined.includes('tower') ||
    combined.includes('hoàng văn thái') ||
    combined.includes('quận 7') ||
    combined.includes('hồ chí minh')
  ) {
    image = '/cobi/branch/5-1.png';
    mapQuery = 'Tòa nhà Cobi Tower 69 Hoàng Văn Thái Tân Phú Quận 7 Hồ Chí Minh';
  }

  return {
    image,
    mapQuery,
    mapEmbedUrl: `https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&t=&z=16&ie=UTF8&iwloc=&output=embed`,
    googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`,
  };
}

// ============================================================================
// 4. ABOUT DATA (Bilingual VI / EN)
// ============================================================================
export const ABOUT_DATA = {
  eyebrow: 'Về chúng tôi',
  title: 'GIẢI PHÁP TOÀN DIỆN TRONG SẢN XUẤT VÀ KINH DOANH BÁNH NGỌT',
  slogan: 'BÁNH NGON NHẤT LÀ BÁNH MỚI RA LÒ',
  subSlogan: 'NÂNG TẦM TRẢI NGHIỆM ẨM THỰC CÙNG “TINH HOA BÁNH MÌ”',
  paragraphs: [
    'COBI BREAD là thương hiệu bánh ngọt thuộc COBI GROUP. Với bề dày kinh nghiệm và bí quyết riêng trong lĩnh vực sản xuất bánh ngọt, chúng tôi cam kết mang tới cho khách hàng những sản phẩm chất lượng với hương vị tuyệt hảo.',
    'COBI BREAD cung cấp hơn 100 sản phẩm bánh ngọt, đồ ăn và thức uống, cùng hơn 5,000 trang thiết bị, dụng cụ và vật liệu đóng gói, phục vụ nhu cầu đa dạng của khách hàng. Với những sản phẩm bánh ngọt được sản xuất mới mỗi ngày, COBI BREAD cam kết mang tới khách hàng những sản phẩm chất lượng và trọn vị nhất.',
  ],
  stats: [
    { value: '100+', label: 'Sản phẩm bánh & đồ uống' },
    { value: '5,000+', label: 'Thiết bị & vật liệu đóng gói' },
    { value: '100%', label: 'Nướng mới mỗi ngày' },
  ],
  mainImage: '/cobi/introduce/Rectangle.png',
  cafeImage: '/cobi/introduce/gallery/DSC00182.png',
  freshSection: {
    title: 'Tươi & Ngon Mỗi Ngày',
    description:
      'Tại Cobi Bread, chúng tôi chỉ lựa chọn cẩn thận những nguyên liệu tốt nhất, nướng bánh với sự tận tâm vì chất lượng. Mỗi sản phẩm phản ánh nghệ thuật và niềm đam mê của những người thợ làm bánh chuyên nghiệp của chúng tôi. Cơ sở bếp hiện đại của chúng tôi tuân thủ các tiêu chuẩn an toàn thực phẩm cao nhất và các biện pháp đảm bảo chất lượng.',
    productListTitle: 'PRODUCT LIST',
    productListText:
      'Bánh kẹo / Bánh mì / Bột đông lạnh / Tráng miệng / Salad / Cà phê / Đồ uống, v.v.',
    image: '/cobi/introduce/Frame-1795888985.png',
  },
  pillars: [
    {
      title: 'Hệ Thống Bếp Trung Tâm',
      description:
        'Cobi Bread CK (Bếp trung tâm) đáp ứng các tiêu chuẩn cao nhất về vệ sinh, độ tươi của nguyên liệu và kiểm tra an toàn thực phẩm.',
      image: '/cobi/introduce/Frame-1795888990.png',
      isDiagram: false,
    },
    {
      title: 'Giải Pháp Tổng Thể Cho Tiệm Bánh',
      description:
        'Chúng tôi cung cấp một loạt các dịch vụ làm bánh toàn diện được thiết kế riêng để hỗ trợ cả các hoạt động quy mô lớn và các doanh nghiệp thủ công. Các giải pháp của chúng tôi không chỉ giới hạn ở sản phẩm mà còn cung cấp hỗ trợ thiết yếu trong việc cung cấp thiết bị, đóng gói, đào tạo và chứng nhận.',
      image: '/cobi/introduce/Asset-11@4x-8-1.png',
      isDiagram: true,
    },
    {
      title: 'Học Viện Dạy Làm Bánh',
      description:
        'Tại Cobi Bread Bakery Academy, chúng tôi cung cấp chương trình đào tạo toàn diện về cả khía cạnh kỹ thuật và nghệ thuật của nghề làm bánh. Chương trình giảng dạy của chúng tôi kết hợp kiến thức lý thuyết với thực hành, đảm bảo bạn nắm vững mọi chi tiết của nghề.',
      image: '/cobi/introduce/Rectangle.png',
      isDiagram: false,
    },
  ],
  mission: {
    title: 'Sứ Mệnh',
    paragraphs: [
      'Tại COBI BREAD, chúng tôi không chỉ làm ra những chiếc bánh thơm ngon, tươi mới mỗi ngày, mà còn mong muốn lan tỏa tinh hoa bánh mì đến mọi khách hàng.',
      'Không chỉ dừng lại ở việc sản xuất, COBI BREAD còn đồng hành cùng các doanh nghiệp và cá nhân đam mê ngành bánh với giải pháp kinh doanh toàn diện, từ cung cấp nguyên liệu, trang thiết bị đến đào tạo chuyên sâu tại Baking Academy.',
      'Sứ mệnh của chúng tôi là nâng tầm trải nghiệm ẩm thực, mang đến sự tin cậy, sáng tạo và niềm vui trong mỗi chiếc bánh được làm ra.',
    ],
    image: '/cobi/introduce/download-2-1.png',
  },
  testimonials: [
    {
      name: 'Hồng Hạnh',
      quote:
        'Mình đã thử nhiều tiệm bánh, nhưng Cobi Bread thực sự chinh phục mình ngay từ lần đầu tiên, mọi thứ thật sự rất là tuyệt vời với mình.',
      rating: 5,
    },
    {
      name: 'Thu Hương',
      quote:
        'Menu vô cùng đa dạng, từ bánh bông lan mềm mịn, lớp nhân béo ngậy, đến bánh su kem tan chảy hay cookie giòn rụm, mỗi loại đều có nét đặc trưng riêng nhưng điểm chung là rất ngon và chỉn chu trong từng chi tiết.',
      rating: 5,
    },
    {
      name: 'Minh Huy',
      quote:
        'Dịch vụ cực kỳ tận tâm, nhân viên thân thiện và nhiệt tình. Cách đóng gói cũng rất cẩn thận, sang trọng, tạo cảm giác chỉn chu ngay từ những chi tiết nhỏ nhất. Rất hài lòng và chắc chắn sẽ ủng hộ lâu dài.',
      rating: 5,
    },
    {
      name: 'Ngọc Lan',
      quote:
        'Nhân viên siêu dễ thương, tư vấn nhiệt tình, giúp mình chọn được loại bánh ưng ý nhất. Lần sau sẽ nhất định tiếp tục mua bánh ở đây vì rất hài lòng.',
      rating: 5,
    },
  ],
};

export const ABOUT_DATA_EN: typeof ABOUT_DATA = {
  eyebrow: 'About Us',
  title: 'COMPREHENSIVE SOLUTIONS IN BAKERY PRODUCTION & BUSINESS',
  slogan: 'THE BEST BREAD IS FRESH FROM THE OVEN',
  subSlogan: 'ELEVATING CULINARY EXPERIENCES WITH “ARTISAN BAKERY ESSENCE”',
  paragraphs: [
    'COBI BREAD is a flagship bakery brand under COBI GROUP. Built on deep industry expertise and proprietary recipes, we are committed to crafting premium baked goods with unforgettable flavor.',
    'COBI BREAD offers more than 100 pastries, savory treats, and beverages alongside over 5,000 commercial bakery tools, machinery, and packaging solutions. Freshly baked every morning, every loaf embodies peak aroma and craftsmanship.',
  ],
  stats: [
    { value: '100+', label: 'Pastries, Foods & Beverages' },
    { value: '5,000+', label: 'Equipment & Packaging SKUs' },
    { value: '100%', label: 'Freshly Baked Every Morning' },
  ],
  mainImage: '/cobi/introduce/Rectangle.png',
  cafeImage: '/cobi/introduce/gallery/DSC00182.png',
  freshSection: {
    title: 'Fresh & Delicious Every Day',
    description:
      'At Cobi Bread, we carefully source the finest ingredients and bake with an unwavering commitment to excellence. Every item reflects the passion of our master bakers inside modern Central Kitchen facilities that adhere to strict global food safety standards.',
    productListTitle: 'PRODUCT PORTFOLIO',
    productListText:
      'Confectionery / Fresh Bread / Frozen Dough / Desserts / Salads / Specialty Coffee & Beverages.',
    image: '/cobi/introduce/Frame-1795888985.png',
  },
  pillars: [
    {
      title: 'Central Kitchen System',
      description:
        'Cobi Bread CK meets the highest benchmarks for hygiene, ingredient freshness, cold-chain integrity, and microbiological safety testing.',
      image: '/cobi/introduce/Frame-1795888990.png',
      isDiagram: false,
    },
    {
      title: 'Total Bakery Business Solutions',
      description:
        'From commercial cafe chains to artisan bakeries, we provide turnkey support spanning frozen bread dough supply, Ho.Re.Ca machinery, interior design, packaging, and compliance licensing.',
      image: '/cobi/introduce/Asset-11@4x-8-1.png',
      isDiagram: true,
    },
    {
      title: 'Bakery Training Academy',
      description:
        'At Cobi Bread Bakery Academy, our hands-on curriculum blends baking science with artisanal pastry skills to empower culinary professionals and franchise partners.',
      image: '/cobi/introduce/Rectangle.png',
      isDiagram: false,
    },
  ],
  mission: {
    title: 'Our Mission',
    paragraphs: [
      'At COBI BREAD, we do more than bake fragrant, fresh bread each morning — we strive to share genuine bakery craftsmanship with every table.',
      'Beyond production, we partner with F&B entrepreneurs through full-spectrum operational solutions spanning premium ingredients, commercial kitchen equipment, and specialized training at our Baking Academy.',
      'Our mission is to elevate everyday dining experiences through trust, culinary creativity, and pure joy in every bite.',
    ],
    image: '/cobi/introduce/download-2-1.png',
  },
  testimonials: [
    {
      name: 'Hong Hanh',
      quote:
        'I have tried many bakeries, yet Cobi Bread won me over from the very first visit — everything from flavor to service is genuinely impressive.',
      rating: 5,
    },
    {
      name: 'Thu Huong',
      quote:
        'Such a diverse menu — soft milk sponge cakes, creamy chilled fillings, melty cream puffs, and crisp cookies. Everything tastes thoughtfully crafted.',
      rating: 5,
    },
    {
      name: 'Minh Huy',
      quote:
        'Attentive service and welcoming staff. The insulated packaging feels refined down to the smallest detail. I will definitely remain a loyal customer.',
      rating: 5,
    },
    {
      name: 'Ngoc Lan',
      quote:
        'Super friendly staff who helped me choose the perfect flavors for my family. I will certainly be coming back regularly!',
      rating: 5,
    },
  ],
};

export function getLocalizedAboutData(locale: Locale) {
  return locale === 'en' ? ABOUT_DATA_EN : ABOUT_DATA;
}

// ============================================================================
// 5. NEWS ARTICLES (Bilingual VI / EN — identical slugs)
// ============================================================================
export const NEWS_ARTICLES: NewsArticle[] = [
  {
    slug: 'ra-mat-vi-moi-chi-co-tai-gs25-banh-mi-kem-tuoi-muoi-hong-himalaya',
    title: 'Ra mắt vị mới chỉ có tại GS25: Bánh Mì Kem Tươi Muối Hồng Himalaya',
    date: '22/12/2025',
    author: 'admin',
    category: 'Sản Phẩm Mới',
    excerpt:
      'Cobi Bread chính thức ra mắt vị mới – Bánh mì kem tươi muối hồng “Himalaya Pink Salt Milk Cream Bread”, hiện chỉ có mặt duy nhất tại hệ thống cửa hàng tiện lợi GS25 trên toàn Miền Bắc & Miền Nam.',
    thumbnail: '/cobi/news/new1/Picture1.jpg',
    gallery: [
      '/cobi/news/new1/Picture1.jpg',
      '/cobi/news/new1/Picture2-768x768.jpg',
      '/cobi/news/new1/Picture3-768x768.jpg',
    ],
    highlights: [
      'Bữa sáng nhẹ nhàng trước giờ làm việc',
      'Bữa xế ngọt ngào cho dân văn phòng, học sinh – sinh viên',
      'Những lúc cần một món ăn nhanh nhưng vẫn ngon và chất lượng',
    ],
    content: [
      'Nếu bạn là “fan” của những chiếc bánh mì mềm ẩm, nhân kem béo mịn nhưng không ngấy, vị cân bằng hòa quyện, thì tin vui là Cobi Bread chính thức ra mắt vị mới – Bánh mì kem tươi muối hồng “Himalaya Pink Salt Milk Cream Bread”, hiện chỉ có mặt duy nhất tại hệ thống cửa hàng tiện lợi GS25 trên toàn Miền Bắc & Miền Nam.',
      'Một hương vị mới, tinh tế và được thiết kế để trở thành lựa chọn bữa ăn nhanh ngon – tiện – chuẩn chất lượng quốc tế.',
      'SỰ CÂN BẰNG HOÀN HẢO TRONG TỪNG MIẾNG: Điểm đặc biệt của Himalaya Pink Salt Milk Cream Bread nằm ở sự kết hợp hài hòa giữa ngọt – béo – mặn nhẹ, tạo nên trải nghiệm vị giác cuốn hút ngay từ lần thử đầu tiên. Bọc ngoài với vỏ bánh mềm ẩm, tơi nhẹ thơm bơ. Lớp kem tươi bên trong mịn mượt, béo, mát lạnh và tan nhẹ trong miệng, mang lại cảm giác dễ chịu, phù hợp để thưởng thức bất cứ thời điểm nào trong ngày.',
      'Muối hồng Himalaya – điểm nhấn tạo khác biệt: Không thể thiếu “nhân vật chính” làm nên dấu ấn của vị bánh mới: muối hồng Himalaya. Vị mặn nhẹ, thanh tự nhiên giúp cân bằng hoàn hảo vị ngọt của kem, khiến bánh ăn không ngán, càng ăn càng cuốn.',
      'SẢN XUẤT THEO CÔNG THỨC ĐỘC QUYỀN – CENTRAL KITCHEN HIỆN ĐẠI: Himalaya Pink Salt Milk Cream Bread được sản xuất theo công thức độc quyền của Cobi Bread tại mô hình Bếp Trung Tâm (Central Kitchen) hiện đại. Quy trình này đảm bảo vị ngon đồng nhất trong từng chiếc bánh, đạt chuẩn An toàn vệ sinh thực phẩm và chuẩn chất lượng quốc tế phù hợp phân phối tại GS25.',
      'Hiện tại, Himalaya Pink Salt Milk Cream Bread chỉ được phân phối độc quyền tại hệ thống cửa hàng tiện lợi GS25 trên toàn quốc và đang có mức giá dùng thử siêu ưu đãi (28.000đ). Hãy ghé ngay GS25 gần bạn để trải nghiệm vị mới độc quyền từ Cobi Bread nha!',
    ],
  },
  {
    slug: 'cobi-song-kiem-hop-bich-tai-coffee-expo-vietnam-2025',
    title: 'COBI “Song Kiếm Hợp Bích” tại Coffee Expo Vietnam 2025',
    date: '29/10/2025',
    author: 'admin',
    category: 'Sự Kiện',
    excerpt:
      'COBI HOME x COBI BREAD – Khi công nghệ và hương vị cùng hội ngộ. Bộ đôi mảnh ghép chiến lược của hệ sinh thái Cobi Group cùng hợp lực mang đến giải pháp tổng thể cho doanh nghiệp F&B.',
    thumbnail: '/cobi/news/new2/BAKERY_1.png',
    gallery: [
      '/cobi/news/new2/BAKERY_1.png',
      '/cobi/news/new2/EQUIP_1-300x180.png',
      '/cobi/news/new2/EQUIP_2-300x180.png',
      '/cobi/news/new2/2025_11_SECC_CAFE-SHOW_V5_OL-04-300x158.jpg',
    ],
    highlights: [
      'Pocket Toast – tiện lợi, thơm ngon, phù hợp cho mô hình takeaway',
      'Frozen Bread – dòng bánh mì đông lạnh cao cấp best seller nhà Cobi',
      'Fresh Cream Bread – “Cơn sốt” từ Seoul với kem sữa béo ngậy',
      'Frozen Pizza – Kết hợp hài hòa giữa vị truyền thống Ý và phong cách Hàn hiện đại',
    ],
    content: [
      'Coffee Expo Vietnam 2025 đang đến gần, và năm nay, giới F&B sẽ được chứng kiến “bộ đôi quyền lực” mang tên Cobi Home và Cobi Bread – hai mảnh ghép chiến lược của hệ sinh thái Cobi Group cùng hợp lực mang đến giải pháp tổng thể cho doanh nghiệp F&B.',
      'COBI HOME – “Bếp công nghệ” kiến tạo vận hành thông minh: Với vai trò là đơn vị tiên phong cung cấp thiết bị, máy móc và giải pháp vận hành cho ngành ẩm thực, Cobi Home giới thiệu tại triển lãm loạt máy làm bánh, máy pha cà phê và thiết bị trưng bày chuyên dụng giúp tối ưu quy trình sản xuất & phục vụ, tiết kiệm chi phí vận hành và đảm bảo chất lượng đồng nhất.',
      'Từ máy trộn bột, lò nướng, tủ ủ, máy làm kem, máy làm đá đến máy pha cà phê chuẩn barista, tất cả tạo nên một “bếp thông minh” khép kín, sẵn sàng vận hành trơn tru cho bất kỳ mô hình tiệm cà phê hay bakery nào.',
      'COBI BREAD – “Hương vị Hàn Quốc” chinh phục khẩu vị Việt: Nếu Cobi Home mang đến “bàn tay kỹ thuật”, thì Cobi Bread chính là “linh hồn của hương vị”. Tại gian hàng chung, Cobi Bread giới thiệu những dòng bánh ngọt cao cấp được ưa chuộng như Pocket Toast, Frozen Bread, Fresh Cream Bread và Frozen Pizza.',
    ],
  },
  {
    slug: 'cafeshow-2025-khoi-nguon-giai-phap-doanh-nghiep-fb',
    title: 'Cafeshow 2025 – Khơi nguồn giải pháp doanh nghiệp F&B',
    date: '17/04/2025',
    author: 'admin',
    category: 'Giải Pháp B2B',
    excerpt:
      'Giải pháp bánh mì cấp đông sâu giúp chuỗi cafe tối ưu chi phí bếp bánh và đồng bộ chất lượng vượt trội tại mọi điểm bán.',
    thumbnail: '/cobi/news/new2/2025_11_SECC_CAFE-SHOW_V5_OL-05-300x158.jpg',
    gallery: [
      '/cobi/news/new2/2025_11_SECC_CAFE-SHOW_V5_OL-05-300x158.jpg',
      '/cobi/news/new2/2025_11_SECC_CAFE-SHOW_V5_OL-06-300x125.jpg',
      '/cobi/introduce/gallery/image-1.png',
      '/cobi/introduce/gallery/image-3.png',
    ],
    highlights: [
      'Rã đông và nướng giòn chỉ trong 3 phút bằng nồi chiên không dầu hoặc lò đối lưu',
      'Hạn sử dụng lên tới 12 tháng khi bảo quản ở -18°C',
      'Không cần đầu tư nhân sự thợ làm bánh chuyên nghiệp tại điểm bán',
    ],
    content: [
      'Tại triển lãm Cafeshow 2025 diễn ra tại SECC, Cobi Bread đã trình diễn giải pháp bánh mì đông lạnh và Pocket Toast tiện lợi dành riêng cho các chuỗi cửa hàng đồ uống, quán cafe take-away và nhà hàng khách sạn.',
      'Với quy trình sản xuất tập trung tại Central Kitchen Long Hậu đạt chuẩn BRCGS, FSSC 22000 và HACCP, các đối tác F&B có thể phục vụ những chiếc bánh nướng nóng giòn đồng nhất chỉ sau 3 phút thao tác.',
      'Đội ngũ tư vấn chuyên môn của Cobi Bread cũng hỗ trợ lắp đặt thiết bị từ Cobi Home, thiết kế menu kèm combo đồ uống giúp gia tăng giá trị đơn hàng trung bình từ 25% - 40%.',
    ],
  },
  {
    slug: 'cobi-bread-tower-1-goc-nho-ngot-ngao-giua-long-quan-7',
    title: 'Cobi Bread Tower 1 – Góc nhỏ ngọt ngào giữa lòng Quận 7',
    date: '14/03/2025',
    author: 'admin',
    category: 'Cửa Hàng',
    excerpt:
      'Không gian tiệm bánh đậm chất thư thái tại tòa nhà Cobi Tower, 69 Hoàng Văn Thái, Phường Tân Phú, Quận 7, TP. Hồ Chí Minh.',
    thumbnail: '/cobi/branch/5-1.png',
    gallery: [
      '/cobi/branch/5-1.png',
      '/cobi/introduce/gallery/DSC00182.png',
      '/cobi/introduce/gallery/image-5.png',
      '/cobi/introduce/DSC9528-5-1.png',
    ],
    highlights: [
      'Địa chỉ: 69 Hoàng Văn Thái, Phường Tân Phú, Quận 7, TP. Hồ Chí Minh',
      'Giờ mở cửa: 07:00 - 21:30 hàng ngày',
      'Hotline cửa hàng: 0903 100 895',
    ],
    content: [
      'Nằm ngay tầng trệt tòa nhà Cobi Tower I tại khu đô thị Phú Mỹ Hưng, Cobi Bread Bakery & Cafe mang đến không gian thưởng thức bánh ngọt phong cách Hàn Quốc hiện đại, ấm áp và tràn ngập hương thơm bơ sữa mỗi sớm mai.',
      'Khách hàng ghé thăm cửa hàng có thể thưởng thức trực tiếp các mẻ bánh mì kem tươi, bánh Pocket Toast nóng hổi, bánh croissant nướng giòn cùng cà phê pha máy nguyên chất.',
      'Bên cạnh đó, khu vực tủ đông tiện lợi tại cửa hàng cũng trưng bày đầy đủ các dòng bánh mì đông lạnh đóng gói sẵn B2C để khách hàng dễ dàng mua về chế biến nhanh tại nhà.',
    ],
  },
];

export const NEWS_ARTICLES_EN: NewsArticle[] = [
  {
    slug: 'ra-mat-vi-moi-chi-co-tai-gs25-banh-mi-kem-tuoi-muoi-hong-himalaya',
    title: 'Exclusive Launch at GS25: Himalaya Pink Salt Fresh Milk Cream Bread',
    date: '22/12/2025',
    author: 'admin',
    category: 'New Launch',
    excerpt:
      'Cobi Bread officially debuts our brand-new flavor — Himalaya Pink Salt Milk Cream Bread — now available exclusively at GS25 convenience stores across Northern & Southern Vietnam.',
    thumbnail: '/cobi/news/new1/Picture1.jpg',
    gallery: [
      '/cobi/news/new1/Picture1.jpg',
      '/cobi/news/new1/Picture2-768x768.jpg',
      '/cobi/news/new1/Picture3-768x768.jpg',
    ],
    highlights: [
      'A light, satisfying breakfast before starting your workday',
      'Delightful afternoon treat for office professionals and students',
      'Quick grab-and-go snack crafted to international quality benchmarks',
    ],
    content: [
      'If you love pillowy-soft bread filled with velvety milk cream that feels rich yet remarkably light, Cobi Bread has exciting news: Himalaya Pink Salt Milk Cream Bread has arrived exclusively across GS25 convenience stores nationwide.',
      'Crafted as a refined yet convenient everyday snack, this signature release brings gourmet bakery quality directly into your daily routine.',
      'PERFECT HARMONY IN EVERY BITE: What makes Himalaya Pink Salt Milk Cream Bread special is the seamless interplay of gentle sweetness, creamy richness, and a crisp hint of mineral salt wrapped inside an airy butter bun.',
      'Himalayan Pink Salt — The Signature Twist: Natural pink salt delicately balances the chilled whipped cream center so each bite tastes bright, clean, and endlessly crave-worthy.',
      'PRODUCED IN OUR MODERN CENTRAL KITCHEN: Prepared with Cobi Bread’s proprietary recipe inside our FSSC 22000 & BRCGS certified Central Kitchen, every bun delivers identical texture and international food safety assurance.',
      'Available exclusively at GS25 stores nationwide at a special introductory price of 28,000 VND. Stop by your nearest GS25 today to taste this Cobi Bread exclusive!',
    ],
  },
  {
    slug: 'cobi-song-kiem-hop-bich-tai-coffee-expo-vietnam-2025',
    title: 'COBI “Double Power” Showcase at Coffee Expo Vietnam 2025',
    date: '29/10/2025',
    author: 'admin',
    category: 'Events',
    excerpt:
      'COBI HOME x COBI BREAD — Where kitchen engineering meets artisan pastry flavor. Two flagship pillars of Cobi Group unite to present turnkey F&B solutions.',
    thumbnail: '/cobi/news/new2/BAKERY_1.png',
    gallery: [
      '/cobi/news/new2/BAKERY_1.png',
      '/cobi/news/new2/EQUIP_1-300x180.png',
      '/cobi/news/new2/EQUIP_2-300x180.png',
      '/cobi/news/new2/2025_11_SECC_CAFE-SHOW_V5_OL-04-300x158.jpg',
    ],
    highlights: [
      'Pocket Toast — Hot, sealed, mess-free toasted sandwiches built for takeaway',
      'Frozen Bread — Cobi Bread’s #1 B2B deep-frozen croissant & pastry lineup',
      'Fresh Cream Bread — Seoul’s viral chilled milk cream bun sensation',
      'Frozen Pizza — Authentic Italian stone-baked spirit with Korean flair',
    ],
    content: [
      'At Coffee Expo Vietnam 2025, F&B professionals experienced the synergy of Cobi Home and Cobi Bread — two strategic pillars within Cobi Group delivering complete bakery and beverage store solutions.',
      'COBI HOME — Smart Commercial Kitchen Engineering: As a specialist supplier of commercial hospitality hardware, Cobi Home showcased integrated dough mixers, convection ovens, proofers, ice makers, and barista coffee machines designed to cut overhead and guarantee beverage consistency.',
      'From automated prep stations to cold display showcases, Cobi Home equips entrepreneurs with an end-to-end "Smart Bakery Kitchen" ready for rapid scaling.',
      'COBI BREAD — Korean Artisan Flavor Loved Across Vietnam: While Cobi Home provides technical precision, Cobi Bread delivers culinary soul with crowd-pleasing bestsellers including Pocket Toast, Frozen Bread, Fresh Cream Bread, and Frozen Pizza.',
    ],
  },
  {
    slug: 'cafeshow-2025-khoi-nguon-giai-phap-doanh-nghiep-fb',
    title: 'Cafeshow 2025 – Empowering Turnkey F&B Enterprise Solutions',
    date: '17/04/2025',
    author: 'admin',
    category: 'B2B Solutions',
    excerpt:
      'Deep-frozen artisan bread solutions helping coffee chains eliminate on-site pastry labor while serving crisp, standardized treats at every location.',
    thumbnail: '/cobi/news/new2/2025_11_SECC_CAFE-SHOW_V5_OL-05-300x158.jpg',
    gallery: [
      '/cobi/news/new2/2025_11_SECC_CAFE-SHOW_V5_OL-05-300x158.jpg',
      '/cobi/news/new2/2025_11_SECC_CAFE-SHOW_V5_OL-06-300x125.jpg',
      '/cobi/introduce/gallery/image-1.png',
      '/cobi/introduce/gallery/image-3.png',
    ],
    highlights: [
      'Thaw and bake crisp in just 3 minutes using an air fryer or convection oven',
      'Up to 12-month frozen shelf life when maintained at -18°C',
      'No in-store master baker or heavy bakery investment needed',
    ],
    content: [
      'At Cafeshow Vietnam 2025 in SECC, Cobi Bread demonstrated frozen croissant dough and Pocket Toast workflows tailored specifically for specialty coffee shops, grab-and-go kiosks, and hotel chains.',
      'Thanks to centralized manufacturing at Long Hau Central Kitchen under BRCGS, FSSC 22000, and HACCP standards, partner cafes serve freshly toasted pastries within 3 minutes per order.',
      'Our B2B advisory team also supports Cobi Home equipment installation and combo-menu engineering, helping beverage brands boost average ticket size by 25% to 40%.',
    ],
  },
  {
    slug: 'cobi-bread-tower-1-goc-nho-ngot-ngao-giua-long-quan-7',
    title: 'Cobi Bread Tower 1 – A Cozy Sweet Corner in the Heart of District 7',
    date: '14/03/2025',
    author: 'admin',
    category: 'Stores',
    excerpt:
      'Step into a warm Korean-inspired bakery cafe at Cobi Tower I, 69 Hoang Van Thai, Tan Phu Ward, District 7, Ho Chi Minh City.',
    thumbnail: '/cobi/branch/5-1.png',
    gallery: [
      '/cobi/branch/5-1.png',
      '/cobi/introduce/gallery/DSC00182.png',
      '/cobi/introduce/gallery/image-5.png',
      '/cobi/introduce/DSC9528-5-1.png',
    ],
    highlights: [
      'Address: 69 Hoang Van Thai, Tan Phu Ward, District 7, Ho Chi Minh City',
      'Opening Hours: 07:00 - 21:30 daily',
      'Store Hotline: 0903 100 895',
    ],
    content: [
      'Located on the ground floor of Cobi Tower I in Phu My Hung, District 7, our flagship Cobi Bread Bakery & Cafe greets office workers and local families with the warm aroma of butter pastries every morning.',
      'Guests can relax indoors while enjoying freshly piped Fresh Cream Bread, crisp hot Pocket Toast, flaky butter croissants, and freshly pulled espresso.',
      'A dedicated retail freezer corner is also stocked daily with our B2C Frozen Bread Dough packs so families can bake hot croissants at home in minutes.',
    ],
  },
];

export function getLocalizedNewsArticles(locale: Locale): NewsArticle[] {
  return locale === 'en' ? NEWS_ARTICLES_EN : NEWS_ARTICLES;
}

// ============================================================================
// 6. MEDIA DATA (Bilingual VI / EN)
// ============================================================================
export const MEDIA_DATA: { videos: MediaVideo[]; images: MediaImage[] } = {
  videos: [
    {
      id: 'vid-1',
      title: 'COBI Bread | Bakery - Hành trình của những chiếc bánh hoàn hảo',
      description:
        'Khám phá quy trình tuyển chọn nguyên liệu, lên men tự nhiên và nghệ thuật nướng bánh tại hệ thống bếp trung tâm Cobi Bread.',
      youtubeUrl: 'https://www.youtube.com/watch?v=Nex5roVUPXI',
      youtubeId: 'Nex5roVUPXI',
      embedUrl: 'https://www.youtube.com/embed/Nex5roVUPXI?autoplay=1&rel=0',
      thumbnailUrl: 'https://img.youtube.com/vi/Nex5roVUPXI/hqdefault.jpg',
      fallbackThumbnail: '/cobi/introduce/DSC9528-5-1.png',
    },
    {
      id: 'vid-2',
      title: 'COBI BREAD - THƯƠNG HIỆU BÁNH THUỘC TẬP ĐOÀN COBI GROUP',
      description:
        'Giới thiệu hệ sinh thái Cobi Group với giải pháp toàn diện từ sản xuất bánh ngọt đến cung ứng thiết bị bếp công nghiệp và đào tạo nghề.',
      youtubeUrl: 'https://www.youtube.com/watch?v=Vivmj67W7gg',
      youtubeId: 'Vivmj67W7gg',
      embedUrl: 'https://www.youtube.com/embed/Vivmj67W7gg?autoplay=1&rel=0',
      thumbnailUrl: 'https://img.youtube.com/vi/Vivmj67W7gg/hqdefault.jpg',
      fallbackThumbnail: '/cobi/introduce/Rectangle.png',
    },
    {
      id: 'vid-3',
      title: 'Giới thiệu Cobi Bread',
      description:
        'Tổng quan về chuỗi cửa hàng Cobi Bread Bakery & Cafe và các dòng sản phẩm bánh tươi, bánh cấp đông phục vụ khách hàng cá nhân & B2B.',
      youtubeUrl: 'https://www.youtube.com/watch?v=x8cBlbm2fwY',
      youtubeId: 'x8cBlbm2fwY',
      embedUrl: 'https://www.youtube.com/embed/x8cBlbm2fwY?autoplay=1&rel=0',
      thumbnailUrl: 'https://img.youtube.com/vi/x8cBlbm2fwY/hqdefault.jpg',
      fallbackThumbnail: '/cobi/introduce/gallery/DSC00182.png',
    },
    {
      id: 'vid-4',
      title: 'COBI BREAD Pocket Toast',
      description:
        'Hướng dẫn chế biến bánh Pocket Toast ép viền giòn rụm chỉ trong 3 phút, giải pháp bữa sáng dinh dưỡng và tiện lợi.',
      youtubeUrl: 'https://www.youtube.com/watch?v=GzsETHWLZI4',
      youtubeId: 'GzsETHWLZI4',
      embedUrl: 'https://www.youtube.com/embed/GzsETHWLZI4?autoplay=1&rel=0',
      thumbnailUrl: 'https://img.youtube.com/vi/GzsETHWLZI4/hqdefault.jpg',
      fallbackThumbnail: '/cobi/news/new2/2025_11_SECC_CAFE-SHOW_V5_OL-05-300x158.jpg',
    },
  ],
  images: [
    {
      id: 'img-1',
      title: 'Bánh mì kem hạnh nhân & Espresso Cobi Bread',
      category: 'Sản phẩm',
      src: '/cobi/introduce/DSC9528-5-1.png',
      description: 'Bánh mì nhân kem tươi phủ hạnh nhân lát nướng vàng thơm giòn.',
    },
    {
      id: 'img-2',
      title: 'Nghệ nhân phết trứng & Nướng bánh Croissant mới ra lò',
      category: 'Sản xuất',
      src: '/cobi/introduce/gallery/BANH_1-sang.png',
      description: 'Quy trình phết trứng thủ công trước khi đưa vào lò nướng đối lưu.',
    },
    {
      id: 'img-3',
      title: 'Không gian Cobi Bread Bakery Cafe hiện đại',
      category: 'Cửa hàng',
      src: '/cobi/introduce/gallery/DSC00182.png',
      description: 'Quầy bánh và không gian thưởng thức cà phê tại cửa hàng Cobi Bread.',
    },
    {
      id: 'img-4',
      title: 'Đóng gói dây chuyền Mini Croissant Đông Lạnh',
      category: 'Sản xuất',
      src: '/cobi/introduce/gallery/DSC09576.png',
      description: 'Kiểm soát vệ sinh khép kín khi đóng gói túi bột bánh đông lạnh.',
    },
    {
      id: 'img-5',
      title: 'Tủ bánh & Khu vực trưng bày Frozen Bread Dough',
      category: 'Cửa hàng',
      src: '/cobi/introduce/gallery/image-5.png',
      description: 'Tủ cấp đông bánh mì và quầy trưng bày bánh tươi tại chi nhánh.',
    },
    {
      id: 'img-6',
      title: 'Gian hàng Cobi International tại triển lãm Thaifex HOREC Asia',
      category: 'Sự kiện',
      src: '/cobi/introduce/gallery/image-1.png',
      description: 'Khách hàng và đối tác F&B quốc tế trải nghiệm sản phẩm Cobi Bread.',
    },
    {
      id: 'img-7',
      title: 'Trải nghiệm dùng thử Bánh mì kem tươi (Free Taste)',
      category: 'Sự kiện',
      src: '/cobi/introduce/gallery/image-2.png',
      description: 'Đội ngũ tư vấn Cobi Bread phục vụ khách hàng tại hội chợ F&B.',
    },
    {
      id: 'img-8',
      title: 'Khu trưng bày Frozen Dough B2B Package tại triển lãm',
      category: 'Sự kiện',
      src: '/cobi/introduce/gallery/image-3.png',
      description: 'Giới thiệu quy cách đóng gói thùng B2B và công thức rã đông nhanh.',
    },
    {
      id: 'img-9',
      title: 'Dòng bánh ngọt cấp đông Palmier & Strawberry Crown',
      category: 'Sản phẩm',
      src: '/cobi/introduce/gallery/image-4.png',
      description: 'Bao bì cao cấp bảo quản ở nhiệt độ -18°C.',
    },
    {
      id: 'img-10',
      title: 'Khách tham quan thưởng thức bánh nóng tại quầy thử mẫu',
      category: 'Sự kiện',
      src: '/cobi/introduce/gallery/image-6.png',
      description: 'Nướng mẫu trực tiếp bằng nồi chiên không dầu tại sự kiện.',
    },
    {
      id: 'img-11',
      title: 'Thực khách hài lòng với hương vị bánh nướng giòn tan',
      category: 'Sự kiện',
      src: '/cobi/introduce/gallery/image-7.png',
      description: 'Khoảnh khắc check-in và dùng thử bánh ngọt Cobi Bread.',
    },
    {
      id: 'img-12',
      title: 'Xe tải lạnh chuyên dụng giao hàng Cobi Bread',
      category: 'Sản xuất',
      src: '/cobi/introduce/gallery/z6422056442683_bd7fae4fa812a11ba5196657976ea032.png',
      description: 'Hệ thống vận tải lạnh đảm bảo chuỗi cung ứng giao hàng 24h.',
    },
    {
      id: 'img-13',
      title: 'Đội ngũ nhân viên Cobi Bread thân thiện phục vụ khách hàng',
      category: 'Cửa hàng',
      src: '/cobi/introduce/gallery/z6427768540949_f629f4f712f75cb848ba1fba9cda0d7a.png',
      description: 'Phục vụ tận tâm và đảm bảo vệ sinh an toàn thực phẩm.',
    },
    {
      id: 'img-14',
      title: 'Chuyên gia bếp bánh Cobi Bread biểu diễn chế biến',
      category: 'Sản xuất',
      src: '/cobi/introduce/Rectangle.png',
      description: 'Thợ làm bánh chuyên nghiệp thao tác chuẩn mực vệ sinh.',
    },
    {
      id: 'img-15',
      title: 'Bếp Trung Tâm (Central Kitchen) Cobi Bread hiện đại',
      category: 'Sản xuất',
      src: '/cobi/introduce/Frame-1795888990.png',
      description: 'Hệ thống bếp inox khép kín đạt chuẩn BRCGS và FSSC 22000.',
    },
    {
      id: 'img-16',
      title: 'Cobi Bread Tower Quận 7 & Hệ thống 5 chi nhánh',
      category: 'Cửa hàng',
      src: '/cobi/branch/5-1.png',
      description: 'Không gian cửa hàng trưng bày bánh tươi tại Cobi Tower Quận 7.',
    },
  ],
};

export const MEDIA_DATA_EN: { videos: MediaVideo[]; images: MediaImage[] } = {
  videos: [
    {
      id: 'vid-1',
      title: 'COBI Bread | Bakery - Journey of the Perfect Loaf',
      description:
        'Explore our ingredient selection, natural fermentation, and precision oven baking at Cobi Bread Central Kitchen.',
      youtubeUrl: 'https://www.youtube.com/watch?v=Nex5roVUPXI',
      youtubeId: 'Nex5roVUPXI',
      embedUrl: 'https://www.youtube.com/embed/Nex5roVUPXI?autoplay=1&rel=0',
      thumbnailUrl: 'https://img.youtube.com/vi/Nex5roVUPXI/hqdefault.jpg',
      fallbackThumbnail: '/cobi/introduce/DSC9528-5-1.png',
    },
    {
      id: 'vid-2',
      title: 'COBI BREAD - A Signature Bakery Brand of COBI GROUP',
      description:
        'Discover Cobi Group’s integrated ecosystem spanning pastry manufacturing, commercial kitchen equipment, and bakery academy training.',
      youtubeUrl: 'https://www.youtube.com/watch?v=Vivmj67W7gg',
      youtubeId: 'Vivmj67W7gg',
      embedUrl: 'https://www.youtube.com/embed/Vivmj67W7gg?autoplay=1&rel=0',
      thumbnailUrl: 'https://img.youtube.com/vi/Vivmj67W7gg/hqdefault.jpg',
      fallbackThumbnail: '/cobi/introduce/Rectangle.png',
    },
    {
      id: 'vid-3',
      title: 'Introducing Cobi Bread',
      description:
        'An inside look at our Cobi Bread Bakery & Cafe stores along with fresh cream and frozen dough product lines.',
      youtubeUrl: 'https://www.youtube.com/watch?v=x8cBlbm2fwY',
      youtubeId: 'x8cBlbm2fwY',
      embedUrl: 'https://www.youtube.com/embed/x8cBlbm2fwY?autoplay=1&rel=0',
      thumbnailUrl: 'https://img.youtube.com/vi/x8cBlbm2fwY/hqdefault.jpg',
      fallbackThumbnail: '/cobi/introduce/gallery/DSC00182.png',
    },
    {
      id: 'vid-4',
      title: 'COBI BREAD Pocket Toast',
      description:
        'Watch how sealed-edge Pocket Toast crisps up in just 3 minutes for an effortless gourmet breakfast or café snack.',
      youtubeUrl: 'https://www.youtube.com/watch?v=GzsETHWLZI4',
      youtubeId: 'GzsETHWLZI4',
      embedUrl: 'https://www.youtube.com/embed/GzsETHWLZI4?autoplay=1&rel=0',
      thumbnailUrl: 'https://img.youtube.com/vi/GzsETHWLZI4/hqdefault.jpg',
      fallbackThumbnail: '/cobi/news/new2/2025_11_SECC_CAFE-SHOW_V5_OL-05-300x158.jpg',
    },
  ],
  images: [
    {
      id: 'img-1',
      title: 'Almond Milk Cream Bread & Espresso',
      category: 'Products',
      src: '/cobi/introduce/DSC9528-5-1.png',
      description: 'Toasted sliced almonds atop airy cream-filled brioche buns.',
    },
    {
      id: 'img-2',
      title: 'Artisan Egg Wash & Freshly Baked Croissants',
      category: 'Production',
      src: '/cobi/introduce/gallery/BANH_1-sang.png',
      description: 'Hand-brushed glaze before entering precision convection ovens.',
    },
    {
      id: 'img-3',
      title: 'Modern Cobi Bread Bakery Cafe Interior',
      category: 'Stores',
      src: '/cobi/introduce/gallery/DSC00182.png',
      description: 'Pastry showcase and cozy cafe seating at Cobi Bread.',
    },
    {
      id: 'img-4',
      title: 'Mini Croissant Frozen Dough Packaging Line',
      category: 'Production',
      src: '/cobi/introduce/gallery/DSC09576.png',
      description: 'Sanitary closed-loop packaging for deep-frozen croissant dough.',
    },
    {
      id: 'img-5',
      title: 'In-Store Bakery Counter & Frozen Bread Display',
      category: 'Stores',
      src: '/cobi/introduce/gallery/image-5.png',
      description: 'Frozen retail packs and fresh pastry counter side by side.',
    },
    {
      id: 'img-6',
      title: 'Cobi International Booth at Thaifex HOREC Asia',
      category: 'Events',
      src: '/cobi/introduce/gallery/image-1.png',
      description: 'International F&B buyers sampling Cobi Bread export products.',
    },
    {
      id: 'img-7',
      title: 'Fresh Cream Bread Live Tasting Bar',
      category: 'Events',
      src: '/cobi/introduce/gallery/image-2.png',
      description: 'Our culinary team serving visitors at trade exhibitions.',
    },
    {
      id: 'img-8',
      title: 'Frozen Dough B2B Wholesale Exhibition Showcase',
      category: 'Events',
      src: '/cobi/introduce/gallery/image-3.png',
      description: 'Presenting bulk cartoon specifications and 3-minute bake-off guides.',
    },
    {
      id: 'img-9',
      title: 'Palmier & Strawberry Crown Frozen Pastries',
      category: 'Products',
      src: '/cobi/introduce/gallery/image-4.png',
      description: 'Retail-ready laminated pastry packs stored at -18°C.',
    },
    {
      id: 'img-10',
      title: 'Live Air-Fryer Bake Tasting for Guests',
      category: 'Events',
      src: '/cobi/introduce/gallery/image-6.png',
      description: 'Demonstrating effortless oven-crisp pastries in minutes.',
    },
    {
      id: 'img-11',
      title: 'Smiles & Check-Ins Over Warm Pastries',
      category: 'Events',
      src: '/cobi/introduce/gallery/image-7.png',
      description: 'Trade fair attendees enjoying crisp, flaky Cobi Bread bites.',
    },
    {
      id: 'img-12',
      title: 'Dedicated Cobi Bread Refrigerated Delivery Fleet',
      category: 'Production',
      src: '/cobi/introduce/gallery/z6422056442683_bd7fae4fa812a11ba5196657976ea032.png',
      description: 'Cold-chain transport guaranteeing 24-hour branch & B2B delivery.',
    },
    {
      id: 'img-13',
      title: 'Welcoming Cobi Bread Baristas & Cashiers',
      category: 'Stores',
      src: '/cobi/introduce/gallery/z6427768540949_f629f4f712f75cb848ba1fba9cda0d7a.png',
      description: 'Attentive customer care and immaculate counter hygiene.',
    },
    {
      id: 'img-14',
      title: 'Master Pastry Chef Demonstration',
      category: 'Production',
      src: '/cobi/introduce/Rectangle.png',
      description: 'Sanitary preparation and dough lamination expertise.',
    },
    {
      id: 'img-15',
      title: 'Cobi Bread Central Kitchen Stainless Facility',
      category: 'Production',
      src: '/cobi/introduce/Frame-1795888990.png',
      description: 'BRCGS & FSSC 22000 certified stainless steel baking facility.',
    },
    {
      id: 'img-16',
      title: 'Cobi Bread Tower District 7 Flagship Store',
      category: 'Stores',
      src: '/cobi/branch/5-1.png',
      description: 'Spacious bakery cafe flagship inside Cobi Tower I, District 7.',
    },
  ],
};

export function getLocalizedMediaData(locale: Locale) {
  return locale === 'en' ? MEDIA_DATA_EN : MEDIA_DATA;
}

// ============================================================================
// 7. CERTIFICATES DATA (Bilingual VI / EN)
// ============================================================================
export const CERTIFICATES_DATA: CertificateItem[] = [
  {
    id: 'cert-fssc',
    code: 'EI_FA_SC_439',
    title: 'Food Safety System Certification 22000 (FSSC 22000)',
    subtitle: 'ISO 22000:2018, ISO/TS 22002-1:2009 & FSSC 22000 Version 6',
    issuedBy: 'Eurofins Assurance India Pvt. Ltd. (NABCB / IAF)',
    validUntil: '22/01/2029',
    scope:
      'Sản xuất (bao gồm chuẩn bị bột, cán lớp, tạo hình, ủ, đóng gói, cấp đông) bột đông lạnh trong bao bì nhựa tại COBI BREAD CK LOGIS 2.',
    image: '/cobi/certificate/ckkk-1-566x800.jpg',
  },
  {
    id: 'cert-brcgs',
    code: 'F_EI0794_2025',
    title: 'BRCGS Global Standard for Food Safety (Issue 9)',
    subtitle: 'Audit Recognition — Has Achieved Grade: B (UKAS 9660)',
    issuedBy: 'Eurofins Food Safety Solutions Ltd, United Kingdom',
    validUntil: '12/01/2027',
    scope:
      'Làm bột, ủ và đóng gói bột đông lạnh trong túi PA/PE (Product category 03 - Raw prepared products) tại COBI BREAD CK LOGIS 2.',
    image: '/cobi/certificate/ck2-1-566x800.jpg',
  },
  {
    id: 'cert-haccp',
    code: '2503011-EN-1',
    title: 'HACCP CODEX CXC 1-1969 Rev 2022',
    subtitle: 'Hệ thống phân tích mối nguy & kiểm soát điểm tới hạn (VICAS 076-FSMS)',
    issuedBy: 'Eurofins Assurance Vietnam LLC',
    validUntil: '02/11/2028',
    scope:
      'Sản xuất (làm bột, cán, tạo hình, ủ, nướng, làm nguội, bơm nhân, đóng gói) bột đông lạnh, bánh mì và bánh toast trong túi nhựa.',
    image: '/cobi/certificate/ck3-1-566x800.jpg',
  },
  {
    id: 'cert-fda',
    code: 'FFR# 12451195218',
    title: 'U.S. FDA Food Facility Registration',
    subtitle: 'Certificate of Registration — Cert No: FL1822510273 (DUNS: 66-553-4922)',
    issuedBy: 'U.S. Food and Drug Administration (Registered via Finch Law / Hollis Consultancy LLC)',
    validUntil: '16/10/2027',
    scope:
      'Cơ sở chế biến thực phẩm COBI BREAD CK LOGIS II được đăng ký hợp lệ với Cục Quản lý Thực phẩm và Dược phẩm Hoa Kỳ (US FDA) phục vụ xuất khẩu.',
    image: '/cobi/certificate/ck4-1-566x800.jpg',
  },
];

export const CERTIFICATES_DATA_EN: CertificateItem[] = [
  {
    id: 'cert-fssc',
    code: 'EI_FA_SC_439',
    title: 'Food Safety System Certification 22000 (FSSC 22000)',
    subtitle: 'ISO 22000:2018, ISO/TS 22002-1:2009 & FSSC 22000 Version 6',
    issuedBy: 'Eurofins Assurance India Pvt. Ltd. (NABCB / IAF)',
    validUntil: '22/01/2029',
    scope:
      'Manufacturing (dough preparation, lamination, shaping, proofing, packaging, freezing) of frozen dough in plastic packaging at COBI BREAD CK LOGIS 2.',
    image: '/cobi/certificate/ckkk-1-566x800.jpg',
  },
  {
    id: 'cert-brcgs',
    code: 'F_EI0794_2025',
    title: 'BRCGS Global Standard for Food Safety (Issue 9)',
    subtitle: 'Audit Recognition — Achieved Grade: B (UKAS 9660)',
    issuedBy: 'Eurofins Food Safety Solutions Ltd, United Kingdom',
    validUntil: '12/01/2027',
    scope:
      'Dough making, proofing, and packaging of frozen bread dough in PA/PE bags (Product Category 03 - Raw prepared products) at COBI BREAD CK LOGIS 2.',
    image: '/cobi/certificate/ck2-1-566x800.jpg',
  },
  {
    id: 'cert-haccp',
    code: '2503011-EN-1',
    title: 'HACCP CODEX CXC 1-1969 Rev 2022',
    subtitle: 'Hazard Analysis and Critical Control Points (VICAS 076-FSMS)',
    issuedBy: 'Eurofins Assurance Vietnam LLC',
    validUntil: '02/11/2028',
    scope:
      'Production (dough mixing, rolling, forming, proofing, baking, cooling, cream filling, and packaging) of frozen dough, fresh bread, and pocket toast in plastic pouches.',
    image: '/cobi/certificate/ck3-1-566x800.jpg',
  },
  {
    id: 'cert-fda',
    code: 'FFR# 12451195218',
    title: 'U.S. FDA Food Facility Registration',
    subtitle: 'Certificate of Registration — Cert No: FL1822510273 (DUNS: 66-553-4922)',
    issuedBy: 'U.S. Food and Drug Administration (Registered via Finch Law / Hollis Consultancy LLC)',
    validUntil: '16/10/2027',
    scope:
      'COBI BREAD CK LOGIS II food manufacturing facility is duly registered with the U.S. Food and Drug Administration (US FDA) for international export compliance.',
    image: '/cobi/certificate/ck4-1-566x800.jpg',
  },
];

export function getLocalizedCertificatesData(locale: Locale): CertificateItem[] {
  return locale === 'en' ? CERTIFICATES_DATA_EN : CERTIFICATES_DATA;
}

// ============================================================================
// 8. POLICIES & SERVICES DATA (Bilingual VI / EN — identical slugs)
// ============================================================================
export const POLICIES_DATA: PolicyDocument[] = [
  {
    slug: 'thong-tin-chu-so-huu',
    group: 'ABOUT',
    shortTitle: 'Thông tin chủ sở hữu website',
    title: 'Thông Tin Chủ Sở Hữu Website Cobi Bread',
    subtitle: 'Công bố thông tin pháp lý & Giấy chứng nhận đăng ký doanh nghiệp chính thức',
    updatedAt: 'Đăng ký thay đổi lần thứ 10 — 12/01/2023',
    sections: [
      {
        heading: 'Thông tin đơn vị chủ quản',
        bullets: [
          'Tên đơn vị: CÔNG TY TNHH QUỐC TẾ COBI (COBI INTERNATIONAL COMPANY LIMITED)',
          'Mã số doanh nghiệp / MST: 0314490563',
          'Đăng ký lần đầu: Ngày 03 tháng 7 năm 2017 tại Phòng Đăng ký kinh doanh — Sở Kế hoạch và Đầu tư Thành phố Hồ Chí Minh',
          'Địa chỉ trụ sở chính: Phòng 1602, Tầng 16, Tòa nhà Cobi Tower II, Số 2-4 Đường số 8, Phường Tân Phú, Quận 7, Thành phố Hồ Chí Minh, Việt Nam',
          'Số điện thoại: 028 5411 1550',
          'Fax: 028 5411 1554',
          'Email: jmhan@cobione.com',
        ],
      },
      {
        heading: 'Thông tin thương hiệu Cobi Bread',
        paragraphs: [
          'COBI BREAD là thương hiệu bánh ngọt cao cấp thuộc hệ sinh thái COBI GROUP, trực thuộc Công ty TNHH Quốc Tế COBI. Website cobibread.com cung cấp thông tin sản phẩm bánh tươi, bánh đông lạnh B2C & B2B, dịch vụ cung ứng bếp công nghiệp (Cobi Home) và hệ thống cửa hàng bán lẻ trên toàn quốc.',
        ],
      },
    ],
    attachments: [
      {
        title: 'Giấy Chứng Nhận Đăng Ký Doanh Nghiệp (ERC)',
        image: '/cobi/owner/ERC-Cobi-Inter-10th-12012023-5_page-0001.jpg',
        caption: 'Công ty TNHH Quốc Tế COBI — Mã số doanh nghiệp: 0314490563 (Bấm vào ảnh để phóng to)',
      },
    ],
    contactBox: {
      company: 'CÔNG TY TNHH QUỐC TẾ COBI',
      address:
        'Phòng 1602, Tầng 16, Tòa nhà Cobi Tower II, Số 2-4 Đường số 8, Phường Tân Phú, Quận 7, TP. Hồ Chí Minh',
      phone: '028 5411 1550',
      fax: '028 5411 1554',
      email: 'jmhan@cobione.com',
      hotline: '03 567 567 20',
    },
  },
  {
    slug: 'chinh-sach-bao-mat',
    group: 'ABOUT',
    shortTitle: 'Chính sách bảo mật',
    title: 'Chính Sách Bảo Mật Thông Tin Cá Nhân',
    subtitle: 'Tuân thủ Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân tại Việt Nam',
    updatedAt: 'Cập nhật năm 2025–2026',
    sections: [
      {
        heading: '1. Giới thiệu chung',
        paragraphs: [
          'Chính sách bảo mật / Chính sách bảo vệ dữ liệu cá nhân này (“Chính sách bảo mật” hay “Chính sách”) được Công ty TNHH Quốc Tế COBI (“Cobi Bread” hay “Chúng tôi”) thiết kế để giúp khách hàng (“Khách hàng”) hiểu được cách thức chúng tôi thu thập, sử dụng, bảo vệ, tiết lộ và/hoặc xử lý dữ liệu cá nhân mà khách hàng đã cung cấp cho chúng tôi thông qua việc sử dụng website http://cobibread.com/ (“Website”).',
          'Chúng tôi cam kết luôn nghiêm túc thực hiện trách nhiệm liên quan đến bảo mật thông tin theo các quy định về bảo vệ bí mật thông tin cá nhân của pháp luật Việt Nam và cam kết tôn trọng quyền riêng tư của tất cả Khách hàng.',
          'Bằng việc truy cập, sử dụng Website và/hoặc đăng ký tài khoản thành viên, Khách hàng đồng ý toàn bộ và cho phép chúng tôi thu thập, sử dụng, tiết lộ và/hoặc xử lý dữ liệu cá nhân như mô tả tại Chính sách này.',
        ],
      },
      {
        heading: '2. Định nghĩa dữ liệu cá nhân',
        paragraphs: [
          '“Dữ liệu cá nhân” là thông tin dưới dạng ký hiệu, chữ viết, chữ số, hình ảnh, âm thanh hoặc dạng tương tự trên môi trường điện tử gắn liền với một con người cụ thể hoặc giúp xác định một con người cụ thể, bao gồm dữ liệu cá nhân cơ bản và dữ liệu cá nhân nhạy cảm quy định tại Nghị định 13/2023/NĐ-CP.',
          '“Xử lý dữ liệu cá nhân” là một hoặc nhiều hoạt động tác động tới dữ liệu cá nhân như: thu thập, ghi, phân tích, xác nhận, lưu trữ, chỉnh sửa, công khai, kết hợp, truy cập, truy xuất, thu hồi, mã hóa, giải mã, sao chép, chia sẻ, truyền đưa, cung cấp, chuyển giao, xóa, hủy dữ liệu cá nhân.',
        ],
      },
      {
        heading: '3. Thời điểm và phạm vi thu thập dữ liệu',
        paragraphs: ['Cobi Bread tiến hành thu thập dữ liệu cá nhân về Khách hàng khi:'],
        bullets: [
          'Khách hàng đăng ký và/hoặc sử dụng Website hoặc mở tài khoản trên Website;',
          'Khách hàng thực hiện việc mua sắm sản phẩm trên Website;',
          'Khách hàng tương tác với Chúng tôi thông qua cuộc gọi điện thoại (có thể được ghi âm), thư từ, hội thoại trên Website và/hoặc qua email;',
          'Khách hàng cung cấp ý kiến phản hồi, khảo sát hoặc khiếu nại đến Chúng tôi;',
          'Khách hàng đăng ký sự kiện, tham gia chương trình khuyến mại hoặc gửi thông tin vì bất kỳ lý do hợp pháp nào khác.',
        ],
      },
      {
        heading: '4. Loại dữ liệu cá nhân được thu thập',
        bullets: [
          'Thông tin nhận dạng: định danh người dùng, ảnh hồ sơ, tên người dùng (biệt danh), ngày sinh và giới tính;',
          'Thông tin liên lạc: họ tên, địa chỉ giao hàng, địa chỉ thư điện tử (email) và số điện thoại;',
          'Dữ liệu giao dịch: các khoản thanh toán, chi tiết đơn hàng sản phẩm và dịch vụ đã mua;',
          'Dữ liệu kỹ thuật & sử dụng: dữ liệu đăng nhập, loại/phiên bản trình duyệt, múi giờ, dữ liệu vị trí cửa hàng lựa chọn, hệ điều hành và hành vi tương tác trên Website;',
          'Dữ liệu tiếp thị & truyền thông: ưu tiên nhận thông tin khuyến mại và kênh nhận thông tin.',
        ],
      },
      {
        heading: '5. Mục đích sử dụng & Thời gian lưu trữ dữ liệu',
        paragraphs: [
          'Dữ liệu cá nhân được sử dụng để tạo và quản lý tài khoản; xác minh khách hàng; xử lý giao hàng, thanh toán, đổi trả/hoàn tiền; cung cấp dịch vụ hỗ trợ khách hàng; thực hiện nghiên cứu cải thiện sản phẩm; gửi thông báo chương trình khuyến mại (nếu khách hàng đồng ý); và tuân thủ các yêu cầu pháp lý từ cơ quan nhà nước có thẩm quyền.',
          'Thông tin của Khách hàng được lưu trữ điện tử trên hệ thống máy chủ của Chúng tôi hoặc đối tác hạ tầng hợp pháp trong suốt thời gian tồn tại tài khoản và theo quy định lưu trữ lịch sử giao dịch, phòng chống gian lận của pháp luật.',
        ],
      },
      {
        heading: '6. Bảo vệ, chỉnh sửa, chia sẻ và chuyển dữ liệu',
        paragraphs: [
          'Chúng tôi áp dụng các biện pháp kỹ thuật và quản trị phù hợp để ngăn chặn truy cập trái phép, trộm cắp, sửa đổi hoặc phá hủy dữ liệu cá nhân. Chúng tôi có thể chia sẻ thông tin cần thiết cho các công ty thành viên thuộc COBI GROUP hoặc đơn vị đối tác vận chuyển/thanh toán để hoàn tất đơn hàng và chỉ chia sẻ trong phạm vi cần thiết.',
          'Việc chuyển dữ liệu ra nước ngoài (nếu phát sinh phục vụ báo cáo tập đoàn mẹ thuộc Công ty TNHH Quốc Tế COBI) luôn tuân thủ nghiêm ngặt các quy định của pháp luật Việt Nam.',
        ],
      },
      {
        heading: '7. Quyền và nghĩa vụ của Khách hàng',
        bullets: [
          'Được biết về hoạt động xử lý thông tin cá nhân và yêu cầu cung cấp bản sao dữ liệu đang lưu trữ;',
          'Được yêu cầu chỉnh sửa, cập nhật hoặc xóa bỏ dữ liệu cá nhân không chính xác hoặc khi không còn nhu cầu sử dụng (trừ trường hợp pháp luật yêu cầu lưu giữ hóa đơn chứng từ);',
          'Được quyền hạn chế xử lý, phản đối xử lý hoặc rút lại sự đồng ý đã cấp thông qua email liên hệ chính thức;',
          'Được quyền khiếu nại, tố cáo hoặc yêu cầu bồi thường thiệt hại theo đúng quy định pháp luật hiện hành.',
        ],
      },
    ],
    contactBox: {
      company: 'CÔNG TY TNHH QUỐC TẾ COBI',
      address:
        'Phòng 1602, Tầng 16, Tòa nhà Cobi Tower II, Số 2-4 Đường số 8, Phường Tân Phú, Quận 7, TP. Hồ Chí Minh',
      phone: '028 5411 1550',
      email: 'cobionline@cobione.com',
      hotline: '03 567 567 20',
    },
  },
  {
    slug: 'chinh-sach-giao-hang',
    group: 'ABOUT',
    shortTitle: 'Chính sách giao hàng',
    title: 'Chính Sách Giao Hàng B2C & Đổi Trả Bánh Đông Lạnh',
    subtitle: 'Quy trình vận chuyển lạnh, đổi mới và hoàn tiền minh bạch từ Cobi Bread',
    updatedAt: 'Cập nhật năm 2025–2026',
    sections: [
      {
        heading: '1. Phương thức vận chuyển B2C',
        bullets: [
          'Hình thức: Giao hàng chuyển phát nhanh / giao nhận lạnh chuyên dụng.',
          'Phạm vi giao hàng: Toàn quốc.',
          'Phí vận chuyển: Tùy khu vực sẽ có báo giá cụ thể tại trang thanh toán.',
          'Thời gian giao hàng: 3 – 7 ngày làm việc (chưa bao gồm Thứ 7, Chủ Nhật hoặc điều kiện bất khả kháng).',
        ],
        note: 'Lưu ý: Đối với các khu vực xa xôi, hẻo lánh hoặc hạ tầng khó tiếp cận, quý khách có thể thanh toán thêm phụ phí vận chuyển. Cobi Bread tiến hành giao hàng sau khi xác nhận đơn hàng/thanh toán và đảm bảo quy cách bảo quản lạnh phù hợp.',
      },
      {
        heading: '2. Chính sách đổi mới sản phẩm (áp dụng với bánh đông lạnh)',
        paragraphs: ['2.1. Phạm vi áp dụng đổi mới:'],
        bullets: [
          'Bánh bị hư hại do quá trình vận chuyển (bể, vỡ, rách bao bì, tan chảy nghiêm trọng).',
          'Bánh bị lỗi do nhà sản xuất (bánh hư, chảy nước bất thường, mốc, sai loại bánh, sai hình dáng ban đầu).',
        ],
      },
      {
        heading: '2.2. Điều kiện & Yêu cầu đóng gói gửi lại',
        bullets: [
          'Quý khách cần liên hệ với bộ phận chăm sóc khách hàng của Cobi Bread trong vòng 7 ngày kể từ khi nhận hàng thành công.',
          'Phải cung cấp bằng chứng hình ảnh hoặc video lúc mở gói hàng để chứng minh sản phẩm lỗi phát sinh từ nhà bán hoặc quá trình vận chuyển.',
          'Trường hợp không có bằng chứng (video/quay cảnh khui hàng), Cobi Bread có quyền từ chối xử lý yêu cầu đổi mới.',
          'Sản phẩm yêu cầu đổi mới cần còn nguyên bao bì, đầy đủ phụ kiện đi kèm (túi giữ lạnh, hộp xốp) và không bị hư hỏng thêm do bảo quản sai cách.',
          'Quý khách bảo quản bánh ở nhiệt độ đông lạnh (-18°C) và quay video/chụp ảnh tình trạng kiện hàng trước khi giao lại cho đơn vị vận chuyển.',
        ],
      },
      {
        heading: '3. Chính sách trả hàng – hoàn tiền',
        paragraphs: [
          'Áp dụng khi bánh bị hư hại trong quá trình vận chuyển (bị chảy, hỏng, không đảm bảo chất lượng), nhận sai sản phẩm (sai loại, sai số lượng, không đúng mô tả cơ bản) hoặc khác biệt rõ rệt về thiết kế/thành phần chính (không áp dụng cho thay đổi nhỏ về bao bì/tem nhãn theo đợt nhập hàng).',
        ],
        bullets: [
          'Thời hạn thông báo: Trong vòng 7 ngày kể từ khi nhận hàng thành công kèm video/hình ảnh khui hàng.',
          'Yêu cầu sản phẩm hoàn trả: Giữ nguyên trạng thái ban đầu, còn đông lạnh, kèm đầy đủ hộp đựng và túi giữ nhiệt.',
          'Cần chụp ảnh/quay video kiện hàng trước khi bàn giao hoàn trả để làm cơ sở đối chiếu.',
        ],
      },
    ],
    contactBox: {
      company: 'CÔNG TY TNHH QUỐC TẾ COBI',
      address: 'Cobi Bread Tower — 69 Hoàng Văn Thái, Phường Tân Phú, Quận 7, TP. Hồ Chí Minh',
      phone: '03 567 567 20',
      email: 'cobionline@cobione.com',
      hotline: '0909 459 387',
    },
  },
  {
    slug: 'chinh-sach-kiem-hang',
    group: 'ABOUT',
    shortTitle: 'Chính sách kiểm hàng',
    title: 'Chính Sách Kiểm Hàng',
    subtitle: 'Quyền lợi đồng kiểm sản phẩm trực tiếp khi nhận đơn hàng từ Cobi Bread',
    updatedAt: 'Cập nhật năm 2025–2026',
    sections: [
      {
        heading: '1. Định nghĩa',
        paragraphs: [
          'Kiểm hàng là thực hiện các công việc kiểm tra và so sánh các sản phẩm/hàng hóa nhận được trong kiện hàng cobibread.com gửi với các sản phẩm trong đơn hàng mà quý khách hàng yêu cầu.',
        ],
      },
      {
        heading: '2. Thời điểm kiểm hàng',
        paragraphs: [
          'cobibread.com chấp nhận cho khách hàng đồng kiểm với nhân viên giao hàng tại thời điểm nhận hàng (hoặc trong vòng 30 phút kể từ khi khách nhận được hàng hóa).',
          'Sau khi nhận hàng, khách hàng kiểm lại phát hiện sai lệch có thể liên lạc ngay với bộ phận chăm sóc khách hàng để được hỗ trợ đổi trả.',
        ],
        note: 'Lưu ý: Quý khách vui lòng quay video lúc mở thùng hàng để làm căn cứ đối chiếu khi cần thiết.',
      },
      {
        heading: '3. Phạm vi kiểm tra hàng hóa',
        bullets: [
          'Kiểm đếm số lượng sản phẩm thực nhận, đối chiếu với đơn hàng đã xác nhận theo tên hàng, số lượng và thông tin khách hàng.',
          'Đối chiếu mẫu mã bên ngoài theo ảnh đại diện sản phẩm đã đặt mua.',
          'Tuyệt đối không bóc, mở các hộp sản phẩm có tem niêm phong, tem đảm bảo.',
          'Không cào lấy mã các sản phẩm có tích điểm hoặc đổi quà.',
          'Không bóc và sử dụng sản phẩm trong kiện hàng khi đang còn vấn đề cần xác minh trong quá trình kiểm tra hàng hóa.',
        ],
      },
      {
        heading: '4. Các bước xử lý khi nhận hàng không đúng đơn đặt hàng',
        paragraphs: [
          'Khi quý khách đồng kiểm và phát hiện sản phẩm nhận được không đúng với đơn đặt hàng, vui lòng liên hệ ngay hotline: 03 567 567 20 để gặp bộ phận chăm sóc khách hàng xác nhận lại đơn hàng.',
          'Trường hợp cobibread.com đóng sai đơn hàng theo yêu cầu của khách, khách hàng có thể từ chối nhận hàng và không thanh toán. Nếu đơn hàng đã thanh toán trước, khách hàng có thể yêu cầu gửi lại đơn mới hoặc nhận hoàn tiền trong thời gian sớm nhất.',
        ],
      },
      {
        heading: '5. Kênh tiếp nhận khiếu nại',
        paragraphs: [
          'Mọi thông tin khiếu nại và hỗ trợ kiểm hàng được tiếp nhận trực tiếp qua số hotline chăm sóc khách hàng: 03 567 567 20 hoặc email cobionline@cobione.com.',
        ],
      },
    ],
    contactBox: {
      company: 'BỘ PHẬN CSKH COBI BREAD',
      address: '69 Hoàng Văn Thái, Phường Tân Phú, Quận 7, TP. Hồ Chí Minh',
      phone: '03 567 567 20',
      email: 'cobionline@cobione.com',
      hotline: '03 567 567 20',
    },
  },
  {
    slug: 'dieu-khoan-dieu-kien',
    group: 'ABOUT',
    shortTitle: 'Điều khoản & điều kiện',
    title: 'Điều Khoản & Điều Kiện Sử Dụng',
    subtitle:
      'Quy định đặt hàng, thanh toán, vận chuyển, đổi trả và giải quyết tranh chấp trên website cobibread.com',
    updatedAt: 'Cập nhật năm 2025–2026',
    sections: [
      {
        heading: '1. Giới thiệu',
        paragraphs: [
          'Những điều khoản và điều kiện tại đây (“Điều khoản sử dụng”) áp dụng giữa CÔNG TY TNHH QUỐC TẾ COBI (“Cobi Bread” hay “Chúng tôi”) với bất kỳ khách hàng nào truy cập và đặt mua sản phẩm thông qua Website http://cobibread.com/.',
          'Bằng việc tiếp tục sử dụng Website, Khách hàng đồng ý với toàn bộ Điều khoản sử dụng theo bản cập nhật mới nhất được đăng tải chính thức.',
        ],
      },
      {
        heading: '2. Quy định đặt hàng & Mô tả sản phẩm',
        paragraphs: [
          'Khách hàng lựa chọn sản phẩm vào “Giỏ hàng”, kiểm tra kỹ thông tin cá nhân, số lượng và tổng thanh toán trước khi nhấn nút “Gửi đơn hàng” / “Xác nhận đặt hàng”. Sau khi tiếp nhận đơn hàng, hệ thống hoặc nhân viên của Chúng tôi sẽ gửi xác nhận qua email/tin nhắn hoặc điện thoại.',
          'Thông tin cân nặng, kích thước và màu sắc hiển thị được cung cấp chính xác tối đa trong khả năng; màu sắc thực tế có thể chênh lệch nhẹ tùy thuộc thiết bị hiển thị.',
        ],
      },
      {
        heading: '3. Chính sách giá & Thanh toán',
        paragraphs: [
          'Giá sản phẩm niêm yết trên Website đã bao gồm thuế (GTGT theo quy định) nhưng chưa bao gồm phí vận chuyển (trừ các chương trình miễn phí vận chuyển cụ thể). Phí vận chuyển sẽ được thể hiện rõ tại trang Thanh toán.',
          'Khách hàng có thể lựa chọn thanh toán khi nhận hàng (COD) hoặc các phương thức được hỗ trợ. Đơn hàng chỉ được giao khi quá trình thanh toán hợp lệ được xác nhận.',
        ],
      },
      {
        heading: '4. Chính sách vận chuyển & Hủy đơn hàng',
        bullets: [
          'Thời gian xử lý giao hàng tiêu chuẩn: khoảng 5 ngày đối với đơn nội thành và khoảng 7 ngày đối với đơn ngoại thành (không tính Thứ 7 – Chủ Nhật), trừ các trường hợp bất khả kháng (thiên tai, sai địa chỉ, đơn hàng tăng đột biến).',
          'Hủy đơn hàng: Khách hàng được hỗ trợ hủy đơn trong vòng 24 giờ kể từ lúc đặt/thanh toán thành công bằng cách gọi hotline 035 675 6720 và gửi email về cobionline@cobione.com.',
          'Nếu hủy trong vòng 1 giờ kể từ khi xác nhận (trước khi hàng được vận chuyển), Cobi Bread hoàn 100% số tiền đã thanh toán.',
          'Nếu hủy sau khi hàng đã xuất kho vận chuyển, tiền hoàn sẽ được khấu trừ chi phí vận chuyển, thanh toán và đóng gói phát sinh.',
        ],
      },
      {
        heading: '5. Quy định đổi trả hàng',
        bullets: [
          'Trường hợp áp dụng: bánh hư hại khi vận chuyển (chảy, hỏng), nhận sai loại/số lượng hoặc khác biệt rõ rệt với đơn đặt hàng. Khách hàng phải thông báo trong vòng 24h kể từ lúc nhận.',
          'Sản phẩm được đổi 1 lần duy nhất trong vòng 7 ngày kể từ ngày nhận hàng, còn nguyên bao bì, phụ kiện, quà tặng đi kèm.',
          'Cách 1 — Đổi trực tiếp tại cửa hàng Cobi Bread cùng vận đơn/hóa đơn.',
          'Cách 2 — Gửi về địa chỉ: Cobi Bread Tower – 69 Hoàng Văn Thái, Phường Tân Phú, Quận 7, TP. Hồ Chí Minh.',
          'Hoàn tiền được xử lý trong thời hạn 14 – 20 ngày sau khi Cobi Bread nhận lại và kiểm tra sản phẩm đạt điều kiện đổi trả.',
        ],
      },
      {
        heading: '6. Quyền sở hữu trí tuệ & Quản lý tài khoản',
        paragraphs: [
          'Toàn bộ thương hiệu, hình ảnh, nội dung, giao diện và tài liệu trên Website thuộc quyền sở hữu của Công ty TNHH Quốc Tế COBI. Nghiêm cấm hành vi sao chép, khai thác dữ liệu tự động hoặc sử dụng cho mục đích thương mại khi chưa có chấp thuận bằng văn bản.',
          'Khách hàng có trách nhiệm bảo mật mật khẩu tài khoản. Chúng tôi bảo lưu quyền tạm khóa hoặc chấm dứt tài khoản vi phạm (đặt đơn ảo, gian lận khuyến mại, lạm dụng tách đơn, tài khoản không hoạt động quá 2 năm hoặc theo yêu cầu cơ quan chức năng).',
        ],
      },
      {
        heading: '7. Sự kiện bất khả kháng & Giới hạn trách nhiệm',
        paragraphs: [
          'Chúng tôi không chịu trách nhiệm chậm trễ hoặc không thực hiện được nghĩa vụ trong các trường hợp Bất Khả Kháng (thiên tai, lũ lụt, dịch bệnh, hỏa hoạn, sự cố hạ tầng viễn thông/mạng ngoài tầm kiểm soát). Khi sự kiện kết thúc, Cobi Bread sẽ sắp xếp giao hàng lại hoặc thỏa thuận phương án phù hợp cho Khách hàng.',
        ],
      },
      {
        heading: '8. Giải quyết khiếu nại & Luật điều chỉnh',
        paragraphs: [
          'Mọi khiếu nại được ưu tiên giải quyết qua thương lượng, hòa giải tại bộ phận CSKH (Mail: cobionline@cobione.com — Hotline: 03 567 567 20). Trường hợp không thể hòa giải, tranh chấp sẽ được giải quyết bằng trọng tài tại Trung tâm Trọng tài Quốc tế Việt Nam (VIAC) tại TP. Hồ Chí Minh theo quy định của pháp luật Việt Nam.',
        ],
      },
    ],
    contactBox: {
      company: 'CÔNG TY TNHH QUỐC TẾ COBI',
      address:
        'Phòng 1602, Tầng 16, Tòa nhà Cobi Tower II, Số 2-4 Đường số 8, Phường Tân Phú, Quận 7, TP. Hồ Chí Minh',
      phone: '028 5411 1550',
      email: 'cobionline@cobione.com',
      hotline: '03 567 567 20',
    },
  },
  {
    slug: 'phan-dinh-trach-nhiem',
    group: 'ABOUT',
    shortTitle: 'Phân định trách nhiệm thương nhân & logistics',
    title: 'Phân Định Trách Nhiệm Của Thương Nhân & Tổ Chức Cung Ứng Dịch Vụ Logistics',
    subtitle:
      'Quy định quyền, nghĩa vụ và trách nhiệm cung cấp chứng từ hàng hóa trong quá trình giao nhận',
    updatedAt: 'Cập nhật năm 2025–2026',
    sections: [
      {
        heading: '1. Nghĩa vụ của bên vận chuyển',
        bullets: [
          'Bảo đảm vận chuyển tài sản đầy đủ, an toàn đến địa điểm đã định, theo đúng thời hạn.',
          'Giao tài sản cho đúng người có quyền nhận.',
          'Chịu chi phí liên quan đến việc chuyên chở tài sản, trừ trường hợp có thỏa thuận khác.',
          'Mua bảo hiểm trách nhiệm dân sự theo quy định của pháp luật.',
          'Bồi thường thiệt hại cho bên thuê vận chuyển trong trường hợp bên vận chuyển để mất, hư hỏng tài sản, trừ trường hợp có thỏa thuận khác hoặc pháp luật có quy định khác.',
        ],
      },
      {
        heading: '2. Quyền của bên vận chuyển',
        bullets: [
          'Kiểm tra sự xác thực của tài sản, của vận đơn hoặc chứng từ vận chuyển tương đương khác.',
          'Từ chối vận chuyển tài sản không đúng với loại tài sản đã thỏa thuận trong hợp đồng.',
          'Yêu cầu bên thuê vận chuyển thanh toán đủ cước phí vận chuyển đúng thời hạn.',
          'Từ chối vận chuyển tài sản cấm giao dịch, tài sản có tính chất nguy hiểm, độc hại theo quy định.',
        ],
      },
      {
        heading: '3. Nghĩa vụ của bên thuê vận chuyển (Thương nhân / Người gửi)',
        bullets: [
          'Trả đủ tiền cước phí vận chuyển cho bên vận chuyển theo đúng thời hạn, phương thức đã thỏa thuận.',
          'Cung cấp đầy đủ thông tin cần thiết và chứng từ liên quan đến hàng hóa (phiếu xuất kho, hóa đơn, vận đơn, hướng dẫn bảo quản lạnh nếu có) để bảo đảm an toàn cho tài sản vận chuyển.',
          'Trông coi tài sản trên đường vận chuyển nếu có thỏa thuận (trường hợp bên thuê tự trông coi mà bị mất, hư hỏng thì bên vận chuyển không phải bồi thường).',
        ],
      },
      {
        heading: '4. Quyền của bên thuê vận chuyển',
        bullets: [
          'Yêu cầu bên vận chuyển chuyên chở tài sản đến đúng địa điểm, thời điểm đã thỏa thuận.',
          'Trực tiếp nhận hoặc chỉ định người thứ ba nhận lại tài sản đã thuê vận chuyển.',
        ],
      },
      {
        heading: '5. Trách nhiệm bồi thường thiệt hại',
        bullets: [
          'Bên vận chuyển phải bồi thường thiệt hại cho bên thuê vận chuyển nếu để tài sản bị mất hoặc hư hỏng trong quá trình vận chuyển.',
          'Bên thuê vận chuyển phải bồi thường thiệt hại cho bên vận chuyển và người thứ ba về thiệt hại do tài sản vận chuyển có tính chất nguy hiểm, độc hại mà không có biện pháp đóng gói, bảo đảm an toàn.',
          'Trường hợp bất khả kháng dẫn đến tài sản vận chuyển bị mất, hư hỏng hoặc bị hủy hoại trong quá trình vận chuyển thì bên vận chuyển không phải chịu trách nhiệm bồi thường thiệt hại, trừ trường hợp có thỏa thuận khác hoặc pháp luật có quy định khác.',
        ],
      },
    ],
    contactBox: {
      company: 'CÔNG TY TNHH QUỐC TẾ COBI',
      address:
        'Phòng 1602, Tầng 16, Tòa nhà Cobi Tower II, Số 2-4 Đường số 8, Phường Tân Phú, Quận 7, TP. Hồ Chí Minh',
      phone: '028 5411 1550',
      email: 'cobionline@cobione.com',
      hotline: '03 567 567 20',
    },
  },
  {
    slug: 'tu-van-lap-dat-bep-cong-nghiep',
    group: 'SERVICE',
    shortTitle: 'Tư vấn lắp đặt bếp công nghiệp',
    title: 'Dịch Vụ Tư Vấn Lắp Đặt Bếp Công Nghiệp & Tiệm Bánh (Cobi Home x Cobi Bread)',
    subtitle:
      'Giải pháp tổng thể thiết kế layout bếp, thiết bị làm bánh, máy pha cà phê & vận hành F&B',
    updatedAt: 'Hệ sinh thái COBI GROUP',
    sections: [
      {
        heading: '1. Bếp công nghệ kiến tạo vận hành thông minh',
        paragraphs: [
          'Với vai trò là đơn vị tiên phong cung cấp hơn 5,000 trang thiết bị, máy móc, dụng cụ và giải pháp vận hành trong hệ sinh thái COBI GROUP, bộ đôi COBI HOME x COBI BREAD mang đến dịch vụ tư vấn – thiết kế – lắp đặt trọn gói cho tiệm bánh, chuỗi cà phê, nhà hàng và khách sạn (Ho.Re.Ca).',
        ],
        bullets: [
          'Tư vấn bố trí layout quầy bar, khu bếp nướng đối lưu, khu trưng bày tủ mát/tủ đông chuẩn công năng.',
          'Cung cấp thiết bị đồng bộ: máy trộn bột, lò nướng công nghiệp, tủ ủ bột, tủ mát bánh kem, máy làm kem, máy làm đá và máy pha cà phê chuẩn barista.',
          'Hỗ trợ thiết bị nướng nhanh chuyên dụng (nồi chiên không dầu công suất lớn / lò đối lưu mini) cho mô hình chuỗi take-away sử dụng bánh Pocket Toast và Frozen Dough của Cobi Bread.',
        ],
      },
      {
        heading: '2. Đào tạo vận hành tại Bakery Academy & Chứng nhận',
        paragraphs: [
          'Không chỉ cung cấp thiết bị, Cobi Bread Bakery Academy đồng hành đào tạo đội ngũ pha chế và nhân viên vận hành quầy bánh từ kỹ thuật rã đông, phết trứng, canh nhiệt độ nướng tới kiểm soát vệ sinh an toàn thực phẩm (HACCP / ISO 22000).',
        ],
      },
    ],
    attachments: [
      {
        title: 'Sơ đồ Giải Pháp Tổng Thể Cho Tiệm Bánh (Total Bakery Solutions)',
        image: '/cobi/introduce/Asset-11@4x-8-1.png',
        caption: 'Kết hợp thiết bị Ho.Re.Ca, Bakery Academy, thiết kế nội thất & hỗ trợ pháp lý vận hành',
        isDiagram: true,
      },
      {
        title: 'Hệ thống thiết bị bếp bánh & quầy pha chế trưng bày thực tế',
        image: '/cobi/news/new2/BAKERY_1.png',
        caption: 'Mô hình kết hợp Cobi Home & Cobi Bread tại triển lãm Coffee Expo Vietnam',
      },
    ],
    contactBox: {
      company: 'COBI HOME x COBI BREAD B2B SOLUTIONS',
      address: '69 Hoàng Văn Thái, Phường Tân Phú, Quận 7, TP. Hồ Chí Minh',
      phone: '0909 459 387 (HCM) • 0982 219 841 (HN)',
      email: 'Exportsales@cobione.com',
      hotline: '0909 459 387',
    },
  },
  {
    slug: 'chinh-sach-bao-hanh',
    group: 'SERVICE',
    shortTitle: 'Chính sách bảo hành',
    title: 'Chính Sách Bảo Hành & Cam Kết Chất Lượng',
    subtitle:
      'Bảo hành chất lượng bánh thành phẩm, bánh đông lạnh và hỗ trợ kỹ thuật thiết bị đối tác B2B',
    updatedAt: 'Cập nhật năm 2025–2026',
    sections: [
      {
        heading: '1. Bảo đảm chất lượng đối với sản phẩm bánh ngọt & bánh đông lạnh',
        bullets: [
          'Tất cả sản phẩm bánh tươi (bảo quản 0–10°C) và bánh đông lạnh (bảo quản -18°C) đều được kiểm định chặt chẽ tại Central Kitchen theo tiêu chuẩn BRCGS Issue 9, FSSC 22000 Version 6 và HACCP CODEX.',
          'Bảo hành 1 đổi 1 hoặc hoàn tiền 100% đối với sản phẩm phát sinh lỗi sản xuất, biến chất trước hạn sử dụng hoặc hư hại/tan chảy trong quá trình giao nhận lạnh của Cobi Bread (áp dụng theo Chính sách kiểm hàng & đổi mới trong vòng 7 ngày kèm bằng chứng hình ảnh/video).',
        ],
      },
      {
        heading: '2. Chính sách bảo hành thiết bị & dụng cụ làm bánh (Đối tác B2B / Cobi Home)',
        bullets: [
          'Thiết bị bếp công nghiệp, lò nướng, tủ đông, máy pha cà phê cung ứng qua hệ thống COBI GROUP được hưởng chế độ bảo hành chính hãng và hỗ trợ kỹ thuật định kỳ.',
          'Đội ngũ kỹ thuật viên tiếp nhận xử lý sự cố thiết bị nhanh chóng, cung cấp linh kiện thay thế chuẩn hãng giúp cửa hàng đối tác duy trì hoạt động liên tục không gián đoạn.',
        ],
      },
      {
        heading: '3. Kênh tiếp nhận yêu cầu bảo hành',
        paragraphs: [
          'Quý khách hàng lẻ và đối tác B2B vui lòng liên hệ trực tiếp Tổng đài CSKH 03 567 567 20, Hotline B2B (HCM) 0909 459 387 hoặc (HN) 0982 219 841 để được tiếp nhận và xử lý kịp thời.',
        ],
      },
    ],
    contactBox: {
      company: 'TRUNG TÂM BẢO HÀNH & CSKH COBI',
      address: 'Phòng 1602, Tầng 16, Cobi Tower II, Số 2-4 Đường số 8, P. Tân Phú, Q.7, TP.HCM',
      phone: '028 5411 1550 • 03 567 567 20',
      email: 'cobionline@cobione.com',
      hotline: '0909 459 387',
    },
  },
];

export const POLICIES_DATA_EN: PolicyDocument[] = [
  {
    slug: 'thong-tin-chu-so-huu',
    group: 'ABOUT',
    shortTitle: 'Website Owner Information',
    title: 'Website Owner Information — Cobi Bread',
    subtitle: 'Official corporate legal disclosure & Enterprise Registration Certificate (ERC)',
    updatedAt: '10th Amendment Registered on Jan 12, 2023',
    sections: [
      {
        heading: 'Governing Entity Information',
        bullets: [
          'Company Name: COBI INTERNATIONAL COMPANY LIMITED (CÔNG TY TNHH QUỐC TẾ COBI)',
          'Enterprise Registration / Tax ID: 0314490563',
          'Initial Registration: July 3, 2017 — Business Registration Office, Department of Planning and Investment of Ho Chi Minh City',
          'Head Office Address: Room 1602, 16th Floor, Cobi Tower II, No. 2-4 Street No. 8, Tan Phu Ward, District 7, Ho Chi Minh City, Vietnam',
          'Telephone: 028 5411 1550',
          'Fax: 028 5411 1554',
          'Email: jmhan@cobione.com',
        ],
      },
      {
        heading: 'About the Cobi Bread Brand',
        paragraphs: [
          'COBI BREAD is a premium bakery brand within the COBI GROUP ecosystem operated by Cobi International Co., Ltd. Our official website cobibread.com showcases fresh cream buns, frozen bakery dough for B2C and B2B partners, commercial kitchen setups (Cobi Home), and our nationwide retail bakery locations.',
        ],
      },
    ],
    attachments: [
      {
        title: 'Enterprise Registration Certificate (ERC)',
        image: '/cobi/owner/ERC-Cobi-Inter-10th-12012023-5_page-0001.jpg',
        caption: 'COBI International Co., Ltd — Tax ID: 0314490563 (Click image to enlarge)',
      },
    ],
    contactBox: {
      company: 'COBI INTERNATIONAL CO., LTD',
      address:
        'Room 1602, 16th Floor, Cobi Tower II, No. 2-4 Street No. 8, Tan Phu Ward, District 7, Ho Chi Minh City',
      phone: '028 5411 1550',
      fax: '028 5411 1554',
      email: 'jmhan@cobione.com',
      hotline: '03 567 567 20',
    },
  },
  {
    slug: 'chinh-sach-bao-mat',
    group: 'ABOUT',
    shortTitle: 'Privacy Policy',
    title: 'Personal Data Privacy Policy',
    subtitle: 'Compliant with Vietnam Decree No. 13/2023/ND-CP on Personal Data Protection',
    updatedAt: 'Updated 2025–2026',
    sections: [
      {
        heading: '1. Introduction',
        paragraphs: [
          'This Privacy Policy explains how COBI International Company Limited (“Cobi Bread”, “We”, or “Us”) collects, uses, safeguards, discloses, and processes personal data provided by customers (“Customer”) while using http://cobibread.com/ (“Website”).',
          'We strictly uphold all statutory obligations concerning personal data protection under Vietnamese law and deeply respect every Customer’s privacy.',
          'By accessing this Website or creating a customer account, you confirm your understanding and consent to the personal data practices outlined below.',
        ],
      },
      {
        heading: '2. Definitions',
        paragraphs: [
          '“Personal Data” refers to electronic symbols, letters, numbers, images, audio, or equivalent information linked to or capable of identifying a specific individual, including basic and sensitive personal data defined under Decree 13/2023/ND-CP.',
          '“Processing” includes collection, recording, analysis, verification, storage, modification, sharing, transfer, encryption, retrieval, deletion, or destruction of personal data.',
        ],
      },
      {
        heading: '3. When We Collect Personal Data',
        paragraphs: ['Cobi Bread may collect personal data whenever you:'],
        bullets: [
          'Register or log in to an account on our Website;',
          'Browse or place online bakery orders;',
          'Contact us via customer service calls, email, live chat, or written correspondence;',
          'Submit feedback, surveys, warranty claims, or product inquiries;',
          'Participate in seasonal promotions, tastings, or marketing campaigns.',
        ],
      },
      {
        heading: '4. Categories of Data Collected',
        bullets: [
          'Identity details: full name, username, profile preferences, gender, and date of birth;',
          'Contact information: delivery address, email address, and telephone number;',
          'Transaction records: payment methods, ordered items, fulfillment store, and invoices;',
          'Technical usage data: browser version, operating system, time zone, selected store location, and interaction logs;',
          'Communication preferences: opt-in marketing notifications.',
        ],
      },
      {
        heading: '5. Purpose of Use & Retention Period',
        paragraphs: [
          'Personal data is used solely to manage customer accounts, verify identities, fulfill cold-chain deliveries, process refunds/exchanges, improve bakery offerings, deliver requested updates, and comply with statutory obligations.',
          'Records are securely stored electronically throughout active account tenure and as required by statutory financial and anti-fraud retention laws.',
        ],
      },
      {
        heading: '6. Security, Disclosure & Cross-Border Transfers',
        paragraphs: [
          'We implement strict administrative and technical safeguards to protect personal data against unauthorized access or alteration. Necessary fulfillment details may be shared strictly within COBI GROUP affiliates, shipping couriers, and payment processors.',
          'Any cross-border reporting to parent corporate systems complies strictly with Vietnam data governance regulations.',
        ],
      },
      {
        heading: '7. Customer Rights',
        bullets: [
          'Right to be informed and request copies of stored personal data;',
          'Right to update, correct, or request erasure of inaccurate personal information (subject to tax invoicing laws);',
          'Right to withdraw consent, restrict processing, or lodge complaints via our official privacy contact below.',
        ],
      },
    ],
    contactBox: {
      company: 'COBI INTERNATIONAL CO., LTD',
      address:
        'Room 1602, 16th Floor, Cobi Tower II, No. 2-4 Street No. 8, Tan Phu Ward, District 7, Ho Chi Minh City',
      phone: '028 5411 1550',
      email: 'cobionline@cobione.com',
      hotline: '03 567 567 20',
    },
  },
  {
    slug: 'chinh-sach-giao-hang',
    group: 'ABOUT',
    shortTitle: 'Delivery & Return Policy',
    title: 'B2C Delivery & Frozen Bread Return Policy',
    subtitle: 'Transparent cold-chain shipping, replacement, and refund rules at Cobi Bread',
    updatedAt: 'Updated 2025–2026',
    sections: [
      {
        heading: '1. B2C Shipping Methods',
        bullets: [
          'Method: Express delivery / dedicated temperature-controlled cold shipping.',
          'Coverage: Nationwide across Vietnam.',
          'Shipping Fee: Calculated dynamically by delivery zone at checkout.',
          'Estimated Transit Time: 3 – 7 business days (excluding weekends & force majeure events).',
        ],
        note: 'Note: Remote or restricted-access delivery areas may incur an additional courier surcharge. Orders dispatch once payment or order confirmation is completed under appropriate cold packaging.',
      },
      {
        heading: '2. Product Replacement Policy (Frozen Bakery Items)',
        paragraphs: ['2.1. Eligible Replacement Cases:'],
        bullets: [
          'Transit damage (crushed packaging, torn vacuum seal, severe thawing).',
          'Manufacturing defect (spoilage, unusual moisture, mold, wrong flavor, or deformed item).',
        ],
      },
      {
        heading: '2.2. Conditions & Return Packaging Requirements',
        bullets: [
          'Please contact Customer Care within 7 days from confirmed delivery.',
          'Customers must provide unboxing photos or continuous unboxing video proving the defect upon arrival.',
          'Without clear photo/video evidence of the unopened parcel condition, Cobi Bread reserves the right to decline replacement claims.',
          'Returned frozen goods must stay frozen (-18°C), retain original packaging and insulated accessories (cooler bags/foam boxes), and be photographed prior to courier handover.',
        ],
      },
      {
        heading: '3. Returns & Refunds',
        paragraphs: [
          'Applies to thawed/damaged shipments, wrong SKU or wrong quantity dispatched, or major variance from online descriptions (minor batch packaging label updates excluded).',
        ],
        bullets: [
          'Claim Window: Within 7 days of receipt with unboxing video/photo documentation.',
          'Condition: Product must remain sealed, kept frozen, and returned with all thermal liners/packaging.',
        ],
      },
    ],
    contactBox: {
      company: 'COBI INTERNATIONAL CO., LTD',
      address: 'Cobi Bread Tower — 69 Hoang Van Thai, Tan Phu Ward, District 7, Ho Chi Minh City',
      phone: '03 567 567 20',
      email: 'cobionline@cobione.com',
      hotline: '0909 459 387',
    },
  },
  {
    slug: 'chinh-sach-kiem-hang',
    group: 'ABOUT',
    shortTitle: 'Goods Inspection Policy',
    title: 'Order Inspection Policy',
    subtitle: 'Customer co-inspection guidelines upon parcel arrival from Cobi Bread',
    updatedAt: 'Updated 2025–2026',
    sections: [
      {
        heading: '1. Definition',
        paragraphs: [
          'Order inspection allows customers to verify and compare the physical items delivered by cobibread.com against their confirmed order invoice.',
        ],
      },
      {
        heading: '2. Inspection Timing',
        paragraphs: [
          'Customers may inspect parcels directly with the courier upon delivery or within 30 minutes after receiving the shipment.',
          'If any discrepancy is discovered shortly after handover, please reach out promptly to Customer Care for return/exchange assistance.',
        ],
        note: 'Tip: Recording an unboxing video helps ensure fast verification and resolution whenever discrepancies occur.',
      },
      {
        heading: '3. Inspection Scope',
        bullets: [
          'Verify item quantities, SKU names, and recipient details against the packing slip.',
          'Inspect outer visual condition and packaging appearance matching the product listing.',
          'Do not break tamper-evident security seals or scratch promotional reward codes prior to accepting.',
          'Do not open or consume disputed items while an inspection ticket is under review.',
        ],
      },
      {
        heading: '4. Resolving Discrepancies',
        paragraphs: [
          'If items do not match your order upon inspection, please call Hotline 03 567 567 20 immediately to verify details with our support desk.',
          'Where cobibread.com packed an incorrect order, customers may refuse delivery without payment or request an immediate replacement / full refund if prepaid.',
        ],
      },
      {
        heading: '5. Complaints & Support Desk',
        paragraphs: [
          'All inspection inquiries are handled directly via Customer Care Hotline 03 567 567 20 or email cobionline@cobione.com.',
        ],
      },
    ],
    contactBox: {
      company: 'COBI BREAD CUSTOMER CARE',
      address: '69 Hoang Van Thai, Tan Phu Ward, District 7, Ho Chi Minh City',
      phone: '03 567 567 20',
      email: 'cobionline@cobione.com',
      hotline: '03 567 567 20',
    },
  },
  {
    slug: 'dieu-khoan-dieu-kien',
    group: 'ABOUT',
    shortTitle: 'Terms & Conditions',
    title: 'Terms & Conditions of Use',
    subtitle: 'Ordering, pricing, shipping, cancellation, returns, and dispute resolution rules on cobibread.com',
    updatedAt: 'Updated 2025–2026',
    sections: [
      {
        heading: '1. Overview',
        paragraphs: [
          'These Terms & Conditions govern the relationship between COBI International Co., Ltd (“Cobi Bread”, “We”) and any customer browsing or purchasing products through http://cobibread.com/.',
          'Continued use of the Website signifies your full acceptance of the most current posted Terms & Conditions.',
        ],
      },
      {
        heading: '2. Ordering & Product Descriptions',
        paragraphs: [
          'Customers add items to Cart, verify contact details, item counts, and totals before confirming submission. Confirmation will be sent via phone, SMS, or email depending on stock availability.',
          'Weights and dimensions are carefully measured approximations; colors may vary slightly depending on screen calibration.',
        ],
      },
      {
        heading: '3. Pricing & Payment',
        paragraphs: [
          'Listed prices include applicable taxes (VAT) but exclude shipping fees unless specified by promotional offers. Exact shipping charges appear at Checkout.',
          'Cash on Delivery (COD) and supported methods must be validated prior to parcel dispatch.',
        ],
      },
      {
        heading: '4. Shipping & Order Cancellation',
        bullets: [
          'Standard processing lead time: ~5 business days for inner-city orders and ~7 business days for outer provinces (excluding weekends), subject to traffic or weather conditions.',
          'Cancellation: Customers may request cancellation within 24 hours via Hotline 035 675 6720 and email cobionline@cobione.com.',
          'Canceling within 1 hour of confirmation (prior to warehouse dispatch) receives a 100% refund.',
          'Cancellations requested after dispatch will deduct incurred courier, handling, and packaging costs.',
        ],
      },
      {
        heading: '5. Return & Exchange Rules',
        bullets: [
          'Eligible claims: transit spoilage/thawing, incorrect items or quantities delivered. Must be reported within 24 hours of receipt.',
          'One-time exchange eligible within 7 days of delivery with intact original packaging and thermal accessories.',
          'Option 1 — Exchange in person at a Cobi Bread store with original receipt.',
          'Option 2 — Return by courier to Cobi Bread Tower – 69 Hoang Van Thai, Tan Phu Ward, District 7, Ho Chi Minh City.',
          'Approved refunds are processed within 14 – 20 days after returned goods pass quality inspection.',
        ],
      },
      {
        heading: '6. Intellectual Property & Accounts',
        paragraphs: [
          'All trademarks, product photography, layouts, and content belong exclusively to Cobi International Co., Ltd. Unauthorized commercial scraping, mirroring, or redistribution is strictly prohibited.',
          'Customers are responsible for maintaining account password security. Fraudulent orders, promo abuse, or accounts inactive over 2 years may be suspended.',
        ],
      },
      {
        heading: '7. Force Majeure & Liability',
        paragraphs: [
          'We are not liable for delays caused by Force Majeure events (natural disasters, floods, pandemics, power or telecom disruptions). Once resolved, Cobi Bread will coordinate rescheduled delivery or suitable remedies.',
        ],
      },
      {
        heading: '8. Dispute Resolution & Governing Law',
        paragraphs: [
          'Disputes are resolved amicably first via Customer Care (cobionline@cobione.com — 03 567 567 20). Unresolved matters fall under arbitration at the Vietnam International Arbitration Centre (VIAC) in Ho Chi Minh City pursuant to Vietnamese law.',
        ],
      },
    ],
    contactBox: {
      company: 'COBI INTERNATIONAL CO., LTD',
      address:
        'Room 1602, 16th Floor, Cobi Tower II, No. 2-4 Street No. 8, Tan Phu Ward, District 7, Ho Chi Minh City',
      phone: '028 5411 1550',
      email: 'cobionline@cobione.com',
      hotline: '03 567 567 20',
    },
  },
  {
    slug: 'phan-dinh-trach-nhiem',
    group: 'ABOUT',
    shortTitle: 'Merchant & Logistics Responsibilities',
    title: 'Delineation of Responsibilities Between Merchant & Logistics Providers',
    subtitle: 'Rights, duties, and cargo documentation obligations during transport & handover',
    updatedAt: 'Updated 2025–2026',
    sections: [
      {
        heading: '1. Obligations of the Carrier (Logistics Provider)',
        bullets: [
          'Ensure goods are transported intact, safely, and delivered to the designated destination on time.',
          'Hand over goods strictly to the authorized recipient.',
          'Bear transport-related costs unless otherwise agreed.',
          'Maintain statutory civil liability insurance as required by law.',
          'Compensate the shipper for goods lost or damaged during transit, unless otherwise exempted by agreement or law.',
        ],
      },
      {
        heading: '2. Rights of the Carrier',
        bullets: [
          'Verify the authenticity of shipped goods, waybills, and accompanying shipping documentation.',
          'Refuse carriage of goods inconsistent with contractual descriptions.',
          'Require timely payment of agreed freight charges.',
          'Refuse carriage of prohibited, hazardous, or unsafe items lacking proper cold/safety containment.',
        ],
      },
      {
        heading: '3. Obligations of the Shipper (Merchant)',
        bullets: [
          'Pay freight charges in full on schedule per agreed payment terms.',
          'Provide accurate cargo details and required shipping documentation (delivery notes, VAT invoices, cold-chain handling instructions) to safeguard shipments.',
          'Supervise goods in transit if specifically contracted to do so.',
        ],
      },
      {
        heading: '4. Rights of the Shipper',
        bullets: [
          'Require the carrier to transport parcels to the exact agreed destination and timeframe.',
          'Receive returned cargo directly or designate an authorized third party.',
        ],
      },
      {
        heading: '5. Liability for Loss or Damage',
        bullets: [
          'The carrier is liable for loss or physical deterioration occurring during transit.',
          'The shipper is liable for damage caused by hazardous or improperly packaged cargo undisclosed to the carrier.',
          'Force majeure exemptions apply per prevailing commercial transport legislation.',
        ],
      },
    ],
    contactBox: {
      company: 'COBI INTERNATIONAL CO., LTD',
      address:
        'Room 1602, 16th Floor, Cobi Tower II, No. 2-4 Street No. 8, Tan Phu Ward, District 7, Ho Chi Minh City',
      phone: '028 5411 1550',
      email: 'cobionline@cobione.com',
      hotline: '03 567 567 20',
    },
  },
  {
    slug: 'tu-van-lap-dat-bep-cong-nghiep',
    group: 'SERVICE',
    shortTitle: 'Commercial Kitchen Consulting',
    title: 'Commercial Kitchen & Bakery Setup Consulting (Cobi Home x Cobi Bread)',
    subtitle: 'Turnkey kitchen layout design, ovens, espresso gear & F&B operational support',
    updatedAt: 'COBI GROUP Ecosystem',
    sections: [
      {
        heading: '1. Smart Technology Kitchen for Effortless Operations',
        paragraphs: [
          'Backed by over 5,000 professional machines, utensils, and packaging assets under COBI GROUP, COBI HOME x COBI BREAD delivers complete design, equipment sourcing, and installation packages for bakeries, specialty cafes, restaurants, and hotels (Ho.Re.Ca).',
        ],
        bullets: [
          'Ergonomic bar & bakery layout planning covering convection baking zones and chill/freeze displays.',
          'Synchronized supply of spiral dough mixers, commercial ovens, proofers, pastry chillers, ice makers, and espresso machines.',
          'Compact speed-oven & heavy-duty air fryer setups optimized for take-away Pocket Toast and Frozen Dough menus.',
        ],
      },
      {
        heading: '2. Hands-On Bakery Academy Training & Compliance',
        paragraphs: [
          'Beyond hardware delivery, Cobi Bread Bakery Academy provides staff training covering thawing curves, egg-wash finishing, oven timing, and HACCP / ISO 22000 food safety compliance.',
        ],
      },
    ],
    attachments: [
      {
        title: 'Total Bakery Solutions Ecosystem Diagram',
        image: '/cobi/introduce/Asset-11@4x-8-1.png',
        caption: 'Integrating Ho.Re.Ca hardware, Bakery Academy training, interior design & licensing',
        isDiagram: true,
      },
      {
        title: 'Cobi Home & Cobi Bread Integrated Showcase Booth',
        image: '/cobi/news/new2/BAKERY_1.png',
        caption: 'Turnkey commercial kitchen & pastry solution presented at Coffee Expo Vietnam',
      },
    ],
    contactBox: {
      company: 'COBI HOME x COBI BREAD B2B SOLUTIONS',
      address: '69 Hoang Van Thai, Tan Phu Ward, District 7, Ho Chi Minh City',
      phone: '0909 459 387 (HCMC) • 0982 219 841 (Hanoi)',
      email: 'Exportsales@cobione.com',
      hotline: '0909 459 387',
    },
  },
  {
    slug: 'chinh-sach-bao-hanh',
    group: 'SERVICE',
    shortTitle: 'Warranty Policy',
    title: 'Warranty & Quality Assurance Policy',
    subtitle: 'Product freshness guarantees and commercial kitchen equipment support for B2B partners',
    updatedAt: 'Updated 2025–2026',
    sections: [
      {
        heading: '1. Fresh & Frozen Bakery Product Quality Guarantee',
        bullets: [
          'Every fresh loaf (0–10°C) and deep-frozen dough item (-18°C) undergoes strict Central Kitchen QC aligned with BRCGS Issue 9, FSSC 22000 Version 6, and HACCP CODEX.',
          '1-for-1 replacement or 100% refund applies for verified manufacturing defects, premature spoilage, or transit thawing (eligible within 7 days of delivery with photo/video unboxing proof).',
        ],
      },
      {
        heading: '2. Commercial Equipment & Hardware Warranty (Cobi Home B2B)',
        bullets: [
          'Ovens, mixers, display freezers, and espresso systems supplied through COBI GROUP carry genuine manufacturer warranty coverage and scheduled maintenance support.',
          'Dedicated technicians provide rapid troubleshooting and genuine spare parts to prevent retail downtime.',
        ],
      },
      {
        heading: '3. Warranty Service Desk',
        paragraphs: [
          'Retail shoppers and B2B clients can reach our Warranty & Customer Care Desk at 03 567 567 20, B2B Hotline (HCMC) 0909 459 387, or Hanoi Hotline 0982 219 841.',
        ],
      },
    ],
    contactBox: {
      company: 'COBI WARRANTY & SUPPORT CENTER',
      address: 'Room 1602, 16th Floor, Cobi Tower II, No. 2-4 Street No. 8, District 7, HCMC',
      phone: '028 5411 1550 • 03 567 567 20',
      email: 'cobionline@cobione.com',
      hotline: '0909 459 387',
    },
  },
];

export function getLocalizedPoliciesData(locale: Locale): PolicyDocument[] {
  return locale === 'en' ? POLICIES_DATA_EN : POLICIES_DATA;
}
