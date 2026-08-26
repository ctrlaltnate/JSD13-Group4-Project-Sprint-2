import React from "react";

export default function RandomResultCard({
  dish,
  isSpinning,
  onRandomize,
  onAddToCart,
}) {
  if (!dish) return null;

  return (
    <div className="bg-[#FAF7F2] p-6 rounded-2xl shadow-sm border border-[#EBE5DF] max-w-xl mx-auto mt-6">
      <div className="flex justify-between items-center mb-3">
        <span className="text-xs font-bold text-[#8C7B73] bg-[#EFEBE4] px-3 py-1 rounded-full">
          เมนูตามธาตุ
        </span>
        <span className="text-xl font-extrabold text-[#3D2E2B]">
          ฿{dish.price || dish.priceThb || 0}
        </span>
      </div>

      {/* 
        จุดสำคัญ: แสดงชื่อเมนูตลอดเวลา 
        ช่วง isSpinning = true ให้ใส่ Effect เบลอ/ย่อเล็กน้อย เพื่อให้ดูเหมือนกำลังวิ่งรัวๆ 
      */}
      <div className="min-h-[90px] flex flex-col justify-center my-2">
        <h3
          className={`text-2xl font-bold text-[#3D2E2B] transition-all duration-75 ${
            isSpinning
              ? "blur-[1px] opacity-70 scale-[0.98] select-none"
              : "blur-0 opacity-100 scale-100"
          }`}
        >
          {dish.name || dish.nameTh || "กำลังเลือกเมนู..."}
        </h3>

        <p
          className={`text-xs text-[#63534B] mt-2 leading-relaxed transition-all duration-75 ${
            isSpinning ? "opacity-40 blur-[0.5px]" : "opacity-100"
          }`}
        >
          {dish.description || dish.desc || "..."}
        </p>
      </div>

      {/* ปุ่มกด Action */}
      <div className="flex gap-3 mt-6">
        <button
          onClick={onRandomize}
          disabled={isSpinning}
          className="flex-1 py-3 px-4 bg-[#EFEBE4] hover:bg-[#E2DCD5] text-[#3D2E2B] rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <span>✨</span> {isSpinning ? "กำลังสุ่ม..." : "สุ่มใหม่อีกครั้ง"}
        </button>

        <button
          onClick={() => onAddToCart(dish)}
          disabled={isSpinning}
          className="flex-1 py-3 px-4 bg-[#3D2E2B] hover:bg-[#2A1F1D] text-white rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <span>🛒</span> สั่งซื้อเมนูนี้เลย
        </button>
      </div>
    </div>
  );
}
