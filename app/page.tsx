'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { 
  Zap, 
  Lock, 
  CheckCircle,
  ArrowRight,
  Sparkles,
  Download,
  Palette
} from 'lucide-react'

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    // Framer Motion's easing tuple typing differs across versions; cast for compatibility.
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as any },
  },
}

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 w-full bg-background/80 backdrop-blur-md z-50 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-primary/15 bg-white/70 dark:bg-white/10 border border-border flex items-center justify-center">
              <img src="/oflogo.png" alt="GossipOffice" className="w-7 h-7 object-contain" />
            </div>
            <span className="font-bold text-xl">GossipOffice</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/files">
              <Button variant="ghost" className="hidden sm:inline-flex">Files</Button>
            </Link>
            <Link href="/tools">
              <Button variant="ghost" className="hidden sm:inline-flex">AI Tools</Button>
            </Link>
            <Link href="/templates">
              <Button variant="ghost" className="hidden sm:inline-flex">Templates</Button>
            </Link>
            <Link href="/builder">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25">
                Open Builder
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5 pointer-events-none" />
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center max-w-5xl mx-auto relative z-10"
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">AI-Powered Office Suite</span>
          </motion.div>
          
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-8 leading-tight"
          >
            Create documents, slides, and resumes with{' '}
            <span className="gradient-text">GossipOffice</span>
          </motion.h1>
          
          <motion.p
            variants={itemVariants}
            className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            A modern workspace for CVs, cover letters, summaries, reports, and slide decks — powered by AI and saved locally. Free to use.
          </motion.p>
          
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/files">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 w-full sm:w-auto text-lg px-8 py-6 shadow-xl shadow-primary/25">
                Open Files <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/tools">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 py-6 border-2">
                <Sparkles className="w-5 h-5 mr-2" />
                Try AI Tools
              </Button>
            </Link>
          </motion.div>

          {/* Hero Visual */}
          <motion.div
            variants={itemVariants}
            className="mt-16 relative"
          >
            <div className="relative w-full max-w-3xl mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-accent/30 rounded-3xl blur-2xl transform -rotate-1" />
              <div className="relative rounded-2xl p-8 border shadow-2xl bg-white/90 border-black/5 dark:bg-zinc-950/70 dark:border-white/10">
                <div className="flex items-start gap-6 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center">
                    <div className="w-10 h-10 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded-lg w-2/3" />
                    <div className="h-4 bg-zinc-200/70 dark:bg-zinc-800/70 rounded w-full" />
                    <div className="h-4 bg-zinc-200/70 dark:bg-zinc-800/70 rounded w-5/6" />
                  </div>
                </div>
                <div className="space-y-4 pt-4 border-t border-black/10 dark:border-white/10">
                  <div className="h-4 bg-primary/20 rounded w-1/4" />
                  <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-full" />
                  <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-11/12" />
                  <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-4/5" />
                </div>
                <div className="space-y-4 pt-4 mt-4 border-t border-black/10 dark:border-white/10">
                  <div className="h-4 bg-primary/20 rounded w-1/5" />
                  <div className="flex gap-2 flex-wrap">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded-full px-4 w-20" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 relative bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="text-center mb-16"
          >
            <motion.h2
              variants={itemVariants}
              className="text-3xl sm:text-4xl font-bold mb-6"
            >
              Powerful Features for{' '}
              <span className="gradient-text">Modern Professionals</span>
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
            >
              Everything you need to create professional work: CVs, cover letters, reports, and slides.
            </motion.p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[
              {
                icon: Zap,
                title: 'AI Writing & Drafting',
                description: 'Summaries, reports, bullet points, and cover letters generated from your notes and goals',
                color: 'from-yellow-500 to-orange-500',
              },
              {
                icon: Palette,
                title: 'Elegant Templates',
                description: 'Professional layouts across 35 templates, with consistent exports to PDF/DOCX',
                color: 'from-pink-500 to-rose-500',
              },
              {
                icon: Lock,
                title: 'Private by Default',
                description: 'Local-first storage in your browser. Your data stays on your machine by default',
                color: 'from-green-500 to-emerald-500',
              },
              {
                icon: Download,
                title: 'Export Anywhere',
                description: 'Download PDFs, DOCX, and PPTX — resumes, cover letters, reports, and slides',
                color: 'from-blue-500 to-cyan-500',
              },
              {
                icon: CheckCircle,
                title: 'Fast Workflow',
                description: 'Create, edit, and export in one place with clear navigation (Files, Tools, Resumes)',
                color: 'from-purple-500 to-violet-500',
              },
              {
                icon: Sparkles,
                title: 'Office Tools',
                description: 'Summarize notes, create reports, generate modern slides, and work with PDFs/DOCX',
                color: 'from-indigo-500 to-blue-500',
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="group relative bg-card rounded-2xl p-8 border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2
              variants={itemVariants}
              className="text-3xl sm:text-4xl font-bold mb-6"
            >
              Loved by{' '}
              <span className="gradient-text">10,000+</span>
              {' '}Job Seekers
            </motion.h2>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              {
                name: 'Sarah Johnson',
                role: 'Marketing Manager',
                quote: 'Got 3 interview calls within a week. The templates are sleek and professional!',
                avatar: 'SJ',
              },
              {
                name: 'Michael Chen',
                role: 'Software Engineer',
                quote: 'The AI suggestions for my projects section were incredibly helpful. Landed my dream job!',
                avatar: 'MC',
              },
              {
                name: 'Emma Williams',
                role: 'Product Designer',
                quote: 'Finally a resume builder that understands modern design standards. Absolutely love it.',
                avatar: 'EW',
              },
            ].map((testimonial, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -4 }}
                className="bg-card rounded-2xl p-8 border border-border shadow-sm"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-primary-foreground font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed">&quot;{testimonial.quote}&quot;</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 relative overflow-hidden bg-primary">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-primary" />
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          <motion.h2
            variants={itemVariants}
            className="text-3xl sm:text-5xl font-bold mb-8 text-primary-foreground"
          >
            Ready to get work done faster?
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-lg text-primary-foreground/80 mb-10 max-w-2xl mx-auto"
          >
            Create a CV, generate a cover letter, summarize notes, build a report, and export slides — all in GossipOffice.
          </motion.p>
          <motion.div variants={itemVariants}>
            <Link href="/files">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 gap-2 text-lg px-10 py-6 shadow-2xl">
                Open Files <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-primary/15 bg-white/70 dark:bg-white/10 border border-border flex items-center justify-center">
                  <img src="/oflogo.png" alt="GossipOffice" className="w-7 h-7 object-contain" />
                </div>
                <span className="font-bold text-xl">GossipOffice</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                A modern, AI-powered office suite for documents, reports, slides, and professional resumes.
              </p>
            </div>
            {[
              {
                title: 'Product',
                links: ['Files', 'Office Tools', 'Templates', 'Resumes'],
              },
              {
                title: 'Company',
                links: ['About', 'Blog', 'Careers', 'Contact'],
              },
              {
                title: 'Legal',
                links: ['Privacy', 'Terms', 'Security', 'Cookies'],
              },
            ].map((section, idx) => (
              <div key={idx}>
                <h4 className="font-semibold mb-4">{section.title}</h4>
                <ul className="space-y-3">
                  {section.links.map((link, i) => (
                    <li key={i}>
                      <Link
                        href={
                          link === 'Files'
                            ? '/files'
                            : link === 'Office Tools'
                              ? '/tools'
                              : link === 'Templates'
                                ? '/templates'
                                : link === 'Resumes'
                                  ? '/dashboard'
                                  : link === 'About'
                                    ? '/about'
                                    : link === 'Blog'
                                      ? '/blog'
                                      : link === 'Careers'
                                        ? '/careers'
                                        : link === 'Contact'
                                          ? '/contact'
                                          : link === 'Privacy'
                                            ? '/privacy'
                                            : link === 'Terms'
                                              ? '/terms'
                                              : link === 'Security'
                                                ? '/security'
                                                : link === 'Cookies'
                                                  ? '/cookies'
                                                  : '/'
                        }
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-border pt-8 text-center text-muted-foreground">
            <p>2024 GossipOffice. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
