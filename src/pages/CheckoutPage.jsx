import React, { useState } from "react";
import { users } from "../mock-data/users";
import { SUBSCRIPTION_PLANS, PAYMENT_METHODS } from "../constants/checkout";
import {
  calculateEarnedPoints,
  calculateGrandTotal,
  generatePromptPayQrUrl,
} from "../utils/checkoutHelpers";

import CheckoutUserStatus from "../components/checkout/CheckoutUserStatus";
import ShippingForm from "../components/checkout/ShippingForm";
import PaymentMethodSelector from "../components/checkout/PaymentMethodSelector";
import CheckoutSummary from "../components/checkout/CheckoutSummary";

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
        <div className="text-center mb-8">
          <span className="text-xs font-bold uppercase tracking-[.22em] text-[#8d593a]">
            SECURE CHECKOUT
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#3d2c2e] mt-1">
            ยืนยันการสั่งซื้อ
          </h1>
        </div>

        <CheckoutUserStatus currentUser={currentUser} />

        <form
          onSubmit={handleSubmitOrder}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          <div className="lg:col-span-7 flex flex-col gap-6">
            <ShippingForm
              formData={formData}
              onChange={handleInputChange}
              onDateChange={(date) =>
                setFormData((prev) => ({ ...prev, deliveryDate: date }))
              }
            />
            <PaymentMethodSelector
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              promptPayQrUrl={promptPayQrUrl}
              cardData={cardData}
              onCardInputChange={handleCardInputChange}
            />
          </div>

          <div className="lg:col-span-5">
            <CheckoutSummary
              selectedPlan={selectedPlan}
              itemsSubtotal={itemsSubtotal}
              grandTotal={grandTotal}
              earnedPoints={earnedPoints}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
