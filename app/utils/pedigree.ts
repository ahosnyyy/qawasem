export const DEFAULT_LINEAGE = " بن سلطان بن صقر بن راشد بن مطر بن كايد بن قضيب بن رحمة (كايد) بن حمود عدوان بن محمد بن أحمد (الشيخ الصالح) بن صقر (القواس) بن علي بن صقر القواس بن قائد رحمة بن إدريس (شرف) بن زيد (مزيد) بن قائد رحمة بن القاسم بن علي (أبو القاسم) بن القاسم بن علي بن الحسين بن راشد (عفيص  عفيصان) بن فضل (المفضل) بن إدريس (شرف الدين) بن رحمة (قائد) بن محمد (جياش) بن الحسن (أبو دريد) بن إدريس (فارس العرب) بن القاسم (الحرابي) بن الأمير محمد (الثائر) بن موسى (الثاني) بن عبدالله (الشيخ الصالح) بن موسى (الجون) بن عبدالله (المحض) بن الحسن (المثنى) بن الحسن (السبط) بن علي بن أبي طالب";

const SUFFIX_PHRASE = "بن سلطان بن صقر بن راشد بن مطر القاسمي";
const SUFFIX_WORDS = SUFFIX_PHRASE.split(" ");

function stripSuffix(words: string[]): string[] {
  const hasSuffix
    = words.length >= SUFFIX_WORDS.length
    && SUFFIX_WORDS.every((suffixWord, index) => words[words.length - SUFFIX_WORDS.length + index] === suffixWord);

  return hasSuffix ? words.slice(0, words.length - SUFFIX_WORDS.length) : words;
}

export function getDisplayNameLines(name: string, firstLineWordLimit = 5) {
  const allWords = (name || "").split(" ").filter(word => word.length > 0);
  const cleanedWords = stripSuffix(allWords);
  const firstLine = cleanedWords.slice(0, firstLineWordLimit).join(" ").trim();
  const secondLine = cleanedWords.slice(firstLineWordLimit).join(" ").trim();

  return {
    firstLine: firstLine || (name || ""),
    secondLine,
  };
}
