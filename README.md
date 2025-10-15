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
- **Flu & Cold Prevention**: Educational content and vaccination info
- **Habit Tracker**: Personal development and goal tracking
- **Holiday Calendar**: Automated holiday scraping and management
- **Contact Management**: Comprehensive contact database
- **Offline Budget Meter**: Financial planning tool
- **Tobacco Reports**: Specialized reporting for tobacco education
- **School Program Participation**: Track school involvement in educational programs
- **Educational Tasks**: Manage and track educational activities
- **School Lists**: Administrative record keeping

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
- **[Firebase Admin SDK 13.5.0](https://firebase.google.com/docs/admin/setup)** - Server-side Firebase operations
- **[React Hook Form 7.62.0](https://react-hook-form.com/)** - Form state management
- **[Zod 4.1.9](https://zod.dev/)** - Schema validation
- **[React Context API](https://react.dev/reference/react/Context)** - Global state management

### Data Processing & Export

- **[XLSX 0.18.5](https://sheetjs.com/)** - Excel file processing
- **[DocxTemplater 3.66.3](https://docxtemplater.com/)** - Word document generation
- **[React-PDF 4.3.0](https://react-pdf.org/)** - PDF document creation
- **[PizZip 3.2.0](https://stuk.github.io/jszip/)** - ZIP file handling
- **[ExcelJS 4.4.0](https://github.com/exceljs/exceljs)** - Advanced Excel operations

### AI & External APIs

- **[OpenAI 5.21.0](https://openai.com/)** - GPT-4o integration for content generation
- **[Unsplash API](https://unsplash.com/developers)** - Image fetching for posts
- **[Cheerio 1.1.2](https://cheerio.js.org/)** - Web scraping for holiday data

### Development Tools

- **[pnpm](https://pnpm.io/)** - Fast, disk space efficient package manager
- **[Vitest 3.2.4](https://vitest.dev/)** - Modern testing framework
- **[ESLint 9](https://eslint.org/)** - Code linting and formatting
- **[Turbopack](https://turbo.build/)** - Next.js bundler for faster builds
- **[@testing-library](https://testing-library.com/)** - React testing utilities

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

> **🎯 New Architecture**: This project follows a **feature-based architecture** for better modularity and maintainability. See [REFACTORING_STRATEGY.md](REFACTORING_STRATEGY.md) for details.

## 📁 Project Structure

> **🎯 Feature-Driven Architecture**: This project follows a **feature-based architecture** for better modularity and maintainability. See [REFACTORING_SUMMARY_2025.md](REFACTORING_SUMMARY_2025.md) for details.

```
edu-report-v3-nextjs/
├── src/
│   ├── components/             # Shared UI components
│   │   ├── ui/                 # Base UI primitives
│   │   │   ├── bottom-navbar.tsx
│   │   │   ├── breadcrumbs.tsx
│   │   │   ├── side-drawer.tsx
│   │   │   ├── top-navbar.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── layout/             # Layout components
│   │   │   ├── AuthenticatedLayout.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── shared/             # Business components
│   │   │   ├── ActionButton.tsx
│   │   │   ├── DataTable.tsx
│   │   │   ├── EditDialog.tsx
│   │   │   ├── FilterSection.tsx
│   │   │   ├── FormField.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── NotificationSnackbar.tsx
│   │   │   ├── PageHeader.tsx
│   │   │   ├── SelectorWithCounts.tsx
│   │   │   └── ... (more shared components)
│   │   │
│   │   └── index.ts            # Master barrel export
│   │
│   ├── features/               # Feature modules
│   │   ├── auth/               # Authentication feature
│   │   ├── contacts/           # Contact management
│   │   ├── schools/            # School management
│   │   ├── schedule/           # Task scheduling
│   │   ├── programy-edukacyjne/ # Educational programs
│   │   ├── szkoly-w-programie/ # School participation
│   │   ├── zadania-edukacyjne/ # Educational tasks
│   │   ├── spisy-spraw/        # Administrative records
│   │   ├── sprawozdanie-z-tytoniu/ # Tobacco reports
│   │   ├── czerniak/           # Melanoma education
│   │   ├── grypa-i-przeziebienia/ # Flu prevention
│   │   ├── holidays/           # Holiday management
│   │   ├── offline-miernik-budzetowy/ # Budget planning
│   │   ├── todo/               # Task management
│   │   ├── wygeneruj-izrz/     # Report generation
│   │   └── README.md           # Features documentation
│   │
│   ├── hooks/                  # Shared React hooks
│   │   ├── useNotification.ts  # Notification management
│   │   ├── useAsyncOperation.ts
│   │   ├── useFormValidation.ts
│   │   ├── useLocalStorage.ts
│   │   └── index.ts
│   │
│   ├── app/                    # Next.js App Router
│   │   ├── (protected)/        # Protected routes
│   │   │   ├── contacts/       # Contact management
│   │   │   ├── schools/        # School management
│   │   │   ├── schedule/       # Task scheduling
│   │   │   ├── programy-edukacyjne/ # Educational programs
│   │   │   ├── szkoly-w-programie/ # School program participation
│   │   │   ├── zadania-edukacyjne/ # Educational tasks
│   │   │   ├── spisy-spraw/    # Administrative records
│   │   │   ├── sprawozdanie-z-tytoniu/ # Tobacco reports
│   │   │   ├── czerniak/       # Melanoma education
│   │   │   ├── grypa-i-przeziebienia/ # Flu prevention
│   │   │   ├── holidays/       # Holiday management
│   │   │   ├── offline-miernik-budzetowy/ # Budget planning
│   │   │   ├── todo/           # Task management
│   │   │   ├── wygeneruj-izrz/ # Report generation
│   │   │   ├── 4fun/           # Miscellaneous features
│   │   │   ├── (admin)/        # Admin panel
│   │   │   │   └── users/      # User management
│   │   │   ├── profile/        # User profile
│   │   │   └── layout.tsx      # Protected layout
│   │   │
│   │   ├── api/                # API routes
│   │   │   ├── auth/           # Authentication
│   │   │   ├── users/          # User management
│   │   │   ├── openai/         # AI integration
│   │   │   ├── generate-holiday-graphics/ # Graphics generation
│   │   │   └── upload-to-postimages/ # Image uploads
│   │   │
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Home page
│   │
│   ├── providers/              # Context providers
│   ├── firebase/               # Firebase configuration
│   ├── services/               # Shared services
│   ├── types/                  # Global TypeScript types
│   ├── utils/                  # Shared utilities
│   ├── constants/              # Global constants
│   ├── models/                 # Data models
│   ├── styles/                 # Global styles
│   └── theme/                  # Theme configuration
│
├── public/                     # Static assets
├── coverage/                   # Test coverage reports
├── REFACTORING_DEDUPLICATION_2025.md # Component deduplication docs
├── REFACTORING_SUMMARY_2025.md # Architecture refactoring docs
├── package.json
├── tsconfig.json
├── vitest.config.ts
├── tailwind.config.ts
└── ...

### 🏗️ Architecture Highlights

- **Feature-Based Modules**: Each feature contains all its code (components, hooks, services, utils, types)
- **Shared Components**: Reusable UI components organized in `/src/components/shared/`
- **Clear Boundaries**: Features are self-contained and loosely coupled
- **Easy Navigation**: Related code is co-located
- **Barrel Exports**: Clean imports via index files

**📚 Learn More**:
- [Features Directory](src/features/README.md) - Feature modules overview
- [Refactoring Summary 2025](REFACTORING_SUMMARY_2025.md) - Architecture refactoring details
- [Component Deduplication](REFACTORING_DEDUPLICATION_2025.md) - Recent component refactoring

## 🔧 Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Firebase Configuration (Client-side)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin SDK (Server-side)
FIREBASE_ADMIN_TYPE=service_account
FIREBASE_ADMIN_PROJECT_ID=your_project_id
FIREBASE_ADMIN_PRIVATE_KEY_ID=your_private_key_id
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com
FIREBASE_ADMIN_CLIENT_ID=your_client_id
FIREBASE_ADMIN_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_ADMIN_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_ADMIN_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_ADMIN_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/...

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# Unsplash API
UNSPLASH_ACCESS_KEY=your_unsplash_access_key
```

For detailed Firebase Admin SDK setup, see [FIREBASE_ADMIN_API.md](FIREBASE_ADMIN_API.md).

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

# Production build with Turbopack
pnpm run build

# Start production server
pnpm run start

# Run tests with Vitest
pnpm run test

# Run tests in watch mode
pnpm run test:watch

# Lint code with ESLint
pnpm run lint
```

### Key Development Features

- **Hot Reload**: Instant updates with Turbopack
- **TypeScript**: Full type safety and IntelliSense
- **Vitest**: Modern testing framework with 620+ tests
- **ESLint**: Code linting and consistency
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
- [Vitest](https://vitest.dev/) for modern testing framework
- [React Hook Form](https://react-hook-form.com/) for form state management
- [Zod](https://zod.dev/) for schema validation
- [Framer Motion](https://www.framer.com/motion/) for animations
- [Recharts](https://recharts.org/) for data visualization
