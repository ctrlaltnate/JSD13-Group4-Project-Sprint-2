import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const subscriptionPlans = {
  S: { name: "Size S", detail: "4 Kits / สัปดาห์" },
  M: { name: "Size M", detail: "6 Kits / สัปดาห์" },
  L: { name: "Size L", detail: "8 Kits / สัปดาห์" },
  XL: { name: "Size XL", detail: "12 Kits / สัปดาห์" },
};

const paymentMethodLabels = {
  PromptPay: "พร้อมเพย์ (ชำระเรียบร้อย)",
  CreditCard: "บัตรเครดิต / เดบิต (ชำระเรียบร้อย)",
  COD: "เก็บเงินปลายทาง",
};

export default function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();

  // ดึงข้อมูล payload จากหน้า Checkout (มี Mock Data สำรองให้กรณีเข้าตรง)
  const orderData = location.state || {
    orderId: "TT-892134",
    orderType: "alacarte",
    items: [
      { name: "ชุดทำต้มยำกุ้งแม่น้ำ (ภาคกลาง)", price: 350, quantity: 2 },
      { name: "ชุดทำแกงฮังเลหมู (ภาคเหนือ)", price: 320, quantity: 1 },
    ],
    shippingAddress: {
      fullName: "สมชาย ใจดี",
      phone: "081-234-5678",
      address: "123/45 ถนนวิภาวดีรังสิต แขวงจตุจักร",
      province: "กรุงเทพมหานคร",
      postalCode: "10900",
    },
    totalAmount: 1080,
    earnedPoints: 0,
    paymentMethod: "PromptPay",
  };

  const {
    orderId,
    orderType,
    items,
    shippingAddress,
    totalAmount,
    earnedPoints,
    paymentMethod,
  } = orderData;

  return (
    <div className="bg-[#FAF6F0] min-h-screen py-12 px-4 sm:px-6 lg:px-8 font-sans text-[#3D2E2B] flex justify-center items-center">
      <div className="max-w-2xl w-full bg-white rounded-3xl p-8 shadow-sm border border-[#E8DFC8] space-y-8">
        {/* Header สัญลักษณ์ความสำเร็จ */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-[#3D2E2B] text-white rounded-full flex items-center justify-center mx-auto text-2xl shadow-md">
            ✓
          </div>
          <span className="text-xs font-semibold text-[#8C7A6B] tracking-widest uppercase block">
            ORDER CONFIRMED
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#3D2E2B]">
            สั่งซื้อสำเร็จเรียบร้อย!
          </h1>
          <p className="text-xs sm:text-sm text-[#8C7A6B]">
            ขอบคุณสำหรับการสั่งซื้อ หมายเลขออเดอร์ของคุณคือ{" "}
            <span className="font-bold text-[#3D2E2B]">{orderId}</span>
          </p>
        </div>

        {/* รายละเอียดคำสั่งซื้อ */}
        <div className="bg-[#FAF6F0] p-6 rounded-2xl border border-[#E8DFC8] space-y-4">
          <div className="flex justify-between items-center border-b border-[#E8DFC8] pb-3">
            <h2 className="font-bold text-sm text-[#3D2E2B]">รายการสินค้า</h2>
            <span className="text-xs font-semibold bg-[#3D2E2B] text-white px-3 py-1 rounded-full">
              {orderType === "subscription"
                ? "Subscription Plan"
                : "A La Carte"}
            </span>
          </div>

          <div className="space-y-3">
            {orderType === "subscription" ? (
              <div className="flex justify-between text-sm">
                <div>
                  <p className="font-bold text-[#3D2E2B]">
                    {subscriptionPlans[items[0]?.plan]?.name || "Custom Plan"}
                  </p>
                  <p className="text-xs text-[#8C7A6B]">
                    {subscriptionPlans[items[0]?.plan]?.detail ||
                      "จัดส่งรายสัปดาห์"}
                  </p>
                </div>
                <span className="font-bold text-[#8C6239]">
                  ฿{totalAmount - 60}
                </span>
              </div>
            ) : (
              items?.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-[#3D2E2B]">
                    {item.name}{" "}
                    <span className="text-[#8C7A6B] text-xs">
                      x{item.quantity}
                    </span>
                  </span>
                  <span className="font-semibold text-[#8C6239]">
                    ฿{item.price * item.quantity}
                  </span>
                </div>
              ))
            )}
          </div>

          {/* แต้มสะสมที่ได้รับ (ถ้ามี) */}
          {earnedPoints > 0 && (
            <div className="pt-3 border-t border-[#E8DFC8] flex justify-between items-center text-xs">
              <span className="text-[#8C7A6B]">🎉 แต้มสะสมที่จะได้รับ</span>
              <span className="font-bold text-[#8C6239]">
                +{earnedPoints} คะแนน
              </span>
            </div>
          )}
        </div>

        {/* ข้อมูลการจัดส่ง & ชำระเงิน */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          {/* ที่อยู่จัดส่ง */}
          <div className="space-y-1 bg-white p-4 rounded-xl border border-[#E8DFC8]">
            <p className="font-bold text-[#8C7A6B] uppercase tracking-wider mb-2">
              ที่อยู่สำหรับจัดส่ง
            </p>
            <p className="font-bold text-[#3D2E2B] text-sm">
              {shippingAddress?.fullName}
            </p>
            <p className="text-[#8C7A6B]">{shippingAddress?.phone}</p>
            <p className="text-[#8C7A6B] leading-relaxed">
              {shippingAddress?.address} {shippingAddress?.province}{" "}
              {shippingAddress?.postalCode}
            </p>
          </div>

          {/* สรุปชำระเงิน */}
          <div className="space-y-1 bg-white p-4 rounded-xl border border-[#E8DFC8] flex flex-col justify-between">
            <div>
              <p className="font-bold text-[#8C7A6B] uppercase tracking-wider mb-2">
                วิธีชำระเงิน
              </p>
              <p className="font-bold text-[#3D2E2B] text-sm">
                {paymentMethodLabels[paymentMethod] || paymentMethod}
              </p>
            </div>
            <div className="pt-3 border-t border-[#F3EBDD] flex justify-between items-end">
              <span className="text-[#8C7A6B]">ยอดชำระสุทธิ</span>
              <span className="text-lg font-extrabold text-[#8C6239]">
                ฿{totalAmount}
              </span>
            </div>
          </div>
        </div>

        {/* ปุ่มกลับหน้าหลัก */}
        <div className="pt-2 text-center space-y-3">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="w-full bg-[#3D2E2B] text-white py-3.5 rounded-full font-bold text-sm hover:bg-[#2A1F1D] transition-all shadow-md active:scale-[0.99]"
          >
            กลับสู่หน้าหลัก
          </button>
        </div>
      </div>
    </div>
  );
}
