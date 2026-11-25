'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ShoppingBag, 
  ArrowLeft, 
  CheckCircle2, 
  MapPin, 
  Truck, 
  CreditCard, 
  AlertTriangle, 
  ShieldCheck,
  Store,
  Clock
} from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useCartStore } from '@/stores/cart.store';
import { useBranchStore } from '@/stores/branch.store';
import { useAuthStore } from '@/stores/auth.store';
import { formatVND, getStorageBadge } from '@/components/ProductCard';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalItems, getTotalPrice, hasMixedStorage, clearCart } = useCartStore();
  const { selectedBranch } = useBranchStore();
  const { user } = useAuthStore();

  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState<'DELIVERY' | 'PICKUP'>('DELIVERY');
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    phone: '',
    address: '',
    note: '',
    paymentMethod: 'COD',
  });

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();
  const isMixed = hasMixedStorage();
  const shippingFee = deliveryMethod === 'DELIVERY' ? 25000 : 0;
  const finalTotal = totalPrice + shippingFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderSubmitted(true);
    clearCart();
  };

  if (orderSubmitted) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#231812]">
        <Header />
        <main className="flex-1 flex items-center justify-center py-20 px-4">
          <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl border border-stone-200 shadow-xl text-center space-y-5">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold font-display text-[#231812]">
                Đặt Hàng Thành Công!
              </h1>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Cảm ơn bạn đã tin tưởng chọn bánh từ <strong>Cobi Bread</strong>. Nhân viên chi nhánh {selectedBranch?.name || 'gần nhất'} sẽ liên hệ với bạn trong vòng 10 phút để xác nhận đơn hàng.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-stone-200 text-xs text-left space-y-1.5">
              <div className="flex justify-between">
                <span className="text-stone-500">Người nhận:</span>
                <strong className="text-stone-800">{formData.fullName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Số điện thoại:</span>
                <strong className="text-stone-800">{formData.phone}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Hình thức:</span>
                <strong className="text-stone-800">
                  {deliveryMethod === 'DELIVERY' ? 'Giao hàng tận nơi' : 'Nhận tại cửa hàng'}
                </strong>
              </div>
              <div className="flex justify-between border-t border-stone-200 pt-1.5 font-bold">
                <span>Tổng tiền:</span>
                <span className="text-[#C67C3B]">{formatVND(finalTotal)}</span>
              </div>
            </div>

            <Link
              href="/"
              className="w-full inline-block py-3 px-4 rounded-xl bg-[#231812] hover:bg-black text-white font-bold text-xs"
            >
              Về trang chủ
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#231812]">
        <Header />
        <main className="flex-1 flex items-center justify-center py-20 px-4">
          <div className="text-center space-y-4 max-w-sm">
            <div className="w-16 h-16 rounded-3xl bg-amber-50 text-[#C67C3B] flex items-center justify-center mx-auto">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold font-display">Giỏ hàng của bạn đang trống</h2>
            <p className="text-xs text-stone-500">
              Vui lòng chọn bánh trước khi tiến hành thanh toán.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C67C3B] text-white font-bold text-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Xem thực đơn bánh</span>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#231812]">
      <Header />

      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <Link href="/" className="hover:text-[#C67C3B]">Trang chủ</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-[#C67C3B]">Sản phẩm</Link>
            <span>/</span>
            <span className="text-stone-900 font-bold">Thanh toán đơn hàng</span>
          </div>

          <h1 className="text-3xl font-extrabold font-display">
            Thanh Toán & Đặt Bánh Cobi Bread
          </h1>

          {/* Mixed Storage Notification */}
          {isMixed && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-stone-800 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-[#C67C3B] shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <strong className="block font-bold text-amber-900">
                  Đóng gói chuyên biệt 2 kiện:
                </strong>
                Đơn hàng của bạn có chứa cả bánh tươi (0-10°C) và bánh mì đông lạnh (-18°C). Chúng tôi sẽ chia thành 2 túi bảo quản lạnh chuyên dụng để đảm bảo độ tươi ngon nhất.
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Form Info (7 cols) */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-2xs space-y-6">
              
              {/* Delivery method toggle */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                  Phương thức nhận bánh
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('DELIVERY')}
                    className={`p-3.5 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      deliveryMethod === 'DELIVERY'
                        ? 'border-[#C67C3B] bg-amber-50/70 text-[#C67C3B]'
                        : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <Truck className="w-4 h-4" />
                    <span>Giao hàng tận nơi</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('PICKUP')}
                    className={`p-3.5 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      deliveryMethod === 'PICKUP'
                        ? 'border-[#C67C3B] bg-amber-50/70 text-[#C67C3B]'
                        : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <Store className="w-4 h-4" />
                    <span>Nhận tại cửa hàng</span>
                  </button>
                </div>
              </div>

              {/* Branch notice */}
              {selectedBranch && (
                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Store className="w-4 h-4 text-[#C67C3B]" />
                    <span>Chi nhánh xử lý đơn: <strong>{selectedBranch.name}</strong></span>
                  </div>
                  <Link href="/stores" className="text-[#C67C3B] font-bold hover:underline">
                    Đổi
                  </Link>
                </div>
              )}

              {/* Customer Info Form */}
              <form onSubmit={handleSubmit} id="checkout-form" className="space-y-4 text-xs sm:text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                      Họ và tên người nhận *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="Nguyễn Văn A"
                      className="w-full px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#C67C3B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                      Số điện thoại *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="09xx xxx xxx"
                      className="w-full px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#C67C3B]"
                    />
                  </div>
                </div>

                {deliveryMethod === 'DELIVERY' && (
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                      Địa chỉ nhận hàng chi tiết *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Số nhà, tên đường, phường/xã, quận/huyện..."
                      className="w-full px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#C67C3B]"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Ghi chú đơn hàng (Tùy chọn)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                    placeholder="Giao khung giờ nào, cần thêm tương ớt, dĩa muỗng..."
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#C67C3B] text-xs"
                  />
                </div>

                {/* Payment method */}
                <div className="pt-2">
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-2">
                    Hình thức thanh toán
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 p-3 rounded-xl border border-stone-200 bg-stone-50 cursor-pointer">
                      <input
                        type="radio"
                        name="payment"
                        checked={formData.paymentMethod === 'COD'}
                        onChange={() => setFormData({ ...formData, paymentMethod: 'COD' })}
                        className="text-[#C67C3B] focus:ring-[#C67C3B]"
                      />
                      <div>
                        <strong className="block text-xs text-stone-900">Thanh toán khi nhận hàng (COD)</strong>
                        <span className="text-[11px] text-stone-500">Trả tiền mặt hoặc chuyển khoản khi nhận bánh</span>
                      </div>
                    </label>
                  </div>
                </div>
              </form>
            </div>

            {/* Order Summary (5 cols) */}
            <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-2xs space-y-6">
              <h3 className="text-base font-bold text-[#231812] border-b border-stone-100 pb-3">
                Đơn Hàng ({totalItems} món)
              </h3>

              <div className="space-y-3 max-h-80 overflow-y-auto divide-y divide-stone-100 pr-1">
                {items.map(({ product, quantity }) => {
                  const storageInfo = getStorageBadge(product.storageType);
                  return (
                    <div key={product.id} className="pt-3 first:pt-0 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={product.images?.[0] || 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=100'}
                          alt={product.name}
                          className="w-12 h-12 rounded-xl object-cover bg-stone-100 border border-stone-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-[#231812] truncate">{product.name}</p>
                          <span className={`inline-block text-[9px] font-semibold px-1.5 py-0.2 rounded border mt-0.5 ${storageInfo.className}`}>
                            {storageInfo.label}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-stone-500 text-[11px]">x {quantity}</span>
                        <p className="font-bold text-[#C67C3B]">{formatVND(product.price * quantity)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Price Calculation */}
              <div className="border-t border-stone-200 pt-4 space-y-2 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Tạm tính bánh:</span>
                  <strong className="text-stone-800">{formatVND(totalPrice)}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Phí giao hàng:</span>
                  <strong className="text-stone-800">
                    {deliveryMethod === 'DELIVERY' ? formatVND(shippingFee) : '0 đ (Tự lấy)'}
                  </strong>
                </div>
                <div className="flex justify-between text-base font-black text-[#231812] pt-2 border-t border-stone-200">
                  <span>Tổng thanh toán:</span>
                  <span className="text-lg text-[#C67C3B]">{formatVND(finalTotal)}</span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                form="checkout-form"
                className="w-full py-4 px-6 rounded-2xl bg-[#C67C3B] hover:bg-[#A86224] text-white font-black text-sm shadow-lg shadow-[#C67C3B]/25 transition-all"
              >
                Xác nhận đặt hàng ({formatVND(finalTotal)})
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
