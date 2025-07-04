# 🚀 Nelson-GPT Deployment Guide

This guide covers deploying Nelson-GPT to Vercel with complete backend integration.

## 📋 Pre-Deployment Checklist

### ✅ Required Services
- [ ] **Supabase Project** - Database and authentication
- [ ] **Mistral AI API Key** - AI language model access
- [ ] **Vercel Account** - Deployment platform
- [ ] **GitHub Repository** - Source code hosting

### ✅ Environment Variables
Ensure you have these values ready:
```env
VITE_MISTRAL_API_KEY=your_mistral_api_key
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 🌐 Vercel Deployment

### Method 1: One-Click Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/DrZeepeads/Autonomous-agent)

1. Click the deploy button above
2. Connect your GitHub account
3. Configure environment variables
4. Deploy!

### Method 2: Manual Deployment

#### Step 1: Import Project
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import from GitHub: `DrZeepeads/Autonomous-agent`
4. Select the repository

#### Step 2: Configure Build Settings
Vercel will auto-detect these settings:
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

#### Step 3: Environment Variables
Add these in the Vercel dashboard:

| Variable | Value | Description |
|----------|-------|-------------|
| `VITE_MISTRAL_API_KEY` | `ktmttn2gilgermi7hg7uatuppptptxr1` | Mistral AI API key |
| `VITE_SUPABASE_URL` | `https://vteqjgqcksifjmtwwjby.supabase.co` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | Supabase anonymous key |
| `VITE_SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | Supabase service role key |

#### Step 4: Deploy
1. Click "Deploy"
2. Wait for build completion (~2-3 minutes)
3. Your app will be live at `https://your-app.vercel.app`

## 🗄️ Database Setup

### Supabase Configuration

#### 1. Create Tables
Run this SQL in your Supabase SQL editor:

```sql
-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- User profiles table
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  specialty TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Textbook content with vector embeddings
CREATE TABLE textbook_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter TEXT NOT NULL,
  page_number INTEGER,
  content TEXT NOT NULL,
  embedding VECTOR(1536),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chat history
CREATE TABLE chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  messages JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE textbook_content ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own chats" ON chats
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own chats" ON chats
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own chats" ON chats
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own chats" ON chats
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Everyone can read textbook content" ON textbook_content
  FOR SELECT TO authenticated USING (true);

-- Indexes for performance
CREATE INDEX textbook_content_embedding_idx ON textbook_content 
USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

CREATE INDEX textbook_content_chapter_idx ON textbook_content (chapter);
CREATE INDEX chats_user_id_idx ON chats (user_id);
CREATE INDEX chats_created_at_idx ON chats (created_at DESC);

-- Functions for vector similarity search
CREATE OR REPLACE FUNCTION search_textbook_content(
  query_embedding VECTOR(1536),
  match_threshold FLOAT DEFAULT 0.8,
  match_count INT DEFAULT 5
)
RETURNS TABLE (
  id UUID,
  chapter TEXT,
  page_number INTEGER,
  content TEXT,
  metadata JSONB,
  similarity FLOAT
)
LANGUAGE SQL STABLE
AS $$
  SELECT
    textbook_content.id,
    textbook_content.chapter,
    textbook_content.page_number,
    textbook_content.content,
    textbook_content.metadata,
    1 - (textbook_content.embedding <=> query_embedding) AS similarity
  FROM textbook_content
  WHERE 1 - (textbook_content.embedding <=> query_embedding) > match_threshold
  ORDER BY textbook_content.embedding <=> query_embedding
  LIMIT match_count;
$$;
```

#### 2. Seed Sample Content
After deployment, visit your app and use the content seeder:
1. Open browser console
2. Run: `await seedTextbookContent()`
3. Verify content in Supabase dashboard

## 🔧 Configuration Files

### vercel.json
```json
{
  "version": 2,
  "name": "nelson-gpt",
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "dist" }
    }
  ],
  "routes": [
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
```

### _redirects
```
/*    /index.html   200
```

