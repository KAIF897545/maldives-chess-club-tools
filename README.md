# Maldives Chess Club - Student Progress Checklist Tool

A comprehensive student progress tracking system for instructors and parents/students. Features role-based access, detailed chess skill progression tracking, and secure password-protected accounts.

## Features

- **Instructor Panel**: Manage student progress, create categories, track chess skills
- **Parent/Student Panel**: View progress with student password protection
- **Chess Content Progress**: In-depth tracking of:
  - Opening principles & repertoire
  - Middlegame tactics & strategy
  - Endgame techniques
  - Problem-solving abilities
  - Tournament performance
- **Student Categorization**: Group students by level, age, or custom categories
- **Activity Checklist**: Track attendance, homework, participation, milestones
- **Rating System**: 1-5 star ratings for skill assessments
- **Comments & Notes**: Add detailed feedback for each student
- **Secure Access**: Student ID + Password authentication

## Project Structure

```
├── index.html              # Main entry point (login page)
├── instructor-panel.html   # Instructor dashboard
├── student-panel.html      # Parent/Student view
├── css/
│   ├── style.css          # Main stylesheet
│   └── responsive.css     # Mobile responsiveness
├── js/
│   ├── app.js             # Core application logic
│   ├── auth.js            # Authentication system
│   ├── storage.js         # LocalStorage management
│   ├── instructor.js      # Instructor panel functions
│   ├── student.js         # Student panel functions
│   └── utils.js           # Utility functions
└── data/
    └── sample-data.js     # Sample data structure
```

## Getting Started

1. Clone the repository
2. Open `index.html` in your web browser
3. Use sample credentials to log in (see below)

## Default Test Credentials

### Instructor
- Username: `instructor`
- Password: `admin123`

### Student/Parent
- Student ID: `STU001`
- Password: `student123`

## Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Storage**: Browser LocalStorage (can be upgraded to backend database)
- **No dependencies**: Runs completely client-side

## Future Enhancements

- Backend database integration (Node.js + PostgreSQL)
- Export reports to PDF
- Email notifications
- Mobile app
- Real-time synchronization
- Advanced analytics & progress charts

## License

MIT License - Feel free to use and modify for your needs