<script setup lang="ts">
import { computed, ref } from "vue";

type AncestorMember = {
  id: number;
  title: string;
  fullName: string;
  photo: string;
  isStillLive: boolean;
  gender: string;
  parent: any;
};

type Props = {
  commonAncestor: AncestorMember;
  member1: AncestorMember[];
  member2: AncestorMember[];
};

const props = defineProps<Props>();

const isGenerating = ref(false);
const certificateRef = ref<HTMLElement | null>(null);
const bgImageRef = ref<HTMLImageElement | null>(null);
const toast = useToast();
const { isDark } = useTheme();

const requiredFonts = [
  "bold 48px \"Mohammad Bold Art\"",
  "bold 38px \"Mohammad Bold Art\"",
  "bold 32px \"Mohammad Bold Art\"",
  "bold 20px \"Mohammad Bold Art\"",
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
    // fallback: continue with defaults
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

const commonAncestorName = computed(() => props.commonAncestor?.fullName || "");

// Build lineage strings for both branches (from person to common ancestor)
const member1Lineage = computed(() => {
  if (!props.member1 || props.member1.length === 0)
    return "";
  // member1 array is already from person1 to common ancestor
  return props.member1.map(m => m.fullName).join(" ← ");
});

const member2Lineage = computed(() => {
  if (!props.member2 || props.member2.length === 0)
    return "";
  // member2 array is already from person2 to common ancestor
  return props.member2.map(m => m.fullName).join(" ← ");
});

async function generatePDF(_mode: "print" | "download" = "print") {
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
  // Calculate dynamic height based on number of members and potential wrapped names
  const maxMembers = Math.max(props.member1?.length || 0, props.member2?.length || 0);
  // Base height + extra per member (accounting for wrapped names and rahma text)
  const CERTIFICATE_HEIGHT = Math.max(818, 400 + maxMembers * 160 + 120);

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
  const originalBgSrc: string | null = null;

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

    // Create PDF with dynamic size based on content
    // Convert pixel dimensions to mm (assuming 96 DPI: 1 inch = 25.4mm, 96px = 25.4mm)
    const pxToMm = 25.4 / 96;
    const pdfWidthMm = CERTIFICATE_WIDTH * pxToMm;
    const pdfHeightMm = CERTIFICATE_HEIGHT * pxToMm;
    const pdf = new jsPDF({
      orientation: pdfWidthMm > pdfHeightMm ? "landscape" : "portrait",
      unit: "mm",
      format: [pdfWidthMm, pdfHeightMm],
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

    // Load image with timeout helper
    const loadImageWithTimeout = (src: string, crossOrigin: boolean, timeoutMs: number): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        if (crossOrigin) {
          img.crossOrigin = "anonymous";
        }

        const timeout = setTimeout(() => {
          img.src = "";
          reject(new Error(`Image load timeout: ${src}`));
        }, timeoutMs);

        img.onload = () => {
          clearTimeout(timeout);
          resolve(img);
        };
        img.onerror = () => {
          clearTimeout(timeout);
          reject(new Error(`Failed to load image: ${src}`));
        };
        img.src = src;
      });
    };

    // Load image: try direct first, then proxy if CORS fails
    const loadImage = async (url: string, timeoutMs: number = 6000): Promise<HTMLImageElement> => {
      if (!url) {
        throw new Error("No image URL provided");
      }

      // First try loading directly (faster if no CORS issues)
      try {
        const img = await loadImageWithTimeout(url, true, timeoutMs);
        console.log("✅ Direct load succeeded:", url);
        return img;
      }
      catch (directError) {
        console.warn("❌ Direct load failed, trying proxy:", url);
      }

      // Fallback to proxy if direct load fails (CORS issues)
      const proxyUrl = `/api/images/proxy?url=${encodeURIComponent(url)}`;
      const img = await loadImageWithTimeout(proxyUrl, true, timeoutMs);
      console.log("✅ Proxy load succeeded:", url);
      return img;
    };

    // Helper to load image safely (returns null on failure)
    const loadImageSafe = async (url: string | undefined): Promise<HTMLImageElement | null> => {
      if (!url)
        return null;
      try {
        return await loadImage(url);
      }
      catch (error) {
        console.warn("Failed to load image:", error);
        return null;
      }
    };

    // Load all images in parallel for better performance
    const [commonAncestorImage, ...allMemberImages] = await Promise.all([
      // Common ancestor
      loadImageSafe(props.commonAncestor?.photo),
      // Member1 images
      ...(props.member1 || []).map(member => loadImageSafe(member?.photo)),
      // Member2 images
      ...(props.member2 || []).map(member => loadImageSafe(member?.photo)),
    ]);

    // Split the results back into member1 and member2 arrays
    const member1Length = props.member1?.length || 0;
    const member1Images = allMemberImages.slice(0, member1Length);
    const member2Images = allMemberImages.slice(member1Length);

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
    const topImageWidth = 600;
    const topImageHeight = (141 / 741) * topImageWidth;
    const topX = CERTIFICATE_WIDTH - topImageWidth - (RIGHT_MARGIN - 30);
    const topY = 0;
    textCtx.drawImage(topImage, topX, topY, topImageWidth, topImageHeight);

    // Draw badge image on bottom left (respecting left margin)
    // Badge is a circle, so width must equal height
    const badgeSize = 150; // size for both width and height (circle)
    const badgeImageWidth = badgeSize;
    const badgeImageHeight = badgeSize;
    const badgeX = LEFT_MARGIN - 40;
    const badgeY = CERTIFICATE_HEIGHT - badgeImageHeight - 40;

    // Add black shadow behind badge image
    textCtx.shadowColor = "rgba(0, 0, 0, 0.3)";
    textCtx.shadowBlur = 10;
    textCtx.shadowOffsetX = -6;
    textCtx.shadowOffsetY = 6;
    textCtx.drawImage(badgeImage, badgeX, badgeY, badgeImageWidth, badgeImageHeight);

    // Reset shadow properties
    textCtx.shadowColor = "transparent";
    textCtx.shadowBlur = 0;
    textCtx.shadowOffsetX = 0;
    textCtx.shadowOffsetY = 0;

    textCtx.fillStyle = "#B48E65";
    textCtx.font = "18px \"Mohammad Bold Art\", sans-serif";
    const firstPart = "\"يَا أَيُّهَا النَّاسُ إِنَّا خَلَقْنَاكُمْ مِنْ ذَكَرٍ وَأُنْثَى وَجَعَلْنَاكُمْ شُعُوبًا وَقَبَائِلَ لِتَعَارَفُوا";
    const secondPart = "إِنَّ أَكْرَمَكُمْ عِنْدَ اللَّهِ أَتْقَاكُمْ إِنَّ اللَّهَ عَلِيمٌ خَبِيرٌ\"";
    const verseEnd = "صدق الله العظيم";

    // Draw first part of verse
    textCtx.fillText(firstPart, CERTIFICATE_WIDTH / 2, 80);

    // Calculate positions for RTL layout
    textCtx.font = "18px \"Mohammad Bold Art\", sans-serif";
    const secondPartWidth = textCtx.measureText(secondPart).width;

    // Draw verseEnd with smaller font on the left
    textCtx.font = "14px \"Mohammad Bold Art\", sans-serif";
    const verseEndWidth = textCtx.measureText(verseEnd).width;

    const verseEndX = (CERTIFICATE_WIDTH / 2) - (secondPartWidth / 2) - verseEndWidth + 30;

    // Draw verseEnd on left
    textCtx.fillText(verseEnd, verseEndX, 113);

    // Draw second part centered
    textCtx.font = "18px \"Mohammad Bold Art\", sans-serif";
    textCtx.fillText(secondPart, CERTIFICATE_WIDTH / 2, 110);

    // Title
    textCtx.font = "bold 48px \"Mohammad Bold Art\", sans-serif";
    // textCtx.fillText('وثيقة البحث بين شخصين', CERTIFICATE_WIDTH / 2, 180)

    // Helper function to draw circular node with optional image
    const drawCircularImage = (img: HTMLImageElement | null, x: number, y: number, size: number) => {
      textCtx.save();

      // Set shadow for the circle
      textCtx.shadowColor = "rgba(241, 198, 135, 0.6)";
      textCtx.shadowBlur = 15;
      textCtx.shadowOffsetX = 0;
      textCtx.shadowOffsetY = 0;

      // Create circular clipping path
      textCtx.beginPath();
      textCtx.arc(x, y, size / 2, 0, Math.PI * 2);
      textCtx.clip();

      // Draw image if provided, otherwise fill with a solid color
      if (img && img.complete && img.naturalWidth > 0) {
        // Draw the image centered and scaled to fit the circle
        textCtx.drawImage(img, x - size / 2, y - size / 2, size, size);
      }
      else {
        // Fallback: fill with a solid color
        textCtx.fillStyle = "rgba(180, 142, 101, 0.2)";
        textCtx.fillRect(x - size / 2, y - size / 2, size, size);
      }

      textCtx.restore();

      // Draw border circle
      textCtx.strokeStyle = "rgba(241, 198, 135, 0.3)";
      textCtx.lineWidth = 2;
      textCtx.beginPath();
      textCtx.arc(x, y, size / 2, 0, Math.PI * 2);
      textCtx.stroke();
    };

    // Helper function to draw dashed line
    const drawDashedLine = (x1: number, y1: number, x2: number, y2: number, color: string, dashLength: number = 4, gapLength: number = 4) => {
      textCtx.strokeStyle = color;
      textCtx.lineWidth = 1;
      textCtx.setLineDash([dashLength, gapLength]);

      textCtx.beginPath();
      textCtx.moveTo(x1, y1);
      textCtx.lineTo(x2, y2);
      textCtx.stroke();

      textCtx.setLineDash([]);
    };

    // Helper function to draw text with word wrapping (splits into max 2 lines)
    const drawWrappedText = (text: string, x: number, y: number, maxWidth: number, lineHeight: number): number => {
      if (!text)
        return 0;

      const textWidth = textCtx.measureText(text).width;

      // If text fits in one line, draw it normally
      if (textWidth <= maxWidth) {
        textCtx.fillText(text, x, y);
        return lineHeight;
      }

      // Split text into words and find best split point
      const words = text.split(" ");
      let line1 = "";
      let line2 = "";

      // Try to split roughly in half by finding the middle word
      const midPoint = Math.ceil(words.length / 2);
      line1 = words.slice(0, midPoint).join(" ");
      line2 = words.slice(midPoint).join(" ");

      // Draw both lines
      textCtx.fillText(line1, x, y);
      textCtx.fillText(line2, x, y + lineHeight);

      return lineHeight * 2;
    };

    // Helper function to draw junction circle
    const drawJunctionCircle = (x: number, y: number, color: string) => {
      // Outer circle (border)
      textCtx.strokeStyle = color;
      textCtx.lineWidth = 1;
      textCtx.beginPath();
      textCtx.arc(x, y, 6, 0, Math.PI * 2);
      textCtx.stroke();

      // Inner filled circle
      textCtx.fillStyle = color;
      textCtx.beginPath();
      textCtx.arc(x, y, 4, 0, Math.PI * 2);
      textCtx.fill();
    };

    // Layout configuration for the visual tree (easier to tweak spacing here)
    const layout = {
      treeStartY: 200, // Y position of common ancestor
      imageSize: 56, // Size for branch nodes
      commonImageSize: 80, // Size for common ancestor node
      verticalSpacing: 140, // Space between nodes vertically (includes name + bigger gap + connector)
      horizontalSpacing: 210, // Space between left and right branches
      nameBelowNodeOffset: 16, // Distance from bottom of node down to name text
      dotBelowNameOffset: 30, // Distance from bottom of name down to junction dot (more space after names)
      branchLabelOffset: 56, // Distance from last node bottom to branch label
    };

    // Draw visual tree
    const treeStartY = layout.treeStartY;
    const imageSize = layout.imageSize;
    const commonImageSize = layout.commonImageSize;
    const horizontalSpacing = layout.horizontalSpacing;

    // Common ancestor (similar structure to page tree: circle, name, then dot + vertical to branches)
    const centerX = CERTIFICATE_WIDTH / 2;
    const commonY = treeStartY;

    // Ancestor node circle (with image from API)
    drawCircularImage(commonAncestorImage, centerX, commonY, commonImageSize);

    // Common ancestor name (under the circle)
    textCtx.fillStyle = "#B48E65";
    textCtx.font = "bold 24px \"Mohammad Bold Art\", sans-serif";
    textCtx.textAlign = "center";
    const commonNameY = commonY + commonImageSize / 2 + 15;
    textCtx.fillText(commonAncestorName.value || "", centerX, commonNameY);

    // Add "رحمه الله" / "رحمها الله" below common ancestor name if not still alive
    /* if (props.commonAncestor && !props.commonAncestor.isStillLive) {
      const rahmaText = props.commonAncestor.gender === "أنثى" ? "رحمها الله" : "رحمه الله";
      textCtx.font = "16px \"Mohammad Bold Art\", sans-serif";
      textCtx.fillStyle = "#B48E65";
      textCtx.globalAlpha = 0.7;
      textCtx.fillText(rahmaText, centerX, commonNameY + 24);
      textCtx.globalAlpha = 1.0;
    } */

    // Check if we have a stratified layout (one branch is empty)
    const member1Array = [...(props.member1 || [])].reverse();
    const member2Array = [...(props.member2 || [])].reverse();
    const hasBothBranches = member1Array.length > 0 && member2Array.length > 0;
    const hasOnlyMember1 = member1Array.length > 0 && member2Array.length === 0;
    const hasOnlyMember2 = member2Array.length > 0 && member1Array.length === 0;

    // Junction dot under the name (extra space for better readability)
    const headDotY = commonNameY + 48;
    drawJunctionCircle(centerX, headDotY, "#B48E65");

    // Vertical dashed line from head dot down to branch junction line
    const junctionY = headDotY + 40;
    drawDashedLine(centerX, headDotY, centerX, junctionY, "#B48E65");

    // Branch X positions
    const leftBranchX = centerX - horizontalSpacing;
    const rightBranchX = centerX + horizontalSpacing;

    // Only draw horizontal line if both branches have members
    if (hasBothBranches) {
      drawDashedLine(leftBranchX, junctionY, rightBranchX, junctionY, "#B48E65");
    }

    // Where branch nodes start below the junction line
    const branchStartY = junctionY + 5;

    // Variables for tracking bottom positions
    let member1BottomY = branchStartY;
    let member2BottomY = branchStartY;

    // Stratified layout: single branch centered when one is empty
    if (hasOnlyMember1 || hasOnlyMember2) {
      const singleBranchArray = hasOnlyMember1 ? member1Array : member2Array;
      const singleBranchImages = hasOnlyMember1 ? [...member1Images].reverse() : [...member2Images].reverse();

      let currentY = branchStartY;
      let lastNameY = branchStartY;
      let lastExtraHeight = 0;

      for (let i = 0; i < singleBranchArray.length; i++) {
        const member = singleBranchArray[i];
        if (!member)
          continue;

        const nodeCenterY = currentY;
        const memberImage = singleBranchImages[i] || null;

        // Draw node centered
        drawCircularImage(memberImage, centerX, nodeCenterY, imageSize);

        // Name below the node
        const nameY = nodeCenterY + imageSize / 2 + layout.nameBelowNodeOffset;
        textCtx.fillStyle = "#B48E65";
        textCtx.font = "18px \"Mohammad Bold Art\", sans-serif";
        textCtx.textAlign = "center";
        const maxNameWidth = 150;
        const nameLineHeight = 22;
        const nameHeight = drawWrappedText(member.fullName || "", centerX, nameY, maxNameWidth, nameLineHeight);
        const extraNameHeight = nameHeight > nameLineHeight ? nameLineHeight : 0;

        lastNameY = nameY;
        lastExtraHeight = extraNameHeight + (!member.isStillLive ? 18 : 0);

        // Add "رحمه الله" / "رحمها الله" below name if not still alive
        /* f (!member.isStillLive) {
          const rahmaText = member.gender === "أنثى" ? "رحمها الله" : "رحمه الله";
          textCtx.font = "14px \"Mohammad Bold Art\", sans-serif";
          textCtx.fillStyle = "#B48E65";
          textCtx.globalAlpha = 0.7;
          textCtx.fillText(rahmaText, centerX, nameY + nameHeight + 4);
          textCtx.globalAlpha = 1.0;
        } */

        // Draw connector (dot + dashed line) except for last item
        if (i < singleBranchArray.length - 1) {
          const dotY = nameY + layout.dotBelowNameOffset + extraNameHeight + (!member.isStillLive ? 18 : 0);
          const nextNodeCenterY = dotY + 40 + imageSize / 2;
          currentY = nextNodeCenterY;

          drawDashedLine(centerX, dotY, centerX, nextNodeCenterY - imageSize / 2, "#B48E65");
          drawJunctionCircle(centerX, dotY, "#B48E65");
        }
      }

      // No label for stratified single-branch layout
      if (hasOnlyMember1) {
        member1BottomY = lastNameY + layout.dotBelowNameOffset + lastExtraHeight + 10;
      }
      else {
        member2BottomY = lastNameY + layout.dotBelowNameOffset + lastExtraHeight + 10;
      }
    }
    else if (hasBothBranches) {
      // Original two-branch layout
      const member1ImagesReversed = [...member1Images].reverse();
      let currentY1 = branchStartY;
      let lastMember1NameY = branchStartY;
      let lastMember1ExtraHeight = 0;

      for (let i = 0; i < member1Array.length; i++) {
        const member = member1Array[i];
        if (!member)
          continue;
        const nodeCenterY = currentY1;
        const memberImage = member1ImagesReversed[i] || null;

        drawCircularImage(memberImage, rightBranchX, nodeCenterY, imageSize);

        const nameY = nodeCenterY + imageSize / 2 + layout.nameBelowNodeOffset;
        textCtx.fillStyle = "#B48E65";
        textCtx.font = "18px \"Mohammad Bold Art\", sans-serif";
        textCtx.textAlign = "center";
        const maxNameWidth = 120;
        const nameLineHeight = 22;
        const nameHeight = drawWrappedText(member.fullName || "", rightBranchX, nameY, maxNameWidth, nameLineHeight);
        const extraNameHeight = nameHeight > nameLineHeight ? nameLineHeight : 0;

        lastMember1NameY = nameY;
        lastMember1ExtraHeight = extraNameHeight + (!member.isStillLive ? 18 : 0);

        /* if (!member.isStillLive) {
          const rahmaText = member.gender === "أنثى" ? "رحمها الله" : "رحمه الله";
          textCtx.font = "14px \"Mohammad Bold Art\", sans-serif";
          textCtx.fillStyle = "#B48E65";
          textCtx.globalAlpha = 0.7;
          textCtx.fillText(rahmaText, rightBranchX, nameY + nameHeight + 4);
          textCtx.globalAlpha = 1.0;
        } */

        if (i < member1Array.length - 1) {
          const dotY = nameY + layout.dotBelowNameOffset + extraNameHeight + (!member.isStillLive ? 18 : 0);
          const nextNodeCenterY = dotY + 40 + imageSize / 2;
          currentY1 = nextNodeCenterY;

          drawDashedLine(rightBranchX, dotY, rightBranchX, nextNodeCenterY - imageSize / 2, "#B48E65");
          drawJunctionCircle(rightBranchX, dotY, "#B48E65");
        }
      }

      textCtx.font = "bold 20px \"Mohammad Bold Art\", sans-serif";
      textCtx.fillText("الشخصية الأولى", rightBranchX, lastMember1NameY + layout.dotBelowNameOffset + lastMember1ExtraHeight + 10);
      member1BottomY = lastMember1NameY + layout.dotBelowNameOffset + lastMember1ExtraHeight + 40;

      // Draw Member 2 Branch (Left side)
      const member2ImagesReversed = [...member2Images].reverse();
      let currentY2 = branchStartY;
      let lastMember2NameY = branchStartY;
      let lastMember2ExtraHeight = 0;

      for (let i = 0; i < member2Array.length; i++) {
        const member = member2Array[i];
        if (!member)
          continue;
        const nodeCenterY = currentY2;
        const memberImage = member2ImagesReversed[i] || null;

        drawCircularImage(memberImage, leftBranchX, nodeCenterY, imageSize);

        const nameY = nodeCenterY + imageSize / 2 + layout.nameBelowNodeOffset;
        textCtx.fillStyle = "#B48E65";
        textCtx.font = "18px \"Mohammad Bold Art\", sans-serif";
        textCtx.textAlign = "center";
        const maxNameWidth = 180;
        const nameLineHeight = 22;
        const nameHeight = drawWrappedText(member.fullName || "", leftBranchX, nameY, maxNameWidth, nameLineHeight);
        const extraNameHeight = nameHeight > nameLineHeight ? nameLineHeight : 0;

        lastMember2NameY = nameY;
        lastMember2ExtraHeight = extraNameHeight + (!member.isStillLive ? 18 : 0);

        /* if (!member.isStillLive) {
          const rahmaText = member.gender === "أنثى" ? "رحمها الله" : "رحمه الله";
          textCtx.font = "14px \"Mohammad Bold Art\", sans-serif";
          textCtx.fillStyle = "#B48E65";
          textCtx.globalAlpha = 0.7;
          textCtx.fillText(rahmaText, leftBranchX, nameY + nameHeight + 4);
          textCtx.globalAlpha = 1.0;
        } */

        if (i < member2Array.length - 1) {
          const dotY = nameY + layout.dotBelowNameOffset + extraNameHeight + (!member.isStillLive ? 18 : 0);
          const nextNodeCenterY = dotY + 40 + imageSize / 2;
          currentY2 = nextNodeCenterY;

          drawDashedLine(leftBranchX, dotY, leftBranchX, nextNodeCenterY - imageSize / 2, "#B48E65");
          drawJunctionCircle(leftBranchX, dotY, "#B48E65");
        }
      }

      textCtx.font = "bold 20px \"Mohammad Bold Art\", sans-serif";
      textCtx.fillText("الشخصية الثانية", leftBranchX, lastMember2NameY + layout.dotBelowNameOffset + lastMember2ExtraHeight + 10);
      member2BottomY = lastMember2NameY + layout.dotBelowNameOffset + lastMember2ExtraHeight + 40;
    }

    // Calculate the bottom of the tree (use the maximum Y from both branches)
    const maxTreeY = Math.max(member1BottomY, member2BottomY);
    const dateStartY = Math.max(maxTreeY + 30, 650);

    // Date at bottom
    // textCtx.fillStyle = "#B48E65";
    // textCtx.font = "20px \"Mohammad Bold Art\", sans-serif";
    // textCtx.direction = "rtl";
    // textCtx.textAlign = "right";
    // textCtx.fillText("وقد طبعت هذه الشهادة استناداََ الي الوارد في كتاب القول الحاسم في نسب القواسم", CERTIFICATE_WIDTH - RIGHT_MARGIN, dateStartY);
    // const dateText = `طُبعت بتاريخ: ${currentDate.value} م`;
    // textCtx.fillText(dateText, CERTIFICATE_WIDTH - RIGHT_MARGIN, dateStartY + 30);

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
  const pdf = await generatePDF("print");
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
  const pdf = await generatePDF("download");
  if (!pdf)
    return;

  // Get first two names from each searched person
  const person1Name = props.member1?.[0]?.fullName?.split(" ").slice(0, 3).join("_") || "";
  const person2Name = props.member2?.[0]?.fullName?.split(" ").slice(0, 3).join("_") || "";
  const fileName = `شهادة_البحث_${person1Name}_و_${person2Name}.pdf`;
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
            شهادة البحث بين شخصين
          </h1>

          <!-- Main Text -->
          <div class="certificate-text">
            <p class="certificate-intro">
              السلف المشترك
            </p>
            <p class="certificate-name">
              <strong>{{ commonAncestorName }}</strong>
            </p>
            <div class="certificate-branches">
              <div class="branch-section">
                <p class="branch-label">
                  الشخصية الأولى
                </p>
                <p class="branch-lineage">
                  {{ member1Lineage }}
                </p>
              </div>
              <div class="branch-section">
                <p class="branch-label">
                  الشخصية الثانية
                </p>
                <p class="branch-lineage">
                  {{ member2Lineage }}
                </p>
              </div>
            </div>
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

.certificate-branches {
  display: flex;
  flex-direction: column;
  gap: 30px;
  width: 100%;
  margin-top: 30px;
}

.branch-section {
  width: 100%;
}

.branch-label {
  font-family: "Mohammad Bold Art", sans-serif;
  font-size: 24px;
  font-weight: bold;
  color: #b48e65;
  margin-bottom: 15px;
}

.branch-lineage {
  font-family: "Mohammad Bold Art", sans-serif;
  font-size: 18px;
  color: #b48e65;
  line-height: 2;
  text-align: right;
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
