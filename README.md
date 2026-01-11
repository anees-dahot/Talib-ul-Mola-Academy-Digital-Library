# Talib ul Mola Academy Digital Library

A beautiful, modern homepage for the Talib ul Mola Academy Digital Library - preserving rare books, scholarly works, and intellectual heritage through digital technology.

## Features

- ✨ Modern, responsive design with elegant animations
- 📚 Hero section with compelling call-to-action
- 👤 Introduction section for Makhdoom Jameel Zaman
- 📖 Books collection showcase with category filters
- 💳 Subscription section with benefits
- 🎨 Custom color scheme (burgundy & gold) for scholarly aesthetic
- ⚡ Built with Next.js 15, React 19, TypeScript, and Tailwind CSS
- 🎭 Smooth animations with Framer Motion

## Getting Started

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

### Build for Production

```bash
npm run build
npm run start
```

### Deploy to Vercel

This project is ready to deploy on Vercel:

1. Push your code to a GitHub repository
2. Import the repository in Vercel
3. Vercel will automatically detect Next.js and configure the build
4. Click "Deploy"

Alternatively, use the Vercel CLI:

```bash
npm install -g vercel
vercel
```

## Project Structure

```
talib-ul-mola-library/
├── app/
│   ├── layout.tsx       # Root layout with metadata
│   ├── page.tsx         # Homepage
│   └── globals.css      # Global styles
├── components/
│   ├── Hero.tsx         # Hero/Banner section
│   ├── Introduction.tsx # About Makhdoom Jameel Zaman
│   ├── BooksCollection.tsx # Books showcase
│   ├── Subscription.tsx # Subscription plans
│   └── Footer.tsx       # Footer with links
├── public/              # Static assets
└── tailwind.config.ts   # Tailwind configuration
```

## Customization

### Colors

The custom color palette is defined in `tailwind.config.ts`:
- Burgundy shades (burgundy-50 to burgundy-950)
- Gold shades (gold-50 to gold-950)

### Fonts

The project uses:
- **Playfair Display** (serif) for headings
- **Inter** (sans-serif) for body text

These are loaded from Google Fonts in `app/globals.css`.

### Content

To update content, edit the respective component files in the `components/` directory.

## Future Enhancements

This homepage is ready for future features:
- User authentication (NextAuth.js or Clerk)
- Payment integration (Stripe)
- Book reader functionality
- Download management
- Backend API (Next.js API routes or Supabase)
- Database (PostgreSQL/Firebase)

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **UI Library:** React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Deployment:** Vercel

## License

All rights reserved - Talib ul Mola Academy

---

Built with ❤️ for preserving knowledge and heritage
# Talib-ul-Mola-Academy-Digital-Library
