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
- **React Native**: Mobile app framework
- **Expo**: Development platform and tools
- **Firebase Authentication**: User authentication
- **Cloud Firestore**: Database for storing muscle entries
- **Zustand**: State management
- **React Navigation**: Navigation between screens
- **Expo Secure Store**: Secure local storage
- **React Native Reanimated**: Animations

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
