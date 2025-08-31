# ISEP Bands 🎸

A comprehensive music platform for the ISEP music association, built as a modern web application with Next.js 15, React 19, and TypeScript.

## 🎯 Project Overview

**ISEPBANDS.FR** is a 3-tier system designed to manage the ISEP music association:

1. **Showcase Layer** (Public): Association presentation, events, team pages
2. **Mid-office Layer** (Members): Group management, profile settings, event participation
3. **Back-office Layer** (Admin): Complete administrative control

### Key Milestones

- **MVP Release**: September 1, 2025
- **BANDS Module**: September 25, 2025
- **EVENTS Module**: October 15, 2025

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router) + React 19
- **Database**: MySQL + Prisma ORM
- **Authentication**: Better Auth
- **Styling**: Tailwind CSS v4
- **Internationalization**: next-international (FR/EN)
- **Icons**: Font Awesome + Lucide React
- **Language**: TypeScript
- **File Storage**: AWS S3 integration
- **UI Components**: Radix UI + shadcn/ui

## 📦 Installation

### Prerequisites

- Node.js 18+
- MySQL database
- AWS S3 bucket (for file uploads)

### Setup

```bash
# Clone the repository
git clone <repository-url>
cd isepbands.fr

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Fill in your database credentials and AWS keys

# Set up the database
npx prisma db push --force-reset
npx prisma db seed

# Start development server
npm run dev
```

## 🔧 Available Scripts

```bash
# Development
npm run dev              # Start development server at http://localhost:3000

# Building
npm run build           # Create production build
npm run start           # Run production build

# Code Quality
npm run lint            # Run ESLint
npm run test            # Run Jest tests
npm run test:e2e        # Run Playwright E2E tests

# Database
npx prisma db push      # Push schema changes to database
npx prisma db seed      # Seed database with default data
npx prisma generate     # Generate Prisma client
npx prisma migrate dev  # Run database migrations
```

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── [lang]/            # Internationalized routes (FR/EN)
│   │   ├── admin/         # Admin dashboard
│   │   ├── bands/         # Music groups
│   │   ├── events/        # Events management
│   │   ├── team/          # Team page with garland design
│   │   ├── profile/       # User profiles
│   │   ├── login/         # Authentication
│   │   └── register/      # 6-step registration
│   └── api/               # API routes
├── components/            # React components
│   ├── admin/            # Administrative interfaces
│   ├── bands/            # Band-related components
│   ├── events/           # Event components
│   ├── team/             # Special garland design system
│   ├── profile/          # User profile components
│   └── ui/               # Reusable UI components
├── lib/                  # Utility libraries
├── data/                 # Static data (instruments, genres, etc.)
├── utils/                # Helper functions
└── types/                # TypeScript type definitions

