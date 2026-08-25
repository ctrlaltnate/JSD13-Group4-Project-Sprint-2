import React, { useState } from "react";
import { users } from "../mock-data/users";
import {
  SUBSCRIPTION_PLANS,
  SHIPPING_FEE,
  PAYMENT_METHODS,
} from "../constants/checkout";
import {
  calculateEarnedPoints,
  calculateGrandTotal,
  generatePromptPayQrUrl,
} from "../utils/checkoutHelpers";

export default function CheckoutPage() {
  const [currentUserId] = useState("USR-001");
  const currentUser = users.find((u) => u.id === currentUserId) || users[0];

  const [selectedPlan] = useState(SUBSCRIPTION_PLANS.M);

  const [formData, setFormData] = useState({
    fullName: `${currentUser.firstName} ${currentUser.lastName}`,
    phone: currentUser.phone || "",
    address: "123/45 ถนนวงศ์สว่าง",
    district: "บางซื่อ",
    province: "กรุงเทพมหานคร",
    zipcode: "10800",
    deliveryDate: "12",
  });

  // State สำหรับเก็บข้อมูลบัตรเครดิต
  const [cardData, setCardData] = useState({
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvc: "",
  });

  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS.PROMPTPAY);

  const itemsSubtotal = selectedPlan.price;
  const earnedPoints = calculateEarnedPoints(itemsSubtotal);
  const grandTotal = calculateGrandTotal(itemsSubtotal);

  const promptPayQrUrl = generatePromptPayQrUrl("0812345678", grandTotal);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    setCardData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    alert(
      `ยืนยันการสั่งซื้อสำเร็จ! ยอดชำระ ฿${grandTotal.toLocaleString()} (คุณจะได้รับ ${earnedPoints} แต้ม)`,
    );
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] py-10 px-4 sm:px-6 lg:px-8 text-[#2f2119]">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <span className="text-xs font-bold uppercase tracking-[.22em] text-[#8d593a]">
            SECURE CHECKOUT
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#3d2c2e] mt-1">
            ยืนยันการสั่งซื้อ
          </h1>
        </div>

        {/* User Status Bar */}
        <div className="bg-[#f6ede5] border border-[#e8dfd1] rounded-2xl p-4 mb-8 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#3d2c2e] text-white flex items-center justify-center font-bold">
              {currentUser.firstName ? currentUser.firstName.charAt(0) : "U"}
            </div>
            <div>
              <h2 className="font-bold text-[#3d2c2e]">
                {currentUser.firstName} {currentUser.lastName}
              </h2>
              <span className="text-xs px-2.5 py-0.5 bg-[#8d593a] text-white rounded-full font-medium">
                {currentUser.tierStatus} Member
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-[#6f675f]">แต้มสะสมปัจจุบัน</p>
            <p className="font-bold text-lg text-[#8d593a]">
              {currentUser.biaPoints
                ? currentUser.biaPoints.toLocaleString()
                : 0}{" "}
              แต้ม
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmitOrder}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          {/* ฝั่งซ้าย: ข้อมูลการจัดส่ง & ช่องทางชำระเงิน */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* 1. ข้อมูลการจัดส่ง */}
            <div className="bg-[#fcf8f2] border border-[#e8dfd1] rounded-3xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <span className="text-xl">🚚</span>
                <h2 className="text-xl font-bold text-[#3d2c2e]">
                  ข้อมูลการจัดส่ง
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#6f675f] mb-1">
                    ชื่อ - นามสกุล
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-[#e8dfd1] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8d593a]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#6f675f] mb-1">
                    เบอร์โทรศัพท์
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-[#e8dfd1] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8d593a]"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#6f675f] mb-1">
                    ที่อยู่จัดส่ง
                  </label>
                  <textarea
                    name="address"
                    rows="2"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-[#e8dfd1] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8d593a]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#6f675f] mb-1">
                    อำเภอ/เขต
                  </label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-[#e8dfd1] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8d593a]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#6f675f] mb-1">
                    จังหวัด
                  </label>
                  <input
                    type="text"
                    name="province"
                    value={formData.province}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-[#e8dfd1] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8d593a]"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#6f675f] mb-1">
                    รหัสไปรษณีย์
                  </label>
                  <input
                    type="text"
                    name="zipcode"
                    value={formData.zipcode}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-[#e8dfd1] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8d593a]"
                    required
                  />
                </div>
              </div>

              {/* เลือกรอบรับสินค้า */}
              <div className="mt-6 border-t border-[#e8dfd1] pt-4">
                <label className="block text-xs font-semibold text-[#6f675f] mb-2">
                  เลือกรอบรับสินค้า (จัดส่งทุกวันอาทิตย์)
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { day: "SUN", date: "12", month: "พ.ย." },
                    { day: "SUN", date: "19", month: "พ.ย." },
                    { day: "SUN", date: "26", month: "พ.ย." },
                  ].map((item) => (
                    <button
                      key={item.date}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, deliveryDate: item.date })
                      }
                      className={`p-3 rounded-2xl border text-center transition-all ${
                        formData.deliveryDate === item.date
                          ? "bg-[#3d2c2e] text-white border-[#3d2c2e] shadow-md"
                          : "bg-white text-[#2f2119] border-[#e8dfd1] hover:border-[#8d593a]"
                      }`}
                    >
                      <div className="text-[10px] opacity-80">{item.day}</div>
                      <div className="text-xl font-bold">{item.date}</div>
                      <div className="text-[10px] opacity-80">{item.month}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. ช่องทางการชำระเงิน */}
            <div className="bg-[#fcf8f2] border border-[#e8dfd1] rounded-3xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <span className="text-xl">💳</span>
                <h2 className="text-xl font-bold text-[#3d2c2e]">
                  ช่องทางการชำระเงิน
                </h2>
              </div>

              <div className="space-y-3">
                {/* PromptPay */}
                <label
                  className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === PAYMENT_METHODS.PROMPTPAY
                      ? "border-[#8d593a] bg-[#f6ede5]"
                      : "border-[#e8dfd1] bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={PAYMENT_METHODS.PROMPTPAY}
                      checked={paymentMethod === PAYMENT_METHODS.PROMPTPAY}
                      onChange={() =>
                        setPaymentMethod(PAYMENT_METHODS.PROMPTPAY)
                      }
                      className="accent-[#8d593a]"
                    />
                    <span className="font-semibold text-sm">
                      สแกน QR Code พร้อมเพย์
                    </span>
                  </div>
                  <span className="text-xs bg-[#8d593a]/10 text-[#8d593a] px-2 py-1 rounded font-bold">
                    PromptPay
                  </span>
                </label>

                {paymentMethod === PAYMENT_METHODS.PROMPTPAY && (
                  <div className="p-5 bg-white border border-[#e8dfd1] rounded-2xl text-center my-2">
                    <span className="inline-block text-xs bg-[#f6ede5] text-[#8d593a] px-3 py-1 rounded-full font-medium mb-3">
                      ทดลองสแกนเพื่อชำระเงิน
                    </span>
                    <div className="flex justify-center mb-3">
                      <img
                        src={promptPayQrUrl}
                        alt="PromptPay QR Code"
                        className="w-48 h-48 border p-2 rounded-xl bg-white shadow-inner"
                      />
                    </div>
                    <p className="text-xs text-[#6f675f]">
                      เมื่อชำระเงินเสร็จสิ้น ระบบจะทำการยืนยันให้อัตโนมัติใน 1-2
                      นาที
                    </p>
                  </div>
                )}

                {/* บัตรเครดิต / เดบิต */}
                <label
                  className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === PAYMENT_METHODS.CREDIT_CARD
                      ? "border-[#8d593a] bg-[#f6ede5]"
                      : "border-[#e8dfd1] bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={PAYMENT_METHODS.CREDIT_CARD}
                      checked={paymentMethod === PAYMENT_METHODS.CREDIT_CARD}
                      onChange={() =>
                        setPaymentMethod(PAYMENT_METHODS.CREDIT_CARD)
                      }
                      className="accent-[#8d593a]"
                    />
                    <span className="font-semibold text-sm">
                      บัตรเครดิต / เดบิต
                    </span>
                  </div>
                  <span className="text-xs text-[#6f675f]">
                    💳 Visa / Mastercard
                  </span>
                </label>

                {/* 🟢 ฟอร์มกรอกข้อมูลบัตรเครดิต (แสดงเฉพาะเมื่อเลือกบัตรเครดิต) */}
                {paymentMethod === PAYMENT_METHODS.CREDIT_CARD && (
                  <div className="p-5 bg-white border border-[#e8dfd1] rounded-2xl space-y-4 my-2">
                    <div>
                      <label className="block text-xs font-semibold text-[#6f675f] mb-1">
                        หมายเลขบัตร
                      </label>
                      <input
                        type="text"
                        name="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        maxLength="19"
                        value={cardData.cardNumber}
                        onChange={handleCardInputChange}
                        className="w-full bg-[#fdfbf7] border border-[#e8dfd1] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8d593a]"
                        required={paymentMethod === PAYMENT_METHODS.CREDIT_CARD}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#6f675f] mb-1">
                        ชื่อบนบัตร
                      </label>
                      <input
                        type="text"
                        name="cardName"
                        placeholder="NATCHA SOOKJAI"
                        value={cardData.cardName}
                        onChange={handleCardInputChange}
                        className="w-full bg-[#fdfbf7] border border-[#e8dfd1] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8d593a]"
                        required={paymentMethod === PAYMENT_METHODS.CREDIT_CARD}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#6f675f] mb-1">
                          วันหมดอายุ (MM/YY)
                        </label>
                        <input
                          type="text"
                          name="expiry"
                          placeholder="MM/YY"
                          maxLength="5"
                          value={cardData.expiry}
                          onChange={handleCardInputChange}
                          className="w-full bg-[#fdfbf7] border border-[#e8dfd1] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8d593a]"
                          required={
                            paymentMethod === PAYMENT_METHODS.CREDIT_CARD
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#6f675f] mb-1">
                          รหัส CVC / CVV
                        </label>
                        <input
                          type="password"
                          name="cvc"
                          placeholder="123"
                          maxLength="4"
                          value={cardData.cvc}
                          onChange={handleCardInputChange}
                          className="w-full bg-[#fdfbf7] border border-[#e8dfd1] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8d593a]"
                          required={
                            paymentMethod === PAYMENT_METHODS.CREDIT_CARD
                          }
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* เก็บเงินปลายทาง (COD) */}
                <label
                  className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === PAYMENT_METHODS.COD
                      ? "border-[#8d593a] bg-[#f6ede5]"
                      : "border-[#e8dfd1] bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={PAYMENT_METHODS.COD}
                      checked={paymentMethod === PAYMENT_METHODS.COD}
                      onChange={() => setPaymentMethod(PAYMENT_METHODS.COD)}
                      className="accent-[#8d593a]"
                    />
                    <span className="font-semibold text-sm">
                      เก็บเงินปลายทาง (COD)
                    </span>
                  </div>
                  <span className="text-xs text-[#6f675f]">💵 เงินสด</span>
                </label>
              </div>
            </div>
          </div>

          {/* ฝั่งขวา: สรุปคำสั่งซื้อ & ปุ่มชำระเงิน */}
          <div className="lg:col-span-5">
            <div className="bg-[#fcf8f2] border border-[#e8dfd1] rounded-3xl p-6 shadow-sm sticky top-6">
              <div className="flex justify-between items-center border-b border-[#e8dfd1] pb-4 mb-4">
                <h2 className="text-xl font-bold text-[#3d2c2e]">
                  สรุปคำสั่งซื้อ
                </h2>
                <span className="text-xs bg-[#3d2c2e] text-white px-3 py-1 rounded-full">
                  {selectedPlan.name} - {selectedPlan.kitsPerWeek} Kits
                </span>
              </div>

              <div className="space-y-4 mb-6">
                {[
                  {
                    name: "แกงส้มใต้ปลากะพงยอดยอดมะพร้าว",
                    desc: "วัตถุดิบสดใหม่ + เครื่องแกงโฮมเมด",
                    qty: 1,
                  },
                  {
                    name: "ลาบหมูคั่วเมืองเหนือ",
                    desc: "พริกลาบมะแขว่นหอมๆ",
                    qty: 1,
                  },
                  {
                    name: "แกงเขียวหวานไก่บ้าน",
                    desc: "มะเขือเปราะกรอบ + พริกแกงสูตรโบราณ",
                    qty: 1,
                  },
                  {
                    name: "ต้มข่าไก่เห็ดฟาง",
                    desc: "รสชาติเข้มข้น หอมกะทิสด",
                    qty: 1,
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-start text-xs border-b border-dashed border-[#e8dfd1] pb-3"
                  >
                    <div>
                      <p className="font-bold text-[#2f2119]">{item.name}</p>
                      <p className="text-[#6f675f]">{item.desc}</p>
                    </div>
                    <span className="font-semibold ml-2">x{item.qty}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 text-sm text-[#6f675f] border-t border-[#e8dfd1] pt-4">
                <div className="flex justify-between">
                  <span>มูลค่าสินค้า ({selectedPlan.kitsPerWeek} มื้อ)</span>
                  <span className="font-medium text-[#2f2119]">
                    ฿{itemsSubtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>ค่าจัดส่ง (ควบคุมอุณหภูมิ)</span>
                  <span className="font-medium text-[#2f2119]">
                    ฿{SHIPPING_FEE}
                  </span>
                </div>
              </div>

              <div className="border-t border-[#3d2c2e]/20 pt-4 mt-4 flex justify-between items-baseline">
                <span className="font-bold text-[#3d2c2e] text-base">
                  ยอดชำระสุทธิ
                </span>
                <div className="text-right">
                  <span className="text-2xl font-bold text-[#8d593a]">
                    ฿{grandTotal.toLocaleString()}
                  </span>
                  <span className="text-xs text-[#6f675f] ml-1">THB</span>
                </div>
              </div>

              <div className="mt-3 bg-[#f6ede5] p-2.5 rounded-xl text-center text-xs text-[#8d593a] font-semibold">
                🎉 คุณจะได้รับแต้มสะสม +{earnedPoints} แต้มจากคำสั่งซื้อนี้
              </div>

              <button
                type="submit"
                className="w-full mt-6 bg-[#3d2c2e] text-white py-4 rounded-full font-bold hover:bg-[#8d593a] transition-colors shadow-lg flex items-center justify-center gap-2"
              >
                <span>ชำระเงิน</span>
                <span>→</span>
              </button>

              <p className="text-[10px] text-center text-[#6f675f] mt-3">
                การกดปุ่มชำระเงินถือว่าท่านยอมรับ{" "}
                <a href="#terms" className="underline">
                  เงื่อนไขการให้บริการ
                </a>{" "}
                ของธาตุแท้
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
