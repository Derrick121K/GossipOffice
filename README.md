# GossipOffice

A free, local-first, AI-assisted office suite built with Next.js (App Router), TypeScript, Tailwind, and shadcn/ui.

## Features

### Core Functionality
- **Resume & Cover Letter Builder** - CV builder with live preview + cover letter editing
- **Office Tools** - Notes/Word/PowerPoint/Excel/Visio-style workspace (ribbon + Backstage) with local Files
- **Live Preview** - Real-time preview as you type
- **Multiple Professional Templates** - 35 templates with different layouts
- **Template Switching** - Switch between templates without losing your data
- **Exports** - PDF/DOCX/PPTX downloads
- **Auto-save** - Saved locally in your browser (local-first)

### AI Features
- **Groq integration** - AI suggestions + AI generation endpoints under `/api/ai/*`
- **GossipAI** - Office Tools side panel to prompt AI and apply results (Insert/Replace)

### User Experience
- **Dark & Light Mode** - Full theme support with system preference detection
- **Mobile Responsive** - Fully responsive design that works on all devices
- **Local Data Storage** - All resumes saved in browser local storage using Zustand
- **Drag & Drop Ready** - Architecture supports drag-and-drop section reordering
- **Professional Animations** - Smooth Framer Motion animations throughout the app

### Resume Sections
- Personal Information (with profile photo upload)
- Professional Summary
- Work Experience
- Education
- Skills (with proficiency levels)
- Extensible for: Certifications, Languages, Projects, References

## Tech Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: Zustand with local storage persistence
- **Animations**: Framer Motion
- **Export**: `@react-pdf/renderer` (CV PDFs) + `docx` + `pptxgenjs` + `jspdf` (text PDFs)
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## Project Structure

```
/app
  /files              - Local-first file hub
  /tools              - Office Tools workspace (ribbon + Backstage + GossipAI)
  /dashboard          - Resume list and management
  /builder           - Multi-step CV builder
    /[id]           - Individual resume builder
  /templates         - Template gallery
  /settings          - User settings and preferences
  page.tsx           - Landing page
  
/components
  /builder
    /sections        - Form sections (personal, experience, education, skills)
    builder-form.tsx - Main builder form with tabs
    resume-preview.tsx - Live preview component
    resume-score.tsx - Resume scoring display
    ai-suggestions.tsx - AI suggestions panel
    template-switcher.tsx - Template selector
  /ui               - shadcn/ui components

/lib
  store.ts          - Zustand store for CV data
  ai-suggestions.ts - Mock AI suggestion data
  pdf-export.ts     - PDF export utility
  resume-scorer.ts  - Resume scoring algorithm
  utils.ts          - Tailwind utility functions
```

## Getting Started

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

If you don't have `pnpm` installed globally (common on Windows without admin rights), you can run it via `npx` instead:

```bash
npx --yes pnpm@latest install
npx --yes pnpm@latest dev
```

The app will be available at `http://localhost:3000`

### Environment Variables

No environment variables are required for the basic local version (it uses mock AI suggestions). For real AI suggestions via **Groq**, add:

```env
GROQ_API_KEY=your_groq_api_key_here
# Optional
GROQ_MODEL=llama-3.1-8b-instant
```

Copy `.env.example` to `.env.local` and restart the dev server after changes.

## Production deployment (GitHub + Vercel free tier)

### 1) Push to GitHub
- Create a new GitHub repo
- Commit and push this project
- **Do not commit** `.env.local` (it contains secrets). This repo already ignores it via `.gitignore`.

### 2) Deploy on Vercel (free)
- Create an account at Vercel
- Import the GitHub repository
- In **Project → Settings → Environment Variables**, add:
  - `GROQ_API_KEY`
  - `GROQ_MODEL` (optional)
- Deploy. Your free domain will look like `https://<project>.vercel.app`.

### 3) Rotate any exposed API keys (IMPORTANT)
If you ever pasted a real key into a file or chat history:
- Go to Groq console and **revoke/rotate** the key immediately.
- Update the key in Vercel env vars.
- Restart/redeploy.

## Safety notes (local-first)
- Your documents are stored in your browser. Clearing site data can remove them.
- Use **Files → Export Backup** (when enabled) and regular PDF/DOCX/PPTX exports for backups.

## Usage

1. **Landing Page**: View features, testimonials, and pricing
2. **Dashboard**: Create, view, edit, and manage your resumes
3. **Builder**: Fill in your resume information across multiple sections
4. **Preview**: See live preview of your resume as you type
5. **Export**: Download your resume as a PDF
6. **Templates**: Switch between different professional templates
7. **Settings**: Manage theme, notifications, and export data

## Key Features Explained

### Resume Scoring
The scoring system evaluates your resume across 5 dimensions:
- Personal Info (20 points)
- Experience (30 points)
- Education (20 points)
- Skills (20 points)
- Profile Image (bonus)

Scoring ranges:
- 80-100: Excellent
- 60-79: Good
- 40-59: Fair
- Below 40: Poor

### AI Suggestions
Mock AI suggestions are provided for:
- Professional summaries (job-seeking advice)
- Job description bullet points (by category: software, management, design, marketing)
- Skills (technical, professional, tools)

To integrate with real AI:
1. Update `/lib/ai-suggestions.ts` to call your AI API
2. Implement streaming responses for better UX
3. Add API rate limiting and caching

### Data Persistence
All resume data is stored in the browser's local storage using Zustand. The store includes:
- Multiple resumes support
- Auto-save on every change
- Persistent theme preference

## Customization

### Adding New Template
1. Create a new template variant in the preview component
2. Add styling classes based on templateId
3. List it in `/app/templates/page.tsx` and the template switcher

### Extending Resume Sections
1. Add new fields to the Resume interface in `/lib/store.ts`
2. Create a new section component in `/components/builder/sections/`
3. Add tab to the builder form
4. Update the preview component to display the new section

### Styling
The app uses:
- Design tokens for colors in `/app/globals.css`
- Tailwind CSS for utilities
- shadcn/ui components with custom styling
- Blue (#2563eb) as primary color with grayscale neutrals

## Browser Support

- Modern browsers supporting ES6+ and CSS Grid/Flexbox
- Tested on:
  - Chrome/Edge 90+
  - Firefox 88+
  - Safari 14+
  - Mobile browsers (iOS Safari, Chrome Android)

## Performance Optimizations

- Code splitting via Next.js automatic splitting
- Image optimization with next/image (when used)
- Local storage for instant resume loading
- Memoization of expensive computations (resume scoring)
- CSS-in-JS minimization with Tailwind purging

## Future Enhancements

- [ ] Database integration (Supabase, PostgreSQL)
- [ ] User authentication and cloud sync
- [ ] Real AI integration for suggestions
- [ ] Advanced PDF templates with custom styling
- [ ] Resume sharing with public links
- [ ] Resume version history
- [ ] Collaborative editing
- [ ] Email export and sharing
- [ ] Multi-language support
- [ ] Interview preparation tools
- [ ] ATS score analysis
- [ ] Cover letter builder

## Deployment

### Vercel (Recommended)
```bash
vercel deploy
```

### Other Platforms
The app is a standard Next.js application and can be deployed to:
- Netlify
- AWS Amplify
- Docker
- Self-hosted servers

## License

MIT License - Feel free to use this project for personal or commercial use.

## Support

For issues, feature requests, or questions:
1. Check existing GitHub issues
2. Create a detailed bug report with reproduction steps
3. Share your feedback and suggestions

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

---

Built with ❤️ using Next.js and modern web technologies.
