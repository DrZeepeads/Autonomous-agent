# 🏥 Nelson-GPT - Your Smart Pediatric Assistant

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/DrZeepeads/Autonomous-agent)

A production-ready Progressive Web App (PWA) that delivers evidence-based pediatric healthcare answers sourced exclusively from the Nelson Textbook of Pediatrics via a Retrieval-Augmented Generation (RAG) pipeline powered by Mistral AI.

## 🎯 Features

### 🤖 AI-Powered Medical Assistant
- **RAG Pipeline**: Vector-based content retrieval from Nelson Textbook
- **Streaming Responses**: Real-time AI responses with typing indicators
- **Medical Context**: Specialized prompts for pediatric healthcare
- **Evidence-Based**: All answers sourced from authoritative medical content

### 💬 Advanced Chat Interface
- **Real-time Streaming**: Live AI response generation
- **Chat History**: Persistent conversation storage
- **Message Reactions**: Copy, thumbs up/down, audio, regenerate
- **Mobile-First**: Responsive design optimized for all devices

### 🔐 Secure Backend
- **Supabase Integration**: PostgreSQL with pgvector for embeddings
- **User Authentication**: Secure user profiles with Row Level Security
- **Vector Database**: Optimized medical content similarity search
- **Environment Security**: Secure API key management

### 🎨 Professional UI/UX
- **Medical Styling**: Professional clinical content formatting
- **Dark Theme**: Eye-friendly interface for long sessions
- **PWA Ready**: Installable app with offline capabilities
- **Accessibility**: WCAG compliant design patterns

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- Mistral AI API key

### 1. Clone & Install
```bash
git clone https://github.com/DrZeepeads/Autonomous-agent.git
cd Autonomous-agent
npm install
```

### 2. Environment Setup
Copy `.env.example` to `.env.local` and configure:

```env
# Mistral AI API Configuration
VITE_MISTRAL_API_KEY=your_mistral_api_key_here

# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
VITE_SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
```

### 3. Database Setup
Run the Supabase migration:
```bash
# In your Supabase SQL editor, run:
# supabase/migrations/001_initial_schema.sql
```

### 4. Seed Sample Content
```bash
npm run dev
# Navigate to the app and use the seeder utility
```

### 5. Development
```bash
npm run dev
# Open http://localhost:3000
```

## 🌐 Vercel Deployment

### One-Click Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/DrZeepeads/Autonomous-agent)

### Manual Deployment

1. **Connect Repository**
   - Import your GitHub repository to Vercel
   - Select the `Autonomous-agent` repository

2. **Configure Environment Variables**
   In Vercel dashboard, add these environment variables:
   ```
   VITE_MISTRAL_API_KEY=your_mistral_api_key
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

3. **Deploy**
   - Vercel will automatically build and deploy
   - Build command: `npm run build`
   - Output directory: `dist`

### Build Configuration
The app includes optimized Vercel configuration:
- **SPA Routing**: Proper React Router handling
- **Security Headers**: CSP, XSS protection, frame options
- **Performance**: Code splitting and chunk optimization
- **PWA Support**: Service worker and manifest

## 🏗️ Architecture

### Frontend Stack
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Zustand** for state management
- **React Router** for navigation

### Backend Stack
- **Supabase** (PostgreSQL + Auth + Storage)
- **pgvector** for vector embeddings
- **Row Level Security** for data protection
- **Real-time subscriptions** for live updates

### AI Pipeline
- **Mistral AI** for language generation
- **Vector similarity search** for content retrieval
- **Streaming responses** for real-time interaction
- **Medical context** for specialized prompts

## 📚 Content Management

### Sample Content Included
- **8 Medical Topics**: Neonatology, Cardiology, Infectious Diseases, etc.
- **Vector Embeddings**: Pre-computed for instant search
- **Metadata Tags**: Age groups, topics, clinical relevance

### Adding More Content
Use the content seeder utility:
```typescript
import { seedTextbookContent } from '@/utils/seedTextbookContent'
await seedTextbookContent()
```

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

### Project Structure
```
src/
├── components/      # Reusable UI components
├── contexts/        # React contexts (Auth, etc.)
├── hooks/          # Custom React hooks
├── lib/            # Utility libraries
├── pages/          # Route components
├── services/       # API services
├── stores/         # State management
├── styles/         # Global styles
└── utils/          # Helper functions

supabase/
└── migrations/     # Database migrations

public/
├── icons/          # PWA icons
└── _redirects      # Vercel routing rules
```

## 🔐 Security

### Environment Variables
- Never commit `.env.local` to version control
- Use Vercel environment variables for production
- Rotate API keys regularly

### Database Security
- Row Level Security (RLS) enabled
- User data isolation
- Secure API endpoints

### Content Security
- CSP headers configured
- XSS protection enabled
- Secure HTTPS connections

## 📱 PWA Features

### Installation
- Add to home screen on mobile
- Standalone app experience
- Offline capability (coming soon)

### Performance
- Code splitting for faster loads
- Optimized bundle sizes
- Efficient caching strategies

## 🎯 Roadmap

### Phase 1 (Current)
- ✅ Core chat functionality
- ✅ RAG pipeline implementation
- ✅ User authentication
- ✅ Vercel deployment ready

### Phase 2 (Next)
- 🔄 Advanced medical tools (growth charts, calculators)
- 🔄 Voice input/output
- 🔄 Enhanced content library
- 🔄 Analytics dashboard

### Phase 3 (Future)
- 📋 Mobile app (React Native)
- 📋 Advanced AI features
- 📋 Multi-language support
- 📋 Integration with EHR systems

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- 📧 Email: support@nelson-gpt.com
- 💬 GitHub Issues: [Create an issue](https://github.com/DrZeepeads/Autonomous-agent/issues)
- 📖 Documentation: [Wiki](https://github.com/DrZeepeads/Autonomous-agent/wiki)

---

**Built with ❤️ for pediatric healthcare professionals**

*Nelson-GPT is designed to assist healthcare professionals and should not replace clinical judgment or direct patient care.*

