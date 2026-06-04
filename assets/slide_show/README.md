# Hero Slideshow Images

This directory contains images for the hero slideshow on the homepage.

## How to Use

1. **Add your images** to this directory:
   - Supported formats: `.jpg`, `.jpeg`, `.png`, `.png`
   - Recommended size: 1920x1080 or higher
   - Recommended aspect ratio: 16:9
   - File size: Keep under 500KB for fast loading

2. **Update manifest.json** with your image filenames:

   ```json
   {
     "images": ["slide1.jpg", "slide2.jpg", "slide3.jpg", "slide4.jpg"]
   }
   ```

3. The slideshow will automatically load your images!

## Example Structure

```
assets/slide_show/
├── manifest.json
├── slide1.jpg
├── slide2.jpg
├── slide3.jpg
└── slide4.jpg
```

## Notes

- Images are displayed in the order listed in `manifest.json`
- The first image in the list will be shown first
- If no images are found, the slideshow falls back to placeholder images
- Each slide displays for 5 seconds
- The slideshow loops continuously

## Tips for Best Results

- Use high-quality images of taxis, vehicles, or Graz city views
- Ensure images are bright and not too dark
- Consider adding text overlay space (center area)
- Optimize images before uploading (compress to reduce file size)
- Test on different devices to ensure images look good
