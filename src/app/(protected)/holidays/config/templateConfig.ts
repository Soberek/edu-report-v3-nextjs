// Template configuration for holiday graphics generation
// You can customize the template image and text positioning here

export const TEMPLATE_CONFIG = {
  // Template image URL - place your Canva template image in the public folder
  // Example: '/templates/holiday-template.png'
  templateImageUrl: '', // Leave empty to use default overlays
  
  // Date text positioning (replaces "DATE HERE" in template)
  datePosition: {
    x: 150, // X position (pixels from left) - to the right of the logo
    y: 65, // Y position (pixels from top) - aligned with logo
    fontSize: 18,
    color: '#000000', // Black text to match template
    fontFamily: 'Arial, sans-serif',
    textAlign: 'left' as const, // 'left', 'center', or 'right'
  },
  
  // Title text positioning (replaces "TEXT HERE" in template)
  titlePosition: {
    x: 30, // X position (pixels from left) - below the logo and date
    y: 200, // Y position (pixels from top) - below the date
    fontSize: 36,
    color: '#2D5A5A', // Teal color to match template
    fontFamily: 'Arial, sans-serif',
    textAlign: 'left' as const, // 'left', 'center', or 'right'
    maxWidth: 450, // Maximum width for text wrapping
    lineHeight: 1.2, // Line spacing multiplier
  },
  
  // Canvas dimensions
  canvasSize: {
    width: 940,
    height: 788,
  },
  
  // Image placeholder for Unsplash image (circular area in top-right)
  imagePlaceholder: {
    x: 750, // X position of circle center (top-right area)
    y: 175, // Y position of circle center
    radius: 280, // Radius of the circular image area
  }
};

// Helper function to update template configuration
export const updateTemplateConfig = (updates: Partial<typeof TEMPLATE_CONFIG>) => {
  return { ...TEMPLATE_CONFIG, ...updates };
};

// Example configurations for different templates
export const TEMPLATE_PRESETS = {
  // Default template with overlays
  default: {
    templateImageUrl: '',
    datePosition: {
      x: 80,
      y: 40,
      fontSize: 18,
      color: '#000000',
      fontFamily: 'Arial, sans-serif',
      textAlign: 'left' as const,
    },
    titlePosition: {
      x: 80,
      y: 80,
      fontSize: 36,
      color: '#2D5A5A',
      fontFamily: 'Arial, sans-serif',
      textAlign: 'left' as const,
      maxWidth: 500,
      lineHeight: 1.2,
    },
    imagePlaceholder: {
      x: 750,
      y: 200,
      radius: 120,
    },
  },
  
  // Center-aligned template
  centered: {
    templateImageUrl: '',
    datePosition: {
      x: 470, // Center of 940px canvas
      y: 40,
      fontSize: 18,
      color: '#000000',
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center' as const,
    },
    titlePosition: {
      x: 470, // Center of 940px canvas
      y: 80,
      fontSize: 36,
      color: '#2D5A5A',
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center' as const,
      maxWidth: 600,
      lineHeight: 1.2,
    },
    imagePlaceholder: {
      x: 750,
      y: 200,
      radius: 120,
    },
  },
  
  // Right-aligned template
  rightAligned: {
    templateImageUrl: '',
    datePosition: {
      x: 860, // Near right edge of 940px canvas
      y: 40,
      fontSize: 18,
      color: '#000000',
      fontFamily: 'Arial, sans-serif',
      textAlign: 'right' as const,
    },
    titlePosition: {
      x: 860, // Near right edge of 940px canvas
      y: 80,
      fontSize: 36,
      color: '#2D5A5A',
      fontFamily: 'Arial, sans-serif',
      textAlign: 'right' as const,
      maxWidth: 500,
      lineHeight: 1.2,
    },
    imagePlaceholder: {
      x: 750,
      y: 200,
      radius: 120,
    },
  },
};
