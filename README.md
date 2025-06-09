# Muscle Recovery App

## Project Overview
A mobile application designed to help fitness enthusiasts track muscle recovery after workouts, ensuring each muscle group receives adequate rest before training it again. The app provides real-time countdowns and visual indicators to optimize training schedules and prevent overtraining.

## Features
- Track individual muscle groups with customizable recovery times
- Monitor recovery progress with real-time countdown timers
- Cloud synchronization across devices
- Secure user authentication and profile management
- Dark mode support for comfortable viewing
- Customizable user profile
- Visualize recovery status with color indicators (red for recovering, green for ready)
- Filter muscles by status (all, ready, recovering)
- Swipe to navigate across pages
- Notes option on entries
- Countdown timer

## Installation Instructions
1. Clone the repository:
```
git clone https://github.com/RedXP2/capstone-2.git
cd capstone-2
```

2. Install dependencies:
```
npm install
```

3. Set up Firebase:
   - Create a Firebase project at https://console.firebase.google.com/
   - Enable Authentication with Email/Password
   - Create a Firestore database
   - Add your Firebase configuration to `srcconfig/firebase.js`
   - Deploy the Firestore security rules from `firestore.rules`

4. Start the development server:
```
npm start
```

## Usage
1. **Registration/Login**: Create an account or log in with existing credentials
2. **Add Muscle Entry**: Swipe to the middle page to add a new muscle with details:
   - Muscle name
   - Recovery time (in days)
   - Workout details (weight, sets, reps)
3. **Track Recovery**: View countdown timers for each muscle on the home screen
4. **Filter Muscles**: Use the tabs to filter by All, Ready, or Recovering
5. **Edit/Delete**: Tap on a muscle entry to edit or delete it
6. **Profile Management**: Update your profile information in Settings

## Technologies Used
- **React Native**: Mobile app framework for cross-platform development
- **Expo**: Development platform and tools for React Native
- **Firebase Authentication**: User authentication and session management
- **Cloud Firestore**: NoSQL database for storing muscle entries
- **Zustand**: Lightweight state management with hooks
- **React Navigation**: Screen navigation and routing
- **Expo Secure Store**: Secure local storage for sensitive data
- **React Native Reanimated**: High-performance animations
- **Jest & React Testing Library**: Testing framework and utilities
- **EAS Build**: Build system for creating production apps

## Architecture
The application follows a modern React Native architecture with these key components:

### State Management
- **Auth Store**: Manages user authentication state and operations
- **Muscle Store**: Handles muscle entry data and operations
- **Error Handling**: Global error boundary and custom error hooks

### Key Components
- **ErrorBoundary**: Catches and handles React component errors
- **Navigation**: Bottom tabs and stack navigation for screen management
- **Screens**: Home, Add Entry, Profile, and Settings screens
- **Custom Hooks**: Error handling, authentication, and data management

### Testing
The project includes comprehensive testing:
```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

Test coverage includes:
- Unit tests for components and hooks
- Integration tests for navigation and error handling
- Store testing for auth and muscle data management
- Performance testing for critical operations

### Deployment
The project uses EAS (Expo Application Services) for building and deploying:

```bash
# Build Android Preview
npm run build:android

# Build iOS Preview
npm run build:ios

# Build Android Production
npm run build:production:android

# Build iOS Production
npm run build:production:ios

# Submit to stores
npm run submit:android
npm run submit:ios
```

Build profiles are configured in `eas.json` for different environments:
- Preview: Development and testing builds
- Production: App store ready builds

## Code Structure
```
src/
├── components/     # Reusable UI components
├── screens/       # Screen components
├── hooks/         # Custom React hooks
├── store/         # State management
├── config/        # Configuration files
└── utils/         # Utility functions

__tests__/
├── components/    # Component tests
├── screens/       # Screen tests
├── hooks/        # Hook tests
├── integration/  # Integration tests
└── store/        # Store tests
```

## Future Improvements
- Push notifications when muscles are ready to train
- Workout history and statistics
- Customizable recovery calculation based on workout intensity
- Social features to share progress with friends
- Integration with fitness wearables for automatic tracking
- Barcode scanner for gym equipment
- Export/import data functionality
- Localization support for multiple languages

## License
This project is licensed under the MIT License.

## Author
Created by Will as part of the Software Development Bootcamp.
