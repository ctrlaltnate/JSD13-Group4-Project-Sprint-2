import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserSwitcher from "../components/checkout/UserSwitcher";

// Mock รายการสินค้าตัวอย่างในตะกร้า (ในการใช้งานจริงจะรับจาก CartContext หรือ API)
const initialCartItems = [
  {
    id: "1",
    name: "ชุดทำต้มยำกุ้งแม่น้ำ (ภาคกลาง)",
    price: 350,
    quantity: 2,
    purchaseType: "alacarte",
    image: "/assets/central/ID013_001.jpg",
  },
  {
    id: "2",
    name: "ชุดทำแกงฮังเลหมู (ภาคเหนือ)",
    price: 320,
    quantity: 1,
    purchaseType: "alacarte",
    image: "/assets/northern/ID001_001.jpg",
  },
];

// แพ็กเกจ Subscription รายสัปดาห์
const subscriptionPlans = [
  { id: "S", name: "Size S", detail: "4 Kits / สัปดาห์", price: 599 },
  { id: "M", name: "Size M", detail: "6 Kits / สัปดาห์ (ยอดนิยม)", price: 899 },
  { id: "L", name: "Size L", detail: "8 Kits / สัปดาห์", price: 1169 },
  { id: "XL", name: "Size XL", detail: "12 Kits / สัปดาห์", price: 1599 },
];

