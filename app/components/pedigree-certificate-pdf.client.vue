<script setup lang="ts">
import { computed, ref } from "vue";

import { DEFAULT_LINEAGE, getDisplayNameSegments } from "~/utils/pedigree";

type Props = {
  name: string;
  lineage: string;
  memberId?: number;
};

const props = defineProps<Props>();

const displayNameSegments = computed(() => getDisplayNameSegments(props.name, { memberId: props.memberId }));

const lineageText = computed(() => {
  const baseLineage = props.lineage || DEFAULT_LINEAGE;
  const staticPart = displayNameSegments.value.staticPart;
  return staticPart ? `${staticPart} ${baseLineage}`.trim() : baseLineage;
});

const isGenerating = ref(false);
const certificateRef = ref<HTMLElement | null>(null);
const bgImageRef = ref<HTMLImageElement | null>(null);
const toast = useToast();
const { isDark } = useTheme();

const requiredFonts = [
  "bold 48px \"Mohammad Bold Art\"",
  "bold 38px \"Mohammad Bold Art\"",
  "bold 32px \"Mohammad Bold Art\"",
  "18px \"Mohammad Bold Art\"",
  "14px \"Mohammad Bold Art\"",
];
let fontsPreloaded = false;

async function ensureFontsLoaded() {
  if (fontsPreloaded || typeof document === "undefined" || !document.fonts)
    return;

  try {
    await Promise.all(requiredFonts.map(font => document.fonts.load(font)));
    await document.fonts.ready;
    fontsPreloaded = true;
  }
  catch (error) {
    console.warn("Failed to preload fonts", error);
    // fallback: allow rendering to continue with available fonts
  }
}

const currentDate = computed(() => {
  const date = new Date();
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    calendar: "gregory",
  };
  return new Intl.DateTimeFormat("ar-SA", options).format(date);
});

