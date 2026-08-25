import React from "react";
import { useLocation, Link } from "react-router-dom";

export default function OrderSuccess() {
  const location = useLocation();
  // รับ data จากการ navigate หรือใช้ mock data ไว้โชว์ก่อนได้
  const orderData = location.state?.order || {
    orderId: "ORD-882940",
    createdAt: new Date().toLocaleDateString("th-TH"),
    grandTotal: 959,
    earnedPoints: 80,
    deliveryDate: "12 พ.ย.",
    shippingAddress: {
      fullName: "ณัฐชา สุขใจ",
      phone: "081-234-5678",
      address: "123/45 ถนนวงศ์สว่าง บางซื่อ กรุงเทพมหานคร 10800",
    },
    paymentMethod: "PROMPTPAY",
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] py-12 px-4 sm:px-6 lg:px-8 text-[#2f2119]">
      <div className="max-w-2xl mx-auto bg-[#fcf8f2] border border-[#e8dfd1] rounded-3xl p-8 shadow-sm text-center">
        {/* Icon Success */}
        <div className="w-20 h-20 bg-[#f6ede5] border border-[#e8dfd1] text-[#8d593a] rounded-full flex items-center justify-center text-4xl mx-auto mb-6 shadow-inner">
          🎉
        </div>

        <span className="text-xs font-bold uppercase tracking-[.22em] text-[#8d593a]">
          ORDER CONFIRMED
        </span>
        <h1 className="text-3xl font-bold text-[#3d2c2e] mt-1 mb-2">
          สั่งซื้อเรียบร้อยแล้ว!
        </h1>
        <p className="text-sm text-[#6f675f] mb-6">
          ขอบคุณที่สั่งซื้อ Cooking Kit กับธาตุแท้
          เรากำลังเตรียมวัตถุดิบสดใหม่ส่งตรงถึงบ้านคุณ
        </p>

        {/* Highlight Bonus Points */}
        <div className="bg-[#f6ede5] border border-[#e8dfd1] rounded-2xl p-4 mb-6">
          <p className="text-xs text-[#8d593a] font-semibold">
            แต้มสะสมที่จะได้รับจากคำสั่งซื้อนี้
          </p>
          <p className="text-2xl font-bold text-[#3d2c2e] mt-0.5">
            +{orderData.earnedPoints} Points 🌟
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white border border-[#e8dfd1] rounded-2xl p-5 text-left text-xs space-y-3 mb-8">
          <div className="flex justify-between border-b border-[#e8dfd1] pb-2">
            <span className="text-[#6f675f]">หมายเลขคำสั่งซื้อ:</span>
            <span className="font-bold text-[#3d2c2e]">
              {orderData.orderId}
            </span>
          </div>
          <div className="flex justify-between border-b border-[#e8dfd1] pb-2">
            <span className="text-[#6f675f]">รอบการจัดส่ง:</span>
            <span className="font-bold text-[#8d593a]">
              {orderData.deliveryDate} (จัดส่งช่วงเช้า)
            </span>
          </div>
          <div className="flex justify-between border-b border-[#e8dfd1] pb-2">
            <span className="text-[#6f675f]">ผู้รับ:</span>
            <span className="font-medium text-[#2f2119]">
              {orderData.shippingAddress.fullName} (
              {orderData.shippingAddress.phone})
            </span>
          </div>
          <div className="flex justify-between border-b border-[#e8dfd1] pb-2">
            <span className="text-[#6f675f]">ที่อยู่จัดส่ง:</span>
            <span className="font-medium text-[#2f2119] text-right max-w-[60%]">
              {orderData.shippingAddress.address}
            </span>
          </div>
          <div className="flex justify-between pt-1">
            <span className="text-sm font-bold text-[#3d2c2e]">
              ยอดชำระสุทธิ:
            </span>
            <span className="text-base font-bold text-[#8d593a]">
              ฿{orderData.grandTotal.toLocaleString()} THB
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="bg-[#3d2c2e] text-white px-8 py-3.5 rounded-full font-bold hover:bg-[#8d593a] transition-colors shadow-md text-sm"
          >
            กลับหน้าหลัก
          </Link>
        </div>
      </div>
    </div>
  );
}