export default function CheckoutPage() {
  // const navigate = useNavigate();
  const [currentUserId, setCurrentUserId] = useState("user_01");
  const [orderType, setOrderType] = useState("alacarte"); // 'alacarte' หรือ 'subscription'
  const [selectedPlan, setSelectedPlan] = useState("M"); // Default Plan M

  // State ฟอร์มที่อยู่จัดส่ง
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    province: "",
    postalCode: "",
    paymentMethod: "PromptPay",
  });

  // State เก็บข้อความ Error สีแดง
  const [errors, setErrors] = useState({});

  // คำนวณยอดรวมสินค้า
  const calculateSubtotal = () => {
    if (orderType === "subscription") {
      const plan = subscriptionPlans.find((p) => p.id === selectedPlan);
      return plan ? plan.price : 0;
    }
    return initialCartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
  };

  const shippingFee = 60;
  const subtotal = calculateSubtotal();
  const totalAmount = subtotal + shippingFee;

  // คำนวณแต้มสะสม (ซื้อครบ 1,499 บาท ได้แต้ม)
  const earnedPoints =
    totalAmount >= 1499 ? Math.floor(totalAmount / 100) * 10 : 0;

  // ฟังก์ชั่นตรวจความถูกต้องของฟอร์ม (Form Validation Logic)
  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) {
      newErrors.fullName = "กรุณากรอกชื่อ-นามสกุล ผู้รับ";
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "ชื่อ-นามสกุล ต้องมีความยาวอย่างน้อย 2 ตัวอักษร";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "กรุณากรอกเบอร์โทรศัพท์";
    } else if (!/^0\d{9}$/.test(formData.phone.trim())) {
      newErrors.phone = "เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 หลัก (ขึ้นต้นด้วย 0)";
    }

    if (!formData.address.trim()) {
      newErrors.address = "กรุณากรอกที่อยู่จัดส่ง";
    } else if (formData.address.trim().length < 10) {
      newErrors.address =
        "กรุณากรอกที่อยู่รายละเอียดให้ชัดเจน (อย่างน้อย 10 ตัวอักษร)";
    }

    if (!formData.province.trim()) {
      newErrors.province = "กรุณากรอกจังหวัด";
    }

    if (!formData.postalCode.trim()) {
      newErrors.postalCode = "กรุณากรอกรหัสไปรษณีย์";
    } else if (!/^\d{5}$/.test(formData.postalCode.trim())) {
      newErrors.postalCode = "รหัสไปรษณีย์ต้องเป็นตัวเลข 5 หลัก";
    }

    if (!formData.paymentMethod) {
      newErrors.paymentMethod = "กรุณาเลือกวิธีการชำระเงิน";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // ลบ Error ของช่องนั้นเมื่อผู้ใช้พิมพ์แก้ไข
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const orderPayload = {
        userId: currentUserId,
        orderType,
        items:
          orderType === "alacarte"
            ? initialCartItems
            : [{ plan: selectedPlan }],
        shippingAddress: formData,
        totalAmount,
        earnedPoints,
      };

      console.log("ส่งข้อมูลการสั่งซื้อสำเร็จ:", orderPayload);
      alert("สั่งซื้อสำเร็จ! กำลังพาไปหน้า Order Success");
      // navigate('/order-success', { state: orderPayload });
    }
  };

  return (
    <div className="bg-[#FAF6F0] min-h-screen py-10 px-4 sm:px-6 lg:px-8 font-sans text-[#3D2E2B]">
      <div className="max-w-6xl mx-auto">
        {/* ส่วนหัว และ User Switcher Component */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-[#E8DFC8] pb-6">
          <div>
            <span className="text-xs font-semibold text-[#8C7A6B] tracking-widest uppercase">
              CHECKOUT FLOW
            </span>
            <h1 className="text-3xl font-bold text-[#3D2E2B]">
              สรุปรายการสั่งซื้อ & ชำระเงิน
            </h1>
          </div>
          <UserSwitcher
            currentUserId={currentUserId}
            onSelectUser={(id) => setCurrentUserId(id)}
          />
        </div>

        <form
          onSubmit={handleSubmitOrder}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          {/* ฝั่งซ้าย: ตัวเลือกรูปแบบ + ฟอร์มที่อยู่ (8 Columns) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: เลือกรูปแบบการซื้อ */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E8DFC8]">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#3D2E2B] text-white text-xs flex items-center justify-center">
                  1
                </span>
                เลือกรูปแบบการสั่งซื้อ
              </h2>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <button
                  type="button"
                  onClick={() => setOrderType("alacarte")}
                  className={`p-4 rounded-xl border text-center transition-all ${
                    orderType === "alacarte"
                      ? "border-[#3D2E2B] bg-[#3D2E2B] text-white font-semibold"
                      : "border-[#E8DFC8] bg-[#FAF6F0] hover:bg-[#F3EBDD]"
                  }`}
                >
                  ซื้อรายชุด (A La Carte)
                </button>
                <button
                  type="button"
                  onClick={() => setOrderType("subscription")}
                  className={`p-4 rounded-xl border text-center transition-all ${
                    orderType === "subscription"
                      ? "border-[#3D2E2B] bg-[#3D2E2B] text-white font-semibold"
                      : "border-[#E8DFC8] bg-[#FAF6F0] hover:bg-[#F3EBDD]"
                  }`}
                >
                  สมัคร Subscription รายสัปดาห์
                </button>
              </div>

              {/* Sub-option สำหรับ Subscription */}
              {orderType === "subscription" && (
                <div className="mt-4 pt-4 border-t border-[#F3EBDD] space-y-2">
                  <label className="text-xs font-semibold text-[#8C7A6B]">
                    เลือกแพ็กเกจ (Size):
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {subscriptionPlans.map((plan) => (
                      <div
                        key={plan.id}
                        onClick={() => setSelectedPlan(plan.id)}
                        className={`p-3 rounded-xl border cursor-pointer text-center transition-all ${
                          selectedPlan === plan.id
                            ? "border-[#8C6239] bg-[#FAF6F0] ring-2 ring-[#8C6239]"
                            : "border-[#E8DFC8] bg-white"
                        }`}
                      >
                        <div className="font-bold text-sm">{plan.name}</div>
                        <div className="text-xs text-[#8C7A6B]">
                          {plan.detail}
                        </div>
                        <div className="text-xs font-semibold mt-1">
                          ฿{plan.price}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Step 2: ฟอร์มข้อมูลจัดส่ง */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E8DFC8]">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#3D2E2B] text-white text-xs flex items-center justify-center">
                  2
                </span>
                ที่อยู่สำหรับจัดส่ง
              </h2>

              <div className="space-y-4">
                {/* ชื่อ-นามสกุล */}
                <div>
                  <label className="block text-xs font-semibold text-[#8C7A6B] mb-1">
                    ชื่อ-นามสกุล ผู้รับ *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="สมชาย ใจดี"
                    className={`w-full p-3 rounded-xl border text-sm outline-none transition-all ${
                      errors.fullName
                        ? "border-red-500 bg-red-50"
                        : "border-[#E8DFC8] focus:border-[#3D2E2B]"
                    }`}
                  />
                  {errors.fullName && (
                    <p className="text-xs text-red-500 mt-1 font-medium">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                {/* เบอร์โทรศัพท์ */}
                <div>
                  <label className="block text-xs font-semibold text-[#8C7A6B] mb-1">
                    เบอร์โทรศัพท์ *
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="0812345678"
                    className={`w-full p-3 rounded-xl border text-sm outline-none transition-all ${
                      errors.phone
                        ? "border-red-500 bg-red-50"
                        : "border-[#E8DFC8] focus:border-[#3D2E2B]"
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-xs text-red-500 mt-1 font-medium">
                      {errors.phone}
                    </p>
                  )}
                </div>

                {/* ที่อยู่ */}
                <div>
                  <label className="block text-xs font-semibold text-[#8C7A6B] mb-1">
                    ที่อยู่จัดส่ง *
                  </label>
                  <textarea
                    name="address"
                    rows="2"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="บ้านเลขที่, ถนน, แขวง/ตำบล, เขต/อำเภอ"
                    className={`w-full p-3 rounded-xl border text-sm outline-none transition-all ${
                      errors.address
                        ? "border-red-500 bg-red-50"
                        : "border-[#E8DFC8] focus:border-[#3D2E2B]"
                    }`}
                  ></textarea>
                  {errors.address && (
                    <p className="text-xs text-red-500 mt-1 font-medium">
                      {errors.address}
                    </p>
                  )}
                </div>

                {/* จังหวัด & รหัสไปรษณีย์ */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#8C7A6B] mb-1">
                      จังหวัด *
                    </label>
                    <input
                      type="text"
                      name="province"
                      value={formData.province}
                      onChange={handleInputChange}
                      placeholder="กรุงเทพมหานคร"
                      className={`w-full p-3 rounded-xl border text-sm outline-none transition-all ${
                        errors.province
                          ? "border-red-500 bg-red-50"
                          : "border-[#E8DFC8] focus:border-[#3D2E2B]"
                      }`}
                    />
                    {errors.province && (
                      <p className="text-xs text-red-500 mt-1 font-medium">
                        {errors.province}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#8C7A6B] mb-1">
                      รหัสไปรษณีย์ *
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      placeholder="10110"
                      className={`w-full p-3 rounded-xl border text-sm outline-none transition-all ${
                        errors.postalCode
                          ? "border-red-500 bg-red-50"
                          : "border-[#E8DFC8] focus:border-[#3D2E2B]"
                      }`}
                    />
                    {errors.postalCode && (
                      <p className="text-xs text-red-500 mt-1 font-medium">
                        {errors.postalCode}
                      </p>
                    )}
                  </div>
                </div>

                {/* ช่องทางชำระเงิน */}
                <div>
                  <label className="block text-xs font-semibold text-[#8C7A6B] mb-2">
                    วิธีชำระเงิน *
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {["PromptPay", "CreditCard", "COD"].map((method) => (
                      <label
                        key={method}
                        className={`p-3 rounded-xl border text-center text-xs font-semibold cursor-pointer transition-all ${
                          formData.paymentMethod === method
                            ? "border-[#3D2E2B] bg-[#3D2E2B] text-white"
                            : "border-[#E8DFC8] bg-white text-[#3D2E2B]"
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method}
                          checked={formData.paymentMethod === method}
                          onChange={handleInputChange}
                          className="sr-only"
                        />
                        {method === "PromptPay"
                          ? "พร้อมเพย์"
                          : method === "CreditCard"
                            ? "บัตรเครดิต"
                            : "เก็บเงินปลายทาง"}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ฝั่งขวา: สรุปรายการคำสั่งซื้อ & ปุ่มยืนยัน (5 Columns) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E8DFC8] sticky top-6">
              <h2 className="text-lg font-bold mb-4">สรุปยอดคำสั่งซื้อ</h2>

              {/* แสดงรายการสินค้า */}
              <div className="space-y-3 max-h-60 overflow-y-auto border-b border-[#F3EBDD] pb-4 mb-4">
                {orderType === "alacarte" ? (
                  initialCartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center text-sm"
                    >
                      <div>
                        <p className="font-semibold text-[#3D2E2B]">
                          {item.name}
                        </p>
                        <p className="text-xs text-[#8C7A6B]">
                          จำนวน: {item.quantity} ชุด
                        </p>
                      </div>
                      <span className="font-medium">
                        ฿{item.price * item.quantity}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="flex justify-between items-center text-sm">
                    <div>
                      <p className="font-semibold text-[#3D2E2B]">
                        Subscription Package ({selectedPlan})
                      </p>
                      <p className="text-xs text-[#8C7A6B]">
                        จัดส่งต่อเนื่องรายสัปดาห์
                      </p>
                    </div>
                    <span className="font-medium">฿{subtotal}</span>
                  </div>
                )}
              </div>

              {/* การคำนวณราคา */}
              <div className="space-y-2 text-sm border-b border-[#F3EBDD] pb-4 mb-4">
                <div className="flex justify-between text-[#8C7A6B]">
                  <span>ราคาสินค้า</span>
                  <span>฿{subtotal}</span>
                </div>
                <div className="flex justify-between text-[#8C7A6B]">
                  <span>ค่าจัดส่ง</span>
                  <span>฿{shippingFee}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-[#3D2E2B] pt-2">
                  <span>ยอดชำระรวม</span>
                  <span className="text-[#8C6239]">฿{totalAmount}</span>
                </div>
              </div>

              {/* แจ้งเตือนแต้มสะสม */}
              <div className="bg-[#FAF6F0] p-3 rounded-xl border border-[#E8DFC8] mb-6 flex items-center gap-3">
                <span className="text-xl">🎁</span>
                <div className="text-xs">
                  {totalAmount >= 1499 ? (
                    <p className="text-[#3D2E2B] font-semibold">
                      คุณได้รับ{" "}
                      <span className="text-[#8C6239] text-sm font-bold">
                        {earnedPoints}
                      </span>{" "}
                      แต้มสะสมจากมื้อนี้!
                    </p>
                  ) : (
                    <p className="text-[#8C7A6B]">
                      ซื้อเพิ่มอีก{" "}
                      <span className="font-semibold text-[#3D2E2B]">
                        ฿{1499 - totalAmount}
                      </span>{" "}
                      เพื่อรับแต้มสะสมพิเศษ
                    </p>
                  )}
                </div>
              </div>

              {/* ปุ่มกดยืนยัน */}
              <button
                type="submit"
                className="w-full bg-[#3D2E2B] text-white py-3.5 rounded-full font-bold text-sm hover:bg-[#2A1F1D] transition-all shadow-md active:scale-[0.99]"
              >
                ยืนยันการชำระเงิน (฿{totalAmount})
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
