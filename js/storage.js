// Storage management system using localStorage
const Storage = (() => {
    const STORAGE_KEY = 'chess_club_data';
    const AUTH_KEY = 'chess_club_auth';

    // Initialize default data
    const getDefaultData = () => ({
        instructors: [
            {
                id: 'INST001',
                username: 'instructor',
                password: 'admin123',
                name: 'John Smith',
                email: 'instructor@chessclub.com'
            }
        ],
        students: [
            {
                id: 'STU001',
                name: 'Ahmed Ali',
                password: 'student123',
                category: 'Beginner',
                dateAdded: new Date().toISOString(),
                progress: {
                    activities: {
                        'Attended Training': false,
                        'Completed Homework': true,
                        'Participated in Tournament': false,
                        'Problem Set Complete': true,
                        'Game Analysis': false
                    },
                    chess: {
                        'Opening Principles': { completed: true, rating: 4 },
                        'Opening Repertoire': { completed: false, rating: 2 },
                        'Middlegame Tactics': { completed: true, rating: 3 },
                        'Middlegame Strategy': { completed: false, rating: 2 },
                        'Endgame Basics': { completed: true, rating: 3 },
                        'Endgame Techniques': { completed: false, rating: 1 },
                        'Problem Solving': { completed: true, rating: 4 },
                        'Tournament Performance': { completed: false, rating: 2 }
                    },
                    comments: [
                        { date: '2024-09-08', text: 'Great progress on opening principles!' },
                        { date: '2024-09-05', text: 'Needs more practice on endgame positions.' }
                    ]
                }
            },
            {
                id: 'STU002',
                name: 'Fatima Hassan',
                password: 'student456',
                category: 'Intermediate',
                dateAdded: new Date().toISOString(),
                progress: {
                    activities: {
                        'Attended Training': true,
                        'Completed Homework': true,
                        'Participated in Tournament': true,
                        'Problem Set Complete': false,
                        'Game Analysis': true
                    },
                    chess: {
                        'Opening Principles': { completed: true, rating: 5 },
                        'Opening Repertoire': { completed: true, rating: 4 },
                        'Middlegame Tactics': { completed: true, rating: 4 },
                        'Middlegame Strategy': { completed: true, rating: 3 },
                        'Endgame Basics': { completed: true, rating: 4 },
                        'Endgame Techniques': { completed: true, rating: 3 },
                        'Problem Solving': { completed: true, rating: 5 },
                        'Tournament Performance': { completed: true, rating: 4 }
                    },
                    comments: [
                        { date: '2024-09-09', text: 'Excellent performance in tournament!' },
                        { date: '2024-09-03', text: 'Strong tactical understanding.' }
                    ]
                }
            },
            {
                id: 'STU003',
                name: 'Mohamed Rasheed',
                password: 'student789',
                category: 'Advanced',
                dateAdded: new Date().toISOString(),
                progress: {
                    activities: {
                        'Attended Training': true,
                        'Completed Homework': true,
                        'Participated in Tournament': true,
                        'Problem Set Complete': true,
                        'Game Analysis': true
                    },
                    chess: {
                        'Opening Principles': { completed: true, rating: 5 },
                        'Opening Repertoire': { completed: true, rating: 5 },
                        'Middlegame Tactics': { completed: true, rating: 5 },
                        'Middlegame Strategy': { completed: true, rating: 4 },
                        'Endgame Basics': { completed: true, rating: 5 },
                        'Endgame Techniques': { completed: true, rating: 4 },
                        'Problem Solving': { completed: true, rating: 5 },
                        'Tournament Performance': { completed: true, rating: 5 }
                    },
                    comments: [
                        { date: '2024-09-10', text: 'Ready for advanced tournament play.' }
                    ]
                }
            }
        ],
        categories: [
            { id: 'CAT001', name: 'Beginner', color: '#3498db' },
            { id: 'CAT002', name: 'Intermediate', color: '#f39c12' },
            { id: 'CAT003', name: 'Advanced', color: '#e74c3c' },
            { id: 'CAT004', name: 'Tournament Players', color: '#27ae60' }
        ]
    });

    const init = () => {
        if (!localStorage.getItem(STORAGE_KEY)) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(getDefaultData()));
        }
    };

    const getData = () => {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY)) || getDefaultData();
        } catch (e) {
            console.error('Error reading data:', e);
            return getDefaultData();
        }
    };

    const saveData = (data) => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error('Error saving data:', e);
            return false;
        }
    };

    const getAuth = () => {
        try {
            return JSON.parse(localStorage.getItem(AUTH_KEY));
        } catch (e) {
            return null;
        }
    };

    const setAuth = (authData) => {
        try {
            localStorage.setItem(AUTH_KEY, JSON.stringify(authData));
            return true;
        } catch (e) {
            console.error('Error saving auth:', e);
            return false;
        }
    };

    const clearAuth = () => {
        localStorage.removeItem(AUTH_KEY);
    };

    const getStudent = (studentId) => {
        const data = getData();
        return data.students.find(s => s.id === studentId);
    };

    const updateStudent = (studentId, updates) => {
        const data = getData();
        const studentIndex = data.students.findIndex(s => s.id === studentId);
        if (studentIndex !== -1) {
            data.students[studentIndex] = { ...data.students[studentIndex], ...updates };
            saveData(data);
            return true;
        }
        return false;
    };

    const addStudent = (student) => {
        const data = getData();
        data.students.push(student);
        saveData(data);
        return true;
    };

    const deleteStudent = (studentId) => {
        const data = getData();
        data.students = data.students.filter(s => s.id !== studentId);
        saveData(data);
        return true;
    };

    const getCategories = () => {
        return getData().categories;
    };

    const addCategory = (category) => {
        const data = getData();
        category.id = 'CAT' + Date.now();
        data.categories.push(category);
        saveData(data);
        return category;
    };

    return {
        init,
        getData,
        saveData,
        getAuth,
        setAuth,
        clearAuth,
        getStudent,
        updateStudent,
        addStudent,
        deleteStudent,
        getCategories,
        addCategory
    };
})();

// Initialize storage on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Storage.init());
} else {
    Storage.init();
}