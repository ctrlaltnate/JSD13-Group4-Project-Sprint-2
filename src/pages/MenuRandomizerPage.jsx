import React, { useState, useEffect, useRef } from "react";
import ElementSelector from "../components/menu-randomizer/ElementSelector.jsx";
import RandomResultCard from "../components/menu-randomizer/RandomResultCard.jsx";

import * as DishesModule from "../mock-data/dishes.js";

const rawDishes =
  DishesModule.default ||
  DishesModule.dishes ||
  DishesModule.mockDishes ||
  DishesModule.DISHES ||
  [];

export default function MenuRandomizerPage() {
  const [selectedElement, setSelectedElement] = useState("earth");
  const [currentDish, setCurrentDish] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const timeoutRef = useRef(null); // เปลี่ยนจาก interval มาใช้ timeout ref

  const handleRandomize = () => {
    if (isSpinning) return;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    const allDishes = Array.isArray(rawDishes)
      ? rawDishes
      : typeof rawDishes === "object" && rawDishes !== null
        ? Object.values(rawDishes)
        : [];

    if (allDishes.length === 0) return;

    const filteredDishes = allDishes.filter((dish) => {
      if (!dish) return false;
      const elem = (dish.element || dish.elementId || "").toLowerCase();
      return elem === selectedElement.toLowerCase();
    });

    const targetList = filteredDishes.length > 0 ? filteredDishes : allDishes;

    setIsSpinning(true);

    let currentStep = 0;
    const totalSteps = 25; // จำนวนครั้งที่จะสลับเมนูก่อนหยุด
    let currentDelay = 40; // ความเร็วเริ่มต้น (ยิ่งน้อยยิ่งวิ่งเร็ว)

    // ฟังก์ชันวนลูปสุ่มแบบเพิ่ม Delay ชะลอความเร็วช่วงท้าย
    const runSpin = () => {
      const randomIndex = Math.floor(Math.random() * targetList.length);
      setCurrentDish(targetList[randomIndex]);

      currentStep++;

      if (currentStep < totalSteps) {
        // เมื่อวิ่งเกินครึ่งทาง (รอบที่ 12 ขึ้นไป) ให้บวก Delay เพิ่มขึ้นเรื่อยๆ เพื่อชะลอความเร็ว
        if (currentStep > 12) {
          currentDelay += 25; // เพิ่มเวลาหน่วงเข้าไปทีละนิด
        }

        timeoutRef.current = setTimeout(runSpin, currentDelay);
      } else {
        // เลือกรอบสุดท้ายเพื่อเฉลย
        const finalIndex = Math.floor(Math.random() * targetList.length);
        setCurrentDish(targetList[finalIndex]);
        setIsSpinning(false);
      }
    };

    // เริ่มรันรอบแรก
    runSpin();
  };

  useEffect(() => {
    handleRandomize();
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedElement]);

  const handleAddToCart = (dish) => {
    if (!dish) return;
    alert(
      `เพิ่ม "${dish.name || dish.nameTh || "เมนูอาหาร"}" ลงในตะกร้าเรียบร้อยแล้วครับ!`,
    );
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <span className="text-xs font-bold text-[#8C7B73] tracking-widest uppercase block mb-1">
            MENU RANDOMIZER
          </span>
          <h1 className="text-3xl font-black text-[#3D2E2B] tracking-tight mb-2">
            สุ่มเมนูอาหารตามธาตุ
          </h1>
          <p className="text-xs text-[#63534B]">
            เลือกธาตุเจ้าเรือนของคุณ เพื่อให้เราแนะนำเมนูอาหารปรับสมดุลมื้อนี้
          </p>
        </div>

        <ElementSelector
          selectedElement={selectedElement}
          onSelect={setSelectedElement}
        />

        <RandomResultCard
          dish={currentDish}
          isSpinning={isSpinning}
          onRandomize={handleRandomize}
          onAddToCart={handleAddToCart}
        />
      </div>
    </div>
  );
}