async function generatePDF() {
  if (isGenerating.value)
    return;

  // Only run on client side
  if (typeof window === "undefined" || !certificateRef.value)
    return;

  isGenerating.value = true;

  // Global margins for the entire certificate
  const LEFT_MARGIN = 100;
  const RIGHT_MARGIN = 100;
  const CERTIFICATE_WIDTH = 1058;
  const CERTIFICATE_HEIGHT = 818;

  // Show the certificate temporarily and position it for capture
  const container = certificateRef.value;
  const certificateElement = container.querySelector(".certificate-wrapper") as HTMLElement;
  if (!certificateElement) {
    console.error("Certificate element not found");
    isGenerating.value = false;
    return;
  }

  // Store original styles
  const originalDisplay = container.style.display;
  const originalPosition = container.style.position;
  const originalTop = container.style.top;
  const originalLeft = container.style.left;

  // Make it visible but keep it off-screen for capture (don't show to user)
  container.style.display = "block";
  container.style.position = "fixed";
  container.style.top = "-9999px";
  container.style.left = "-9999px";
  container.style.zIndex = "-1";
  container.style.width = `${CERTIFICATE_WIDTH}px`;
  container.style.height = `${CERTIFICATE_HEIGHT}px`;
  container.style.visibility = "hidden";

  // Declare variables outside try block for finally access
  const bgImage = bgImageRef.value || certificateElement.querySelector(".certificate-bg") as HTMLImageElement;
  let originalBgSrc: string | null = null;

  try {
    // Wait for the background image to load
    if (bgImage) {
      await new Promise<void>((resolve, reject) => {
        if (bgImage.complete && bgImage.naturalWidth > 0) {
          resolve();
        }
        else {
          const timeout = setTimeout(() => {
            reject(new Error("Image load timeout"));
          }, 5000);

          bgImage.onload = () => {
            clearTimeout(timeout);
            resolve();
          };
          bgImage.onerror = () => {
            clearTimeout(timeout);
            reject(new Error("Failed to load background image"));
          };
        }
      });
    }

    // Additional wait to ensure rendering
    await new Promise(resolve => setTimeout(resolve, 500));

    // Dynamically import jsPDF only
    const jsPDFModule = await import("jspdf");
    const jsPDF = (jsPDFModule as any).jsPDF || (jsPDFModule as any).default?.jsPDF || (jsPDFModule as any).default;

    // Create PDF in landscape A4
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: [297, 210], // A4 landscape
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // Convert background image to data URL if available
    let bgImageData: string | null = null;
    if (bgImage && bgImage.complete && bgImage.naturalWidth > 0) {
      try {
        // Create a temporary canvas to convert SVG to image
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = CERTIFICATE_WIDTH;
        tempCanvas.height = CERTIFICATE_HEIGHT;
        const tempCtx = tempCanvas.getContext("2d");
        if (tempCtx) {
          tempCtx.fillStyle = "#EBEBEB";
          tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
          tempCtx.drawImage(bgImage, 0, 0, tempCanvas.width, tempCanvas.height);
          bgImageData = tempCanvas.toDataURL("image/png");
        }
      }
      catch (imgError) {
        console.warn("Failed to convert background image:", imgError);
      }
    }

    // Add background image to PDF if available
    if (bgImageData) {
      pdf.addImage(bgImageData, "PNG", 0, 0, pdfWidth, pdfHeight);
    }
    else {
      // Fill background color
      pdf.setFillColor(235, 235, 235); // #EBEBEB
      pdf.rect(0, 0, pdfWidth, pdfHeight, "F");
    }

    // Draw text on canvas first (to support Arabic fonts), then add to PDF
    const textCanvas = document.createElement("canvas");
    // Use high resolution for better quality
    const scale = 2;
    textCanvas.width = CERTIFICATE_WIDTH * scale;
    textCanvas.height = CERTIFICATE_HEIGHT * scale;
    const textCtx = textCanvas.getContext("2d");

    if (!textCtx) {
      throw new Error("Failed to get canvas context for text");
    }

    // Set up canvas for high quality
    textCtx.scale(scale, scale);
    textCtx.fillStyle = "transparent";
    textCtx.fillRect(0, 0, CERTIFICATE_WIDTH, CERTIFICATE_HEIGHT);

    // Set text properties - all text uses #B48E65
    textCtx.fillStyle = "#B48E65";
    textCtx.textAlign = "center";
    textCtx.textBaseline = "top";
    textCtx.direction = "rtl";

    // Wait for font to load
    await ensureFontsLoaded();

    // Load decorative images
    const topImage = new Image();
    const badgeImage = new Image();

    await Promise.all([
      new Promise<void>((resolve, reject) => {
        topImage.crossOrigin = "anonymous";
        topImage.onload = () => resolve();
        topImage.onerror = () => reject(new Error("Failed to load top image"));
        topImage.src = "/images/cer-top.svg";
      }),
      new Promise<void>((resolve, reject) => {
        badgeImage.crossOrigin = "anonymous";
        badgeImage.onload = () => resolve();
        badgeImage.onerror = () => reject(new Error("Failed to load badge image"));
        badgeImage.src = "/logo.svg";
      }),
    ]);

    // Draw top image on top right (respecting right margin)
    // cer-top.svg is 741x141, scale it appropriately
    const topImageWidth = 600; // scaled width
    const topImageHeight = (141 / 741) * topImageWidth; // maintain aspect ratio
    const topX = CERTIFICATE_WIDTH - topImageWidth - (RIGHT_MARGIN - 30); // Respect right margin
    const topY = 0;
    textCtx.drawImage(topImage, topX, topY, topImageWidth, topImageHeight);

    // Draw badge image on bottom left (respecting left margin)
    // Badge is a circle, so width must equal height
    const badgeSize = 150; // size for both width and height (circle)
    const badgeImageWidth = badgeSize;
    const badgeImageHeight = badgeSize;
    const badgeX = LEFT_MARGIN - 40; // Respect left margin
    const badgeY = CERTIFICATE_HEIGHT - badgeImageHeight - 40;

    // Add black shadow behind badge image
    textCtx.shadowColor = "rgba(0, 0, 0, 0.3)"; // Black shadow with medium opacity
    textCtx.shadowBlur = 10; // Soft shadow blur
    textCtx.shadowOffsetX = -6; // Slight offset to the right
    textCtx.shadowOffsetY = 6; // Slight offset downward
    textCtx.drawImage(badgeImage, badgeX, badgeY, badgeImageWidth, badgeImageHeight);

    // Reset shadow properties
    textCtx.shadowColor = "transparent";
    textCtx.shadowBlur = 0;
    textCtx.shadowOffsetX = 0;
    textCtx.shadowOffsetY = 0;

    textCtx.fillStyle = "#B48E65"; // Ensure color is set
    textCtx.font = "18px \"Mohammad Bold Art\", sans-serif";
    const firstPart = "\"يَا أَيُّهَا النَّاسُ إِنَّا خَلَقْنَاكُمْ مِنْ ذَكَرٍ وَأُنْثَى وَجَعَلْنَاكُمْ شُعُوبًا وَقَبَائِلَ لِتَعَارَفُوا";
    const secondPart = "إِنَّ أَكْرَمَكُمْ عِنْدَ اللَّهِ أَتْقَاكُمْ إِنَّ اللَّهَ عَلِيمٌ خَبِيرٌ\"";
    const verseEnd = "صدق الله العظيم";

    // First line: first part of verse
    const verseFirstLine = firstPart;

    // Draw second line: verseEnd on left, then second part
    textCtx.fillText(verseFirstLine, CERTIFICATE_WIDTH / 2, 80);

    // Calculate positions for RTL layout
    // First measure second part with 24px font
    textCtx.font = "18px \"Mohammad Bold Art\", sans-serif";
    const secondPartWidth = textCtx.measureText(secondPart).width;

    // Draw verseEnd with smaller font on the left
    textCtx.font = "14px \"Mohammad Bold Art\", sans-serif";
    const verseEndWidth = textCtx.measureText(verseEnd).width;

    // Position verseEnd on the left side (RTL: left is start)
    // Center of second part is at CERTIFICATE_WIDTH/2, so left edge of second part is at (CERTIFICATE_WIDTH/2 - secondPartWidth/2)
    // verseEnd should be to the left of that with 10px spacing
    const verseEndX = (CERTIFICATE_WIDTH / 2) - (secondPartWidth / 2) - verseEndWidth + 30;

    // Draw verseEnd on left
    textCtx.fillText(verseEnd, verseEndX, 113);

    // Draw second part centered (after verseEnd)
    textCtx.font = "18px \"Mohammad Bold Art\", sans-serif";
    textCtx.fillText(secondPart, CERTIFICATE_WIDTH / 2, 110);

    // Title
    textCtx.font = "bold 48px \"Mohammad Bold Art\", sans-serif";
    textCtx.fillText("وثيقة نسب القواسم", CERTIFICATE_WIDTH / 2, 180);

    // Intro text
    // textCtx.font = "30px \"Mohammad Bold Art\", sans-serif";
    // textCtx.fillText("الحاكم من القول الحاسم", CERTIFICATE_WIDTH / 2, 240);

    // Name segments following Flutter logic
    const { firstLine: firstNameLine, secondLine } = displayNameSegments.value;
    textCtx.font = "bold 36px \"Mohammad Bold Art\", sans-serif";
    const nameText = firstNameLine || " ";
    textCtx.fillText(nameText, CERTIFICATE_WIDTH / 2, 300);

    if (secondLine) {
      textCtx.font = "bold 32px \"Mohammad Bold Art\", sans-serif";
      textCtx.fillText(secondLine, CERTIFICATE_WIDTH / 2, 355);
    }

    // staticPart is now merged into the lineage text for consistency with Flutter implementation

    // Lineage text with word wrapping and RTL justification within margins
    textCtx.font = "18px \"Mohammad Bold Art\", sans-serif";
    textCtx.fillStyle = "#B48E65"; // Set lineage color
    textCtx.direction = "rtl"; // Ensure RTL direction

    // Use global margins - text justified between margins
    const maxWidth = CERTIFICATE_WIDTH - LEFT_MARGIN - RIGHT_MARGIN - 20; // width within margins
    const rightEdge = CERTIFICATE_WIDTH - RIGHT_MARGIN; // Right edge of text area
    const leftEdge = LEFT_MARGIN; // Left edge of text area
    const words = (lineageText.value || "").split(" ");
    let currentLine = "";
    const lineageStartY = secondLine ? 440 : 400;
    let yPos = lineageStartY;
    const lineHeight = 30;

    // Helper function to justify RTL text within margins
    const drawJustifiedTextRTL = (text: string, y: number) => {
      const words = text.split(" ").filter(w => w.length > 0);
      if (words.length <= 1) {
        // Single word or empty, just draw it centered
        textCtx.textAlign = "center";
        textCtx.fillText(text, CERTIFICATE_WIDTH / 2, y);
        return;
      }

      // Calculate widths for all words
      const wordWidths: number[] = [];
      let totalWidth = 0;
      for (const word of words) {
        const width = textCtx.measureText(word).width;
        wordWidths.push(width);
        totalWidth += width;
      }

      // Calculate space width
      const spaceWidth = textCtx.measureText(" ").width;
      const totalSpaceWidth = (words.length - 1) * spaceWidth;
      const availableWidth = maxWidth - totalWidth - totalSpaceWidth;
      const extraSpacePerGap = words.length > 1 ? availableWidth / (words.length - 1) : 0;

      // For RTL justified text: ensure text fits exactly between leftEdge and rightEdge
      textCtx.textAlign = "right"; // Anchor text to the right

      // Calculate positions: start from rightEdge, ensure we end at leftEdge
      const positions: number[] = [];

      // Method: Calculate total width needed and position to fit exactly
      // Total width = sum of word widths + (n-1) * (spaceWidth + extraSpacePerGap)
      // We want: positions[0] = rightEdge AND lastWordLeftEdge = leftEdge

      // Start from right edge
      let currentX = rightEdge;

      // Calculate initial positions
      for (let i = 0; i < words.length; i++) {
        positions.push(currentX);
        const wordWidth = wordWidths[i];
        if (wordWidth !== undefined && i < words.length - 1) {
          currentX -= (wordWidth + spaceWidth + extraSpacePerGap);
        }
      }

      // Verify last word's left edge
      const lastIndex = positions.length - 1;
      const lastWordWidth = wordWidths[lastIndex];
      const lastPos = positions[lastIndex];
      if (lastWordWidth === undefined || lastPos === undefined)
        return;

      const lastWordLeftEdge = lastPos - lastWordWidth;
      const actualDiscrepancy = lastWordLeftEdge - leftEdge;

      // If there's a discrepancy, we need to ensure both margins are respected
      // The solution: adjust spacing proportionally so text fits exactly
      if (Math.abs(actualDiscrepancy) > 0.5) {
        // Calculate the correct spacing to make text fit exactly
        // We need: rightEdge - (sum of word widths) - (n-1) * (spaceWidth + adjustedExtraSpace) = leftEdge
        // Solving: adjustedExtraSpace = (rightEdge - leftEdge - totalWidth - (n-1) * spaceWidth) / (n-1)
        const totalGapWidth = rightEdge - leftEdge - totalWidth;
        const adjustedExtraSpace = words.length > 1 ? (totalGapWidth - (words.length - 1) * spaceWidth) / (words.length - 1) : 0;

        // Recalculate positions with correct spacing
        currentX = rightEdge;
        for (let i = 0; i < words.length; i++) {
          positions[i] = currentX;
          const wordWidth = wordWidths[i];
          if (wordWidth !== undefined && i < words.length - 1) {
            currentX -= (wordWidth + spaceWidth + adjustedExtraSpace);
          }
        }

        // Final verification
        const finalLastPos = positions[lastIndex];
        if (finalLastPos !== undefined) {
          // If still not exact, we have a calculation issue - use the adjusted spacing anyway
          // The small difference should be negligible
        }
      }

      // Draw words at calculated positions
      for (let i = 0; i < words.length; i++) {
        const word = words[i];
        const pos = positions[i];
        if (!word || pos === undefined)
          continue;
        textCtx.fillText(word, pos, y);
      }
    };

    for (let i = 0; i < words.length; i++) {
      const word: string = words[i] || "";
      const testLine = currentLine + (currentLine ? " " : "") + word;
      const metrics = textCtx.measureText(testLine);

      if (metrics.width > maxWidth && currentLine) {
        // Draw current line with RTL justification within margins
        drawJustifiedTextRTL(currentLine, yPos);
        // Start new line
        currentLine = word;
        yPos += lineHeight;
        // Check if we need to continue on next page (we'll handle this later)
        if (yPos > 750) {
          yPos = 200; // Reset for next page if needed
        }
      }
      else {
        currentLine = testLine;
      }
    }

    // Draw remaining text (last line, center aligned)
    if (currentLine) {
      textCtx.textAlign = "center";
      textCtx.fillText(currentLine, CERTIFICATE_WIDTH / 2, yPos);
    }

    // Date at bottom
    // textCtx.fillStyle = "#B48E65"; // Ensure date color
    // textCtx.font = "20px \"Mohammad Bold Art\", sans-serif";
    // textCtx.direction = "rtl"; // RTL direction
    // textCtx.textAlign = "right"; // Right align for RTL (starts from right margin)
    // textCtx.fillText("وقد طبعت هذه الشهادة استناداََ الي الوارد في كتاب القول الحاسم في نسب القواسم", CERTIFICATE_WIDTH - RIGHT_MARGIN, 670);
    // const dateText = `طُبعت بتاريخ: ${currentDate.value} م`;
    // textCtx.fillText(dateText, CERTIFICATE_WIDTH - RIGHT_MARGIN, 700);

    // Convert text canvas to image and add to PDF
    const textImageData = textCanvas.toDataURL("image/png");

    // Add text image on top of background
    pdf.addImage(textImageData, "PNG", 0, 0, pdfWidth, pdfHeight);

    // Return the PDF based on mode
    return pdf;
  }
  catch (error) {
    console.error("Error generating PDF:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error details:", errorMessage);
    toast.add({
      title: "حدث خطأ",
      description: `حدث خطأ أثناء إنشاء ملف PDF: ${errorMessage}. يرجى المحاولة مرة أخرى.`,
      icon: "i-lucide-alert-circle",
      color: "error",
      ui: {
        root: isDark.value ? "bg-gray-900 ring-gray-800" : "",
      },
    });
  }
  finally {
    // Restore original background image if it was changed
    if (bgImage && originalBgSrc) {
      bgImage.src = originalBgSrc;
    }

    // Restore original styles
    container.style.display = originalDisplay;
    container.style.position = originalPosition;
    container.style.top = originalTop;
    container.style.left = originalLeft;
    container.style.zIndex = "";
    container.style.width = "";
    container.style.height = "";
    container.style.visibility = "";

    isGenerating.value = false;
  }
}

