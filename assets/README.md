# Assets Folder

Place your app assets here:

- `icon.png` - App icon (1024x1024px)
- `splash.png` - Splash screen image (2048x2048px)
- `adaptive-icon.png` - Android adaptive icon (1024x1024px)
- `favicon.png` - Web favicon (48x48px)

## Recommended Sizes

### Icon (icon.png)
- Size: 1024x1024 pixels
- Format: PNG with transparency
- Use: iOS and Android app icon

### Splash Screen (splash.png)
- Size: 2048x2048 pixels
- Format: PNG
- Background: #4A90E2 (blue)
- Use: Launch screen

### Adaptive Icon (adaptive-icon.png)
- Size: 1024x1024 pixels
- Format: PNG with transparency
- Safe area: Center 512x512 pixels
- Use: Android adaptive icon

### Favicon (favicon.png)
- Size: 48x48 pixels
- Format: PNG
- Use: Web app favicon

## Generate Icons

You can use the following tools to generate app icons:

1. [App Icon Generator](https://appicon.co/)
2. [Expo Icon Generator](https://icon.kitchen/)
3. [Make App Icon](https://makeappicon.com/)

Or use Expo's built-in asset generator:

```bash
npx expo-asset-bundle-visualizer
```

## Placeholder Note

Currently using placeholder references in app.json. 
You can create simple colored squares as placeholders or use proper app icons/images.

To ignore asset errors temporarily, you can comment out the asset references in app.json.
