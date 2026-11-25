'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { 
  Store, 
  MapPin, 
  ChevronDown, 
  LogOut, 
  ShieldCheck, 
  Building2, 
  ShoppingBag, 
  Menu as MenuIcon, 
  X, 
  Search, 
  Phone, 
  FileText, 
  ExternalLink, 
  Globe, 
  Sparkles,
  Layers,
  ArrowRight,
  Briefcase
} from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import { useBranchStore } from '@/stores/branch.store';
import { useCartStore } from '@/stores/cart.store';
import { branchesApi, categoriesApi } from '@/lib/api';
import { Branch, Category } from '@/types';

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { selectedBranch, setSelectedBranch, setBranches } = useBranchStore();
  const { openCart, getTotalItems } = useCartStore();

  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [lang, setLang] = useState<'VI' | 'EN'>('VI');
  const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch branches
  const { data: branches = [] } = useQuery<Branch[]>({
    queryKey: ['branches'],
    queryFn: branchesApi.getBranches,
  });

  // Fetch categories
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: categoriesApi.getAll,
  });

  // Sync branches
  useEffect(() => {
    if (branches.length > 0) {
      setBranches(branches);
      if (!selectedBranch) {
        const defaultBranch = branches.find((b) => b.id === user?.branchId) || branches[0];
        setSelectedBranch(defaultBranch);
      }
    }
  }, [branches, selectedBranch, user?.branchId, setBranches, setSelectedBranch]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const totalCartItems = mounted ? getTotalItems() : 0;

  // 9 Categories list matching exactly with website
  const categoryIconsMap: Record<string, string> = {
    'banh-mi-kem-tuoi': '❄️',
    'banh-pocket-toast': '🥪',
    'banh-bong-lan-sua': '🍰',
    'banh-mi-dong-lanh-b2c': '🧊',
    'banh-mi-dong-lanh-b2b': '📦',
    'snack-banh-quy': '🍪',
    'banh-mi-que': '🥖',
    'set-qua-tang': '🎁',
    'cac-loai-banh-khac': '🥐',
  };

  return (
    <>
      {/* ========================================================
          1. TOPBAR MẢNH (Nền Nâu Espresso #231812, Chữ Kem #FAF7F2)
         ======================================================== */}
      <div className="bg-[#231812] text-[#FAF7F2] text-xs py-2 px-4 border-b border-stone-800 z-40 relative">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
          
          {/* Left: Customer Service Hotline */}
          <div className="flex items-center gap-2 text-stone-300 text-[11px] sm:text-xs">
            <Phone className="w-3.5 h-3.5 text-[#C67C3B] shrink-0" />
            <span className="font-medium">Hotline CSKH:</span>
            <a href="tel:0909459387" className="hover:text-white transition-colors">
              (HCM) <strong className="text-white">0909 459 387</strong>
            </a>
            <span className="text-stone-600">|</span>
            <a href="tel:0982219841" className="hover:text-white transition-colors">
              (HN) <strong className="text-white">0982 219 841</strong>
            </a>
          </div>

          {/* Right: E-Catalogue, Cobi Mall, Language Toggle, Branch Selector */}
          <div className="flex items-center gap-3 sm:gap-4 text-[11px] sm:text-xs">
            
            {/* E-Catalogue */}
            <a
              href="https://cobibread.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-1 text-stone-300 hover:text-white transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-[#C67C3B]" />
              <span>E-Catalogue</span>
            </a>

            {/* Cobi Mall */}
            <a
              href="https://cobimall.vn"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1 text-stone-300 hover:text-white transition-colors"
            >
              <span>Cobi Mall</span>
              <ExternalLink className="w-3 h-3 text-stone-500" />
            </a>

            <span className="hidden sm:inline text-stone-700">|</span>

            {/* Language Selector VI | EN */}
            <div className="inline-flex items-center bg-stone-900 rounded-lg p-0.5 border border-stone-800">
              <button
                type="button"
                onClick={() => setLang('VI')}
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                  lang === 'VI' ? 'bg-[#C67C3B] text-white shadow-2xs' : 'text-stone-400 hover:text-white'
                }`}
              >
                VI
              </button>
              <button
                type="button"
                onClick={() => setLang('EN')}
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                  lang === 'EN' ? 'bg-[#C67C3B] text-white shadow-2xs' : 'text-stone-400 hover:text-white'
                }`}
              >
                EN
              </button>
            </div>

            <span className="text-stone-700">|</span>

            {/* Branch Selector Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsBranchDropdownOpen(!isBranchDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-900/90 hover:bg-stone-800 border border-stone-700/80 text-amber-200 text-[11px] font-semibold transition-all"
              >
                <MapPin className="w-3 h-3 text-[#C67C3B] shrink-0" />
                <span className="truncate max-w-[140px] sm:max-w-[180px]">
                  {selectedBranch ? selectedBranch.name : 'Chọn chi nhánh'}
                </span>
                <ChevronDown className="w-3 h-3 text-stone-400" />
              </button>

              {isBranchDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsBranchDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white border border-stone-200 text-stone-800 shadow-2xl z-50 py-2 overflow-hidden">
                    <div className="px-3.5 py-2 border-b border-stone-100 flex items-center justify-between text-[11px] font-bold text-stone-500 uppercase">
                      <span>Chọn chi nhánh phục vụ</span>
                      <Link href="/stores" onClick={() => setIsBranchDropdownOpen(false)} className="text-[#C67C3B] hover:underline">
                        5 Cửa hàng
                      </Link>
                    </div>
                    {branches.map((b) => (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => {
                          setSelectedBranch(b);
                          setIsBranchDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 flex items-start gap-2.5 hover:bg-amber-50/70 transition-colors ${
                          selectedBranch?.id === b.id ? 'bg-amber-50 font-bold text-amber-950' : 'text-stone-700'
                        }`}
                      >
                        <MapPin className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${
                          selectedBranch?.id === b.id ? 'text-[#C67C3B]' : 'text-stone-400'
                        }`} />
                        <div className="min-w-0">
                          <p className="text-xs font-bold leading-tight">{b.name}</p>
                          <p className="text-[11px] text-stone-500 truncate mt-0.5">{b.address}, {b.city}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          2. MAIN NAVBAR (Sticky, Glassmorphism on scroll)
         ======================================================== */}
      <header className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled 
          ? 'glass-header border-b border-stone-200/80 shadow-md py-2.5' 
          : 'bg-[#FAF7F2] border-b border-stone-200/60 py-3.5'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            
            {/* Left: Brand Logo */}
            <Link href="/" className="flex items-center gap-3 group shrink-0">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#C67C3B] to-[#231812] flex items-center justify-center text-white shadow-md shadow-[#C67C3B]/20 group-hover:scale-105 transition-transform duration-300">
                <Store className="w-6 h-6" />
              </div>
              <div>
                <span className="text-2xl font-black tracking-tight text-[#231812] group-hover:text-[#C67C3B] transition-colors font-display">
                  COBI <span className="text-[#C67C3B]">BREAD</span>
                </span>
                <p className="text-[9px] font-bold text-[#8D501B] tracking-widest -mt-1 uppercase">
                  Bánh Ngon Nhất Là Bánh Mới Ra Lò
                </p>
              </div>
            </Link>

            {/* Center: Desktop Navigation & Mega-menu */}
            <nav className="hidden lg:flex items-center gap-1 font-semibold text-xs sm:text-sm text-[#231812]">
              
              {/* Mega-menu Menu (Danh mục bánh) */}
              <div 
                className="relative"
                onMouseEnter={() => setIsMegaMenuOpen(true)}
                onMouseLeave={() => setIsMegaMenuOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
                  className={`flex items-center gap-1 px-3.5 py-2 rounded-xl transition-all ${
                    pathname.startsWith('/products') 
                      ? 'text-[#C67C3B] font-bold bg-[#FAF7F2] shadow-2xs' 
                      : 'hover:text-[#C67C3B] hover:bg-stone-100/70'
                  }`}
                >
                  <Layers className="w-4 h-4 text-[#C67C3B]" />
                  <span>Menu</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isMegaMenuOpen ? 'rotate-180 text-[#C67C3B]' : 'text-stone-400'}`} />
                </button>

                {/* Mega-menu Dropdown Container */}
                {isMegaMenuOpen && (
                  <div className="absolute left-0 mt-1 w-[460px] bg-white rounded-3xl border border-stone-200 shadow-2xl p-5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-100">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-[#231812] flex items-center gap-1.5">
                          9 Danh Mục Sản Phẩm Cobi Bread
                        </span>
                        <p className="text-[11px] text-stone-500">Bánh nướng thủ công & Cấp đông sâu</p>
                      </div>
                      <Link 
                        href="/products" 
                        onClick={() => setIsMegaMenuOpen(false)}
                        className="text-xs text-[#C67C3B] font-bold hover:underline"
                      >
                        Xem tất cả →
                      </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {categories.map((cat) => (
                        <Link
                          key={cat.id}
                          href={`/products?categorySlug=${cat.slug}`}
                          onClick={() => setIsMegaMenuOpen(false)}
                          className="px-3 py-2.5 rounded-2xl text-xs font-medium text-stone-700 hover:bg-amber-50/70 hover:text-[#231812] transition-colors flex items-center gap-2.5 group"
                        >
                          <span className="text-base shrink-0">
                            {categoryIconsMap[cat.slug] || '🥐'}
                          </span>
                          <span className="truncate group-hover:font-bold">{cat.name}</span>
                        </Link>
                      ))}
                    </div>

                    {/* Bottom Mega-menu Action */}
                    <div className="mt-4 pt-3.5 border-t border-stone-100 bg-amber-50/60 -mx-5 -mb-5 p-4 rounded-b-3xl flex items-center justify-between text-xs">
                      <div>
                        <strong className="text-[#231812] block">Cung cấp bánh sỉ số lượng lớn</strong>
                        <span className="text-[11px] text-stone-500">Dành cho chuỗi F&B, quán cafe & khách sạn</span>
                      </div>
                      <Link
                        href="/b2b"
                        onClick={() => setIsMegaMenuOpen(false)}
                        className="px-3.5 py-1.5 rounded-xl bg-[#231812] text-white font-bold text-xs hover:bg-black transition-colors"
                      >
                        Khám phá B2B
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Exact Links: Giới thiệu, Tin tức, Media, Cửa hàng, Chứng chỉ */}
              <Link 
                href="/about" 
                className={`px-3 py-2 rounded-xl transition-colors ${
                  pathname === '/about' ? 'text-[#C67C3B] font-bold bg-[#FAF7F2]' : 'hover:text-[#C67C3B] hover:bg-stone-100/70'
                }`}
              >
                Giới thiệu
              </Link>

              <Link 
                href="/news" 
                className={`px-3 py-2 rounded-xl transition-colors ${
                  pathname === '/news' ? 'text-[#C67C3B] font-bold bg-[#FAF7F2]' : 'hover:text-[#C67C3B] hover:bg-stone-100/70'
                }`}
              >
                Tin tức
              </Link>

              <Link 
                href="/media" 
                className={`px-3 py-2 rounded-xl transition-colors ${
                  pathname === '/media' ? 'text-[#C67C3B] font-bold bg-[#FAF7F2]' : 'hover:text-[#C67C3B] hover:bg-stone-100/70'
                }`}
              >
                Media
              </Link>

              <Link 
                href="/stores" 
                className={`px-3 py-2 rounded-xl transition-colors ${
                  pathname === '/stores' ? 'text-[#C67C3B] font-bold bg-[#FAF7F2]' : 'hover:text-[#C67C3B] hover:bg-stone-100/70'
                }`}
              >
                Cửa hàng
              </Link>

              <Link 
                href="/certificates" 
                className={`px-3 py-2 rounded-xl transition-colors ${
                  pathname === '/certificates' ? 'text-[#C67C3B] font-bold bg-[#FAF7F2]' : 'hover:text-[#C67C3B] hover:bg-stone-100/70'
                }`}
              >
                Chứng chỉ
              </Link>
            </nav>

            {/* Right: Quick Search, Auth, Cart Button */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              
              {/* Quick Search Button */}
              <button
                type="button"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2.5 rounded-xl text-stone-600 hover:text-[#231812] hover:bg-stone-200/50 transition-colors"
                title="Tìm kiếm sản phẩm"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Cart Drawer Trigger */}
              <button
                type="button"
                onClick={openCart}
                className="relative p-2.5 rounded-xl bg-white border border-stone-200 hover:border-[#C67C3B] text-[#231812] hover:text-[#C67C3B] shadow-2xs transition-all flex items-center justify-center"
                title="Giỏ hàng"
              >
                <ShoppingBag className="w-4 h-4" />
                {totalCartItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#C67C3B] text-white text-[10px] font-black flex items-center justify-center shadow-xs">
                    {totalCartItems}
                  </span>
                )}
              </button>

              {/* Auth / Profile Area */}
              {mounted && isAuthenticated && user ? (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-white border border-stone-200 shadow-2xs">
                    <div className="w-7 h-7 rounded-lg bg-[#C67C3B] text-white font-bold flex items-center justify-center text-xs">
                      {user.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div className="hidden xl:block text-left">
                      <p className="text-xs font-bold text-[#231812] leading-tight">
                        {user.fullName}
                      </p>
                      <span className="text-[9px] font-semibold text-stone-500 uppercase">
                        {user.role}
                      </span>
                    </div>
                  </div>

                  {user.role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#231812] text-white hover:bg-black transition-colors"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                      <span className="hidden sm:inline">Admin</span>
                    </Link>
                  )}

                  {user.role === 'BRANCH_MANAGER' && (
                    <Link
                      href="/manager"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#231812] text-white hover:bg-black transition-colors"
                    >
                      <Building2 className="w-3.5 h-3.5 text-blue-400" />
                      <span className="hidden sm:inline">Quản lý</span>
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={handleLogout}
                    title="Đăng xuất"
                    className="p-2 rounded-xl text-stone-400 hover:text-red-700 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : mounted ? (
                <div className="flex items-center gap-1.5">
                  <Link
                    href="/login"
                    className="px-3 py-2 rounded-xl text-xs font-bold text-[#231812] hover:text-[#C67C3B] hover:bg-stone-100 transition-colors"
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    href="/register"
                    className="hidden sm:inline-block px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-[#C67C3B] hover:bg-[#A86224] transition-colors shadow-2xs shadow-[#C67C3B]/20"
                  >
                    Đăng ký
                  </Link>
                </div>
              ) : (
                <div className="w-20 h-8 rounded-xl bg-stone-100 animate-pulse" />
              )}

              {/* Mobile Menu Button */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-stone-700 hover:bg-stone-100"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Quick Search Bar Drawer */}
          {isSearchOpen && (
            <div className="pt-3 pb-1 border-t border-stone-200 mt-2 animate-in fade-in duration-150">
              <form onSubmit={handleSearchSubmit} className="relative max-w-xl mx-auto flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Tìm theo tên bánh mì, Pocket Toast, SKU..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm border border-stone-300 bg-white focus:outline-none focus:border-[#C67C3B]"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-[#C67C3B] hover:bg-[#A86224] text-white font-bold text-xs"
                >
                  Tìm kiếm
                </button>
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="p-2 text-stone-400 hover:text-stone-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* Mobile Drawer Navigation */}
          {isMobileMenuOpen && (
            <div className="lg:hidden border-t border-stone-200 py-4 px-2 space-y-4 bg-white rounded-3xl mt-2 shadow-xl">
              <div className="space-y-1 text-sm font-bold text-[#231812]">
                <Link
                  href="/products"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl hover:bg-amber-50"
                >
                  Thực đơn bánh (9 Danh mục)
                </Link>
                <Link
                  href="/about"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl hover:bg-amber-50"
                >
                  Giới thiệu
                </Link>
                <Link
                  href="/news"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl hover:bg-amber-50"
                >
                  Tin tức & Sự kiện
                </Link>
                <Link
                  href="/media"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl hover:bg-amber-50"
                >
                  Media & Video xưởng
                </Link>
                <Link
                  href="/stores"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl hover:bg-amber-50"
                >
                  Hệ thống 5 cửa hàng
                </Link>
                <Link
                  href="/certificates"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl hover:bg-amber-50"
                >
                  Chứng chỉ chất lượng (ISO / HACCP)
                </Link>
                <Link
                  href="/b2b"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl text-blue-800 bg-blue-50/70"
                >
                  Bán sỉ & Khách hàng B2B
                </Link>
              </div>

              {/* Mobile Language & Branches */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs px-2">
                <span className="text-stone-500 font-semibold">Ngôn ngữ:</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setLang('VI')}
                    className={`px-3 py-1 rounded-lg font-bold ${lang === 'VI' ? 'bg-[#231812] text-white' : 'bg-stone-100'}`}
                  >
                    Tiếng Việt (VI)
                  </button>
                  <button
                    onClick={() => setLang('EN')}
                    className={`px-3 py-1 rounded-lg font-bold ${lang === 'EN' ? 'bg-[#231812] text-white' : 'bg-stone-100'}`}
                  >
                    English (EN)
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
