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
        />
        
        <!-- Certificate Content -->
        <div class="certificate-content">
          <!-- Title -->
          <h1 class="certificate-title">شهادة البحث بين شخصين</h1>
          
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
                <p class="branch-label">الشخص الأول</p>
                <p class="branch-lineage">{{ member1Lineage }}</p>
              </div>
              <div class="branch-section">
                <p class="branch-label">الشخص الثاني</p>
                <p class="branch-lineage">{{ member2Lineage }}</p>
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
    
    <!-- Print Button -->
    <button
      @click="generatePDF"
      :disabled="isGenerating"
      class="bg-[#4A2E1E] hover:scale-105 text-[#F1C687] py-2 min-w-2xs hover:scale-105 rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <span>{{ isGenerating ? 'جاري التحضير...' : 'طباعة شهادة البحث PDF' }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface AncestorMember {
  id: number
  title: string
  fullName: string
  photo: string
  isStillLive: boolean
  parent: any
}

interface Props {
  commonAncestor: AncestorMember
  member1: AncestorMember[]
  member2: AncestorMember[]
}

const props = defineProps<Props>()

const isGenerating = ref(false)
const certificateRef = ref<HTMLElement | null>(null)
const bgImageRef = ref<HTMLImageElement | null>(null)

const currentDate = computed(() => {
  const date = new Date()
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    calendar: 'gregory'
  }
  return new Intl.DateTimeFormat('ar-SA', options).format(date)
})

const commonAncestorName = computed(() => props.commonAncestor?.fullName || '')

// Build lineage strings for both branches (from person to common ancestor)
const member1Lineage = computed(() => {
  if (!props.member1 || props.member1.length === 0) return ''
  // member1 array is already from person1 to common ancestor
  return props.member1.map(m => m.fullName).join(' ← ')
})

const member2Lineage = computed(() => {
  if (!props.member2 || props.member2.length === 0) return ''
  // member2 array is already from person2 to common ancestor
  return props.member2.map(m => m.fullName).join(' ← ')
})

