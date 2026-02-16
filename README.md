# Private VCF Viewer

A modern, fast, and completely private VCF (vCard) file viewer that runs entirely in your browser.

**[Live Demo](https://lscherub.github.io/vcf-viewer/)**

## 🔒 Privacy First

This application is designed with a strict "Local-Only" architecture:

- **No Server Uploads**: Your contacts never leave your device.
- **Client-Side Parsing**: All processing happens in your browser using JavaScript.
- **Offline Capable**: Once loaded, the app works without an internet connection.
- **Zero Tracking**: No analytics, no cookies, no external scripts.

## ✨ Features

- **Drag & Drop**: Easily upload `.vcf` files.
- **Search & Filter**: Quickly find contacts by name or email.
- **Rich Details**: View photos, phone numbers, emails, addresses, and notes.
- **Material You Design**: Clean, modern interface supporting Light and Dark modes.
- **Cross-Platform**: Works on Desktop, Tablet, and Mobile.

## 🚀 How to Use

1. Open the application.
2. Drag and drop a `.vcf` file onto the window, or click to select a file.
3. Browse your contacts in the list view.
4. Click a contact to view full details.

## 🛠️ Development

This project is built with:
- **React**: UI library
- **Vite**: Build tool
- **CSS Variables**: For theming and design tokens

### Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Build

```bash
# Build for production
npm run build
```

## 📦 Deployment

This project is ready for GitHub Pages.

1. Go to your GitHub repository **Settings**.
2. Navigate to **Pages**.
3. Under **Build and deployment**, select **GitHub Actions**.
4. A workflow file is included in `.github/workflows/deploy.yml`.

## 📄 License

MIT License. Feel free to fork and modify!