async function printPDF() {
  const pdf = await generatePDF();
  if (!pdf)
    return;

  const pdfBlob = pdf.output("blob");
  const pdfUrl = URL.createObjectURL(pdfBlob);
  const printWindow = window.open(pdfUrl, "_blank");

  if (printWindow) {
    printWindow.onload = () => {
      printWindow.print();
      setTimeout(() => {
        URL.revokeObjectURL(pdfUrl);
      }, 1000);
    };
  }
  else {
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = pdfUrl;
    document.body.appendChild(iframe);
    iframe.onload = () => {
      iframe.contentWindow?.print();
      setTimeout(() => {
        document.body.removeChild(iframe);
        URL.revokeObjectURL(pdfUrl);
      }, 1000);
    };
  }
}

async function downloadPDF() {
  const pdf = await generatePDF();
  if (!pdf)
    return;

  // Get first three names from searched person
  const personName = props.name?.split(" ").slice(0, 3).join("_") || "certificate";
  const fileName = `شهادة_النسب_${personName}.pdf`;
  pdf.save(fileName);
}

defineExpose({
  generatePDF,
  printPDF,
  downloadPDF,
});
</script>

<template>
  <div>
    <!-- Hidden certificate container for PDF generation -->
    <div ref="certificateRef" class="certificate-container">
      <div class="certificate-wrapper">
        <!-- Background SVG -->
        <img
          ref="bgImageRef"
          src="/images/cer-bg.svg"
          alt="Certificate Background"
          class="certificate-bg"
          crossorigin="anonymous"
        >

        <!-- Certificate Content -->
        <div class="certificate-content">
          <!-- Title -->
          <h1 class="certificate-title">
            شهادة النسب
          </h1>

          <!-- Main Text -->
          <div class="certificate-text">
            <p class="certificate-intro">
              هذا نص شهادة النسب الرسمية التي تؤكد نسب
            </p>
            <p class="certificate-name">
              <strong>{{ displayNameSegments.firstLine }}</strong>
              <span v-if="displayNameSegments.secondLine" class="certificate-name-second">
                {{ displayNameSegments.secondLine }}
              </span>
            </p>
            <p class="certificate-lineage">
              {{ lineageText }}
            </p>
          </div>

          <!-- Footer -->
          <div class="certificate-footer">
            <p class="certificate-date">
              تاريخ الإصدار: {{ currentDate }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.certificate-container {
  position: fixed;
  top: -9999px;
  left: -9999px;
  width: 1058px;
  height: 818px;
  display: none;
}

.certificate-wrapper {
  position: relative;
  width: 1058px;
  height: 818px;
  background: #ebebeb;
}

.certificate-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1;
}

