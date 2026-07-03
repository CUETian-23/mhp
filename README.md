# Mental Health Platform

A comprehensive full-stack mental health platform with AI-powered support and biometric authentication using WebAuthn.

## Features

### Core Features
- **Biometric Authentication**: Secure passwordless login using WebAuthn (FIDO2) with fingerprint or face recognition
- **AI-Powered Mental Health Support**: 
  - Sentiment analysis for journal entries
  - Risk assessment and crisis detection
  - Personalized recommendations
  - AI chat assistant
- **Mood Tracking**: Daily mood logging with intensity levels and factors
- **Journal**: Private journaling with AI analysis and sentiment tracking
- **Crisis Support**: Integrated crisis resources and emergency contacts
- **Role-Based Dashboards**: 
  - Student Dashboard
  - Professional Dashboard (for mental health professionals)
  - Admin Dashboard (for platform management)

### Security Features
- WebAuthn biometric authentication (FIDO2/CTAP2 compliant)
- JWT-based session management
- Rate limiting for API endpoints
- Input validation and sanitization
- Data encryption at rest and in transit
- Privacy-focused design with anonymity options

### AI/ML Features
- Natural Language Processing for sentiment analysis
- Risk assessment based on text analysis
- Personalized recommendation engine
- Crisis keyword detection
- Mood pattern analysis

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Cache**: Redis
- **Authentication**: JWT + WebAuthn (@simplewebauthn/server)
- **AI/ML**: 
  - Natural (NLP library)
  - Sentiment (sentiment analysis)
  - TensorFlow.js (for future ML models)
- **Security**: Helmet, express-rate-limit
- **Logging**: Winston

### Frontend
- **Framework**: React 18
- **State Management**: Redux Toolkit
- **Routing**: React Router v6
- **UI Components**: Lucide React icons
- **Charts**: Recharts
- **Date Handling**: date-fns
- **HTTP Client**: Axios
- **WebAuthn**: @simplewebauthn/browser

## Project Structure

```
mental-health-platform/
├── client/                          # React Frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/               # Authentication components
│   │   │   ├── dashboard/          # Dashboard components
│   │   │   ├── mental-health/      # Mental health features
│   │   │   ├── ai-features/        # AI-powered components
│   │   │   └── common/             # Shared UI components
│   │   ├── hooks/                  # Custom React hooks
│   │   ├── services/               # API services
│   │   ├── context/                # React context providers
│   │   ├── redux/                  # Redux store and slices
│   │   ├── utils/                  # Utility functions
│   │   ├── styles/                 # Global styles
│   │   ├── App.js                  # Main App component
│   │   └── index.js                # Entry point
│   └── package.json
├── server/                          # Node.js Backend
│   ├── config/                     # Configuration files
│   ├── controllers/                # Route controllers
│   ├── middleware/                 # Express middleware
│   ├── models/                     # Mongoose models
│   ├── routes/                     # API routes
│   ├── services/                   # Business logic
│   ├── ai-models/                  # AI/ML models
│   ├── utils/                      # Utility functions
│   ├── tests/                      # Test files
│   ├── app.js                      # Express app
│   ├── index.js                    # Server entry point
│   └── package.json
├── shared/                          # Shared constants
├── database/                        # Database setup
├── docker/                          # Docker configuration
├── ci-cd/                          # CI/CD configuration
├── docs/                           # Documentation
├── package.json                    # Root package.json
└── README.md
```

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- Redis (v6 or higher)
- npm or yarn

## Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd mental-health-platform
```

2. **Install dependencies**
```bash
npm run install:all
```

This will install dependencies for both client and server.

3. **Environment Setup**

Create `.env` files in both `client/` and `server/` directories:

**Server `.env`**:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/mental-health-platform
REDIS_URI=redis://localhost:6379
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d
WEBAUTHN_RP_ID=localhost
WEBAUTHN_ORIGIN=http://localhost:3000
```

**Client `.env`**:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

4. **Start MongoDB and Redis**

Make sure MongoDB and Redis are running on your local machine or update the connection URIs in the `.env` files.

5. **Run the application**

Development mode (both client and server):
```bash
npm run dev
```

Or run separately:
```bash
# Terminal 1 - Server
cd server
npm run dev

# Terminal 2 - Client
cd client
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/health

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login with password
- `POST /api/auth/login/webauthn` - Login with WebAuthn
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/preferences` - Update preferences

### WebAuthn
- `POST /api/webauthn/register/options` - Generate registration options
- `POST /api/webauthn/register/verify` - Verify registration
- `POST /api/webauthn/auth/options` - Generate authentication options
- `GET /api/webauthn/credentials` - Check if user has credentials
- `DELETE /api/webauthn/credentials/:id` - Remove credential

### Mental Health
- `POST /api/mental-health/mood` - Create mood record
- `GET /api/mental-health/mood` - Get mood records
- `GET /api/mental-health/mood/stats` - Get mood statistics
- `POST /api/mental-health/journal` - Create journal entry
- `GET /api/mental-health/journal` - Get journal entries
- `GET /api/mental-health/journal/:id` - Get single journal entry
- `PUT /api/mental-health/journal/:id` - Update journal entry
- `DELETE /api/mental-health/journal/:id` - Delete journal entry

## User Roles

- **Student**: Primary users with access to mood tracking, journal, AI assistant, and crisis support
- **Public**: General users with access to basic mental health features
- **Professional**: Mental health professionals with access to patient management and analytics
- **Admin**: Platform administrators with full system access

## Security Considerations

### WebAuthn Implementation
- Uses platform authenticators (TouchID, Windows Hello) for seamless user experience
- Implements proper attestation and verification ceremonies
- Includes fallback to password authentication
- Stores credentials securely in database

### Data Privacy
- All sensitive data encrypted at rest
- HTTPS required for all API calls
- User anonymity options available
- GDPR-compliant data handling
- Regular security audits recommended

### Rate Limiting
- General API: 100 requests per 15 minutes
- Authentication: 5 requests per 15 minutes
- WebAuthn: 10 requests per 15 minutes
- Mental health API: 30 requests per minute

## AI/ML Features

### Sentiment Analysis
- Real-time analysis of journal entries
- Sentiment scoring (-5 to +5)
- Mood classification (very-negative to very-positive)
- Confidence scoring

### Risk Assessment
- Crisis keyword detection
- Risk level classification (low, medium, high, critical)
- Automatic crisis alert generation
- Escalation protocols for critical cases

### Recommendations
- Personalized based on mood patterns
- Topic-based recommendations from journal analysis
- Activity suggestions for wellness
- Resource recommendations

## Development

### Running Tests
```bash
# Server tests
cd server
npm test

# Client tests
cd client
npm test
```

### Building for Production
```bash
# Build client
cd client
npm run build

# The build output will be in client/build/
```

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up -d
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Crisis Resources

If you or someone you know is in crisis, please contact:

- **National Suicide Prevention Lifeline**: 988 (24/7)
- **Crisis Text Line**: Text HOME to 741741
- **SAMHSA National Helpline**: 1-800-662-4357

## Support

For support, please contact support@mentalhealthplatform.com or open an issue in the repository.

## Acknowledgments

- WebAuthn implementation based on @simplewebauthn libraries
- AI/ML features using Natural and Sentiment libraries
- Icons provided by Lucide React
- Charting powered by Recharts

## Roadmap

- [ ] Mobile app development
- [ ] Advanced ML models for prediction
- [ ] Integration with wearable devices
- [ ] Telehealth video conferencing
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Community support groups
- [ ] Professional directory
