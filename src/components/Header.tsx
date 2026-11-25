'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { 
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
  Layers,
  ClipboardList
} from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import { useBranchStore } from '@/stores/branch.store';
import { useCartStore } from '@/stores/cart.store';
import { branchesApi, categoriesApi } from '@/lib/api';
import { Branch, Category } from '@/types';
import { BRAND_ASSETS, getCategoryThumbnail } from '@/data/cobi-content';
import {
  useTranslation,
  getLocalizedBranchName,
  getLocalizedBranchAddress,
  getLocalizedBranchCity,
  getLocalizedCategoryName,
} from '@/i18n';

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { selectedBranch, setSelectedBranch, setBranches } = useBranchStore();
  const { openCart, getTotalItems } = useCartStore();
  const { t, locale, setLocale } = useTranslation();

  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch branches
  const { data: branches = [] } = useQuery<Branch[]>({
    queryKey: ['branches', locale],
    queryFn: () => branchesApi.getBranches(locale),
  });

  // Fetch categories
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['categories', locale],
    queryFn: () => categoriesApi.getAll(locale),
  });

  // Sync branches & refresh selectedBranch metadata on locale change
  useEffect(() => {
    if (branches.length > 0) {
      setBranches(branches);
      if (!selectedBranch) {
        const defaultBranch = branches.find((b) => b.id === user?.branchId) || branches[0];
        setSelectedBranch(defaultBranch);
      } else {
        const refreshed = branches.find((b) => b.id === selectedBranch.id);
        if (
          refreshed &&
          (refreshed.name !== selectedBranch.name ||
            refreshed.nameEn !== selectedBranch.nameEn ||
            refreshed.address !== selectedBranch.address ||
            refreshed.addressEn !== selectedBranch.addressEn)
        ) {
          setSelectedBranch(refreshed);
        }
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
  const activeBranch = mounted ? selectedBranch : null;

  return (
    <>
      {/* ========================================================
          1. TOPBAR MẢNH (Nền Nâu Espresso #231812, Chữ Kem #FAF7F2)
         ======================================================== */}
      <div className="bg-[#231812] text-[#FAF7F2] text-xs py-2 px-4 border-b border-stone-800 z-40 relative">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
          
          {/* Left: Customer Service Hotline */}
          <div className="flex items-center gap-2 text-stone-300 text-[11px] sm:text-xs">
            <Phone className="w-3.5 h-3.5 text-[#F37021] shrink-0" />
            <span className="font-medium">{t.common.hotlineCS}</span>
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
              href={BRAND_ASSETS.flipbookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-1 text-stone-300 hover:text-white transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-[#F37021]" />
              <span>{t.common.eCatalogue}</span>
            </a>

            {/* Cobi Mall */}
            <a
              href="https://cobimall.vn"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1 text-stone-300 hover:text-white transition-colors"
            >
              <span>{t.common.cobiMall}</span>
              <ExternalLink className="w-3 h-3 text-stone-500" />
            </a>

            <span className="hidden sm:inline text-stone-700">|</span>

            {/* Language Selector VI | EN */}
            <div
              className="inline-flex items-center bg-stone-900 rounded-lg p-0.5 border border-stone-800"
              role="group"
              aria-label="Language switcher"
            >
              <button
                type="button"
                onClick={() => setLocale('vi')}
                aria-pressed={locale === 'vi'}
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                  locale === 'vi'
                    ? 'bg-[#F37021] text-white shadow-2xs'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                VI
              </button>
              <button
                type="button"
                onClick={() => setLocale('en')}
                aria-pressed={locale === 'en'}
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                  locale === 'en'
                    ? 'bg-[#F37021] text-white shadow-2xs'
                    : 'text-stone-400 hover:text-white'
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
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-900/90 hover:bg-stone-800 border border-stone-700/80 text-amber-200 text-[11px] font-semibold transition-all cursor-pointer"
              >
                <MapPin className="w-3 h-3 text-[#F37021] shrink-0" />
                <span className="truncate max-w-[140px] sm:max-w-[180px]">
                  {activeBranch ? getLocalizedBranchName(activeBranch, locale) : t.common.selectBranch}
                </span>
                <ChevronDown className="w-3 h-3 text-stone-400" />
              </button>

              {isBranchDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsBranchDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white border border-stone-200 text-stone-800 shadow-2xl z-50 py-2 overflow-hidden">
                    <div className="px-3.5 py-2 border-b border-stone-100 flex items-center justify-between text-[11px] font-bold text-stone-500 uppercase">
                      <span>{t.common.chooseServingBranch}</span>
                      <Link
                        href="/stores"
                        onClick={() => setIsBranchDropdownOpen(false)}
                        className="text-[#F37021] hover:underline"
                      >
                        {t.common.fiveStores}
                      </Link>
                    </div>
                    {branches.map((b) => {
                      const branchDisplayName = getLocalizedBranchName(b, locale);
                      const branchDisplayAddress = getLocalizedBranchAddress(b, locale);
                      const branchDisplayCity = getLocalizedBranchCity(b, locale);
                      return (
                        <button
                          key={b.id}
                          type="button"
                          onClick={() => {
                            setSelectedBranch(b);
                            setIsBranchDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 flex items-start gap-2.5 hover:bg-orange-50/70 transition-colors cursor-pointer ${
                            activeBranch?.id === b.id
                              ? 'bg-orange-50 font-bold text-[#231812]'
                              : 'text-stone-700'
                          }`}
                        >
                          <MapPin
                            className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${
                              activeBranch?.id === b.id ? 'text-[#F37021]' : 'text-stone-400'
                            }`}
                          />
                          <div className="min-w-0">
                            <p className="text-xs font-bold leading-tight">{branchDisplayName}</p>
                            <p className="text-[11px] text-stone-500 truncate mt-0.5">
                              {branchDisplayAddress}, {branchDisplayCity}
                            </p>
                          </div>
                        </button>
                      );
                    })}
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
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'glass-header border-b border-stone-200/80 shadow-md py-2.5'
            : 'bg-[#FAF7F2] border-b border-stone-200/60 py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            
            {/* Left: Official Logo COBI BREAD */}
            <Link href="/" className="flex items-center group shrink-0">
              <img
                src={BRAND_ASSETS.logo}
                alt="COBI BREAD Bakery Cafe"
                className="h-9 sm:h-11 w-auto object-contain group-hover:scale-[1.03] transition-transform duration-200"
              />
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
                  className={`flex items-center gap-1 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                    pathname.startsWith('/products')
                      ? 'text-[#F37021] font-bold bg-white shadow-2xs'
                      : 'hover:text-[#F37021] hover:bg-stone-100/70'
                  }`}
                >
                  <Layers className="w-4 h-4 text-[#F37021]" />
                  <span>{t.common.menu}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      isMegaMenuOpen ? 'rotate-180 text-[#F37021]' : 'text-stone-400'
                    }`}
                  />
                </button>

                {/* Mega-menu Dropdown Container */}
                {isMegaMenuOpen && (
                  <div className="absolute left-0 mt-1 w-[540px] bg-white rounded-3xl border border-stone-200 shadow-2xl p-5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-100">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-[#231812] flex items-center gap-1.5">
                          {t.header.megaTitle}
                        </span>
                        <p className="text-[11px] text-stone-500">{t.header.megaSubtitle}</p>
                      </div>
                      <Link
                        href="/products"
                        onClick={() => setIsMegaMenuOpen(false)}
                        className="text-xs text-[#F37021] font-bold hover:underline"
                      >
                        {t.common.viewAll} →
                      </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      {categories.map((cat) => {
                        const displayName = getLocalizedCategoryName(cat, locale);
                        return (
                          <Link
                            key={cat.id}
                            href={`/products?categorySlug=${cat.slug}`}
                            onClick={() => setIsMegaMenuOpen(false)}
                            className="p-2 rounded-2xl text-xs font-medium text-stone-700 hover:bg-orange-50/70 hover:text-[#231812] transition-colors flex items-center gap-3 group"
                          >
                            <img
                              src={getCategoryThumbnail(cat.slug, cat.name)}
                              alt={displayName}
                              className="w-12 h-12 rounded-lg object-cover shrink-0 border border-black/5 group-hover:scale-105 transition-transform duration-300 bg-stone-100"
                            />
                            <div className="min-w-0">
                              <span className="block font-semibold text-[#231812] group-hover:text-[#F37021] transition-colors line-clamp-2 leading-snug">
                                {displayName}
                              </span>
                            </div>
                          </Link>
                        );
                      })}
                    </div>

                    {/* Bottom Mega-menu Action */}
                    <div className="mt-4 pt-3.5 border-t border-stone-100 bg-orange-50/60 -mx-5 -mb-5 p-4 rounded-b-3xl flex items-center justify-between text-xs">
                      <div>
                        <strong className="text-[#231812] block">{t.header.megaB2bTitle}</strong>
                        <span className="text-[11px] text-stone-500">{t.header.megaB2bSubtitle}</span>
                      </div>
                      <Link
                        href="/b2b"
                        onClick={() => setIsMegaMenuOpen(false)}
                        className="px-3.5 py-1.5 rounded-xl bg-[#231812] text-white font-bold text-xs hover:bg-[#F37021] transition-colors"
                      >
                        {t.header.exploreB2b}
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation links */}
              <Link
                href="/about"
                className={`px-3 py-2 rounded-xl transition-colors ${
                  pathname === '/about'
                    ? 'text-[#F37021] font-bold bg-white shadow-2xs'
                    : 'hover:text-[#F37021] hover:bg-stone-100/70'
                }`}
              >
                {t.common.about}
              </Link>

              <Link
                href="/news"
                className={`px-3 py-2 rounded-xl transition-colors ${
                  pathname.startsWith('/news')
                    ? 'text-[#F37021] font-bold bg-white shadow-2xs'
                    : 'hover:text-[#F37021] hover:bg-stone-100/70'
                }`}
              >
                {t.common.news}
              </Link>

              <Link
                href="/media"
                className={`px-3 py-2 rounded-xl transition-colors ${
                  pathname === '/media'
                    ? 'text-[#F37021] font-bold bg-white shadow-2xs'
                    : 'hover:text-[#F37021] hover:bg-stone-100/70'
                }`}
              >
                {t.common.media}
              </Link>

              <Link
                href="/stores"
                className={`px-3 py-2 rounded-xl transition-colors ${
                  pathname === '/stores'
                    ? 'text-[#F37021] font-bold bg-white shadow-2xs'
                    : 'hover:text-[#F37021] hover:bg-stone-100/70'
                }`}
              >
                {t.common.stores}
              </Link>

              <Link
                href="/certificates"
                className={`px-3 py-2 rounded-xl transition-colors ${
                  pathname === '/certificates'
                    ? 'text-[#F37021] font-bold bg-white shadow-2xs'
                    : 'hover:text-[#F37021] hover:bg-stone-100/70'
                }`}
              >
                {t.common.certificates}
              </Link>
            </nav>

            {/* Right: Quick Search, Orders, Cart, Auth */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              
              {/* Quick Search Button */}
              <button
                type="button"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2.5 rounded-xl text-stone-600 hover:text-[#231812] hover:bg-stone-200/50 transition-colors cursor-pointer"
                title={t.common.searchBtn}
                aria-label={t.common.searchBtn}
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Account Orders Shortcut */}
              <Link
                href="/account/orders"
                className={`p-2.5 rounded-xl bg-white border transition-all flex items-center justify-center shadow-2xs ${
                  pathname === '/account/orders'
                    ? 'border-[#F37021] text-[#F37021]'
                    : 'border-stone-200 text-[#231812] hover:border-[#F37021] hover:text-[#F37021]'
                }`}
                title={t.common.orders}
                aria-label={t.common.orders}
              >
                <ClipboardList className="w-4 h-4" />
              </Link>

              {/* Cart Drawer Trigger */}
              <button
                type="button"
                onClick={openCart}
                className="relative p-2.5 rounded-xl bg-white border border-stone-200 hover:border-[#F37021] text-[#231812] hover:text-[#F37021] shadow-2xs transition-all flex items-center justify-center cursor-pointer"
                title={t.common.cart}
                aria-label={t.common.cart}
              >
                <ShoppingBag className="w-4 h-4" />
                {totalCartItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#F37021] text-white text-[10px] font-black flex items-center justify-center shadow-xs">
                    {totalCartItems}
                  </span>
                )}
              </button>

              {/* Auth / Profile Area */}
              {mounted && isAuthenticated && user ? (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-white border border-stone-200 shadow-2xs">
                    <div className="w-7 h-7 rounded-lg bg-[#F37021] text-white font-bold flex items-center justify-center text-xs">
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
                      <ShieldCheck className="w-3.5 h-3.5 text-[#F37021]" />
                      <span className="hidden sm:inline">{t.common.admin}</span>
                    </Link>
                  )}

                  {user.role === 'BRANCH_MANAGER' && (
                    <Link
                      href="/manager"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#231812] text-white hover:bg-black transition-colors"
                    >
                      <Building2 className="w-3.5 h-3.5 text-blue-400" />
                      <span className="hidden sm:inline">{t.common.manager}</span>
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={handleLogout}
                    title={t.common.logout}
                    aria-label={t.common.logout}
                    className="p-2 rounded-xl text-stone-400 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : mounted ? (
                <div className="flex items-center gap-1.5">
                  <Link
                    href="/login"
                    className="px-3 py-2 rounded-xl text-xs font-bold text-[#231812] hover:text-[#F37021] hover:bg-stone-100 transition-colors"
                  >
                    {t.common.login}
                  </Link>
                  <Link
                    href="/register"
                    className="hidden sm:inline-block px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-[#F37021] hover:bg-[#D95D14] transition-colors shadow-2xs shadow-[#F37021]/20"
                  >
                    {t.common.register}
                  </Link>
                </div>
              ) : (
                <div className="w-20 h-8 rounded-xl bg-stone-100 animate-pulse" />
              )}

              {/* Mobile Menu Button */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle navigation menu"
                className="lg:hidden p-2 rounded-xl text-stone-700 hover:bg-stone-100 cursor-pointer"
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
                    placeholder={t.common.searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm border border-stone-300 bg-white focus:outline-none focus:border-[#F37021]"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-[#F37021] hover:bg-[#D95D14] text-white font-bold text-xs cursor-pointer"
                >
                  {t.common.searchBtn}
                </button>
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  aria-label={t.common.close}
                  className="p-2 text-stone-400 hover:text-stone-700 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* Mobile Drawer Navigation */}
          {isMobileMenuOpen && (
            <div className="lg:hidden border-t border-stone-200 py-4 px-3 space-y-4 bg-white rounded-3xl mt-2 shadow-xl">
              <div className="pb-2 border-b border-stone-100 flex items-center justify-between">
                <img
                  src={BRAND_ASSETS.logo}
                  alt="COBI BREAD"
                  className="h-9 w-auto object-contain"
                />
                <a
                  href={BRAND_ASSETS.flipbookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-bold text-[#F37021] flex items-center gap-1"
                >
                  <FileText className="w-3.5 h-3.5" />
                  {t.common.eCatalogue}
                </a>
              </div>

              <div className="space-y-1 text-sm font-bold text-[#231812]">
                <Link
                  href="/products"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl hover:bg-orange-50"
                >
                  {t.header.mobileMenuCatalog}
                </Link>
                <Link
                  href="/about"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl hover:bg-orange-50"
                >
                  {t.common.about}
                </Link>
                <Link
                  href="/news"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl hover:bg-orange-50"
                >
                  {t.header.mobileNews}
                </Link>
                <Link
                  href="/media"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl hover:bg-orange-50"
                >
                  {t.header.mobileMedia}
                </Link>
                <Link
                  href="/stores"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl hover:bg-orange-50"
                >
                  {t.header.mobileStores}
                </Link>
                <Link
                  href="/certificates"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl hover:bg-orange-50"
                >
                  {t.header.mobileCertificates}
                </Link>
                <Link
                  href="/account/orders"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl hover:bg-orange-50"
                >
                  {t.header.myOrders}
                </Link>
                <Link
                  href="/b2b"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl text-blue-800 bg-blue-50/70"
                >
                  {t.header.mobileB2b}
                </Link>
              </div>

              {/* Mobile Language Switcher */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs px-2">
                <span className="text-stone-500 font-semibold">{t.common.language}</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setLocale('vi')}
                    className={`px-3 py-1 rounded-lg font-bold cursor-pointer transition-colors ${
                      locale === 'vi'
                        ? 'bg-[#231812] text-white'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    Tiếng Việt (VI)
                  </button>
                  <button
                    type="button"
                    onClick={() => setLocale('en')}
                    className={`px-3 py-1 rounded-lg font-bold cursor-pointer transition-colors ${
                      locale === 'en'
                        ? 'bg-[#231812] text-white'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
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
