# Melbourne Parking Accessibility System

**FIT5120 Team Project - Onboarding Assignment**

## Problem Statement

Working parents in their 30s–40s who live in Melbourne's outer suburbs rely on private vehicles for their daily commute, driven by the need for flexibility around work and childcare responsibilities. However, they encounter persistent issues such as traffic congestion, high parking costs, and limited access to reliable, real-time parking availability—challenges exacerbated by insufficient public transport options and urban strategies aimed at reducing car use.

**How might we enhance the accessibility and predictability of parking in Melbourne's CBD to better support commuters balancing professional and family obligations?**

## Project Overview

This project develops a comprehensive web application that provides real-time parking information, predictive analytics, and accessibility features for Melbourne CBD parking, specifically targeting working parents who commute from outer suburbs.

## Team Structure

- **Web Developers**: Frontend (React/TypeScript) and Backend (Node.js/Express/TypeScript)
- **Data Science/AI**: Python-based machine learning for parking predictions and analytics
- **Deployment**: Vercel for web hosting, AWS for data processing and storage

## Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **UI Library**: Material-UI (MUI)
- **Maps**: Leaflet/React-Leaflet for interactive parking maps
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Routing**: React Router DOM

### Backend
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript
- **Database**: MySQL with Prisma ORM
- **Authentication**: JWT with bcryptjs
- **Security**: Helmet, CORS, Rate Limiting
- **Real-time**: Scheduled data updates with node-cron

### Data Science/AI
- **Language**: Python 3.9+
- **ML Libraries**: scikit-learn, XGBoost, TensorFlow
- **Data Processing**: pandas, numpy, geopandas
- **Visualization**: matplotlib, seaborn, plotly
- **Geospatial**: folium, shapely, geopy
- **API Framework**: FastAPI for ML model serving

### Infrastructure
- **Frontend Hosting**: Vercel
- **Backend Hosting**: Vercel Serverless Functions
- **Database**: MySQL (e.g., AWS RDS MySQL)
- **Cloud Storage**: AWS S3
- **ML Pipeline**: AWS Lambda/EC2
- **CI/CD**: GitHub Actions

## Project Structure

```
melbourne-parking-accessibility/
├── README.md                     # This file
├── package.json                  # Root workspace configuration
├── vercel.json                   # Vercel deployment config
├── .gitignore                    # Git ignore patterns
│
├── frontend/                     # React TypeScript Frontend
│   ├── public/                   # Public assets
│   ├── src/                      # Source code
│   │   ├── components/           # React components
│   │   ├── pages/                # Page components
│   │   ├── hooks/                # Custom React hooks
│   │   ├── services/             # API services
│   │   ├── utils/                # Utility functions
│   │   ├── types/                # TypeScript type definitions
│   │   └── styles/               # CSS/styling files
│   ├── package.json              # Frontend dependencies
│   ├── tsconfig.json             # TypeScript configuration
│   └── env.template              # Environment variables template
│
├── backend/                      # Node.js Express Backend
│   ├── src/                      # Source code
│   │   ├── controllers/          # Request handlers
│   │   ├── middleware/           # Express middleware
│   │   ├── models/               # Database models
│   │   ├── routes/               # API routes
│   │   ├── services/             # Business logic
│   │   ├── config/               # Configuration files
│   │   ├── utils/                # Utility functions
│   │   └── types/                # TypeScript type definitions
│   ├── dist/                     # Compiled JavaScript (auto-generated)
│   ├── package.json              # Backend dependencies
│   ├── tsconfig.json             # TypeScript configuration
│   └── env.template              # Environment variables template
│
├── data-science/                 # Python ML/AI Components
│   ├── notebooks/                # Jupyter notebooks for EDA
│   ├── src/                      # Python source code
│   │   ├── data_processing/      # Data cleaning and preprocessing
│   │   ├── feature_engineering/  # Feature creation and selection
│   │   ├── models/               # ML model implementations
│   │   ├── evaluation/           # Model evaluation scripts
│   │   └── api/                  # FastAPI model serving
│   ├── data/                     # Data storage
│   │   ├── raw/                  # Raw data files
│   │   ├── processed/            # Cleaned data
│   │   └── external/             # External data sources
│   ├── models/                   # Trained model artifacts
│   ├── scripts/                  # Utility scripts
│   ├── tests/                    # Python tests
│   ├── requirements.txt          # Python dependencies
│   └── env.template              # Environment variables template
│
└── docs/                         # Documentation
    ├── api/                      # API documentation
    ├── deployment/               # Deployment guides
    └── development/              # Development guidelines
```

## Quick Start

### Prerequisites

- **Node.js** (v18+)
- **npm** (v9+)
- **Python** (v3.9+)
- **MySQL** (local or managed e.g., RDS)
- **Git**

### 1. Clone and Setup

```bash
git clone <your-repository-url>
cd FIT5120-TP01-Onboarding

# Install root dependencies
npm install

# Install all project dependencies
npm run install-all
```

### 2. Environment Configuration

```bash
# Frontend environment
cp frontend/env.template frontend/.env.local
# Edit frontend/.env.local with your values

# Backend environment  
cp backend/env.template backend/.env
# Edit backend/.env with your values

# Data Science environment
cp data-science/env.template data-science/.env
# Edit data-science/.env with your values
```

