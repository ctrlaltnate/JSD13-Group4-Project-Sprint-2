import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const initialCartItems = [
  {
    id: "1",
    name: "ชุดทำต้มยำกุ้งแม่น้ำ (ภาคกลาง)",
    price: 350,
    quantity: 2,
    purchaseType: "alacarte",
  },
  {
    id: "2",
    name: "ชุดทำแกงฮังเลหมู (ภาคเหนือ)",
    price: 320,
    quantity: 1,
    purchaseType: "alacarte",
  },
];

const subscriptionPlans = [
  { id: "S", name: "Size S", detail: "4 Kits / สัปดาห์", price: 599 },
  { id: "M", name: "Size M", detail: "6 Kits / สัปดาห์ (ยอดนิยม)", price: 899 },
  { id: "L", name: "Size L", detail: "8 Kits / สัปดาห์", price: 1169 },
  { id: "XL", name: "Size XL", detail: "12 Kits / สัปดาห์", price: 1599 },
];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [currentUserId] = useState("user_01");
  const [orderType, setOrderType] = useState("alacarte");
  const [selectedPlan, setSelectedPlan] = useState("M");

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    province: "",
    postalCode: "",
    paymentMethod: "PromptPay",
  });

  const [cardData, setCardData] = useState({
    cardNumber: "",
    expDate: "",
    cvv: "",
  });

  const [errors, setErrors] = useState({});
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [pendingOrderPayload, setPendingOrderPayload] = useState(null);

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
  const earnedPoints =
    totalAmount >= 1499 ? Math.floor(totalAmount / 100) * 10 : 0;

  const validateForm = () => {
    const newErrors = {};

    // ตรวจสอบที่อยู่จัดส่ง
    if (!formData.fullName.trim())
      newErrors.fullName = "กรุณากรอกชื่อ-นามสกุล ผู้รับ";
    if (!formData.phone.trim()) newErrors.phone = "กรุณากรอกเบอร์โทรศัพท์";
    if (!formData.address.trim()) newErrors.address = "กรุณากรอกที่อยู่จัดส่ง";
    if (!formData.province.trim()) newErrors.province = "กรุณากรอกจังหวัด";
    if (!formData.postalCode.trim())
      newErrors.postalCode = "กรุณากรอกรหัสไปรษณีย์";

    // ตรวจสอบแพ็กเกจกรณีเลือก Subscription
    if (orderType === "subscription" && !selectedPlan) {
      newErrors.selectedPlan = "กรุณาเลือกแพ็กเกจ Subscription";
    }

    // ตรวจสอบวิธีชำระเงิน
    if (!formData.paymentMethod) {
      newErrors.paymentMethod = "กรุณาเลือกวิธีชำระเงิน";
    }

    // ตรวจสอบบัตรเครดิต
    if (formData.paymentMethod === "CreditCard") {
      if (!cardData.cardNumber.trim())
        newErrors.cardNumber = "กรุณากรอกหมายเลขบัตรเครดิต";
      if (!cardData.expDate.trim()) newErrors.expDate = "กรุณากรอกวันหมดอายุ";
      if (!cardData.cvv.trim()) newErrors.cvv = "กรุณากรอก CVV";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: null });
  };

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCardData({ ...cardData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: null });
  };

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      orderId: "TT-" + Math.floor(100000 + Math.random() * 900000),
      userId: currentUserId,
      orderType,
      items:
        orderType === "alacarte" ? initialCartItems : [{ plan: selectedPlan }],
      shippingAddress: formData,
      totalAmount,
      earnedPoints,
      paymentMethod: formData.paymentMethod,
    };

    if (formData.paymentMethod === "PromptPay") {
      setPendingOrderPayload(payload);
      setShowPaymentModal(true);
    } else {
      navigate("/order-success", { state: payload });
    }
  };

  const handleConfirmPromptPay = () => {
    setShowPaymentModal(false);
    navigate("/order-success", { state: pendingOrderPayload });
  };

  return (
    <div className="bg-[#FAF6F0] min-h-screen py-10 px-4 sm:px-6 lg:px-8 font-sans text-[#3D2E2B]">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 border-b border-[#E8DFC8] pb-6">
          <span className="text-xs font-semibold text-[#8C7A6B] tracking-widest uppercase">
            CHECKOUT FLOW
          </span>
          <h1 className="text-3xl font-bold text-[#3D2E2B]">
            สรุปรายการสั่งซื้อ & ชำระเงิน
          </h1>
        </div>

        <form
          onSubmit={handleSubmitOrder}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: เลือกรูปแบบการสั่งซื้อ */}
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
                  className={`p-4 rounded-xl border text-center font-semibold transition-all text-sm ${
                    orderType === "alacarte"
                      ? "border-[#3D2E2B] bg-[#3D2E2B] text-white shadow-sm"
                      : "border-[#E8DFC8] bg-[#FAF6F0] text-[#3D2E2B]"
                  }`}
                >
                  ซื้อรายชุด (A La Carte)
                </button>
                <button
                  type="button"
                  onClick={() => setOrderType("subscription")}
                  className={`p-4 rounded-xl border text-center font-semibold transition-all text-sm ${
                    orderType === "subscription"
                      ? "border-[#3D2E2B] bg-[#3D2E2B] text-white shadow-sm"
                      : "border-[#E8DFC8] bg-[#FAF6F0] text-[#3D2E2B]"
                  }`}
                >
                  สมัคร Subscription รายสัปดาห์
                </button>
              </div>

              {/* แสดงตัวเลือก Size S/M/L/XL เมื่อเลือก Subscription */}
              {orderType === "subscription" && (
                <div className="mt-4 pt-4 border-t border-[#F3EBDD] space-y-3">
                  <label className="block text-xs font-semibold text-[#8C7A6B]">
                    เลือกขนาดแพ็กเกจ (Subscription Plan) *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {subscriptionPlans.map((plan) => (
                      <button
                        key={plan.id}
                        type="button"
                        onClick={() => {
                          setSelectedPlan(plan.id);
                          if (errors.selectedPlan)
                            setErrors({ ...errors, selectedPlan: null });
                        }}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          selectedPlan === plan.id
                            ? "border-[#8C6239] bg-[#FAF6F0] ring-2 ring-[#8C6239]"
                            : "border-[#E8DFC8] bg-white hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-sm text-[#3D2E2B]">
                            {plan.name}
                          </span>
                          <span className="font-extrabold text-sm text-[#8C6239]">
                            ฿{plan.price}
                          </span>
                        </div>
                        <p className="text-xs text-[#8C7A6B]">{plan.detail}</p>
                      </button>
                    ))}
                  </div>
                  {errors.selectedPlan && (
                    <p className="text-red-500 text-xs mt-1 font-semibold">
                      ⚠️ {errors.selectedPlan}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Step 2: ข้อมูลจัดส่ง & ช่องทางชำระเงิน */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E8DFC8]">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#3D2E2B] text-white text-xs flex items-center justify-center">
                  2
                </span>
                ที่อยู่สำหรับจัดส่ง
              </h2>

              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="ชื่อ-นามสกุล ผู้รับ *"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={`w-full p-3 rounded-xl border text-sm outline-none transition-all ${
                      errors.fullName
                        ? "border-red-500 bg-red-50/20"
                        : "border-[#E8DFC8] focus:border-[#3D2E2B]"
                    }`}
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-xs mt-1 font-semibold">
                      ⚠️ {errors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    name="phone"
                    placeholder="เบอร์โทรศัพท์ *"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full p-3 rounded-xl border text-sm outline-none transition-all ${
                      errors.phone
                        ? "border-red-500 bg-red-50/20"
                        : "border-[#E8DFC8] focus:border-[#3D2E2B]"
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1 font-semibold">
                      ⚠️ {errors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <textarea
                    name="address"
                    placeholder="ที่อยู่จัดส่ง *"
                    rows={3}
                    value={formData.address}
                    onChange={handleInputChange}
                    className={`w-full p-3 rounded-xl border text-sm outline-none transition-all ${
                      errors.address
                        ? "border-red-500 bg-red-50/20"
                        : "border-[#E8DFC8] focus:border-[#3D2E2B]"
                    }`}
                  />
                  {errors.address && (
                    <p className="text-red-500 text-xs mt-1 font-semibold">
                      ⚠️ {errors.address}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      name="province"
                      placeholder="จังหวัด *"
                      value={formData.province}
                      onChange={handleInputChange}
                      className={`w-full p-3 rounded-xl border text-sm outline-none transition-all ${
                        errors.province
                          ? "border-red-500 bg-red-50/20"
                          : "border-[#E8DFC8] focus:border-[#3D2E2B]"
                      }`}
                    />
                    {errors.province && (
                      <p className="text-red-500 text-xs mt-1 font-semibold">
                        ⚠️ {errors.province}
                      </p>
                    )}
                  </div>

                  <div>
                    <input
                      type="text"
                      name="postalCode"
                      placeholder="รหัสไปรษณีย์ *"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className={`w-full p-3 rounded-xl border text-sm outline-none transition-all ${
                        errors.postalCode
                          ? "border-red-500 bg-red-50/20"
                          : "border-[#E8DFC8] focus:border-[#3D2E2B]"
                      }`}
                    />
                    {errors.postalCode && (
                      <p className="text-red-500 text-xs mt-1 font-semibold">
                        ⚠️ {errors.postalCode}
                      </p>
                    )}
                  </div>
                </div>

                {/* เลือกวิธีชำระเงิน */}
                <div className="pt-4 border-t border-[#F3EBDD]">
                  <label className="block text-xs font-semibold text-[#8C7A6B] mb-2">
                    วิธีชำระเงิน *
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { key: "PromptPay", label: "พร้อมเพย์" },
                      { key: "CreditCard", label: "บัตรเครดิต" },
                      { key: "COD", label: "เก็บเงินปลายทาง" },
                    ].map((item) => (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, paymentMethod: item.key });
                          if (errors.paymentMethod)
                            setErrors({ ...errors, paymentMethod: null });
                        }}
                        className={`p-3 rounded-xl border text-xs font-semibold transition-all ${
                          formData.paymentMethod === item.key
                            ? "border-[#3D2E2B] bg-[#3D2E2B] text-white shadow-sm"
                            : "border-[#E8DFC8] bg-white text-[#3D2E2B]"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                  {errors.paymentMethod && (
                    <p className="text-red-500 text-xs mt-1 font-semibold">
                      ⚠️ {errors.paymentMethod}
                    </p>
                  )}
                </div>

                {/* ฟอร์มกรอกบัตรเครดิต */}
                {formData.paymentMethod === "CreditCard" && (
                  <div className="mt-4 p-4 rounded-xl bg-[#FAF6F0] border border-[#E8DFC8] space-y-3">
                    <p className="text-xs font-bold text-[#3D2E2B]">
                      ข้อมูลบัตรเครดิต / เดบิต
                    </p>
                    <div>
                      <input
                        type="text"
                        name="cardNumber"
                        placeholder="หมายเลขบัตร 16 หลัก"
                        value={cardData.cardNumber}
                        onChange={handleCardChange}
                        className={`w-full p-2.5 rounded-lg border text-sm bg-white outline-none ${
                          errors.cardNumber
                            ? "border-red-500"
                            : "border-[#E8DFC8]"
                        }`}
                      />
                      {errors.cardNumber && (
                        <p className="text-red-500 text-xs mt-1 font-semibold">
                          ⚠️ {errors.cardNumber}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <input
                          type="text"
                          name="expDate"
                          placeholder="MM/YY"
                          value={cardData.expDate}
                          onChange={handleCardChange}
                          className={`w-full p-2.5 rounded-lg border text-sm bg-white outline-none ${
                            errors.expDate
                              ? "border-red-500"
                              : "border-[#E8DFC8]"
                          }`}
                        />
                        {errors.expDate && (
                          <p className="text-red-500 text-xs mt-1 font-semibold">
                            ⚠️ {errors.expDate}
                          </p>
                        )}
                      </div>

                      <div>
                        <input
                          type="password"
                          name="cvv"
                          placeholder="CVV"
                          maxLength="4"
                          value={cardData.cvv}
                          onChange={handleCardChange}
                          className={`w-full p-2.5 rounded-lg border text-sm bg-white outline-none ${
                            errors.cvv ? "border-red-500" : "border-[#E8DFC8]"
                          }`}
                        />
                        {errors.cvv && (
                          <p className="text-red-500 text-xs mt-1 font-semibold">
                            ⚠️ {errors.cvv}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ฝั่งขวา: สรุปคำสั่งซื้อ */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E8DFC8] sticky top-6">
              <h2 className="text-lg font-bold mb-4">สรุปยอดคำสั่งซื้อ</h2>
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

              <button
                type="submit"
                className="w-full bg-[#3D2E2B] text-white py-3.5 rounded-full font-bold text-sm hover:bg-[#2A1F1D] transition-all shadow-md active:scale-[0.99]"
              >
                {formData.paymentMethod === "COD"
                  ? `ยืนยันสั่งซื้อ (เก็บเงินปลายทาง ฿${totalAmount})`
                  : `ชำระเงิน (฿${totalAmount})`}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Modal สแกน PromptPay QR Code */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl space-y-5 border border-[#E8DFC8]">
            <div>
              <span className="text-[10px] font-extrabold tracking-wider bg-[#113566] text-white px-3 py-1 rounded-full uppercase">
                PromptPay
              </span>
              <h3 className="text-lg font-bold text-[#3D2E2B] mt-2">
                สแกนเพื่อชำระเงิน
              </h3>
              <p className="text-xs text-[#8C7A6B] mt-1">
                เปิดแอปธนาคารของคุณ แล้วสแกน QR Code ด้านล่าง
              </p>
            </div>

            <div className="bg-white p-3 rounded-2xl border-2 border-dashed border-[#E8DFC8] inline-block shadow-inner">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=PROMPTPAY_${totalAmount}`}
                alt="PromptPay QR Code"
                className="mx-auto rounded-lg"
              />
            </div>

            <div className="bg-[#FAF6F0] py-2.5 px-4 rounded-xl border border-[#E8DFC8] flex justify-between items-center text-xs">
              <span className="text-[#8C7A6B] font-medium">
                ยอดชำระทั้งสิ้น
              </span>
              <span className="text-base font-bold text-[#8C6239]">
                ฿{totalAmount}
              </span>
            </div>

            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 py-3 rounded-xl border border-[#E8DFC8] text-xs font-semibold text-[#8C7A6B] hover:bg-gray-50 transition-all"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={handleConfirmPromptPay}
                className="flex-1 py-3 rounded-xl bg-[#3D2E2B] text-white text-xs font-semibold hover:bg-[#2A1F1D] shadow-md transition-all active:scale-95"
              >
                ฉันชำระเงินแล้ว
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
