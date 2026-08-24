import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import cookingImage from "../../assets/feature-thai-cooking.png";
import earthElement from "../../assets/element-earth.png";
import waterElement from "../../assets/element-water.png";
import windElement from "../../assets/element-wind.png";
import fireElement from "../../assets/element-fire.png";

gsap.registerPlugin(ScrollTrigger);

const benefits = [
  {
    number: "01",
    title: "ธาตุเจ้าเรือน",
    text: "เข้าใจพื้นฐานดิน น้ำ ลม ไฟ และเลือกมื้อที่ช่วยดูแลสมดุลในแบบของคุณ",
    icon: "element",
  },
  {
    number: "02",
    title: "เป้าหมายสุขภาพ",
    text: "คัดเมนูให้ตรงความสนใจ ทั้งคุมพลังงาน ลดโซเดียม หรือเพิ่มโปรตีนในแต่ละวัน",
    icon: "target",
  },
  {
    number: "03",
    title: "ข้อจำกัดอาหาร",
    text: "กรองวัตถุดิบที่แพ้ พร้อมดูข้อมูลโภชนาการอย่างชัดเจนก่อนตัดสินใจทุกครั้ง",
    icon: "shield",
  },
];

function BenefitIcon({ name }) {
  const paths = {
    element: (
      <>
        <path d="M12 3.5c2.7 3 4.2 5.5 4.2 7.7A4.2 4.2 0 0 1 12 15.4a4.2 4.2 0 0 1-4.2-4.2C7.8 9 9.3 6.5 12 3.5Z" />
        <path d="M5 17.5c2.2-1.3 4.5-1.1 7 .6 2.5-1.7 4.8-1.9 7-.6" />
      </>
    ),
    target: (
      <>
        <circle cx="12" cy="12" r="7.5" />
        <circle cx="12" cy="12" r="3" />
        <path d="m14.2 9.8 5.3-5.3M16.8 4.5h2.7v2.7" />
      </>
    ),
    shield: (
      <>
        <path d="M12 3.5 19 6v5.3c0 4.2-2.5 7.5-7 9.2-4.5-1.7-7-5-7-9.2V6l7-2.5Z" />
        <path d="m8.8 12 2.1 2.1 4.5-4.5" />
      </>
    ),
  };

  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

export default function FeatureSection() {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) return undefined;

    const context = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 72%",
          once: true,
        },
      });

      timeline
        .from("[data-feature-copy] > *", {
          autoAlpha: 0,
          y: 30,
          duration: 0.7,
          stagger: 0.09,
          ease: "power3.out",
        })
        .from(
          "[data-feature-image]",
          {
            autoAlpha: 0,
            y: 45,
            scale: 0.92,
            rotate: -2,
            duration: 0.9,
            stagger: 0.12,
            ease: "back.out(1.25)",
          },
          0.05,
        )
        .from(
          "[data-feature-card]",
          {
            x: 34,
            duration: 0.65,
            stagger: 0.1,
            ease: "power3.out",
          },
          0.25,
        );

      gsap.to("[data-feature-collage]", {
        y: -30,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2,
        },
      });

      gsap.fromTo(
        "[data-cooking-float]",
        { y: 4, rotation: -5.35 },
        {
          y: -5,
          rotation: 5.5,
          duration: 5.8,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          transformOrigin: "50% 55%",
        },
      );

      gsap.utils.toArray("[data-element]").forEach((element, index) => {
        const directions = [
          { x: -28, y: -48, rotation: -8 },
          { x: 34, y: -62, rotation: 9 },
          { x: -38, y: -24, rotation: 7 },
          { x: 30, y: -38, rotation: -6 },
        ];

        gsap.to(element, {
          ...directions[index],
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 1 + index * 0.18,
          },
        });
      });

      gsap.utils.toArray("[data-element-float]").forEach((element, index) => {
        gsap.to(element, {
          y: index % 2 === 0 ? -13 : 11,
          rotation: index % 2 === 0 ? 6 : -6,
          duration: 3.2 + index * 0.55,
          delay: index * -0.7,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          transformOrigin: "50% 55%",
        });
      });
    }, section);

    return () => context.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="personalized"
      className="home-section relative scroll-mt-24 overflow-hidden bg-[#fdfbf7]"
    >
      <div className="pointer-events-none absolute -left-28 top-20 h-72 w-72 rounded-full bg-[#dba87c]/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-[#82916c]/15 blur-3xl" />

      <div className="home-container relative grid items-center gap-14 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-20">
        <div
          data-feature-collage
          className="relative mx-auto min-h-[510px] w-full max-w-[540px] sm:min-h-[600px]"
        >
          <div className="absolute inset-[4%] rounded-[48%_52%_45%_55%/45%_44%_56%_55%] bg-[#d9b98e] shadow-[0_35px_90px_rgba(89,55,35,0.2)]" />

          <div
            data-feature-image
            className="absolute inset-[7%] z-10"
          >
            <figure
              data-cooking-float
              className="relative h-full w-full overflow-hidden rounded-[2.5rem] border-[7px] border-white bg-[#f8ecd7] shadow-[0_28px_70px_rgba(61,44,46,0.24)]"
            >
              <img
                src={cookingImage}
                alt="มือกำลังปรุงแกงสมุนไพรไทยในกระทะ"
                className="h-full w-full scale-[1.02] object-cover object-center"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(37,25,17,.32)_100%)]" />
            </figure>
          </div>

          <div
            data-element
            className="pointer-events-none absolute -left-[12%] bottom-[-2%] z-20 w-[37%] drop-shadow-[0_18px_20px_rgba(50,30,18,.3)]"
          >
            <img data-element-float src={earthElement} alt="" className="w-full" />
          </div>
          <div
            data-element
            className="pointer-events-none absolute -right-[7%] bottom-[5%] z-20 w-[25%] drop-shadow-[0_12px_14px_rgba(24,73,92,.24)]"
          >
            <img data-element-float src={waterElement} alt="" className="w-full" />
          </div>
          <div
            data-element
            className="pointer-events-none absolute -left-[11%] top-[-3%] z-20 w-[32%] drop-shadow-[0_16px_18px_rgba(62,88,70,.24)]"
          >
            <img data-element-float src={windElement} alt="" className="w-full" />
          </div>
          <div
            data-element
            className="pointer-events-none absolute -right-[3%] top-[2%] z-20 w-[20%] drop-shadow-[0_10px_13px_rgba(136,55,20,.32)]"
          >
            <img data-element-float src={fireElement} alt="" className="w-full" />
          </div>

          <div className="absolute bottom-[3%] left-1/2 z-30 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/70 bg-[#3d2c2e]/90 px-5 py-2.5 text-sm font-bold text-white shadow-xl backdrop-blur-md">
            ปรุงสด ให้สมดุลในทุกมื้อ
          </div>
        </div>

        <div>
          <div data-feature-copy>
            <span className="home-eyebrow">Eat for your element</span>
            <h2 className="mt-5 max-w-xl text-4xl font-bold leading-[1.18] sm:text-5xl">
              ธาตุแท้ เริ่มจากการ
              <span className="text-[#a56c48]">รู้จักร่างกาย</span>
            </h2>
            <p className="mt-5 max-w-xl text-[1.04rem] leading-8 text-[#6f675f]">
              เพราะอาหารที่ดีไม่จำเป็นต้องเหมือนกันสำหรับทุกคน
              เราจึงเปลี่ยนข้อมูลสุขภาพที่ซับซ้อน ให้กลายเป็นมื้อไทยที่เลือกง่าย
              อร่อย และเข้ากับชีวิตประจำวัน
            </p>
          </div>

          <div className="mt-8 space-y-3">
            {benefits.map(({ number, title, text, icon }) => (
              <div
                data-feature-card
                key={title}
                className="group grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-[1.4rem] border border-[#e8dfd1] bg-white/80 p-4 shadow-[0_10px_35px_rgba(61,44,46,0.05)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-[#cba98e] hover:shadow-[0_18px_45px_rgba(61,44,46,0.11)] sm:p-5"
              >
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#f1dec9] text-xl font-bold text-[#8d593a] transition-colors group-hover:bg-[#3d2c2e] group-hover:text-white">
                  <BenefitIcon name={icon} />
                </span>
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-[10px] font-bold tracking-[.18em] text-[#b5947b]">
                      {number}
                    </span>
                    <h3 className="text-lg font-bold sm:text-xl">{title}</h3>
                  </div>
                  <p className="mt-1 text-sm leading-6 text-[#6f675f]">
                    {text}
                  </p>
                </div>
                <span className="hidden text-2xl text-[#bcae9e] transition-transform group-hover:translate-x-1 sm:block">
                  →
                </span>
              </div>
            ))}
          </div>

          <a
            href="#kits"
            className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#3d2c2e] px-6 py-3.5 font-bold text-white shadow-[0_12px_30px_rgba(61,44,46,0.2)] transition hover:-translate-y-0.5 hover:bg-[#563f42]"
          >
            สำรวจเมนูที่ใช่สำหรับคุณ
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
