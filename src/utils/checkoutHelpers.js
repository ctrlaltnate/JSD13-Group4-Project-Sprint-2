import { SHIPPING_FEE, POINT_CALCULATION } from "../constants/checkout";

export const calculateEarnedPoints = (itemsSubtotal) => {
  if (!itemsSubtotal || itemsSubtotal < POINT_CALCULATION.MIN_AMOUNT_TO_EARN) {
    return 0;
  }
  return (
    Math.floor(itemsSubtotal / POINT_CALCULATION.BASE_AMOUNT) *
    POINT_CALCULATION.POINTS_PER_BASE
  );
};

export const calculateGrandTotal = (itemsSubtotal) => {
  return itemsSubtotal + SHIPPING_FEE;
};

export const generatePromptPayQrUrl = (target, amount) => {
  const cleanTarget = target.replace(/[^0-9]/g, "");
  let formattedTarget = cleanTarget;
  if (cleanTarget.length === 10 && cleanTarget.startsWith("0")) {
    formattedTarget = "0066" + cleanTarget.substring(1);
  }

  const targetTag = formattedTarget.length === 13 ? "02" : "01";
  const targetLength = formattedTarget.length.toString().padStart(2, "0");
  const merchantAccountInfo = `0016A000000677010111${targetTag}${targetLength}${formattedTarget}`;

  const amountStr = amount.toFixed(2);
  const amountLength = amountStr.length.toString().padStart(2, "0");

  const rawPayload =
    `000201` +
    `010212` +
    `29${merchantAccountInfo.length.toString().padStart(2, "0")}${merchantAccountInfo}` +
    `5303764` +
    `54${amountLength}${amountStr}` +
    `5802TH` +
    `6304`;

  const crc = crc16CCITT(rawPayload);
  const fullPayload = rawPayload + crc;

  return `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(fullPayload)}`;
};

const crc16CCITT = (currentPayload) => {
  let crc = 0xffff;
  for (let i = 0; i < currentPayload.length; i++) {
    let x = ((crc >> 8) ^ currentPayload.charCodeAt(i)) & 0xff;
    x ^= x >> 4;
    crc = ((crc << 8) ^ (x << 12) ^ (x << 5) ^ x) & 0xffff;
  }
  return (crc & 0xffff).toString(16).toUpperCase().padStart(4, "0");
};
