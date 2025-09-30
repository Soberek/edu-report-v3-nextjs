// Client-side graphics generation using HTML5 Canvas
// This approach avoids server-side canvas dependency issues

interface GraphicsOptions {
  title: string;
  date: string;
  backgroundImageUrl: string;
  templateImageUrl?: string;
  datePosition?: {
    x: number;
    y: number;
    fontSize: number;
    color: string;
    fontFamily: string;
    textAlign: 'left' | 'center' | 'right';
  };
  titlePosition?: {
    x: number;
    y: number;
    fontSize: number;
    color: string;
    fontFamily: string;
    textAlign: 'left' | 'center' | 'right';
    maxWidth: number;
    lineHeight?: number;
  };
  imagePlaceholder?: {
    x: number;
    y: number;
    radius: number;
  };
}

interface TemplateConfig {
  width: number;
  height: number;
  redBanner: {
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
  };
  blueOverlay: {
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
  };
  titleText: {
    x: number;
    y: number;
    fontSize: number;
    color: string;
    fontFamily: string;
    maxWidth: number;
  };
  dateText: {
    x: number;
    y: number;
    fontSize: number;
    color: string;
    fontFamily: string;
  };
  footerText: {
    x: number;
    y: number;
    fontSize: number;
    color: string;
    fontFamily: string;
  };
  logo: {
    x: number;
    y: number;
    size: number;
  };
}

// Template configuration based on the Canva template
const TEMPLATE_CONFIG: TemplateConfig = {
  width: 940,
  height: 788,
  redBanner: {
    x: 0,
    y: 0,
    width: 400,
    height: 80,
    color: '#DC2626', // Red color
  },
  blueOverlay: {
    x: 0,
    y: 200,
    width: 700,
    height: 400,
    color: '#1E40AF', // Blue color
  },
  titleText: {
    x: 50,
    y: 350,
    fontSize: 48,
    color: '#FFFFFF',
    fontFamily: 'Arial, sans-serif',
    maxWidth: 600,
  },
  dateText: {
    x: 20,
    y: 50,
    fontSize: 24,
    color: '#FFFFFF',
    fontFamily: 'Arial, sans-serif',
  },
  footerText: {
    x: 540,
    y: 1050,
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'Arial, sans-serif',
  },
  logo: {
    x: 900,
    y: 50,
    size: 120,
  },
};

export class GraphicsGenerator {
  private config: TemplateConfig;

  constructor(config: TemplateConfig = TEMPLATE_CONFIG) {
    this.config = config;
  }

  async generateHolidayPost(options: GraphicsOptions): Promise<string> {
    const { 
      title, 
      date, 
      backgroundImageUrl, 
      templateImageUrl,
      datePosition,
      titlePosition,
      imagePlaceholder
    } = options;

    // Create canvas element
    const canvas = document.createElement('canvas');
    canvas.width = this.config.width;
    canvas.height = this.config.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Failed to get canvas context');
    }

    try {
      // If template image is provided, use it as the base
      if (templateImageUrl) {
        const templateImage = await this.loadImage(templateImageUrl);
        // Draw the template image to fill the entire canvas
        ctx.drawImage(templateImage, 0, 0, this.config.width, this.config.height);
      } else {
        // Fallback: Load and draw background image with overlays
        if (backgroundImageUrl) {
          const backgroundImage = await this.loadImage(backgroundImageUrl);
          
          // Calculate scaling to cover the entire canvas while maintaining aspect ratio
          const scale = Math.max(
            this.config.width / backgroundImage.width,
            this.config.height / backgroundImage.height
          );
          
          const scaledWidth = backgroundImage.width * scale;
          const scaledHeight = backgroundImage.height * scale;
          
          // Center the image
          const x = (this.config.width - scaledWidth) / 2;
          const y = (this.config.height - scaledHeight) / 2;
          
          ctx.drawImage(backgroundImage, x, y, scaledWidth, scaledHeight);
        } else {
          // Fallback gradient background
          const gradient = ctx.createLinearGradient(0, 0, this.config.width, this.config.height);
          gradient.addColorStop(0, '#3B82F6');
          gradient.addColorStop(1, '#1E40AF');
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, this.config.width, this.config.height);
        }

        // Add dark overlay for better text readability
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(0, 0, this.config.width, this.config.height);

        // Draw red banner
        ctx.fillStyle = this.config.redBanner.color;
        ctx.fillRect(
          this.config.redBanner.x,
          this.config.redBanner.y,
          this.config.redBanner.width,
          this.config.redBanner.height
        );

        // Draw blue overlay
        ctx.fillStyle = this.config.blueOverlay.color;
        ctx.fillRect(
          this.config.blueOverlay.x,
          this.config.blueOverlay.y,
          this.config.blueOverlay.width,
          this.config.blueOverlay.height
        );
      }

