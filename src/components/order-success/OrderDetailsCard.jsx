import React from "react";

export default function OrderDetailsCard({ orderData }) {
  const { orderId, deliveryDate, shippingAddress, grandTotal } = orderData;

  return (
    <div className="bg-white border border-[#e8dfd1] rounded-2xl p-5 text-left text-xs space-y-3 mb-8">
      <div className="flex justify-between border-b border-[#e8dfd1] pb-2">
        <span className="text-[#6f675f]">หมายเลขคำสั่งซื้อ:</span>
        <span className="font-bold text-[#3d2c2e]">{orderId}</span>
      </div>
      <div className="flex justify-between border-b border-[#e8dfd1] pb-2">
        <span className="text-[#6f675f]">รอบการจัดส่ง:</span>
        <span className="font-bold text-[#8d593a]">
          {deliveryDate} (จัดส่งช่วงเช้า)
        </span>
      </div>
      <div className="flex justify-between border-b border-[#e8dfd1] pb-2">
        <span className="text-[#6f675f]">ผู้รับ:</span>
        <span className="font-medium text-[#2f2119]">
          {shippingAddress?.fullName} ({shippingAddress?.phone})
        </span>
      </div>
      <div className="flex justify-between border-b border-[#e8dfd1] pb-2">
        <span className="text-[#6f675f]">ที่อยู่จัดส่ง:</span>
        <span className="font-medium text-[#2f2119] text-right max-w-[60%]">
          {shippingAddress?.address}
        </span>
      </div>
      <div className="flex justify-between pt-1">
        <span className="text-sm font-bold text-[#3d2c2e]">ยอดชำระสุทธิ:</span>
        <span className="text-base font-bold text-[#8d593a]">
          ฿{grandTotal?.toLocaleString()} THB
        </span>
      </div>
    </div>
  );
}
