# Logo Setup Instructions

## Adding Your Logo

1. **Place your logo file:**
   - Copy your logo PNG file to this directory (`public/images/`)
   - Rename it to `logo.png`
   - Recommended size: 400x133 pixels (or 3:1 aspect ratio)

2. **Supported formats:**
   - PNG (recommended for transparency)
   - SVG (best for scalability)
   - JPG/JPEG (if no transparency needed)

3. **Update the Logo component:**
   - Open `src/components/ui/Logo.tsx`
   - Change `const hasLogo = false;` to `const hasLogo = true;`
   - If using SVG, change the `src` from `logo.png` to `logo.svg`

## Converting your PNG to other formats (optional)

If you want to convert your PNG to SVG or optimize it:

### Online tools:
- [Convertio](https://convertio.co/png-svg/) - PNG to SVG conversion
- [TinyPNG](https://tinypng.com/) - PNG optimization
- [SVGOMG](https://jakearchibald.github.io/svgomg/) - SVG optimization

### Command line (if you have ImageMagick):
```bash
# Optimize PNG
pngquant logo.png --output logo-optimized.png

# Convert to WebP (modern format)
convert logo.png logo.webp
```

## Using the Logo

The Logo component is already integrated in:
- Header navigation (`src/components/layout/Header.tsx`)
- Can be used anywhere with: `<Logo />` or `<Logo width={200} height={67} />`

## Current Status

- [ ] Logo file added to `/public/images/logo.png`
- [ ] Logo component updated (`hasLogo = true`)
- [ ] Logo displays correctly in header
