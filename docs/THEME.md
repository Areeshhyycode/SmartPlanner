# Smart Trip Planner - Color Theme Guide

## 🎨 Color Hunt Palette

**Source:** [Color Hunt - Sky Gradient Palette](https://colorhunt.co/palette/154d711c6ea433a1e0fff9af)

This beautiful sky gradient theme is perfect for a weather-based trip planning application, evoking feelings of clear skies, sunny horizons, and adventure.

## 🌈 Color Palette

### Deep Blue (`#154D71`)
- **Usage**: Primary text, dark backgrounds, headers
- **Meaning**: Twilight sky, deep ocean - represents depth and professionalism
- **Tailwind Classes**: `bg-deep-blue`, `text-deep-blue`, `border-deep-blue`

### Medium Blue (`#1C6EA4`)
- **Usage**: Primary buttons, main CTAs, primary brand color
- **Meaning**: Clear sky - represents trust, openness, and clarity
- **Tailwind Classes**: `bg-medium-blue`, `text-medium-blue`, `border-medium-blue`

### Light Blue (`#33A1E0`)
- **Usage**: Secondary buttons, highlights, accents
- **Meaning**: Bright sky - represents energy and optimism
- **Tailwind Classes**: `bg-light-blue`, `text-light-blue`, `border-light-blue`

### Cream Yellow (`#FFF9AF`)
- **Usage**: Accent color, background highlights, special CTAs
- **Meaning**: Sunlit horizon - represents warmth, positivity, and adventure
- **Tailwind Classes**: `bg-cream-yellow`, `text-cream-yellow`, `border-cream-yellow`

## 📝 Usage Examples

### Buttons
```tsx
// Primary Button (Medium Blue)
<button className="bg-medium-blue hover:bg-medium-blue/90 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all">
  Plan Your Trip
</button>

// Secondary Button (Light Blue)
<button className="bg-light-blue hover:bg-light-blue/90 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all">
  Explore Destinations
</button>

// Accent Button (Cream Yellow)
<button className="bg-cream-yellow hover:bg-cream-yellow/90 text-deep-blue px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all border-2 border-deep-blue/20">
  View Weather
</button>
```

### Cards with Glassmorphism
```tsx
<div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20">
  <h3 className="text-deep-blue font-semibold mb-2">Trip Details</h3>
  <p className="text-deep-blue/70">Your trip information here</p>
</div>
```

### Gradient Backgrounds
```tsx
// Sky Gradient
<div className="bg-gradient-to-b from-deep-blue via-medium-blue via-light-blue to-cream-yellow">
  {/* Content */}
</div>

// Horizontal Gradient
<div className="bg-gradient-to-r from-medium-blue to-light-blue">
  {/* Content */}
</div>
```

### Alerts
```tsx
// Warning Alert (Cream Yellow)
<div className="bg-cream-yellow/50 border-l-4 border-cream-yellow p-4 rounded-lg">
  <p className="text-deep-blue font-medium">Weather Alert: Sunny day ahead!</p>
</div>

// Danger Alert
<div className="bg-alert-danger/20 border-l-4 border-alert-danger p-4 rounded-lg">
  <p className="text-deep-blue font-medium">Critical: Severe weather warning</p>
</div>

// Success Alert
<div className="bg-alert-success/20 border-l-4 border-alert-success p-4 rounded-lg">
  <p className="text-deep-blue font-medium">Success: Trip plan saved!</p>
</div>
```

### Text Colors

#### Text on Light Backgrounds
```tsx
// Primary Text - Deep Blue
<p className="text-deep-blue">Main content text</p>
<h1 className="text-deep-blue">Primary Heading</h1>

// Secondary Text - Medium Blue
<p className="text-medium-blue">Secondary information</p>
<h3 className="text-medium-blue">Secondary Heading</h3>

// Light Text - Light Blue
<p className="text-light-blue">Light accent text</p>

// Muted Text (with opacity)
<p className="text-deep-blue/70">Muted secondary text</p>
<p className="text-deep-blue/50">Very muted text</p>
```

#### Text on Colored Backgrounds
```tsx
// White text on blue backgrounds
<div className="bg-deep-blue p-4">
  <p className="text-white">White text on Deep Blue</p>
</div>

<div className="bg-medium-blue p-4">
  <p className="text-white">White text on Medium Blue</p>
</div>

<div className="bg-light-blue p-4">
  <p className="text-white">White text on Light Blue</p>
</div>

// Deep Blue text on Cream Yellow
<div className="bg-cream-yellow p-4">
  <p className="text-deep-blue">Deep Blue text on Cream Yellow</p>
</div>
```

#### Typography Hierarchy
```tsx
// Headings
<h1 className="text-4xl font-bold text-deep-blue">Main Heading</h1>
<h2 className="text-3xl font-bold text-deep-blue">Section Heading</h2>
<h3 className="text-2xl font-semibold text-medium-blue">Subsection Heading</h3>
<h4 className="text-xl font-semibold text-medium-blue">Minor Heading</h4>

// Body Text
<p className="text-base text-deep-blue">Regular paragraph text</p>
<p className="text-sm text-deep-blue/70">Small muted text</p>

// Links
<a href="#" className="text-medium-blue hover:text-light-blue underline">
  Link text
</a>
```

## 🎯 Theme Reference

For programmatic access to colors, import from `src/config/theme.ts`:

```tsx
import theme from '@/config/theme';
// or
import theme from '../config/theme';

// Access hex values
const primaryColor = theme.colors.mediumBlue; // '#1C6EA4'
const deepBlue = theme.colors.deepBlue; // '#154D71'
const lightBlue = theme.colors.lightBlue; // '#33A1E0'
const creamYellow = theme.colors.creamYellow; // '#FFF9AF'

// Access Tailwind class names
const primaryButtonClass = theme.classes.primary.bg; // 'bg-medium-blue'
const textClass = theme.classes.text.text; // 'text-deep-blue'
```

## 🌈 Color Psychology & Usage

- **Deep Blue (#154D71)**: 
  - Professional, trustworthy, depth
  - Use for: Headers, primary text, dark backgrounds
  
- **Medium Blue (#1C6EA4)**:
  - Trust, clarity, openness
  - Use for: Primary buttons, main CTAs, brand elements
  
- **Light Blue (#33A1E0)**:
  - Energy, optimism, brightness
  - Use for: Secondary buttons, highlights, accents
  
- **Cream Yellow (#FFF9AF)**:
  - Warmth, positivity, adventure
  - Use for: Special CTAs, background accents, positive highlights

## 🎨 Design Tips

1. **Gradient Backgrounds**: Use the full gradient (`from-deep-blue via-medium-blue via-light-blue to-cream-yellow`) for hero sections or backgrounds
2. **Contrast**: Always use `text-deep-blue` on light backgrounds and `text-white` on blue backgrounds
3. **Glassmorphism**: Use `bg-white/90 backdrop-blur-sm` for modern card designs
4. **Shadows**: Add `shadow-md` or `shadow-lg` to buttons and cards for depth
5. **Hover States**: Use opacity modifiers like `hover:bg-medium-blue/90` for smooth transitions

## 🔗 Resources

- [Color Hunt Palette](https://colorhunt.co/palette/154d711c6ea433a1e0fff9af)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
