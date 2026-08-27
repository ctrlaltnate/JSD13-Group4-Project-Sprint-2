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
  const timeoutRef = useRef(null);

  // =========================================================================
  // 🔊 [ระบบเสียง WEB AUDIO API]
  // -------------------------------------------------------------------------
  // 💡 เหตุผล:
  // สร้างเสียง Tick สั้นๆ ตอนสลับเมนู เพื่อให้ผู้ใช้รู้สึกถึงจังหวะการสุ่ม (Feedback)
  // ใช้ Web Audio API โดยไม่ต้องดึงไฟล์ .mp3 ให้เบราว์เซอร์โหลดช้า
  // =========================================================================
  const audioContextRef = useRef(null);

  const playTickSound = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (
          window.AudioContext || window.webkitAudioContext
        )();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === "suspended") ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.03);

      gain.gain.setValueAtTime(0.08, ctx.currentTime); // ปรับความดังเบาๆ ละมุนหู
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.03);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.03);
    } catch (e) {
      // ดักจับกรณีเบราว์เซอร์ไม่รองรับ AudioContext
    }
  };

  const handleRandomize = () => {
    if (isSpinning) return;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    // 1. แปลง Data จาก Object (dish_001, dish_002) ให้เป็น Array
    const allDishes = Array.isArray(rawDishes)
      ? rawDishes
      : typeof rawDishes === "object" && rawDishes !== null
        ? Object.values(rawDishes)
        : [];

    if (allDishes.length === 0) return;

    // =========================================================================
    // 📌 [จุดจำลองข้อมูล (MOCKUP LOGIC) - อนาคตต้องปรับแก้ตรงนี้]
    // -------------------------------------------------------------------------
    // 💡 เหตุผลที่ต้องจำลอง:
    // ปัจจุบันใน dishes.js ยังไม่มี field "element" (เนื่องจากรอระบบคำนวณธาตุจากวัตถุดิบ)
    // เราจึงต้องกรองข้อมูลโดยใช้ Logic สำรองไปก่อน เพื่อให้หน้าสุ่มเมนูทำงานและสุ่มได้จริง
    // =========================================================================
    const filteredDishes = allDishes.filter((dish) => {
      if (!dish) return false;

      // -----------------------------------------------------------------------
      // 🟢 [ระบบจริงในอนาคต (PRODUCTION LOGIC)]
      // ถ้า Backend หรือทีมคำนวณวัตถุดิบแล้วส่ง field "element" (เช่น "earth", "water")
      // หรือ "elementId" มาใน Object ของ dish... โค้ดบรรทัดนี้จะทำงานทันที!
      // -----------------------------------------------------------------------
      const actualElement = dish.element || dish.elementId;
      if (actualElement) {
        return actualElement.toLowerCase() === selectedElement.toLowerCase();
      }

      // -----------------------------------------------------------------------
      // 🟡 [ระบบจำลองชั่วคราว (TEMP MOCK MAPPING)]
      // **อนาคตลบท่อนนี้ออกได้เลย** เมื่อใน dishes.js มีการใส่ element มาให้ครบทุกเมนูแล้ว
      // ท่อนนี้เป็นการเอา dishType และ region มาจับคู่กับธาตุชั่วคราวเพื่อให้สุ่มได้ไม่ซ้ำ
      // -----------------------------------------------------------------------
      const tempElementMapping = {
        earth: ["dip", "stew", "northern"], // ธาตุดิน: น้ำพริก / อาหารเหนือ (เช่น น้ำพริกอ่อง, แกงฮังเล)
        water: ["noodle", "soup", "southern"], // ธาตุน้ำ: เมนูเส้น / อาหารใต้ (เช่น ข้าวซอย)
        air: ["salad", "stir-fry", "isan"], // ธาตุลม: ลาบ / ผัด / อาหารอีสาน (เช่น ลาบคั่ว)
        fire: ["grill", "curry", "central"], // ธาตุไฟ: ปิ้งย่าง / อาหารภาคกลาง
      };

      const matchedKeywords = tempElementMapping[selectedElement] || [];
      return (
        matchedKeywords.includes(dish.dishType) ||
        matchedKeywords.includes(dish.region)
      );
    });

    // 🔴 Fallback: หากธาตุนั้นๆ ยังไม่มีเมนูที่ตรงเลย ให้ดึงเมนูทั้งหมดมาสุ่มแทน เพื่อป้องกัน UI ค้าง/ว่างเปล่า
    const targetList = filteredDishes.length > 0 ? filteredDishes : allDishes;

    // =========================================================================
    // 🎰 [ระบบ ANIMATION การสุ่มสลับเมนู (SPINNING LOGIC)]
    // -------------------------------------------------------------------------
    // ส่วนนี้เป็น UI Logic สมบูรณ์แล้ว ไม่จำเป็นต้องแก้ตอนเชื่อม backend ครับ
    // =========================================================================
    setIsSpinning(true);

    let currentStep = 0;
    const totalSteps = 25; // จำนวนรอบที่จะให้เมนูกระพริบสลับ
    let currentDelay = 40; // ความเร็วเริ่มต้น (มิลลิวินาที)

    const runSpin = () => {
      const randomIndex = Math.floor(Math.random() * targetList.length);
      setCurrentDish(targetList[randomIndex]);

      // 🔊 เล่นเสียง Tick ตามจังหวะกระพริบเปลี่ยนเมนู
      playTickSound();

      currentStep++;

      if (currentStep < totalSteps) {
        // ชะลอความเร็วช่วงท้าย (รอบที่ 12 เป็นต้นไป) เพื่อสร้างความตื่นเต้น
        if (currentStep > 12) {
          currentDelay += 25;
        }
        timeoutRef.current = setTimeout(runSpin, currentDelay);
      } else {
        // สุ่มเลือกรอบสุดท้ายเพื่อเฉลยเมนู
        const finalIndex = Math.floor(Math.random() * targetList.length);
        setCurrentDish(targetList[finalIndex]);
        setIsSpinning(false);
      }
    };

    runSpin();
  };

  useEffect(() => {
    handleRandomize();
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedElement]);

  // =========================================================================
  // 📌 [จุดที่จะต้องปรับเพิ่มเมื่อต่อกับระบบจริง (CART INTEGRATION NOTE)]
  // -------------------------------------------------------------------------
  // 💡 สถานะปัจจุบัน:
  // ใช้ alert() แสดงข้อความจำลองเพื่อทดสอบการกดปุ่มสั่งซื้อจากหน้าสุ่ม
  //
  // 🟢 สิ่งที่ต้องทำในอนาคต (เมื่อเพื่อนในทีมทำระบบ CartContext เสร็จ):
  // 1. นำเข้า useCart จากไฟล์ Context ของเพื่อน เช่น:
  //    import { useCart } from "../context/CartContext.jsx";
  //
  // 2. เรียกใช้ฟังก์ชัน addToCart ภายใน Component เช่น:
  //    const { addToCart } = useCart();
  //
  // 3. เปลี่ยนจากการใช้ alert ด้านล่างนี้ เป็นการส่งข้อมูลเข้า Cart โดยตรง:
  //    addToCart(dish);
  // =========================================================================
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
