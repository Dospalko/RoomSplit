# 🏠 RoomSplit

**A modern, intuitive expense tracking and bill splitting application for shared living spaces.**

[![Next.js](https://img.shields.io/badge/Next.js-15.4.6-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.13.0-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.11-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

## ✨ Features

### 🏡 **Room Management**
- Create and manage shared living spaces
- Invite roommates with secure invite codes
- Role-based access control for room owners and members

### 💰 **Smart Bill Splitting**
- Multiple splitting methods: Equal, Percentage, Weight-based
- Categorize expenses (Food, Utilities, Rent, etc.)
- Tag bills for better organization and filtering
- Track payment status and outstanding balances

### 📊 **Analytics & Insights**
- Comprehensive expense analytics with interactive charts
- Monthly/yearly spending trends
- Category-wise expense breakdown
- Member spending patterns and balances

### 🎨 **Modern UI/UX**
- Clean, responsive design with dark/light mode support
- Advanced loading states and smooth animations
- Professional dropdown interfaces and visual feedback
- Mobile-optimized touch interactions

### 🔐 **Security & Privacy**
- Secure user authentication with bcrypt password hashing
- Session-based authentication
- Role-based access control
- Data isolation between rooms

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18.0 or higher
- **npm** or **yarn** package manager

### 1. Clone & Install
```bash
git clone https://github.com/Dospalko/RoomSplit.git
cd RoomSplit
npm install
```

### 2. Environment Setup
Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="file:./dev.db"

# Authentication (optional - for production)
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Database Setup
```bash
# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# (Optional) Open Prisma Studio to view data
npm run db:studio
```

### 4. Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
RoomSplit/
├── 📂 src/
│   ├── 📂 app/                 # Next.js App Router
│   │   ├── 📂 api/            # API routes
│   │   ├── 📂 rooms/          # Room pages
│   │   └── 📂 auth/           # Authentication
│   ├── 📂 components/         # Reusable components
│   │   ├── 📂 features/       # Business logic components
│   │   ├── 📂 layout/         # Layout components
│   │   ├── 📂 sections/       # Page sections
│   │   └── 📂 ui/             # UI components
│   ├── 📂 lib/                # Utilities and configurations
│   └── 📂 server/             # Server-side utilities
├── 📂 prisma/                 # Database schema and migrations
├── 📂 public/                 # Static assets
└── 📄 Configuration files
```

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:studio` | Open Prisma Studio |

## 🔧 Tech Stack

### **Frontend**
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **TailwindCSS** - Utility-first CSS framework
- **React Hook Form** - Form management
- **Recharts** - Data visualization

### **Backend**
- **Next.js API Routes** - Serverless API endpoints
- **Prisma ORM** - Type-safe database client
- **SQLite** - Development database (easily upgradeable to PostgreSQL)
- **bcryptjs** - Password hashing

### **Development**
- **ESLint** - Code linting
- **Turbopack** - Fast bundler for development
- **PostCSS** - CSS processing

## 📝 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Room Management
- `GET /api/rooms` - List user's rooms
- `POST /api/rooms` - Create new room
- `GET /api/rooms/[roomId]` - Get room details
- `DELETE /api/rooms/[roomId]` - Delete room

### Bills & Expenses
- `GET /api/rooms/[roomId]/bills` - List room bills
- `POST /api/rooms/[roomId]/bills` - Create new bill
- `PUT /api/rooms/[roomId]/bills/[billId]` - Update bill
- `DELETE /api/rooms/[roomId]/bills/[billId]` - Delete bill

### Categories & Tags
- `GET /api/rooms/[roomId]/categories` - List categories
- `POST /api/rooms/[roomId]/categories` - Create category
- `GET /api/rooms/[roomId]/tags` - List tags
- `POST /api/rooms/[roomId]/tags` - Create tag

## 🚀 Deployment

### Vercel (Recommended)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Dospalko/RoomSplit)

1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on every push

### Manual Deployment
```bash
# Build the application
npm run build

# Start production server
npm start
```

## 🔧 Configuration

### Database
The application uses SQLite by default for easy development. For production, upgrade to PostgreSQL:

```env
# PostgreSQL example
DATABASE_URL="postgresql://username:password@localhost:5432/roomsplit"
```

Then run migrations:
```bash
npm run db:migrate
```

### Environment Variables
Create a `.env.local` file for production settings:

```env
DATABASE_URL="your-production-database-url"
NEXTAUTH_SECRET="your-secure-secret-key"
NEXTAUTH_URL="https://your-domain.com"
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Live Demo**: [https://roomsplit.vercel.app](https://roomsplit.vercel.app)
- **Documentation**: [Component Architecture](COMPONENT_ARCHITECTURE.md)
- **Issues**: [GitHub Issues](https://github.com/Dospalko/RoomSplit/issues)

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Database powered by [Prisma](https://www.prisma.io/)
- Styled with [TailwindCSS](https://tailwindcss.com/)
- Icons from [Heroicons](https://heroicons.com/)

---

<div align="center">
  <strong>Made with ❤️ for roommates everywhere</strong>
</div>
