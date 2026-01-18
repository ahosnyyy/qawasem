export const DEFAULT_LINEAGE = " بن قضيب بن رحمة (كايد) بن حمود عدوان بن محمد بن أحمد (الشيخ الصالح) بن صقر (القواس) بن علي بن صقر القواس بن قائد رحمة بن إدريس (شرف) بن زيد (مزيد) بن قائد رحمة بن القاسم بن علي (أبو القاسم) بن القاسم بن علي بن الحسين بن راشد (عفيص  عفيصان) بن فضل (المفضل) بن إدريس (شرف الدين) بن رحمة (قائد) بن محمد (جياش) بن الحسن (أبو دريد) بن إدريس (فارس العرب) بن القاسم (الحرابي) بن الأمير محمد (الثائر) بن موسى (الثاني) بن عبدالله (الشيخ الصالح) بن موسى (الجون) بن عبدالله (المحض) بن الحسن (المثنى) بن الحسن (السبط) بن علي بن أبي طالب";
export const SPECIAL_MEMBER_ID = 1;
export const SPECIAL_MEMBER_NAME = "سلطان بن صقر بن راشد بن مطر بن كايد القاسمي";
const SIX_WORD_MEMBER_IDS = new Set([650, 651]);
export function isSpecialMember(name: string, memberId?: number) {
  return memberId === SPECIAL_MEMBER_ID || name.trim() === SPECIAL_MEMBER_NAME;
}

function getFirstLineWordLimit(memberId?: number, fallback = 5) {
  if (memberId && SIX_WORD_MEMBER_IDS.has(memberId))
    return 6;
  return fallback;
}
export type DisplayNameSegments = {
  firstLine: string;
  secondLine: string;
  staticPart: string;
};

const LAST_NAME_KEYWORD = "سلطان";

export function getDisplayNameSegments(name: string, options?: { firstLineWordLimit?: number; memberId?: number }): DisplayNameSegments {
  const words = (name || "").split(" ").filter(word => word.length > 0);
  if (words.length === 0) {
    return {
      firstLine: "",
      secondLine: "",
      staticPart: "",
    };
  }

  const workingNames = [...words];
  workingNames.pop();

  const firstLineWordLimit = options?.firstLineWordLimit ?? getFirstLineWordLimit(options?.memberId);
  const specialMember = isSpecialMember(name, options?.memberId);

  if (specialMember) {
    const hasOverflow = workingNames.length > firstLineWordLimit;
    const firstLine = hasOverflow
      ? workingNames.slice(0, firstLineWordLimit).join(" ")
      : workingNames.join(" ");
    const secondLine = hasOverflow ? workingNames.slice(firstLineWordLimit).join(" ") : "";

    return {
      firstLine: firstLine.trim() || (name || ""),
      secondLine: secondLine.trim(),
      staticPart: "",
    };
  }

  let lastSultanIndex = -1;
  for (let i = workingNames.length - 1; i >= 0; i--) {
    if (workingNames[i] === LAST_NAME_KEYWORD) {
      lastSultanIndex = i;
      break;
    }
  }

  const lastSultanName = lastSultanIndex <= 0 ? lastSultanIndex : lastSultanIndex - 1;
  let staticPart = "";

  if (lastSultanName >= 0 && lastSultanName < workingNames.length) {
    if (!specialMember) {
      staticPart = workingNames.slice(lastSultanName).join(" ");
    }
    workingNames.splice(lastSultanName, workingNames.length - lastSultanName);
  }

  const hasOverflow = workingNames.length > firstLineWordLimit;
  const firstLine = hasOverflow
    ? workingNames.slice(0, firstLineWordLimit).join(" ")
    : workingNames.join(" ");
  const secondLine = hasOverflow ? workingNames.slice(firstLineWordLimit).join(" ") : "";

  return {
    firstLine: firstLine.trim() || (name || ""),
    secondLine: secondLine.trim(),
    staticPart: staticPart.trim(),
  };
}
