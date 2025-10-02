# Edu Report V3 Next.js

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fkrzysztofpalpuchowski%2Fedu-report-v3-nextjs)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15.5.3-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-blue)](https://react.dev/)
[![Material-UI](https://img.shields.io/badge/Material--UI-7.3.2-blue)](https://mui.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

📊 [Live Demo](https://inspekcja.vercel.app) | 📘 [Documentation](#) | 🐛 [Report Bug](#) | ✨ [Request Feature](#)

## 📋 Overview

Edu Report V3 is a comprehensive educational management system built with Next.js 15 and React 19. It provides educators and administrators with powerful tools for managing schools, generating reports, tracking tasks, and creating educational content with AI assistance.

### Why Edu Report V3?

- **Modern Stack**: Built with the latest Next.js 15, React 19, and TypeScript
- **AI-Powered**: Generate educational content using OpenAI GPT-4o
- **Comprehensive**: Complete school management and reporting system
- **Responsive**: Optimized for desktop, tablet, and mobile devices
- **Real-time**: Live data updates with Firebase integration

## ✨ Key Features

### 🏫 School Management

- **School Database**: Complete CRUD operations for school records
- **Advanced Filtering**: Filter by type, city, and search terms
- **Statistics Dashboard**: Visual analytics with gradient cards
- **Bulk Operations**: Copy emails, export data, and batch actions
- **Responsive Tables**: Auto-wrapping text and adaptive layouts

### 📊 Report Generation

- **IZRZ Generator**: Create educational reports with Word templates
- **PDF Export**: Generate PDF documents with custom layouts
- **Template System**: Predefined and custom document templates
- **Data Integration**: Import from Excel files and external sources

### 📅 Task Management

- **Schedule System**: Plan and track educational tasks
- **Progress Monitoring**: Visual completion statistics
- **Filtering & Search**: Advanced task filtering by program, type, and status
- **Deadline Tracking**: Due date management and notifications

### 🤖 AI Content Generation

- **Post Generator**: Create educational posts with AI assistance
- **Content Templates**: Predefined formats for different content types
- **Image Integration**: Unsplash API for relevant educational images
- **Preview System**: Real-time content preview before publishing

### 📚 Educational Modules

- **Melanoma Education**: Interactive quiz system for cancer awareness
- **Habit Tracker**: Personal development and goal tracking
- **Holiday Calendar**: Automated holiday scraping and management
- **Contact Management**: Comprehensive contact database

### 📈 Analytics & Insights

- **School Statistics**: Type-based analytics and visualizations
- **Completion Rates**: Task and program completion tracking
- **Data Export**: Excel and PDF export capabilities
- **Real-time Updates**: Live data synchronization

## 🛠️ Technology Stack

### Core Framework

- **[Next.js 15.5.3](https://nextjs.org/)** - React framework with App Router
- **[React 19.1.0](https://react.dev/)** - Latest React with concurrent features
- **[TypeScript 5.0](https://www.typescriptlang.org/)** - Type-safe development

### UI & Styling

- **[Material-UI 7.3.2](https://mui.com/)** - Component library with theming
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Emotion](https://emotion.sh/)** - CSS-in-JS styling solution

### Data & State Management

- **[Firebase 12.2.1](https://firebase.google.com/)** - Backend services (Firestore, Auth)
- **[React Hook Form 7.62.0](https://react-hook-form.com/)** - Form state management
- **[Zod 4.1.9](https://zod.dev/)** - Schema validation
- **[React Context API](https://react.dev/reference/react/Context)** - Global state management

### Data Processing & Export

- **[XLSX 0.18.5](https://sheetjs.com/)** - Excel file processing
- **[DocxTemplater 3.66.3](https://docxtemplater.com/)** - Word document generation
- **[React-PDF 4.3.0](https://react-pdf.org/)** - PDF document creation
- **[PizZip 3.2.0](https://stuk.github.io/jszip/)** - ZIP file handling

### AI & External APIs

- **[OpenAI 5.21.0](https://openai.com/)** - GPT-4o integration for content generation
- **[Unsplash API](https://unsplash.com/developers)** - Image fetching for posts
- **[Cheerio 1.1.2](https://cheerio.js.org/)** - Web scraping for holiday data

### Development Tools

- **[pnpm](https://pnpm.io/)** - Fast, disk space efficient package manager
- **[ESLint 9](https://eslint.org/)** - Code linting and formatting
- **[Turbopack](https://turbo.build/)** - Next.js bundler for faster builds

## 🚀 Getting Started

### Prerequisites

- Node.js 16.8+ installed
- pnpm or yarn package manager
- Firebase account (for backend services)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/krzysztofpalpuchowski/edu-report-v3-nextjs.git
   cd edu-report-v3-nextjs
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   # or
   yarn install
   ```

3. **Configure environment variables:**

   ```bash
   cp .example.env .env.local
   # Edit .env.local with your configuration
   ```

4. **Start development server:**

   ```bash
   pnpm run dev
   # or
   yarn run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000) in your browser**

## 📁 Project Structure

```
edu-report-v3-nextjs/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (protected)/        # Protected routes requiring authentication
│   │   │   ├── schools/        # School management module
│   │   │   │   ├── components/ # School-specific components
│   │   │   │   ├── hooks/      # School management hooks
│   │   │   │   ├── schemas/    # Zod validation schemas
│   │   │   │   └── types/      # TypeScript interfaces
│   │   │   ├── schedule/       # Task management system
│   │   │   ├── wygeneruj-izrz/ # IZRZ report generator
│   │   │   ├── czerniak/       # Melanoma education module
│   │   │   ├── habit-tracker/  # Personal development tracker
│   │   │   ├── contacts/       # Contact management
│   │   │   └── ...             # Other modules
│   │   ├── api/                # API routes
│   │   │   ├── generate-izrz/  # IZRZ generation endpoint
│   │   │   ├── openai/         # OpenAI integration
│   │   │   └── unsplash-photo-by-tag/ # Image fetching
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page
│   │   └── globals.css         # Global styles
│   ├── components/             # Shared components
│   │   ├── ui/                 # UI components (navbar, drawer, etc.)
│   │   └── shared/             # Reusable components
│   ├── hooks/                  # Custom React hooks
│   ├── types/                  # Global TypeScript types
│   ├── constants/              # Application constants
│   ├── providers/              # Context providers
│   ├── firebase/               # Firebase configuration
│   ├── models/                 # Data models and schemas
│   ├── services/               # Business logic services
│   └── utils/                  # Utility functions
├── public/                     # Static assets
│   ├── generate-templates/     # Word document templates
│   └── ...                     # Images, icons, etc.
├── package.json                # Dependencies and scripts
├── next.config.ts              # Next.js configuration
├── tailwind.config.js          # Tailwind CSS configuration
└── tsconfig.json               # TypeScript configuration
```

## 🔧 Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# Unsplash API
UNSPLASH_ACCESS_KEY=your_unsplash_access_key
```

## 🌐 Deployment

This application is optimized for deployment on [Vercel](https://vercel.com):

1. **Push your repository to GitHub**
2. **Import project into Vercel**
3. **Configure environment variables** in Vercel dashboard
4. **Deploy with a single click**

### Vercel Configuration

- **Framework Preset**: Next.js
- **Build Command**: `pnpm run build`
- **Output Directory**: `.next`
- **Install Command**: `pnpm install`

For detailed deployment instructions, see the [Next.js Deployment Documentation](https://nextjs.org/docs/deployment).

## 🧪 Development

### Available Scripts

```bash
# Development server with Turbopack
pnpm run dev

# Production build
pnpm run build

# Start production server
pnpm run start

# Lint code
pnpm run lint
```

### Key Development Features

- **Hot Reload**: Instant updates with Turbopack
- **TypeScript**: Full type safety and IntelliSense
- **ESLint**: Code quality and consistency
- **Material-UI**: Component library with theming
- **Firebase Emulator**: Local development with Firebase services

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use Material-UI components consistently
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Material-UI](https://mui.com/) for the comprehensive component library
- [Firebase](https://firebase.google.com/) for backend services
- [OpenAI](https://openai.com/) for AI content generation
- [Vercel](https://vercel.com/) for seamless deployment
