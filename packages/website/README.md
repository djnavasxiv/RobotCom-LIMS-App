# RobotComLab Website

A professional marketing website for RobotComLab LIMS application built with Next.js 14 and Tailwind CSS.

## Features

- **Home Page**: Hero section with key statistics, feature highlights, and call-to-action buttons
- **Features Page**: Comprehensive list of 14+ features with icons and detailed descriptions, plus technical specifications
- **Download Page**: Installation guide with system requirements, step-by-step instructions, and trial information
- **Pricing Page**: Two subscription plans ($49/month or $499/year) with feature comparison table and FAQ
- **Responsive Design**: Mobile-friendly layout that works on all devices
- **Professional Styling**: Clean, modern design using Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

```bash
cd packages/website
pnpm install
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the website.

The page auto-updates as you edit files.

### Building

Build for production:

```bash
npm run build
```

### Production

Start the production server:

```bash
npm start
```

## Project Structure

```
packages/website/
├── src/
│   └── app/
│       ├── page.tsx              # Home page
│       ├── features/
│       │   └── page.tsx          # Features page
│       ├── download/
│       │   └── page.tsx          # Download page
│       ├── pricing/
│       │   └── page.tsx          # Pricing page
│       ├── components/
│       │   └── WebsiteLayout.tsx # Navigation layout
│       ├── globals.css           # Global styles
│       └── layout.tsx            # Root layout
├── public/
│   └── downloads/                # Installer downloads
│       └── RobotComLab-Setup-1.0.0.exe
├── tailwind.config.ts
├── postcss.config.js
└── next.config.mjs
```

## Pages

### Home (/)
- Hero section with value proposition
- Key statistics (14+ tests, 100% offline, enterprise security)
- Feature preview grid
- Call-to-action buttons

### Features (/features)
- 14 detailed feature cards with emoji icons
- Technical specifications
- Platform requirements
- Download CTA

### Download (/download)
- Version information
- System requirements
- Step-by-step installation instructions
- What's included
- Support tips and getting started guide
- Licensing information with trial details

### Pricing (/pricing)
- Two pricing plans with feature comparison
- Feature comparison table
- Frequently asked questions
- Free 7-day trial promotion

## Download Link

The website includes a functional download link that points to:
- `/downloads/RobotComLab-Setup-1.0.0.exe`

Make sure to place your installer at `packages/website/public/downloads/RobotComLab-Setup-1.0.0.exe`

## Styling

The website uses:
- **Tailwind CSS**: Utility-first CSS framework
- **Responsive Grid**: Grid layouts that adapt to mobile/tablet/desktop
- **Custom Colors**: Blue accent color (#2563eb) with complementary colors
- **Icons/Emojis**: Simple emoji icons for visual appeal

## SEO & Metadata

- Page titles and descriptions configured in `layout.tsx`
- Meta tags for better search engine visibility
- Semantic HTML structure

## Deployment

The website can be deployed to:
- **Vercel**: Recommended for Next.js apps
- **Netlify**: Supports Next.js deployments
- **Self-hosted**: Export as static site or run Node server

For production, run:
```bash
npm run build
npm start
```

## License

Part of RobotComLab LIMS application.
