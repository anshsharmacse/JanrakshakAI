# JalRakshak AI - Water Crisis Intelligence Platform

<div align="center">
  <img src="public/logo.svg" alt="JalRakshak AI Logo" width="120" height="120">
  
  <h3>AI-Powered Water Crisis Intelligence & Solar-Driven Wastewater Treatment Platform</h3>
  
  <p>
    <strong>Protecting India's Water Future with AI</strong>
  </p>

  [![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
  [![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
</div>

---

## Overview

**JalRakshak AI** is a comprehensive water crisis intelligence platform designed for India. It leverages artificial intelligence to provide real-time water quality monitoring, treatment recommendations using Solar-Driven Biological Wastewater Treatment (SDBWT) technologies, and emergency response coordination.

### Key Features

- **AI Treatment Recommender**: Intelligent system that recommends optimal treatment methods (MPEC, ICPB, SPB) based on pollutant type, concentration, and environmental conditions
- **Crisis Map**: Real-time visualization of water contamination incidents across India
- **Simulation Engine**: Predict treatment outcomes with scientific accuracy
- **AI Chatbot**: Intelligent assistant for water treatment queries and general questions
- **Admin Dashboard**: Manage incidents, users, and system configuration
- **Research Citations**: All recommendations backed by peer-reviewed scientific research

## Technology Stack

| Category | Technologies |
|----------|-------------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 4, shadcn/ui |
| **Database** | Prisma ORM with SQLite |
| **AI Integration** | z-ai-web-dev-sdk (LLM) |
| **Animations** | Framer Motion |
| **State** | Zustand, TanStack Query |

## SDBWT Technologies

### MPEC (Microbial-Photo-Electrochemical Coupling)
- Combines photosensitizers with electrochemical systems
- Dual oxidation-reduction pathways
- Energy recovery: 0.5-1.2 kWh/m³
- Best for: Heavy metals, nitrates

### ICPB (Intimately Coupled Photocatalysis & Biodegradation)
- Photosensitizer-bacteria hybrid on porous carriers
- 85-98% pollutant removal
- Best for: Dyes, phenol, pharmaceuticals

### SPB (Self-Photosensitized Biohybrids)
- Engineered bacteria with intrinsic photosensitizers
- Fully biological system
- Best for: Organic waste, biodegradable pollutants

## Installation

```bash
# Clone the repository
git clone https://github.com/your-username/jalrakshak-ai.git
cd jalrakshak-ai

# Install dependencies
bun install

# Set up environment variables
cp .env.example .env

# Initialize database
bun run db:push

# Start development server
bun run dev
```

## Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="file:./db/custom.db"
```

## Scripts

```bash
bun run dev       # Start development server
bun run build     # Build for production
bun run start     # Start production server
bun run lint      # Run ESLint
bun run db:push   # Push schema to database
bun run db:generate # Generate Prisma client
```

## Project Structure

```
jalrakshak-ai/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── chat/route.ts       # AI Chatbot API
│   │   │   ├── recommend/route.ts  # Treatment recommendation API
│   │   │   ├── simulate/route.ts   # Simulation engine API
│   │   │   └── incidents/route.ts  # Incidents management API
│   │   ├── page.tsx                # Main application
│   │   ├── layout.tsx              # Root layout
│   │   └── globals.css             # Global styles
│   ├── components/ui/              # shadcn/ui components
│   ├── hooks/                      # Custom React hooks
│   └── lib/                        # Utilities and database
├── prisma/
│   └── schema.prisma               # Database schema
├── public/
│   └── logo.svg                    # JalRakshak logo
└── package.json
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/chat` | POST | AI Chatbot conversation |
| `/api/recommend` | POST | Get treatment recommendations |
| `/api/simulate` | POST | Run treatment simulation |
| `/api/incidents` | GET, POST, DELETE | Manage water crisis incidents |

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables
4. Deploy

### Docker

```bash
docker build -t jalrakshak-ai .
docker run -p 3000:3000 jalrakshak-ai
```

## Research Citations

This platform is built on peer-reviewed research:

- Zhou, M., et al. (2022). "Microbial photoelectrochemical systems for wastewater treatment" - *Bioresource Technology*
- Wang, X., et al. (2023). "Intimately coupled photocatalysis and biodegradation" - *Water Research*
- Zhang, Q., et al. (2023). "Self-photosensitized biohybrids" - *Nature Communications*
- Shi, L., et al. (2021). "Extracellular electron transfer mechanisms" - *Nature Reviews Microbiology*

## Creator

**Ansh Sharma**

- LinkedIn: [https://www.linkedin.com/in/anshsharmacse/](https://www.linkedin.com/in/anshsharmacse/)
- Emergency Contact: +91-9981762011

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <p>Made with 💧 for India's Water Security</p>
  <p>© 2024 JalRakshak AI | Created by Ansh Sharma</p>
</div>
