# Holiday Graphics Generation Feature

This feature allows you to generate social media posts with custom graphics for health-related holidays using Unsplash images and a Canva-style template.

## Features

- **Batch Processing**: Generate multiple posts with graphics at once
- **Unsplash Integration**: Automatically fetch relevant background images
- **Custom Template Support**: Use your own Canva template as background
- **Flexible Text Positioning**: Control where date and title text appear
- **Template Configuration UI**: Easy-to-use interface for customizing templates
- **Download & Share**: Download generated images and share posts
- **Responsive Design**: Works on desktop and mobile devices

## How It Works

### 1. Template Structure
The graphics generator supports two modes:

**Custom Template Mode** (Recommended):
- Use your own Canva template image as background
- Overlay date and title text at configurable positions
- Full control over text styling and positioning

**Default Overlay Mode**:
- Red Banner: Date display at the top-left
- Blue Overlay: Main title area with health holiday information
- Footer Text: Organization name at the bottom
- Logo Area: Circular logo placeholder in top-right corner

### 2. Image Processing
- Fetches background images from Unsplash using holiday-specific queries
- Scales and crops images to fit the 940x788 template
- Applies dark overlay for better text readability
- Generates final image with all text and branding elements

### 3. Post Generation
- Creates engaging social media text with emojis
- Generates relevant hashtags
- Sets optimal posting times (9:00 AM)
- Includes call-to-action phrases

## Usage

1. **Configure Template** (Optional): Click "Configure Template" to set up your custom template
2. **Fetch Holidays**: Use the URL input to scrape holidays from a website
3. **Extract Health Holidays**: Use AI to filter health-related holidays
4. **Generate Posts**: Create basic social media posts
5. **Generate with Graphics**: Create posts with custom graphics using the template

## Template Configuration

### Setting Up Your Custom Template

1. **Create Template Image**: Design your template in Canva or any graphics editor
2. **Upload Template**: Use the "Configure Template" button to:
   - **Upload directly**: Drag and drop or click to upload your template image
   - **Use URL**: Reference an image in the `public` folder
3. **Configure Settings**: Position and style your text:
   - Position the date text (X, Y coordinates)
   - Position the title text (X, Y coordinates)
   - Customize font sizes, colors, and alignment
4. **Test & Adjust**: Generate a test post and adjust positioning as needed

### Template Configuration Options

- **Template Upload**: Direct file upload with drag-and-drop support
- **Template Image URL**: Path to your template image in the public folder
- **Date Position**: X/Y coordinates, font size, color, and alignment
- **Title Position**: X/Y coordinates, font size, color, alignment, and max width
- **Presets**: Quick configurations for common layouts (default, centered, right-aligned)

### Upload Features

- **Drag & Drop**: Simply drag your template image onto the upload area
- **File Validation**: Automatic validation of file type (images only) and size (max 10MB)
- **Preview**: See your uploaded template before configuring text positions
- **Data URL Storage**: Uploaded images are stored as data URLs for immediate use
- **Remove Option**: Easy removal and re-upload of templates

## Template Preview

The Template Preview shows a live preview of your template configuration:

- **Auto-updates**: Preview refreshes when you change settings
- **Example Text**: Uses placeholder text to show positioning
- **Real-time Feedback**: See changes immediately as you adjust settings
- **Error Handling**: Clear error messages if something goes wrong

### Debugging Tips

1. **Start with Defaults**: Use the default configuration first, then customize
2. **Check Positioning**: Use the preview to verify text positioning
3. **Incremental Changes**: Make small adjustments and test frequently
4. **Live Preview**: The preview updates automatically as you change settings

## API Endpoints

### `/api/generate-holiday-graphics`
- **Method**: POST
- **Input**: Array of holiday objects with title, description, query, dates
- **Output**: Array of generated posts with graphics URLs

## Components

### `GeneratedPostsWithGraphics`
- Displays generated posts in a responsive grid
- Shows both original and generated images
- Provides download and share functionality
- Includes post preview dialog

### `useHolidayGraphics`
- Manages graphics generation state
- Handles API calls and error states
- Provides loading indicators

## Configuration

### Template Settings
Located in `src/utils/graphicsGenerator.ts`:
- Canvas size: 940x788 pixels
- Colors: Red (#DC2626), Blue (#1E40AF)
- Fonts: Arial, sans-serif
- Text positioning and sizing

### Unsplash Integration
- Uses existing Unsplash API integration
- Fetches landscape-oriented images
- Caches images for performance
- Handles fallback scenarios

## Dependencies

- `canvas`: Server-side image generation
- `@mui/material`: UI components
- Existing Unsplash integration
- Existing OpenAI integration

## Future Enhancements

- [ ] Upload custom logo
- [ ] Multiple template options
- [ ] Image storage service integration
- [ ] Batch download functionality
- [ ] Social media scheduling
- [ ] Analytics and engagement tracking

## Troubleshooting

### Common Issues

1. **Canvas Installation**: Ensure canvas package is properly installed
2. **Image Loading**: Check Unsplash API key configuration
3. **Memory Usage**: Large batch processing may require server optimization
4. **Font Loading**: Custom fonts may need additional configuration

### Error Handling

- Graceful fallback to original images if graphics generation fails
- Clear error messages for debugging
- Loading states for better user experience
- Retry mechanisms for failed requests