async function generatePDF() {
  if (isGenerating.value) return
  
  // Only run on client side
  if (typeof window === 'undefined' || !certificateRef.value) return

  isGenerating.value = true
  
  // Global margins for the entire certificate
  const LEFT_MARGIN = 100
  const RIGHT_MARGIN = 100
  const CERTIFICATE_WIDTH = 1058
  const CERTIFICATE_HEIGHT = 818

  // Show the certificate temporarily and position it for capture
  const container = certificateRef.value
  const certificateElement = container.querySelector('.certificate-wrapper') as HTMLElement
  if (!certificateElement) {
    console.error('Certificate element not found')
    isGenerating.value = false
    return
  }

  // Store original styles
  const originalDisplay = container.style.display
  const originalPosition = container.style.position
  const originalTop = container.style.top
  const originalLeft = container.style.left
  
  // Make it visible but keep it off-screen for capture (don't show to user)
  container.style.display = 'block'
  container.style.position = 'fixed'
  container.style.top = '-9999px'
  container.style.left = '-9999px'
  container.style.zIndex = '-1'
  container.style.width = `${CERTIFICATE_WIDTH}px`
  container.style.height = `${CERTIFICATE_HEIGHT}px`
  container.style.visibility = 'hidden'
  
  // Declare variables outside try block for finally access
  const bgImage = bgImageRef.value || certificateElement.querySelector('.certificate-bg') as HTMLImageElement
  let originalBgSrc: string | null = null
  
  try {
    // Wait for the background image to load
    if (bgImage) {
      await new Promise<void>((resolve, reject) => {
        if (bgImage.complete && bgImage.naturalWidth > 0) {
          resolve()
        } else {
          const timeout = setTimeout(() => {
            reject(new Error('Image load timeout'))
          }, 5000)
          
          bgImage.onload = () => {
            clearTimeout(timeout)
            resolve()
          }
          bgImage.onerror = () => {
            clearTimeout(timeout)
            reject(new Error('Failed to load background image'))
          }
        }
      })
    }

    // Additional wait to ensure rendering
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Dynamically import jsPDF only
    const jsPDFModule = await import('jspdf')
    const jsPDF = (jsPDFModule as any).jsPDF || (jsPDFModule as any).default?.jsPDF || (jsPDFModule as any).default

    // Create PDF in landscape A4
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [297, 210] // A4 landscape
    })

    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()

    // Convert background image to data URL if available
    let bgImageData: string | null = null
    if (bgImage && bgImage.complete && bgImage.naturalWidth > 0) {
      try {
        // Create a temporary canvas to convert SVG to image
        const tempCanvas = document.createElement('canvas')
        tempCanvas.width = CERTIFICATE_WIDTH
        tempCanvas.height = CERTIFICATE_HEIGHT
        const tempCtx = tempCanvas.getContext('2d')
        if (tempCtx) {
          tempCtx.fillStyle = '#EBEBEB'
          tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height)
          tempCtx.drawImage(bgImage, 0, 0, tempCanvas.width, tempCanvas.height)
          bgImageData = tempCanvas.toDataURL('image/png')
        }
      } catch (imgError) {
        console.warn('Failed to convert background image:', imgError)
      }
    }

    // Add background image to PDF if available
    if (bgImageData) {
      pdf.addImage(bgImageData, 'PNG', 0, 0, pdfWidth, pdfHeight)
    } else {
      // Fill background color
      pdf.setFillColor(235, 235, 235) // #EBEBEB
      pdf.rect(0, 0, pdfWidth, pdfHeight, 'F')
    }

    // Draw text on canvas first (to support Arabic fonts), then add to PDF
    const textCanvas = document.createElement('canvas')
    // Use high resolution for better quality
    const scale = 2
    textCanvas.width = CERTIFICATE_WIDTH * scale
    textCanvas.height = CERTIFICATE_HEIGHT * scale
    const textCtx = textCanvas.getContext('2d')
    
    if (!textCtx) {
      throw new Error('Failed to get canvas context for text')
    }

    // Set up canvas for high quality
    textCtx.scale(scale, scale)
    textCtx.fillStyle = 'transparent'
    textCtx.fillRect(0, 0, CERTIFICATE_WIDTH, CERTIFICATE_HEIGHT)

    // Set text properties - all text uses #B48E65
    textCtx.fillStyle = '#B48E65'
    textCtx.textAlign = 'center'
    textCtx.textBaseline = 'top'
    textCtx.direction = 'rtl'

    // Wait for font to load
    await document.fonts.ready

    // Load decorative images
    const topImage = new Image()
    const badgeImage = new Image()
    
    await Promise.all([
      new Promise<void>((resolve, reject) => {
        topImage.crossOrigin = 'anonymous'
        topImage.onload = () => resolve()
        topImage.onerror = () => reject(new Error('Failed to load top image'))
        topImage.src = '/images/cer-top.svg'
      }),
      new Promise<void>((resolve, reject) => {
        badgeImage.crossOrigin = 'anonymous'
        badgeImage.onload = () => resolve()
        badgeImage.onerror = () => reject(new Error('Failed to load badge image'))
        badgeImage.src = '/images/cer-badge.svg'
      })
    ])

    // Draw top image on top right (respecting right margin)
    const topImageWidth = 600
    const topImageHeight = (141 / 741) * topImageWidth
    const topX = CERTIFICATE_WIDTH - topImageWidth - (RIGHT_MARGIN - 30)
    const topY = 0
    textCtx.drawImage(topImage, topX, topY, topImageWidth, topImageHeight)

    // Draw badge image on bottom left (respecting left margin)
    const badgeImageWidth = 150
    const badgeImageHeight = (252 / 250) * badgeImageWidth
    const badgeX = LEFT_MARGIN - 40
    const badgeY = CERTIFICATE_HEIGHT - badgeImageHeight - 40
    
    // Add black shadow behind badge image
    textCtx.shadowColor = 'rgba(0, 0, 0, 0.3)'
    textCtx.shadowBlur = 10
    textCtx.shadowOffsetX = -6
    textCtx.shadowOffsetY = 6
    textCtx.drawImage(badgeImage, badgeX, badgeY, badgeImageWidth, badgeImageHeight)
    
    // Reset shadow properties
    textCtx.shadowColor = 'transparent'
    textCtx.shadowBlur = 0
    textCtx.shadowOffsetX = 0
    textCtx.shadowOffsetY = 0

    textCtx.fillStyle = '#B48E65'
    textCtx.font = '18px "Mohammad Bold Art", sans-serif'
    const firstPart = '"يَا أَيُّهَا النَّاسُ إِنَّا خَلَقْنَاكُمْ مِنْ ذَكَرٍ وَأُنْثَى وَجَعَلْنَاكُمْ شُعُوبًا وَقَبَائِلَ لِتَعَارَفُوا'
    const secondPart = 'إِنَّ أَكْرَمَكُمْ عِنْدَ اللَّهِ أَتْقَاكُمْ إِنَّ اللَّهَ عَلِيمٌ خَبِيرٌ"'
    const verseEnd = 'صدق الله العظيم'
    
    // Draw first part of verse
    textCtx.fillText(firstPart, CERTIFICATE_WIDTH / 2, 80)
    
    // Calculate positions for RTL layout
    textCtx.font = '18px "Mohammad Bold Art", sans-serif'
    const secondPartWidth = textCtx.measureText(secondPart).width
    
    // Draw verseEnd with smaller font on the left
    textCtx.font = '14px "Mohammad Bold Art", sans-serif'
    const verseEndWidth = textCtx.measureText(verseEnd).width
    
    const verseEndX = (CERTIFICATE_WIDTH / 2) - (secondPartWidth / 2) - verseEndWidth + 30
    
    // Draw verseEnd on left
    textCtx.fillText(verseEnd, verseEndX, 113)
    
    // Draw second part centered
    textCtx.font = '18px "Mohammad Bold Art", sans-serif'
    textCtx.fillText(secondPart, CERTIFICATE_WIDTH / 2, 110)

    // Title
    textCtx.font = 'bold 48px "Mohammad Bold Art", sans-serif'
    textCtx.fillText('وثيقة البحث بين شخصين', CERTIFICATE_WIDTH / 2, 180)

    // Helper function to load image
    const loadImage = (src: string): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.onload = () => resolve(img)
        img.onerror = () => reject(new Error(`Failed to load image: ${src}`))
        img.src = src
      })
    }

    // Load all person images
    const personImages: Map<string, HTMLImageElement> = new Map()
    try {
      // Load common ancestor image
      if (props.commonAncestor?.photo) {
        const commonImg = await loadImage(props.commonAncestor.photo)
        personImages.set('common', commonImg)
      }
      
      // Load member1 images
      for (const member of props.member1 || []) {
        if (member.photo && !personImages.has(member.photo)) {
          try {
            const img = await loadImage(member.photo)
            personImages.set(member.photo, img)
          } catch (e) {
            console.warn('Failed to load image for member1:', member.fullName)
          }
        }
      }
      
      // Load member2 images
      for (const member of props.member2 || []) {
        if (member.photo && !personImages.has(member.photo)) {
          try {
            const img = await loadImage(member.photo)
            personImages.set(member.photo, img)
          } catch (e) {
            console.warn('Failed to load image for member2:', member.fullName)
          }
        }
      }
    } catch (error) {
      console.warn('Some images failed to load, continuing without them:', error)
    }

    // Helper function to draw circular image with shadow
    const drawCircularImage = (img: HTMLImageElement | null, x: number, y: number, size: number) => {
      if (!img) return
      
      textCtx.save()
      
      // Set shadow for the circle
      textCtx.shadowColor = 'rgba(241, 198, 135, 0.6)'
      textCtx.shadowBlur = 15
      textCtx.shadowOffsetX = 0
      textCtx.shadowOffsetY = 0
      
      // Create circular clipping path
      textCtx.beginPath()
      textCtx.arc(x, y, size / 2, 0, Math.PI * 2)
      textCtx.clip()
      
      // Draw the image
      textCtx.drawImage(img, x - size / 2, y - size / 2, size, size)
      
      textCtx.restore()
      
      // Draw border circle
      textCtx.strokeStyle = 'rgba(241, 198, 135, 0.3)'
      textCtx.lineWidth = 2
      textCtx.beginPath()
      textCtx.arc(x, y, size / 2, 0, Math.PI * 2)
      textCtx.stroke()
    }

    // Helper function to draw dashed line
    const drawDashedLine = (x1: number, y1: number, x2: number, y2: number, color: string, dashLength: number = 4, gapLength: number = 4) => {
      textCtx.strokeStyle = color
      textCtx.lineWidth = 1
      textCtx.setLineDash([dashLength, gapLength])
      
      textCtx.beginPath()
      textCtx.moveTo(x1, y1)
      textCtx.lineTo(x2, y2)
      textCtx.stroke()
      
      textCtx.setLineDash([])
    }

    // Helper function to draw junction circle
    const drawJunctionCircle = (x: number, y: number, color: string) => {
      // Outer circle (border)
      textCtx.strokeStyle = color
      textCtx.lineWidth = 1
      textCtx.beginPath()
      textCtx.arc(x, y, 6, 0, Math.PI * 2)
      textCtx.stroke()
      
      // Inner filled circle
      textCtx.fillStyle = color
      textCtx.beginPath()
      textCtx.arc(x, y, 4, 0, Math.PI * 2)
      textCtx.fill()
    }

    // Draw visual tree
    const treeStartY = 250
    const imageSize = 60 // Size for branch images
    const commonImageSize = 80 // Size for common ancestor
    const verticalSpacing = 100 // Space between nodes
    const horizontalSpacing = 200 // Space between left and right branches
    
    // Draw Common Ancestor at top center
    const centerX = CERTIFICATE_WIDTH / 2
    const commonY = treeStartY
    
    const commonImg = props.commonAncestor?.photo ? personImages.get(props.commonAncestor.photo) : null
    drawCircularImage(commonImg, centerX, commonY, commonImageSize)
    
    // Common ancestor name
    textCtx.fillStyle = '#B48E65'
    textCtx.font = 'bold 24px "Mohammad Bold Art", sans-serif'
    textCtx.textAlign = 'center'
    textCtx.fillText(commonAncestorName.value || '', centerX, commonY + commonImageSize / 2 + 15)
    
    // Draw connecting lines from common ancestor
    const junctionY = commonY + commonImageSize / 2 + 40
    const branchStartY = junctionY + 30
    
    // Vertical line from common ancestor
    drawDashedLine(centerX, commonY + commonImageSize / 2, centerX, junctionY, '#B48E65')
    
    // Junction circle
    drawJunctionCircle(centerX, junctionY, '#B48E65')
    
    // Horizontal line connecting branches
    const leftBranchX = centerX - horizontalSpacing
    const rightBranchX = centerX + horizontalSpacing
    drawDashedLine(leftBranchX, junctionY, rightBranchX, junctionY, '#B48E65')
    
    // Draw Member 1 Branch (Left side) - reverse to show from ancestor to person
    const member1Array = [...(props.member1 || [])].reverse()
    let member1Y = branchStartY
    
    for (let i = 0; i < member1Array.length; i++) {
      const member = member1Array[i]
      const img = member.photo ? personImages.get(member.photo) : null
      
      // Draw image
      drawCircularImage(img, leftBranchX, member1Y, imageSize)
      
      // Draw name
      textCtx.fillStyle = '#B48E65'
      textCtx.font = '18px "Mohammad Bold Art", sans-serif'
      textCtx.textAlign = 'center'
      const nameY = member1Y + imageSize / 2 + 20
      textCtx.fillText(member.fullName || '', leftBranchX, nameY)
      
      // Draw connecting line (except for last item)
      if (i < member1Array.length - 1) {
        const nextY = member1Y + verticalSpacing
        drawDashedLine(leftBranchX, member1Y + imageSize / 2, leftBranchX, nextY - imageSize / 2, '#B48E65')
        drawJunctionCircle(leftBranchX, nextY - imageSize / 2, '#B48E65')
        member1Y = nextY
      } else {
        member1Y += imageSize / 2 + 30
      }
    }
    
    // Draw label for member1
    textCtx.font = 'bold 20px "Mohammad Bold Art", sans-serif'
    textCtx.fillText('الشخص الأول', leftBranchX, member1Y + 10)
    const member1BottomY = member1Y + 40
    
    // Draw Member 2 Branch (Right side) - reverse to show from ancestor to person
    const member2Array = [...(props.member2 || [])].reverse()
    let member2Y = branchStartY
    
    for (let i = 0; i < member2Array.length; i++) {
      const member = member2Array[i]
      const img = member.photo ? personImages.get(member.photo) : null
      
      // Draw image
      drawCircularImage(img, rightBranchX, member2Y, imageSize)
      
      // Draw name
      textCtx.fillStyle = '#B48E65'
      textCtx.font = '18px "Mohammad Bold Art", sans-serif'
      textCtx.textAlign = 'center'
      const nameY = member2Y + imageSize / 2 + 20
      textCtx.fillText(member.fullName || '', rightBranchX, nameY)
      
      // Draw connecting line (except for last item)
      if (i < member2Array.length - 1) {
        const nextY = member2Y + verticalSpacing
        drawDashedLine(rightBranchX, member2Y + imageSize / 2, rightBranchX, nextY - imageSize / 2, '#B48E65')
        drawJunctionCircle(rightBranchX, nextY - imageSize / 2, '#B48E65')
        member2Y = nextY
      } else {
        member2Y += imageSize / 2 + 30
      }
    }
    
    // Draw label for member2
    textCtx.font = 'bold 20px "Mohammad Bold Art", sans-serif'
    textCtx.fillText('الشخص الثاني', rightBranchX, member2Y + 10)
    const member2BottomY = member2Y + 40
    
    // Calculate the bottom of the tree (use the maximum Y from both branches)
    const maxTreeY = Math.max(member1BottomY, member2BottomY)
    const dateStartY = Math.max(maxTreeY + 30, 650)

    // Date at bottom
    textCtx.fillStyle = '#B48E65'
    textCtx.font = '20px "Mohammad Bold Art", sans-serif'
    textCtx.direction = 'rtl'
    textCtx.textAlign = 'right'
    textCtx.fillText('وقد طبعت هذه الشهادة استناداََ الي الوارد في كتاب القول الحاسم في نسب القواسم', CERTIFICATE_WIDTH - RIGHT_MARGIN, dateStartY)
    const dateText = `طُبعت بتاريخ: ${currentDate.value} م`
    textCtx.fillText(dateText, CERTIFICATE_WIDTH - RIGHT_MARGIN, dateStartY + 30)

    // Convert text canvas to image and add to PDF
    const textImageData = textCanvas.toDataURL('image/png')
    
    // Add text image on top of background
    pdf.addImage(textImageData, 'PNG', 0, 0, pdfWidth, pdfHeight)
    
    // Print the PDF instead of downloading
    const pdfBlob = pdf.output('blob')
    const pdfUrl = URL.createObjectURL(pdfBlob)
    const printWindow = window.open(pdfUrl, '_blank')
    
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print()
        // Clean up the URL after a delay
        setTimeout(() => {
          URL.revokeObjectURL(pdfUrl)
        }, 1000)
      }
    } else {
      // Fallback: if popup blocked, try direct print with iframe
      const iframe = document.createElement('iframe')
      iframe.style.display = 'none'
      iframe.src = pdfUrl
      document.body.appendChild(iframe)
      iframe.onload = () => {
        iframe.contentWindow?.print()
        setTimeout(() => {
          document.body.removeChild(iframe)
          URL.revokeObjectURL(pdfUrl)
        }, 1000)
      }
    }

  } catch (error) {
    console.error('Error generating PDF:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error details:', errorMessage)
    alert(`حدث خطأ أثناء إنشاء ملف PDF: ${errorMessage}. يرجى المحاولة مرة أخرى.`)
  } finally {
    // Restore original background image if it was changed
    if (bgImage && originalBgSrc) {
      bgImage.src = originalBgSrc
    }
    
    // Restore original styles
    container.style.display = originalDisplay
    container.style.position = originalPosition
    container.style.top = originalTop
    container.style.left = originalLeft
    container.style.zIndex = ''
    container.style.width = ''
    container.style.height = ''
    container.style.visibility = ''
    
    isGenerating.value = false
  }
}

