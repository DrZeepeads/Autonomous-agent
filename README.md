# Nelson-GPT 🧠🩺

**Your Smart Pediatric Assistant** - A production-ready Progressive Web App (PWA) designed for pediatric healthcare professionals and medical students.

## 🌟 Features

- **🎨 ChatGPT-like Interface**: Familiar, professional UI with custom medical theming
- **🧠 AI-Powered Responses**: RAG pipeline with Mistral API and Nelson Textbook content
- **📱 Progressive Web App**: Offline capabilities, app-like experience
- **🔍 Medical Library**: Categorized Nelson Textbook content by specialty
- **🧮 Medical Tools**: Growth charts, drug calculators, vital signs references
- **💬 Real-time Chat**: Streaming responses with markdown support
- **🌙 Professional Theme**: Charcoal (#121212), White (#FFFFFF), Soft Gray (#B0B0B0)

## 🚀 Tech Stack

### Frontend
- **React 18** + **Vite** + **TypeScript**
- **Tailwind CSS** + **Shadcn-UI**
- **Framer Motion** for animations
- **React Router** for navigation
- **Zustand** for state management

### Backend
- **Supabase** (PostgreSQL + Auth + Edge Functions)
- **pgvector** for vector embeddings
- **Mistral API** via OpenRouter for AI responses
- **Server-Sent Events** for streaming

### PWA Features
- Service Worker for offline functionality
- Web App Manifest for app installation
- IndexedDB for local data storage
- Background sync capabilities

## 🎨 Design System

### Color Palette
- **Primary Background**: `#121212` (Charcoal)
- **Primary Text**: `#FFFFFF` (White)
- **Secondary Text**: `#B0B0B0` (Soft Gray)
- **User Messages**: `#2A2A2A`
- **AI Messages**: `#1E1E1E`
- **Hover States**: `#333333`
- **Error/Alerts**: `#FF5252`

### Typography
- **Font Family**: Inter, Roboto (medical-friendly sans-serif)
- **Responsive scaling** with proper contrast ratios

## 📱 App Structure

### Pages
1. **Chat** - Main AI conversation interface
2. **Library** - Categorized medical content (Cardiology, Neonatology, etc.)
3. **Explore GPTs** - Medical tools and calculators
4. **Settings** - Theme, preferences, data management
5. **Profile** - User account and statistics

### Navigation
- **Responsive sidebar** with smooth animations
- **Mobile-first design** with touch-friendly interactions
- **Keyboard navigation** support

## 🛠️ Development

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account (for backend)

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd nelson-gpt

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production
```bash
# Type check
npm run type-check

# Build optimized bundle
npm run build

# Preview production build
npm run preview
```

## 🏥 Medical Content

The app integrates with the **Nelson Textbook of Pediatrics** through a sophisticated RAG (Retrieval-Augmented Generation) pipeline:

1. **Content Ingestion**: Medical content is chunked and embedded
2. **Vector Search**: Semantic similarity search using pgvector
3. **Context Assembly**: Relevant passages are selected for AI prompts
4. **Response Generation**: Mistral API generates evidence-based answers
5. **Streaming Delivery**: Real-time response streaming to the frontend

## 🔒 Security & Privacy

- **HIPAA Considerations**: Designed with healthcare data privacy in mind
- **Row Level Security**: Supabase RLS policies protect user data
- **JWT Authentication**: Secure user sessions
- **Data Encryption**: All data encrypted in transit and at rest

## 📊 Performance

- **Code Splitting**: Optimized bundle loading
- **Lazy Loading**: Components and routes loaded on demand
- **Service Worker**: Aggressive caching for offline performance
- **Image Optimization**: Responsive images with proper formats

## 🎯 Target Users

- **Pediatric Healthcare Professionals**
- **Medical Students** studying pediatrics
- **Residents** in pediatric specialties
- **Nurses** working in pediatric units

## 🚀 Deployment

The app is configured for deployment on:
- **Vercel** (recommended for frontend)
- **Supabase** (backend and database)
- **Custom domains** with SSL

## 📈 Future Enhancements

- **Voice Input/Output** for hands-free operation
- **Multi-language Support** for international users
- **Advanced Analytics** for usage insights
- **Integration APIs** for EMR systems
- **Collaborative Features** for medical teams

## 🤝 Contributing

This is a specialized medical application. Contributions should be reviewed by healthcare professionals to ensure medical accuracy.

## 📄 License

This project is designed for educational and professional medical use. Please ensure compliance with medical software regulations in your jurisdiction.

---

**Nelson-GPT** - Empowering pediatric healthcare with AI-driven insights from the world's leading pediatric textbook.

