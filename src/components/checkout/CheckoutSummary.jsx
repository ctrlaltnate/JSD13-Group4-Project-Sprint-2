import React from "react";
import { SHIPPING_FEE } from "../../constants/checkout";

const DEFAULT_ITEMS = [
  {
    name: "แกงส้มใต้ปลากะพงยอดยอดมะพร้าว",
    desc: "วัตถุดิบสดใหม่ + เครื่องแกงโฮมเมด",
    qty: 1,
  },
  { name: "ลาบหมูคั่วเมืองเหนือ", desc: "พริกลาบมะแขว่นหอมๆ", qty: 1 },
  {
    name: "แกงเขียวหวานไก่บ้าน",
    desc: "มะเขือเปราะกรอบ + พริกแกงสูตรโบราณ",
    qty: 1,
  },
  { name: "ต้มข่าไก่เห็ดฟาง", desc: "รสชาติเข้มข้น หอมกะทิสด", qty: 1 },
];

export default function CheckoutSummary({
  selectedPlan,
  itemsSubtotal,
  grandTotal,
  earnedPoints,
}) {
  return (
    <div className="bg-[#fcf8f2] border border-[#e8dfd1] rounded-3xl p-6 shadow-sm sticky top-6">
      <div className="flex justify-between items-center border-b border-[#e8dfd1] pb-4 mb-4">
        <h2 className="text-xl font-bold text-[#3d2c2e]">สรุปคำสั่งซื้อ</h2>
        <span className="text-xs bg-[#3d2c2e] text-white px-3 py-1 rounded-full">
          {selectedPlan.name} - {selectedPlan.kitsPerWeek} Kits
        </span>
      </div>

      <div className="space-y-4 mb-6">
        {DEFAULT_ITEMS.map((item, idx) => (
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
          <span className="font-medium text-[#2f2119]">฿{SHIPPING_FEE}</span>
        </div>
      </div>

      <div className="border-t border-[#3d2c2e]/20 pt-4 mt-4 flex justify-between items-baseline">
        <span className="font-bold text-[#3d2c2e] text-base">ยอดชำระสุทธิ</span>
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
  );
}
