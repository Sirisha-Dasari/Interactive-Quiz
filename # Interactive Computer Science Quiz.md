# Interactive Computer Science Quiz

A dynamic, feature-rich quiz application focused on computer science topics with multiple difficulty levels, timed questions, and persistent high scores.



## Features

- **Multiple Difficulty Levels**: Choose between Easy, Medium, and Hard
- **Timed Questions**: Different time limits based on difficulty level
- **Progress Tracking**: Visual progress bar and score counter
- **Question Navigation**: Move between questions with Previous/Next buttons
- **Feedback System**: Immediate feedback after answering questions
- **High Score System**: Save and view top scores for each difficulty level
- **Responsive Design**: Works on desktop and mobile devices
- **Dynamic Content**: Questions sourced from both local data and external API

## Technologies Used

- HTML5
- CSS3 (with animations and transitions)
- Vanilla JavaScript (ES6+)
- Local Storage API for persistence
- Open Trivia Database API for additional questions

## How to Use

1. Open the application in a web browser
2. Select a difficulty level: Easy, Medium, or Hard
3. Answer the questions before the timer runs out
4. Navigate between questions using the Previous/Next buttons
5. See your final score and save it with your name
6. View high scores for different difficulty levels

## Quiz Mechanics

- **Easy Mode**: 15 seconds per question, basic computer science concepts
- **Medium Mode**: 20 seconds per question, intermediate programming concepts
- **Hard Mode**: 25 seconds per question, advanced computer science topics
- Questions are randomly selected and won't repeat within a session
- When running low on questions, additional ones are fetched from an external API

## Project Structure

- **index.html**: Main HTML structure
- **styles.css**: All styling and animations
- **script.js**: Core application logic and functionality
  - Question management
  - Timer functionality
  - Score tracking
  - High score system

## Local Storage

The application stores high scores locally in your browser using the following keys:
- `highScores_easy`: Top scores for easy difficulty
- `highScores_medium`: Top scores for medium difficulty
- `highScores_hard`: Top scores for hard difficulty

## Future Enhancements

Potential features for future versions:
- Additional question categories
- User accounts with authentication
- Global high score leaderboard
- Custom quiz creation
- More detailed analytics on performance

## Running Locally

1. Clone or download this repository
2. Open `index.html` in your web browser
3. No server required - the application runs entirely in the browser

## Credits

- Questions sourced from [Open Trivia Database](https://opentdb.com/)
- Icons and design inspiration from various educational platforms
- Font styles from Google Fonts

## License

This project is open source and available under the MIT License.