defineExpose({
  generatePDF
})
</script>

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
  background: #EBEBEB;
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
  font-family: 'Mohammad Bold Art', sans-serif;
  font-size: 48px;
  font-weight: bold;
  color: #B48E65;
  margin-bottom: 40px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.certificate-text {
  width: 100%;
  max-width: 850px;
  margin-bottom: 40px;
}

.certificate-intro {
  font-family: 'Mohammad Bold Art', sans-serif;
  font-size: 24px;
  color: #B48E65;
  margin-bottom: 20px;
  line-height: 1.8;
}

.certificate-name {
  font-family: 'Mohammad Bold Art', sans-serif;
  font-size: 36px;
  color: #B48E65;
  margin-bottom: 30px;
  line-height: 1.8;
}

.certificate-name strong {
  font-weight: bold;
  font-size: 42px;
  color: #B48E65;
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
  font-family: 'Mohammad Bold Art', sans-serif;
  font-size: 24px;
  font-weight: bold;
  color: #B48E65;
  margin-bottom: 15px;
}

.branch-lineage {
  font-family: 'Mohammad Bold Art', sans-serif;
  font-size: 18px;
  color: #B48E65;
  line-height: 2;
  text-align: right;
}

.certificate-footer {
  margin-top: auto;
  width: 100%;
}

.certificate-date {
  font-family: 'Mohammad Bold Art', sans-serif;
  font-size: 20px;
  color: #B48E65;
  margin-top: 30px;
}
</style>

