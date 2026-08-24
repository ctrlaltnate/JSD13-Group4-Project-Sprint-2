import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import hero1 from "../../assets/hero-1.jpg"
const slides = [
  {
    title: "กินให้ตรงธาตุ ดูแลสุขภาพจากทุกมื้อ",
    description:
      "ค้นหาธาตุเจ้าเรือนและเลือกอาหารที่สอดคล้องกับร่างกาย เป้าหมายสุขภาพ และวิถีชีวิตของคุณ",
    image:
      "https://cdn.prod.website-files.com/64c167650e120b1b88d297d3/653657450580816a6a3eeede_Five-Elements-Nutrition.jpeg",
    primary: ["ค้นหาธาตุของคุณ", "#personalized"],
    secondary: ["ดูแนวคิดธาตุแท้", "#personalized"],
  },
  {
    title: "เปิดกล่อง แล้วปรุงรสชาติไทยได้เลย",
    description:
      "วัตถุดิบพอดีมื้อจากเมนูไทย 4 ภาค พร้อมสูตรทีละขั้นและข้อมูลโภชนาการ ทำอาหารเองได้ง่ายโดยไม่ต้องซื้อของเหลือ",
    image:
      hero1,
    primary: ["เลือก Cooking Kit", "#kits"],
    secondary: ["ดูแพ็กเกจรายสัปดาห์", "#plans"],
    benefits: ["วัตถุดิบแบ่งพอดี", "สูตรทำตามง่าย", "ส่งสดทุกสัปดาห์"],
  },
  {
    title: "วัตถุดิบสดจากชุมชน รายได้กลับสู่เกษตรกร",
    description:
      "เราคัดเลือกผลผลิตตามฤดูกาลจากเกษตรกรท้องถิ่นอย่างเป็นธรรม เพื่อความสดใหม่ในทุกกล่องและชุมชนที่เติบโตไปด้วยกัน",
    image:
       "https://www.eastwestseed.com/wp-content/uploads/2026/05/DSC_1568.jpg",
    primary: ["รู้จักแหล่งวัตถุดิบ", "#local-sourcing"],
    secondary: ["ดูสิ่งที่อยู่ในกล่อง", "#local-sourcing"],
  },
];

export default function HeroSection() {
  const heroRef = useRef(null);
  const contentRef = useRef(null);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(
      () => setCurrent((value) => (value + 1) % slides.length),
      6000,
    );
    return () => window.clearInterval(timer);
  }, [paused]);

  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const animation = gsap.fromTo(
      contentRef.current.children,
      { autoAlpha: 0, y: 22 },
      { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.08, ease: "power3.out" },
    );
    return () => animation.revert();
  }, [current]);

  const slide = slides[current];
  const goTo = (index) => setCurrent((index + slides.length) % slides.length);

  return (
    <section
      ref={heroRef}
      className="relative isolate -mt-20 flex min-h-[680px] items-center overflow-hidden text-white sm:-mt-24 lg:min-h-[760px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-label="That-tae ธาตุแท้ showcase"
    >
      {slides.map((item, index) => (
        <img
          key={item.image}
          src={item.image}
          alt=""
          aria-hidden={index !== current}
          className={`absolute inset-0 -z-20 h-full w-full object-cover transition-opacity duration-700 ${index === current ? "opacity-100" : "opacity-0"}`}
        />
      ))}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(35,22,17,.92)_0%,rgba(35,22,17,.7)_48%,rgba(35,22,17,.15)_82%)] max-sm:bg-black/60" />

      <div className="home-container py-24">
        <div ref={contentRef} className="max-w-3xl" aria-live="polite">
          <p className="text-xs font-bold uppercase tracking-[.24em] text-[#f1dec9]">
            That-tae · ธาตุแท้ 
          </p>
          <h1 className="mt-5 text-5xl font-bold leading-relaxed sm:text-6xl lg:text-7xl">
            {slide.title}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-white/80 sm:text-lg">
            {slide.description}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={slide.primary[1]}
              className="shimmer-button rounded-full bg-white px-7 py-3.5 font-bold text-[#3d2c2e] transition-colors hover:bg-[#f1dec9]"
            >
              {slide.primary[0]}
            </a>
            <a
              href={slide.secondary[1]}
              className="rounded-full border border-white/40 bg-black/10 px-7 py-3.5 font-bold backdrop-blur-sm transition-colors hover:bg-white/15"
            >
              {slide.secondary[0]}
            </a>
          </div>
          {slide.benefits && (
            <div className="mt-9 flex flex-wrap gap-x-7 gap-y-2 text-sm text-white/75">
              {slide.benefits.map((item) => (
                <span key={item}>✓ {item}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={() => goTo(current - 1)}
        aria-label="สไลด์ก่อนหน้า"
        className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/30 bg-black/15 text-3xl backdrop-blur-sm hover:bg-black/30 sm:left-6"
      >
        ‹
      </button>
      <button
        type="button"
        onClick={() => goTo(current + 1)}
        aria-label="สไลด์ถัดไป"
        className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/30 bg-black/15 text-3xl backdrop-blur-sm hover:bg-black/30 sm:right-6"
      >
        ›
      </button>
      <div className="absolute bottom-7 left-1/2 flex -translate-x-1/2 gap-2">
        {slides.map((item, index) => (
          <button
            key={item.title}
            type="button"
            onClick={() => goTo(index)}
            aria-label={`แสดงสไลด์ ${index + 1}`}
            aria-current={index === current ? "true" : undefined}
            className={`h-2 rounded-full transition-all ${index === current ? "w-12 bg-white" : "w-5 bg-white/45 hover:bg-white/70"}`}
          />
        ))}
      </div>
    </section>
  );
}
