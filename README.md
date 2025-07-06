# UVHub E-commerce App

A modern e-commerce application built with Next.js 15, TypeScript, and Zustand for state management. Features a comprehensive product catalog, shopping cart functionality, and order management system.

## 🚀 Features

- **Product Management**: Browse, filter, and search products with real-time filtering
- **Shopping Cart**: Persistent cart with quantity management and total calculation
- **Order Management**: Complete order lifecycle with status tracking
- **State Management**: Robust state management using Zustand with slices
- **Modern UI**: Beautiful interface built with Tailwind CSS and shadcn/ui components
- **TypeScript**: Full type safety throughout the application
- **Responsive Design**: Mobile-first responsive design
- **Authentication**: Complete authentication system with password reset functionality

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Package Manager**: Bun
- **Database**: Supabase (configured)
- **Email**: Nodemailer for password reset emails
- **Form Validation**: Zod + React Hook Form

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Bun](https://bun.sh/) (recommended) or npm/yarn
- Git

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd uvhub-app
```

### 2. Install Dependencies

```bash
bun install
# or
npm install
# or
yarn install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Add your environment variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Email Configuration (for password reset)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional: Analytics
NEXT_PUBLIC_GA_ID=your_google_analytics_id
```

#### Email Setup Instructions

For password reset functionality, you need to configure email settings:

1. **Gmail Setup** (Recommended):

   - Enable 2-factor authentication on your Gmail account
   - Generate an App Password:
     - Go to Google Account settings
     - Security → 2-Step Verification → App passwords
     - Generate a new app password for "Mail"
   - Use your Gmail address as `EMAIL_USER`
   - Use the generated app password as `EMAIL_PASS`

2. **Other Email Providers**:
   - Update the email service in `src/lib/email.ts`
   - Configure appropriate SMTP settings

### 4. Run the Development Server

```bash
bun dev
# or
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Project Structure

```
uvhub-app/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── admin/              # Admin authentication pages
│   │   │   └── (auth)/         # Auth route group
│   │   │       ├── sign-in/    # Login page
│   │   │       ├── forgot-password/ # Password reset request
│   │   │       └── reset-password/  # Password reset form
│   │   ├── admin/              # Admin authentication pages
│   │   │   └── (auth)/         # Auth route group
│   │   │       ├── sign-in/    # Login page with actions.ts
│   │   │       ├── forgot-password/ # Password reset with actions.ts
│   │   │       └── reset-password/  # Password reset with actions.ts
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Home page
│   ├── components/             # Reusable UI components
│   │   ├── ProductCard.tsx     # Product display card
│   │   ├── ProductList.tsx     # Product listing with filters
│   │   └── CartSummary.tsx     # Shopping cart component
│   ├── store/                  # Zustand state management
│   │   ├── slices/             # State slices
│   │   │   ├── productsSlice.ts # Products state management
│   │   │   ├── ordersSlice.ts  # Orders state management
│   │   │   └── cartSlice.ts    # Shopping cart state
│   │   ├── hooks.ts            # Custom hooks for state
│   │   ├── index.ts            # Store exports
│   │   └── types.ts            # TypeScript type definitions
│   ├── lib/                    # Utility libraries
│   │   ├── email.ts            # Email utilities (Nodemailer)
│   │   ├── auth.ts             # Authentication utilities
│   │   ├── sampleData.ts       # Sample data for development
│   │   └── test-setup.ts       # Test user setup
│   ├── utils/                  # Utility functions
│   └── middleware.ts           # Next.js middleware
├── public/                     # Static assets
├── package.json                # Dependencies and scripts
├── tsconfig.json              # TypeScript configuration
├── tailwind.config.js         # Tailwind CSS configuration
└── README.md                  # Project documentation
```

## 🎨 UI Components

This project uses [shadcn/ui](https://ui.shadcn.com/) for consistent and accessible UI components. The components are built on top of Radix UI primitives and styled with Tailwind CSS.

### Key Components Used:

- **ProductCard**: Displays product information with add to cart functionality
- **ProductList**: Shows filtered product grid with search and category filters
- **CartSummary**: Shopping cart with quantity management and total calculation

## 🔧 Available Scripts

```bash
# Development
bun dev          # Start development server with Turbopack
npm run dev      # Start development server

# Production
bun build        # Build for production
bun start        # Start production server

# Linting
bun lint         # Run ESLint
npm run lint     # Run ESLint
```

## 🔐 Authentication Features

The application includes a complete authentication system:

### Password Reset Flow:

1. **Forgot Password**: User enters email address
2. **Email Sent**: Supabase sends password reset email
3. **Session Validation**: Secure session validation
4. **Password Reset**: User sets new password via Server Actions
5. **Success**: Redirect to login with new credentials

### Test Users (Development):

- `admin@example.com` / `password123`
- `test@example.com` / `test123`

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Branch Naming Convention

Use the following format for branch names:

```
<type>/<description>
```

**Types:**

- `feat/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `style/` - Code style changes (formatting, etc.)
- `refactor/` - Code refactoring
- `test/` - Adding or updating tests
- `chore/` - Maintenance tasks

**Examples:**

```
feat/add-payment-integration
fix/cart-persistence-issue
docs/update-readme
refactor/product-filtering
```

### Commit Message Convention

Use conventional commit messages:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**

```
feat(cart): add persistent cart storage
fix(products): resolve filtering by category
docs(readme): update setup instructions
refactor(store): optimize state management
```

### Pull Request Process

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feat/amazing-feature`)
3. **Commit** your changes (`git commit -m 'feat: add amazing feature'`)
4. **Push** to the branch (`git push origin feat/amazing-feature`)
5. **Open** a Pull Request

### Code Style Guidelines

- Use TypeScript for all new code
- Follow ESLint configuration
- Use Prettier for code formatting
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## 🗂️ State Management

This application uses Zustand for state management with a slice-based architecture:

### Store Structure

- **Products Slice**: Manages product data, filtering, and search
- **Orders Slice**: Handles order management and status tracking
- **Cart Slice**: Manages shopping cart with persistence

### Key Features

- **Persistent Cart**: Cart data persists across browser sessions
- **Real-time Filtering**: Instant product filtering and search
- **Type Safety**: Full TypeScript support for all state operations
- **DevTools Integration**: Redux DevTools support for debugging

## 🔒 Environment Variables

Create a `.env.local` file with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Email Configuration (for password reset)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional: Analytics
NEXT_PUBLIC_GA_ID=your_google_analytics_id
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push to main branch

### Other Platforms

The app can be deployed to any platform that supports Next.js:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Contact the maintainers

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing framework
- [Zustand](https://github.com/pmndrs/zustand) for state management
- [shadcn/ui](https://ui.shadcn.com/) for beautiful components
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Supabase](https://supabase.com/) for backend services
- [Nodemailer](https://nodemailer.com/) for email functionality
