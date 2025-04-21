# Word Memorizer App

A React Native application that helps users memorize words through scheduled notifications.

## Features

- **Word Management**: Add new words with meanings, examples, and AI-generated images
- **Notification System**: Receive word notifications at customizable intervals
- **Learning Progress Tracking**: Track your learning progress with "Learning" and "I Know" buttons
- **Cloud Storage**: All words, examples, and images are stored in Firebase cloud
- **AI Image Generation**: Automatically generate images for words using ChatGPT API

## Technical Stack

- **Frontend**: React Native with Expo
- **Navigation**: React Navigation
- **Backend & Storage**: Firebase (Authentication, Firestore, Storage)
- **Notifications**: Expo Notifications
- **Image Generation**: ChatGPT API

## Setup Instructions

### Prerequisites
- Node.js and npm
- Expo CLI
- Firebase account
- OpenAI API key

### Installation

1. Clone the repository
```bash
git clone https://github.com/moein-shafiei/word-memorizer-app.git
cd word-memorizer-app
```

2. Install dependencies
```bash
npm install
```

3. Configure Firebase
- Create a Firebase project
- Update the Firebase configuration in `src/services/firebase.js`

4. Configure OpenAI API
- Get an API key from OpenAI
- Update the API key in `src/services/openaiService.js`

5. Start the application
```bash
npm start
```

## Usage

- **Add Words**: Use the "Add New Word" button to add words to your collection
- **View Words**: See all your words on the home screen
- **Word Details**: Tap on a word to see its details, meaning, example, and image
- **Settings**: Configure notification frequency in the settings screen
- **Notifications**: Receive word notifications and mark them as "Learning" or "I Know"

## Project Structure

```
src/
├── assets/         # Images, fonts, and other static assets
├── components/     # Reusable UI components
├── navigation/     # Navigation configuration
├── screens/        # App screens
├── services/       # Firebase, OpenAI, and other services
└── utils/          # Utility functions
```

## License

MIT
