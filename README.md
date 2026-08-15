# BlinkMoney Assignment

This is a React Native project built for the BlinkMoney Frontend Engineering hiring assignment. It implements two main features:

1. **Money Wrapped**: An Instagram/Spotify-story style animated recap of the user's savings journey.
   - 7 slides: Intro, Streak, Growth Chart, Milestone Confetti, Percentile Rank, Referral, and Image Share.
   - Interactive navigation: Tap left/right to go back/forward, hold to pause, swipe down to exit, and auto-advancing progress bars.

2. **Squad Save**: A social group-saving dashboard.
   - Interactive leaderboard of group members.
   - Dynamic progress bar showing collective goal progress.
   - Actions to log daily savings, nudge lagging members, invite friends, and share the win.

A preview panel at the bottom of the landing screen allows toggling different states (success, loading, error, empty/new user) for testing.

---

## Getting Started

### 1. Install Dependencies
```sh
npm install
```

### 2. Start Metro Bundler
```sh
npm start
```

### 3. Run on Android
Ensure a device or emulator is connected:
```sh
npm run android
```
*(On Windows, if the command above fails to launch Gradle, run `cd android && .\gradlew.bat :app:installDebug` instead)*

### 4. Run on iOS
```sh
cd ios
bundle install
bundle exec pod install
cd ..
npm run ios
```


