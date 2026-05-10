'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Check, 
  Search, 
  Sparkles, 
  Star, 
  Grid3X3,
  LayoutList,
  Filter
} from 'lucide-react'
import { TEMPLATES, TEMPLATE_CATEGORIES, Template } from '@/lib/templates'
import { useCV } from '@/lib/store'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.2 }
  }
}

function TemplatePreview({ template }: { template: Template }) {
  return (
    <div 
      className="w-full h-full flex flex-col p-3 rounded-lg"
      style={{ 
        backgroundColor: template.colors.background,
        color: template.colors.text 
      }}
    >
      {/* Header bar */}
      <div 
        className="h-1.5 w-full rounded-full mb-3"
        style={{ backgroundColor: template.colors.primary }}
      />
      
      {/* Profile section */}
      <div className="flex gap-2 mb-3">
        <div 
          className="w-8 h-8 rounded-full flex-shrink-0"
          style={{ backgroundColor: template.colors.secondary }}
        />
        <div className="flex-1 space-y-1">
          <div 
            className="h-2 w-3/4 rounded"
            style={{ backgroundColor: template.colors.primary }}
          />
          <div 
            className="h-1.5 w-1/2 rounded opacity-60"
            style={{ backgroundColor: template.colors.text }}
          />
        </div>
      </div>

      {/* Content lines */}
      <div className="space-y-2 flex-1">
        <div className="flex gap-1">
          <div 
            className="h-1.5 w-2 rounded"
            style={{ backgroundColor: template.colors.accent }}
          />
          <div 
            className="h-1.5 flex-1 rounded opacity-40"
            style={{ backgroundColor: template.colors.text }}
          />
        </div>
        <div 
          className="h-1 w-5/6 rounded opacity-30"
          style={{ backgroundColor: template.colors.text }}
        />
        <div 
          className="h-1 w-4/6 rounded opacity-30"
          style={{ backgroundColor: template.colors.text }}
        />
        <div className="pt-2">
          <div 
            className="h-1.5 w-1/3 rounded mb-1"
            style={{ backgroundColor: template.colors.secondary }}
          />
          <div className="flex gap-1">
            {[1, 2, 3].map((i) => (
              <div 
                key={i}
                className="h-4 w-8 rounded text-[6px] flex items-center justify-center"
                style={{ 
                  backgroundColor: template.colors.accent,
                  opacity: 0.7
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function TemplatesPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const { createResume } = useCV()
  const router = useRouter()

  const filteredTemplates = TEMPLATES.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleUseTemplate = (template: Template) => {
    createResume(`New Resume - ${template.name}`, template.id)
    toast.success(`Created new resume with ${template.name} template!`)
    router.push('/dashboard')
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="absolute inset-0 sa-stripe opacity-50" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              <Sparkles className="w-3 h-3 mr-1" />
              {TEMPLATES.length} South African Inspired Templates
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="sa-gradient-text">Choose Your Template</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Professional CV templates inspired by South Africa&apos;s vibrant culture, 
              landscapes, and the spirit of the Rainbow Nation
            </p>
          </motion.div>
        </div>
      </div>

      {/* Filters */}
      <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
              {TEMPLATE_CATEGORIES.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className={`whitespace-nowrap transition-all ${
                    selectedCategory === category.id 
                      ? 'bg-primary text-primary-foreground shadow-lg' 
                      : 'hover:bg-primary/10'
                  }`}
                >
                  {category.name}
                  <span className="ml-1.5 text-xs opacity-70">({category.count})</span>
                </Button>
              ))}
            </div>

            {/* View Toggle */}
            <div className="flex gap-1 bg-muted rounded-lg p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="h-8 w-8 p-0"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="h-8 w-8 p-0"
              >
                <LayoutList className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredTemplates.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Filter className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No templates found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${selectedCategory}-${searchQuery}-${viewMode}`}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className={viewMode === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'space-y-4'
              }
            >
              {filteredTemplates.map((template, index) => (
                <motion.div
                  key={template.id}
                  variants={itemVariants}
                  layout
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {viewMode === 'grid' ? (
                    <Card className="group overflow-hidden card-hover bg-card border-border/50 h-full flex flex-col">
                      {/* Preview */}
                      <div className="relative h-48 border-b border-border overflow-hidden">
                        <TemplatePreview template={template} />
                        
                        {/* Badges */}
                        <div className="absolute top-2 left-2 flex gap-1">
                          {template.popular && (
                            <Badge className="bg-accent text-accent-foreground text-xs">
                              <Star className="w-3 h-3 mr-0.5 fill-current" />
                              Popular
                            </Badge>
                          )}
                          {template.new && (
                            <Badge className="bg-primary text-primary-foreground text-xs">
                              <Sparkles className="w-3 h-3 mr-0.5" />
                              New
                            </Badge>
                          )}
                        </div>

                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-4">
                          <Button 
                            onClick={() => handleUseTemplate(template)}
                            className="bg-white text-black hover:bg-white/90 shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform"
                          >
                            Use This Template
                          </Button>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-4 flex-1 flex flex-col">
                        <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">
                          {template.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2 flex-1">
                          {template.description}
                        </p>

                        {/* Color swatches */}
                        <div className="flex gap-1.5 mb-3">
                          {Object.entries(template.colors).slice(0, 4).map(([key, color]) => (
                            <div
                              key={key}
                              className="w-5 h-5 rounded-full border border-border shadow-sm"
                              style={{ backgroundColor: color }}
                              title={key}
                            />
                          ))}
                        </div>

                        {/* Features */}
                        <div className="flex flex-wrap gap-1.5">
                          {template.features.map((feature) => (
                            <span 
                              key={feature} 
                              className="inline-flex items-center gap-1 text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full"
                            >
                              <Check className="w-3 h-3 text-primary" />
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    </Card>
                  ) : (
                    <Card className="group overflow-hidden card-hover bg-card border-border/50">
                      <div className="flex gap-4 p-4">
                        {/* Preview thumbnail */}
                        <div className="w-32 h-40 rounded-lg overflow-hidden flex-shrink-0 border border-border">
                          <TemplatePreview template={template} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                                  {template.name}
                                </h3>
                                {template.popular && (
                                  <Badge variant="secondary" className="text-xs">
                                    <Star className="w-3 h-3 mr-0.5 fill-current" />
                                    Popular
                                  </Badge>
                                )}
                                {template.new && (
                                  <Badge className="bg-primary/10 text-primary text-xs">
                                    New
                                  </Badge>
                                )}
                              </div>
                              <p className="text-muted-foreground text-sm mb-3">
                                {template.description}
                              </p>
                            </div>
                            <Button 
                              onClick={() => handleUseTemplate(template)}
                              className="flex-shrink-0"
                            >
                              Use Template
                            </Button>
                          </div>

                          {/* Color swatches & features */}
                          <div className="flex items-center gap-4">
                            <div className="flex gap-1">
                              {Object.entries(template.colors).slice(0, 5).map(([key, color]) => (
                                <div
                                  key={key}
                                  className="w-4 h-4 rounded-full border border-border"
                                  style={{ backgroundColor: color }}
                                />
                              ))}
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {template.features.map((feature) => (
                                <span 
                                  key={feature} 
                                  className="inline-flex items-center gap-1 text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full"
                                >
                                  <Check className="w-3 h-3" />
                                  {feature}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="border-t border-border bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold mb-4">
              Can&apos;t find the perfect template?
            </h2>
            <p className="text-muted-foreground mb-6">
              Start with any template and customize colors, fonts, and layouts to match your style
            </p>
            <Link href="/dashboard">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                <Sparkles className="w-4 h-4 mr-2" />
                Create Custom Resume
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </main>
  )
}
