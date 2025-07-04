import { aiService } from '@/services/aiService'

// Sample Nelson Textbook content for seeding the database
const sampleContent = [
  {
    chapter: "Neonatology",
    pageNumber: 45,
    content: "Neonatal jaundice is a common condition affecting approximately 60% of term newborns and 80% of preterm infants. Physiologic jaundice typically appears after 24 hours of life, peaks at 3-5 days in term infants, and resolves by 1-2 weeks. Pathologic jaundice may appear within the first 24 hours, rise rapidly, or persist beyond normal timeframes. Risk factors include prematurity, blood group incompatibility, glucose-6-phosphate dehydrogenase deficiency, and breastfeeding difficulties.",
    metadata: { topic: "jaundice", age_group: "neonate" }
  },
  {
    chapter: "Cardiology",
    pageNumber: 156,
    content: "Congenital heart disease occurs in approximately 8 per 1000 live births. The most common lesions include ventricular septal defect (VSD), atrial septal defect (ASD), patent ductus arteriosus (PDA), and tetralogy of Fallot. Early recognition is crucial as some lesions require immediate intervention. Signs of congenital heart disease in newborns include cyanosis, poor feeding, failure to thrive, and respiratory distress.",
    metadata: { topic: "congenital_heart_disease", age_group: "neonate" }
  },
  {
    chapter: "Infectious Diseases",
    pageNumber: 234,
    content: "Respiratory syncytial virus (RSV) is the leading cause of bronchiolitis and pneumonia in infants and young children. Peak incidence occurs between 2-6 months of age. Clinical presentation includes rhinorrhea, cough, wheezing, and respiratory distress. Severe disease is more common in premature infants, those with chronic lung disease, or immunocompromised children. Treatment is primarily supportive with oxygen, hydration, and bronchodilators as needed.",
    metadata: { topic: "rsv", age_group: "infant" }
  },
  {
    chapter: "Growth and Development",
    pageNumber: 67,
    content: "Normal growth patterns in children follow predictable curves. Birth weight typically doubles by 4-6 months and triples by 12 months. Length increases by approximately 25cm in the first year. Head circumference grows rapidly in the first year, reflecting brain growth. Failure to thrive is defined as weight below the 3rd percentile or crossing two major percentile lines downward. Causes include inadequate caloric intake, malabsorption, or increased metabolic demands.",
    metadata: { topic: "growth", age_group: "infant" }
  },
  {
    chapter: "Immunizations",
    pageNumber: 89,
    content: "The recommended immunization schedule begins at birth with hepatitis B vaccine. At 2 months, infants receive DTaP, IPV, Hib, PCV13, and rotavirus vaccines. The schedule continues with boosters at 4 and 6 months. MMR and varicella vaccines are given at 12-15 months. Contraindications include severe illness, immunocompromised state, and previous severe allergic reactions. Live vaccines should be avoided in immunocompromised children.",
    metadata: { topic: "vaccines", age_group: "infant" }
  },
  {
    chapter: "Nutrition",
    pageNumber: 178,
    content: "Breastfeeding is recommended as the exclusive source of nutrition for the first 6 months of life. Breast milk provides optimal nutrition, immunologic protection, and promotes maternal-infant bonding. Formula feeding is an acceptable alternative when breastfeeding is not possible. Iron supplementation is recommended for breastfed infants after 4 months. Solid foods should be introduced around 6 months, starting with iron-fortified cereals and pureed fruits and vegetables.",
    metadata: { topic: "nutrition", age_group: "infant" }
  },
  {
    chapter: "Emergency Medicine",
    pageNumber: 298,
    content: "Pediatric basic life support differs from adult protocols. For infants under 1 year, use 2 fingers for chest compressions at a rate of 100-120 per minute. For children 1-8 years, use heel of one hand. Compression depth should be at least 1/3 of chest diameter. Rescue breathing is crucial in pediatric arrests as they are often respiratory in origin. The compression to ventilation ratio is 30:2 for single rescuer and 15:2 for two rescuers.",
    metadata: { topic: "cpr", age_group: "pediatric" }
  },
  {
    chapter: "Dermatology",
    pageNumber: 445,
    content: "Atopic dermatitis (eczema) affects up to 20% of children. It typically begins in infancy with involvement of the face, scalp, and extensor surfaces. In older children, flexural areas are more commonly affected. The condition is characterized by dry, itchy, inflamed skin with a chronic relapsing course. Treatment includes gentle skin care, moisturizers, topical corticosteroids for flares, and identification and avoidance of triggers.",
    metadata: { topic: "eczema", age_group: "pediatric" }
  }
]

export async function seedTextbookContent(): Promise<boolean> {
  try {
    console.log('Starting to seed textbook content...')
    
    for (const item of sampleContent) {
      const success = await aiService.addTextbookContent(
        item.chapter,
        item.pageNumber,
        item.content,
        item.metadata
      )
      
      if (success) {
        console.log(`✅ Added content for ${item.chapter}, Page ${item.pageNumber}`)
      } else {
        console.log(`❌ Failed to add content for ${item.chapter}, Page ${item.pageNumber}`)
      }
      
      // Small delay to avoid overwhelming the database
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    console.log('✅ Textbook content seeding completed!')
    return true
  } catch (error) {
    console.error('❌ Error seeding textbook content:', error)
    return false
  }
}

// Function to check if content already exists
export async function checkTextbookContent(): Promise<number> {
  try {
    const chapters = await aiService.getTextbookChapters()
    return chapters.length
  } catch (error) {
    console.error('Error checking textbook content:', error)
    return 0
  }
}