.certificate-content {
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 80px 100px;
  text-align: center;
  direction: rtl;
}

.certificate-title {
  font-family: "Mohammad Bold Art", sans-serif;
  font-size: 48px;
  font-weight: bold;
  color: #b48e65;
  margin-bottom: 40px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.certificate-text {
  width: 100%;
  max-width: 850px;
  margin-bottom: 40px;
}

.certificate-intro {
  font-family: "Mohammad Bold Art", sans-serif;
  font-size: 24px;
  color: #b48e65;
  margin-bottom: 20px;
  line-height: 1.8;
}

.certificate-name {
  font-family: "Mohammad Bold Art", sans-serif;
  font-size: 36px;
  color: #b48e65;
  margin-bottom: 30px;
  line-height: 1.8;
}

.certificate-name strong {
  font-weight: bold;
  font-size: 42px;
  color: #b48e65;
}

.certificate-lineage {
  font-family: "Mohammad Bold Art", sans-serif;
  font-size: 18px;
  color: #b48e65;
  line-height: 2;
  text-align: justify;
  text-align-last: center;
}

.certificate-footer {
  margin-top: auto;
  width: 100%;
}

.certificate-date {
  font-family: "Mohammad Bold Art", sans-serif;
  font-size: 20px;
  color: #b48e65;
  margin-top: 30px;
}
</style>