### 3. Database Setup (MySQL)

```bash
# Install MySQL locally
# macOS (Homebrew):
brew install mysql && brew services start mysql

# Create database and user
mysql -u root -p
CREATE DATABASE melbourne_parking;
CREATE USER 'parking_user'@'%' IDENTIFIED BY 'strong_password';
GRANT ALL PRIVILEGES ON melbourne_parking.* TO 'parking_user'@'%';
FLUSH PRIVILEGES;

# Update DATABASE_URL in backend/.env, e.g.:
# mysql://parking_user:strong_password@localhost:3306/melbourne_parking
```

### 4. Data Science Environment

```bash
cd data-science

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 5. Development Servers

```bash
# Start both frontend and backend (from root)
npm run dev

# Or start individually:
npm run frontend:dev    # Frontend on http://localhost:3000
npm run backend:dev     # Backend on http://localhost:5000

# Start Jupyter for data science work
cd data-science
jupyter lab             # Jupyter on http://localhost:8888
```

## API Endpoints

### Health Check
- `GET /health` - Server health status

### Parking Data
- `GET /api/v1/parking` - Get parking locations
- `GET /api/v1/parking/availability` - Real-time availability
- `GET /api/v1/parking/predictions` - Parking predictions

### User Management
- `POST /api/v1/users/register` - User registration
- `POST /api/v1/users/login` - User authentication
- `GET /api/v1/users/profile` - User profile

## Data Sources

1. **Melbourne Open Data Platform**
   - On-street parking sensors
   - Off-street parking facilities
   - Traffic volume data

2. **Google Maps API**
   - Route optimization
   - Real-time traffic data
   - Places information

3. **VicRoads API**
   - Road condition data
   - Traffic incident reports

## Machine Learning Features

- **Parking Availability Prediction**: Time-series forecasting using XGBoost
- **Route Optimization**: Multi-objective optimization considering parking and traffic
- **User Behavior Analysis**: Clustering analysis for personalized recommendations
- **Real-time Processing**: Streaming data processing for live updates

## Deployment

### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel --prod

# Environment variables are configured in Vercel dashboard
```

### AWS Services Used

- **S3**: Static asset storage and data lake
- **Lambda**: Serverless functions for ML model inference
- **RDS/DocumentDB**: Production database options
- **CloudWatch**: Monitoring and logging

## Development Workflow

### Branch Strategy
- `main`: Production-ready code
- `develop`: Integration branch
- `feature/*`: Feature development
- `hotfix/*`: Critical bug fixes

### Code Quality
```bash
# Frontend linting
npm run frontend:lint

# Backend linting  
npm run backend:lint

# Python code formatting
cd data-science
black src/
flake8 src/
```

### Testing
```bash
# Frontend tests
npm run frontend:test

# Backend tests
npm run backend:test

# Python tests
cd data-science
pytest
```

## Team Collaboration Guidelines

### Git Workflow
1. Create feature branch: `git checkout -b feature/parking-predictions`
2. Make changes and commit: `git commit -m "Add parking prediction model"`
3. Push branch: `git push origin feature/parking-predictions`
4. Create Pull Request for code review
5. Merge after approval

### Code Review Checklist
- [ ] Code follows project conventions
- [ ] Tests are included and passing
- [ ] Documentation is updated
- [ ] Environment variables are templated
- [ ] No sensitive data in commits

### Communication
- Use GitHub Issues for bug reports and feature requests
- Use GitHub Projects for task management
- Regular team meetings for progress updates

## Environment Variables Reference

### Frontend (`frontend/.env.local`)
- `REACT_APP_API_BASE_URL`: Backend API URL
- `REACT_APP_MAPBOX_TOKEN`: Mapbox access token for maps
- `REACT_APP_GOOGLE_MAPS_API_KEY`: Google Maps API key

### Backend (`backend/.env`)
- `PORT`: Server port (default: 5000)
- `DATABASE_URL`: MySQL connection string for Prisma
- `JWT_SECRET`: JWT signing secret
- `MELBOURNE_DATA_API_KEY`: Melbourne Open Data API key

### Data Science (`data-science/.env`)
- `API_BASE_URL`: Backend API URL
- `AWS_ACCESS_KEY_ID`: AWS access key
- `AWS_SECRET_ACCESS_KEY`: AWS secret key
- `GOOGLE_MAPS_API_KEY`: Google Maps API key

## Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Kill process on port 3000/5000
   lsof -ti:3000 | xargs kill -9
   lsof -ti:5000 | xargs kill -9
   ```

2. **MySQL connection issues**
   - Check MySQL is running: `brew services start mysql`
   - Verify `DATABASE_URL` in `.env`
   - Ensure user has privileges on the database

3. **Python environment issues**
   ```bash
   # Reset virtual environment
   rm -rf venv
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

4. **Node modules issues**
   ```bash
   # Clean install
   rm -rf node_modules package-lock.json
   npm install
   ```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

- **Team Lead**: [Your Name]
- **Web Developer**: [Developer Name]
- **Data Scientist**: [Data Scientist Name]
- **Project Repository**: [GitHub URL]

---

**Monash University FIT5120 - Applied Data Science**  
**Team Project - Onboarding Assignment**
This is the official Repository for the onboarding project for TP01
