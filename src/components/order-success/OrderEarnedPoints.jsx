import React from "react";

export default function OrderEarnedPoints({ points }) {
  return (
    <div className="bg-[#f6ede5] border border-[#e8dfd1] rounded-2xl p-4 mb-6">
      <p className="text-xs text-[#8d593a] font-semibold">
        แต้มสะสมที่จะได้รับจากคำสั่งซื้อนี้
      </p>
      <p className="text-2xl font-bold text-[#3d2c2e] mt-0.5">
        +{points} Points 🌟
      </p>
    </div>
  );
}