## 🔐 Security Configuration

### Environment Variables Security
- Never commit `.env.local` to git
- Use Vercel's environment variable dashboard
- Rotate API keys regularly
- Use different keys for development/production

### Content Security Policy
Configured in `vercel.json`:
```
Content-Security-Policy: default-src 'self'; 
script-src 'self' 'unsafe-inline' 'unsafe-eval'; 
style-src 'self' 'unsafe-inline'; 
img-src 'self' data: https:; 
font-src 'self' data:; 
connect-src 'self' https://api.mistral.ai https://*.supabase.co wss://*.supabase.co;
```

## 📊 Performance Optimization

### Build Optimization
- **Code Splitting**: Automatic chunk splitting
- **Tree Shaking**: Unused code elimination
- **Minification**: ESBuild for fast builds
- **Asset Optimization**: Optimized images and fonts

### Runtime Performance
- **Lazy Loading**: Route-based code splitting
- **Caching**: Service worker for offline support
- **Compression**: Gzip/Brotli compression
- **CDN**: Vercel Edge Network

## 🧪 Testing Deployment

### Pre-Deploy Testing
```bash
# Build locally
npm run build

# Test production build
npm run preview

# Type checking
npm run type-check

# Linting
npm run lint
```

### Post-Deploy Verification
1. **✅ App Loads**: Visit your Vercel URL
2. **✅ Authentication**: Test sign up/sign in
3. **✅ Chat Functionality**: Send a test message
4. **✅ AI Responses**: Verify streaming responses
5. **✅ Database**: Check Supabase for data
6. **✅ PWA**: Test "Add to Home Screen"

## 🚨 Troubleshooting

### Common Issues

#### Build Failures
```bash
# Check build logs in Vercel dashboard
# Common fixes:
npm run type-check  # Fix TypeScript errors
npm run lint        # Fix ESLint errors
```

#### Environment Variables
- Verify all required variables are set
- Check for typos in variable names
- Ensure values don't have extra spaces

#### Database Connection
- Verify Supabase URL and keys
- Check RLS policies are enabled
- Ensure tables exist

#### API Errors
- Verify Mistral API key is valid
- Check API rate limits
- Monitor network requests in browser

### Debug Mode
Enable debug logging:
```typescript
// In aiService.ts
const DEBUG = process.env.NODE_ENV === 'development'
if (DEBUG) console.log('Debug info:', data)
```

## 📈 Monitoring

### Vercel Analytics
- Enable in Vercel dashboard
- Monitor performance metrics
- Track user engagement

### Error Tracking
Consider adding Sentry:
```bash
npm install @sentry/react
```

### Performance Monitoring
- Core Web Vitals in Vercel
- Lighthouse scores
- Real User Monitoring (RUM)

## 🔄 Updates & Maintenance

### Automatic Deployments
- Connected to GitHub main branch
- Auto-deploy on push
- Preview deployments for PRs

### Manual Updates
```bash
# Update dependencies
npm update

# Security updates
npm audit fix

# Rebuild and redeploy
git push origin main
```

### Database Migrations
- Version control SQL changes
- Test in staging environment
- Apply to production carefully

## 🎯 Production Checklist

### Before Going Live
- [ ] All environment variables configured
- [ ] Database tables created and seeded
- [ ] SSL certificate active (automatic with Vercel)
- [ ] Custom domain configured (optional)
- [ ] Error tracking enabled
- [ ] Analytics configured
- [ ] Performance tested
- [ ] Security headers verified
- [ ] PWA functionality tested
- [ ] Mobile responsiveness verified

### Post-Launch
- [ ] Monitor error rates
- [ ] Check performance metrics
- [ ] Verify user authentication flow
- [ ] Test AI response quality
- [ ] Monitor database performance
- [ ] Set up alerts for downtime

---

**🎉 Congratulations! Nelson-GPT is now live and ready to assist pediatric healthcare professionals worldwide!**

For support: [GitHub Issues](https://github.com/DrZeepeads/Autonomous-agent/issues)

