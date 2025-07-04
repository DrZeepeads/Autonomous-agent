import { motion } from 'framer-motion'
import { TrendingUp, Calculator, Pill, Activity, Baby, Scale } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const tools = [
  {
    id: 'growth-chart',
    title: 'Growth Chart Visualizer',
    description: 'Plot and analyze pediatric growth percentiles with WHO and CDC standards',
    icon: TrendingUp,
    color: 'text-blue-400',
    category: 'Assessment',
    features: ['WHO Growth Standards', 'CDC Growth Charts', 'Percentile Calculations', 'Growth Velocity']
  },
  {
    id: 'drug-calculator',
    title: 'Drug Dosing Calculator',
    description: 'Calculate safe pediatric medication dosages based on weight and age',
    icon: Calculator,
    color: 'text-green-400',
    category: 'Pharmacology',
    features: ['Weight-based Dosing', 'Age Adjustments', 'Safety Checks', 'Common Medications']
  },
  {
    id: 'calorie-intake',
    title: 'Neonatal Calorie Calculator',
    description: 'Calculate nutritional requirements for premature and term infants',
    icon: Baby,
    color: 'text-pink-400',
    category: 'Nutrition',
    features: ['Caloric Needs', 'Protein Requirements', 'Fluid Balance', 'Growth Tracking']
  },
  {
    id: 'vital-signs',
    title: 'Vital Signs Reference',
    description: 'Age-appropriate normal ranges for pediatric vital signs',
    icon: Activity,
    color: 'text-red-400',
    category: 'Assessment',
    features: ['Heart Rate Ranges', 'Blood Pressure Norms', 'Respiratory Rates', 'Temperature Guidelines']
  },
  {
    id: 'bmi-calculator',
    title: 'Pediatric BMI Calculator',
    description: 'Calculate BMI percentiles and assess nutritional status in children',
    icon: Scale,
    color: 'text-purple-400',
    category: 'Assessment',
    features: ['BMI Percentiles', 'Nutritional Status', 'Growth Assessment', 'Trend Analysis']
  },
  {
    id: 'medication-guide',
    title: 'Pediatric Medication Guide',
    description: 'Comprehensive database of pediatric medications and dosing guidelines',
    icon: Pill,
    color: 'text-orange-400',
    category: 'Pharmacology',
    features: ['Drug Database', 'Dosing Guidelines', 'Contraindications', 'Side Effects']
  }
]

export default function ExploreGPTs() {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">Explore Medical Tools</h1>
        <p className="text-muted-foreground">
          Specialized calculators and tools for pediatric healthcare professionals
        </p>
      </motion.div>

      {/* Tools Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {tools.map((tool, index) => {
          const IconComponent = tool.icon
          return (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card className="cursor-pointer bg-card border-border hover:bg-hover-color transition-colors h-full">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg bg-muted ${tool.color}`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{tool.title}</CardTitle>
                        <Badge variant="secondary" className="mt-1">
                          {tool.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">
                    {tool.description}
                  </CardDescription>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-foreground">Key Features:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {tool.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center">
                          <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Coming Soon Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-12 p-6 bg-muted rounded-lg text-center"
      >
        <h3 className="text-lg font-semibold mb-2">More Tools Coming Soon</h3>
        <p className="text-muted-foreground">
          We're continuously adding new specialized tools to help pediatric healthcare professionals 
          provide the best care possible. Stay tuned for updates!
        </p>
      </motion.div>
    </div>
  )
}