prisma/
├── migrations/           # Database migrations
├── schema.prisma        # Database schema
└── seed.ts              # Database seeding
```

## 🌐 Features Overview

### 🏠 Homepage

- **Showcase Version** (Not logged in): WHO WE ARE, HIGHLIGHT EVENTS, JOIN US CTA
- **Member Dashboard** (Logged in): Welcome message, group activities, upcoming events

### 🎵 Bands Module (Sept 25, 2025)

- **Group Management**: Create, join, and manage music groups
- **Multi-admin System**: Multiple administrators per group
- **Instrument Requirements**: Define needed musicians (e.g., 0/2 keyboardists)
- **Recruitment Status**: Open/closed search independent of available slots
- **Group Limits**: Maximum 2 active groups per user (admin override available)
- **Recommendation System**: Suggest groups to available musicians

### 📅 Events Module (Oct 15, 2025)

- **Event Types**: Concert, Jam, Sale, Showcase, Rehearsal
- **Dynamic Calendar**: Google Calendar sync with iCal subscription
- **Email Notifications**: Automatic reminders
- **Hello-Asso Integration**: Ticketing system
- **Setlist Management**: Collaborative song selection with YouTube/Spotify integration

### 👑 Admin Dashboard

Complete administrative control with sections for:

- **Users**: Member management, creation, permissions
- **Bands**: Group oversight and administration
- **Events**: Event creation and management
- **Content**: Site content and media management
- **Communication**: Newsletter and email campaigns
- **Files**: Restricted document storage
- **System**: Settings and configuration

### 🎨 Special Features

#### Garland Design System

Unique responsive design for the team page featuring:

- Dynamic SVG garland generation
- Responsive card distribution (desktop: 3 cards, mobile: 1 card)
- Animated lighting effects
- Calculated positioning between garland curves

#### Search System

- Global search across members, groups, and content
- Keyword support for instruments ("guitarist", "drummer")
- Categorized results with different content types

## 🗄️ Database Schema

### Core Models

- **User**: Authentication, personal info, ISEP status, association roles
- **Group**: Music bands with instrument requirements and member management
- **Event**: Various event types with group and participant associations
- **Instrument**: Musical instruments with multilingual names
- **Role/Permission**: Granular access control system

## 🔐 Authentication & Permissions

### User Roles

- **President**: Full system access
- **Vice-President**: Complete administrative access except restricted files
- **Secretary**: Administrative access plus financial documents
- **Treasurer**: Financial focus with selective permissions
- **Head of Communication**: Communication tools and content management
- **Head of Creation**: Band and event management focus
- **Member**: Basic access to member features
- **Former Member**: Limited access

### Permission System

Granular permissions including:

- Admin dashboard access
- User management (view, edit, create, delete)
- Band management
- Event management
- Content and media management
- Communication tools
- Restricted file access

## 🌍 Internationalization

Complete French/English support throughout the application:

### Structure

- All multilingual routes are shared in `app/[lang]/`
- Translation files are centralized in `src/locales/`
- The i18n provider is dynamically injected based on URL segment
- Middleware redirects `/` to preferred language (browser/cookie)

### Adding a Language

1. Add translation file in `src/locales/`
2. Add language in `SUPPORTED_LANGS` in `[lang]/layout.tsx` and `middleware.ts`
3. That's it: no page/layout duplication needed

### Advantages

- Business code sharing (no duplication per language)
- SEO-friendly (clean URLs, `<html lang=...>` tag)
- Easy to maintain and extend
- Performant (targeted middleware, no unnecessary overhead)

## 📧 Email & Communications

- **Newsletter System**: Bulk email campaigns with templates
- **Event Reminders**: Automatic notifications
- **Registration Emails**: Welcome and verification messages
- **Group Notifications**: Band-specific communications

## 🎵 Music Features

### Instruments Support

25+ instruments including:

- Electric/Acoustic Guitar, Bass, Drums
- Piano/Keyboard, Violin, Saxophone
- Vocals, Beatbox, and more

### Skill Levels

- Beginner, Intermediate, Advanced, Expert
- Multiple instruments per user with individual skill levels

## 📱 Responsive Design

- Mobile-first approach with Tailwind CSS
- Responsive navigation and layouts
- Touch-friendly interfaces for mobile users
- Desktop-optimized admin dashboard

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests with Playwright
npm run test:e2e
```

## 🚀 Deployment

The application is designed for modern hosting platforms:

```bash
# Build for production
npm run build

# Start production server
npm run start
```

### Environment Variables

Required environment variables:

```env
DATABASE_URL="mysql://user:password@host:port/database"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
AWS_ACCESS_KEY_ID="your-aws-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret"
AWS_BUCKET_NAME="your-s3-bucket"
```

## 📝 Development Guidelines

### Code Style

- ESLint + Prettier configuration included
- Husky pre-commit hooks for code quality
- Conventional commits with commitlint

### Component Architecture

- 3-tier separation (public/member/admin)
- Role-based component rendering
- Reusable UI components with shadcn/ui
- Type-safe props with TypeScript

### Database Management

- Prisma ORM with type-safe queries
- Migration-based schema changes
- Comprehensive seed data
- Database integrity utilities

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Commit Convention

```
feat: add new feature
fix: fix bug
docs: update documentation
style: formatting changes
refactor: code refactoring
test: add tests
chore: maintenance tasks
```

## 📋 Project Status

- ✅ MVP Core Features (Authentication, Profiles, Basic Admin)
- ✅ Admin Dashboard Structure
- ✅ User Management System
- ✅ Profile Management
- ✅ Garland Design System
- 🚧 Bands Module (In Development)
- 🚧 Events Module (Planned)
- 🚧 Advanced Communication Features (Planned)

## 🐛 Known Issues

Check the [Issues](https://github.com/anthropics/claude-code/issues) page for current bugs and feature requests.

## 📞 Support

For questions or issues:

- Create an issue in the repository
- Contact the development team

## 📄 License

This project is proprietary software for the ISEP music association.

---

**Built with ❤️ for the ISEP music community**
