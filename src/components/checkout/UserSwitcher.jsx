import React, { useState } from "react";
import mockUsers from "../../mock-data/users";

export default function UserSwitcher({ currentUserId, onSelectUser }) {
  const [isOpen, setIsOpen] = useState(false);

  // ค้นหาผู้ใช้ปัจจุบัน หรือใช้คนแรกเป็น Default
  const currentUser =
    mockUsers.find((u) => u.id === currentUserId) || mockUsers[0];

  const handleSelect = (user) => {
    if (onSelectUser) {
      onSelectUser(user.id);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left font-sans">
      {/* ปุ่มกดเปิด Dropdown */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-between gap-x-3 rounded-full bg-[#FAF6F0] px-4 py-2 text-sm font-medium text-[#3D2E2B] shadow-sm border border-[#E8DFC8] hover:bg-[#F3EBDD] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#8C6239]"
      >
        <div className="flex items-center gap-2">
          {/* Avatar จำลอง */}
          <div className="w-6 h-6 rounded-full bg-[#3D2E2B] text-[#FAF6F0] flex items-center justify-center text-xs font-bold">
            {currentUser?.name ? currentUser.name.charAt(0) : "U"}
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs text-[#8C7A6B] leading-none">
              ทดสอบระบบเป็น:
            </span>
            <span className="font-semibold text-[#3D2E2B] leading-tight">
              {currentUser?.name || "เลือก User"}
            </span>
          </div>
        </div>

        {/* ไอคอน ลูกศร */}
        <svg
          className={`w-4 h-4 text-[#8C7A6B] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* เมนูรายการ User */}
      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-64 origin-top-right rounded-2xl bg-white p-2 shadow-xl ring-1 ring-black/5 border border-[#E8DFC8] animate-in fade-in zoom-in-95 duration-100">
          <div className="px-3 py-2 border-b border-[#F3EBDD] mb-1">
            <p className="text-xs font-semibold text-[#8C7A6B] uppercase tracking-wider">
              สลับบัญชีผู้ใช้งาน (Dev Mode)
            </p>
          </div>

          <div className="space-y-1">
            {mockUsers.map((user) => {
              const isSelected = user.id === currentUser?.id;
              return (
                <button
                  key={user.id}
                  onClick={() => handleSelect(user)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all duration-150 flex items-center justify-between ${
                    isSelected
                      ? "bg-[#3D2E2B] text-[#FAF6F0] font-medium"
                      : "text-[#3D2E2B] hover:bg-[#FAF6F0]"
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="font-semibold">{user.name}</span>
                    <span
                      className={`text-xs ${isSelected ? "text-[#D4C3B3]" : "text-[#8C7A6B]"}`}
                    >
                      ID: {user.id} {user.role ? `• ${user.role}` : ""}
                    </span>
                  </div>

                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-[#D4AF37]"></span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
