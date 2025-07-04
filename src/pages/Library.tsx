import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, BookOpen, Heart, Baby, Stethoscope, Brain, Pill, Shield } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const categories = [
  {
    id: 'infectious',
    title: 'Infectious Diseases',
    description: 'Bacterial, viral, and parasitic infections in children',
    icon: Shield,
    color: 'text-red-400',
    chapters: 15
  },
  {
    id: 'cardiology',
    title: 'Cardiology',
    description: 'Congenital and acquired heart diseases',
    icon: Heart,
    color: 'text-pink-400',
    chapters: 12
  },
  {
    id: 'neonatology',
    title: 'Neonatology',
    description: 'Newborn care and neonatal conditions',
    icon: Baby,
    color: 'text-blue-400',
    chapters: 18
  },
  {
    id: 'pulmonology',
    title: 'Pulmonology',
    description: 'Respiratory system disorders',
    icon: Stethoscope,
    color: 'text-green-400',
    chapters: 10
  },
  {
    id: 'neurology',
    title: 'Neurology',
    description: 'Neurological and developmental disorders',
    icon: Brain,
    color: 'text-purple-400',
    chapters: 14
  },
  {
    id: 'pharmacology',
    title: 'Pharmacology',
    description: 'Pediatric drug dosing and therapeutics',
    icon: Pill,
    color: 'text-orange-400',
    chapters: 8
  }
]

export default function Library() {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredCategories = categories.filter(category =>
    category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">Nelson Textbook Library</h1>
        <p className="text-muted-foreground">
          Browse evidence-based pediatric medicine content organized by specialty
        </p>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative mb-8"
      >
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search medical topics, conditions, or treatments..."
          className="pl-10 bg-input border-border"
        />
      </motion.div>

      {/* Categories Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredCategories.map((category, index) => {
          const IconComponent = category.icon
          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card className="cursor-pointer bg-card border-border hover:bg-hover-color transition-colors">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg bg-muted ${category.color}`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{category.title}</CardTitle>
                      <CardDescription className="text-sm">
                        {category.chapters} chapters
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    {category.description}
                  </p>
                  <div className="flex items-center mt-4 text-sm text-muted-foreground">
                    <BookOpen className="w-4 h-4 mr-1" />
                    Browse content
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>

      {/* No Results */}
      {filteredCategories.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No categories found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search terms to find relevant content.
          </p>
        </motion.div>
      )}
    </div>
  )
}