      // Draw date text
      const dateConfig = datePosition || {
        x: this.config.dateText.x,
        y: this.config.dateText.y,
        fontSize: this.config.dateText.fontSize,
        color: this.config.dateText.color,
        fontFamily: this.config.dateText.fontFamily,
        textAlign: 'left' as const
      };

      ctx.fillStyle = dateConfig.color;
      ctx.font = `${dateConfig.fontSize}px ${dateConfig.fontFamily}`;
      ctx.textAlign = dateConfig.textAlign;
      ctx.textBaseline = 'middle';
      ctx.fillText(date, dateConfig.x, dateConfig.y);

      // Draw title text
      const titleConfig = titlePosition || {
        x: this.config.titleText.x,
        y: this.config.titleText.y,
        fontSize: this.config.titleText.fontSize,
        color: this.config.titleText.color,
        fontFamily: this.config.titleText.fontFamily,
        textAlign: 'left' as const,
        maxWidth: this.config.titleText.maxWidth
      };

      ctx.fillStyle = titleConfig.color;
      ctx.font = `bold ${titleConfig.fontSize}px ${titleConfig.fontFamily}`;
      ctx.textAlign = titleConfig.textAlign;
      ctx.textBaseline = 'middle';
      
      // Handle text wrapping for title
      this.wrapText(ctx, title, titleConfig.x, titleConfig.y, titleConfig.maxWidth, titleConfig.fontSize, titleConfig.lineHeight);

      // Draw Unsplash image in circular placeholder (if template and image placeholder are provided)
      if (templateImageUrl && imagePlaceholder && backgroundImageUrl) {
        try {
          const unsplashImage = await this.loadImage(backgroundImageUrl);
          
          // Create circular clipping path
          ctx.save();
          ctx.beginPath();
          ctx.arc(imagePlaceholder.x, imagePlaceholder.y, imagePlaceholder.radius, 0, 2 * Math.PI);
          ctx.clip();
          
          // Calculate scaling to fill the circle
          const scale = Math.max(
            (imagePlaceholder.radius * 2) / unsplashImage.width,
            (imagePlaceholder.radius * 2) / unsplashImage.height
          );
          
          const scaledWidth = unsplashImage.width * scale;
          const scaledHeight = unsplashImage.height * scale;
          
          // Center the image in the circle
          const x = imagePlaceholder.x - scaledWidth / 2;
          const y = imagePlaceholder.y - scaledHeight / 2;
          
          ctx.drawImage(unsplashImage, x, y, scaledWidth, scaledHeight);
          ctx.restore();
        } catch (error) {
          console.warn('Failed to load Unsplash image for placeholder:', error);
        }
      }

      return canvas.toDataURL('image/png');
    } catch (error) {
      console.error('Error generating graphics:', error);
      throw new Error('Failed to generate graphics');
    }
  }

  private loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      // Only set crossOrigin for external URLs, not data URLs
      if (!src.startsWith('data:')) {
        img.crossOrigin = 'anonymous';
      }
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  private wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, fontSize: number, lineHeightMultiplier: number = 1.2): void {
    const words = text.split(' ');
    let line = '';
    let lineHeight = fontSize * lineHeightMultiplier;
    let currentY = y;

    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;

      if (testWidth > maxWidth && i > 0) {
        ctx.fillText(line, x, currentY);
        line = words[i] + ' ';
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, currentY);
  }

  // Method to generate multiple posts in batch
  async generateBatchPosts(holidays: Array<{ title: string; date: string; backgroundImageUrl: string }>): Promise<string[]> {
    const results: string[] = [];
    
    for (const holiday of holidays) {
      try {
        const imageDataUrl = await this.generateHolidayPost(holiday);
        results.push(imageDataUrl);
      } catch (error) {
        console.error(`Failed to generate image for ${holiday.title}:`, error);
        // Continue with other holidays
      }
    }
    
    return results;
  }
}

// Export a default instance
export const graphicsGenerator = new GraphicsGenerator();
