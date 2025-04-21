# Word Memorizer App

A React Native application for vocabulary memorization through spaced repetition. The app helps users learn new words by showing them at intervals, with less familiar words appearing more frequently.

## Features

- User authentication with Firebase
- Add words with AI-generated meanings, examples, and images
- Spaced repetition system with 1-20 proficiency levels
- Push notifications for word review
- Cross-platform support (iOS, Android, Web)
- Settings for customizing notification intervals

## Technology Stack

- React Native with Expo
- TypeScript for type safety
- Firebase Authentication, Firestore, and Storage
- OpenAI API for generating word content and images
- Expo Notifications for push notifications

## Installation

1. Clone the repository:
```
git clone https://github.com/moein-shafiei/word-memorizer-app.git
cd word-memorizer-app
```

2. Install dependencies:
```
npm install
```

3. Start the development server:
```
npm start
```

4. Run on your preferred platform:
```
npm run android
npm run ios
npm run web
```

## Usage

1. Register or log in to your account
2. Add new words using the "Add Word" tab
3. Review words when notifications appear
4. Track your progress on the home screen
5. Adjust notification frequency in settings

## Project Structure

- `/src/components`: Reusable UI components
- `/src/screens`: Main application screens
- `/src/services`: Firebase and OpenAI integration
- `/src/context`: React context providers
- `/src/hooks`: Custom React hooks
- `/src/navigation`: Navigation configuration
- `/src/types`: TypeScript type definitions
- `/src/utils`: Utility functions
- `/src/config`: Configuration files

## License

MIT
