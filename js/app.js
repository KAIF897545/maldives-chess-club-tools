// Main application logic
const App = (() => {
    const init = () => {
        // Check if user is logged in
        if (Auth.isAuthenticated()) {
            if (Auth.isInstructor()) {
                window.location.href = 'instructor-panel.html';
            } else if (Auth.isStudent()) {
                window.location.href = 'student-panel.html';
            }
        }

        // Setup login page
        setupLoginPage();
    };

    const setupLoginPage = () => {
        // Tab switching
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabName = btn.getAttribute('data-tab');
                
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                btn.classList.add('active');
                document.getElementById(`${tabName}-tab`).classList.add('active');
            });
        });

        // Instructor login
        const instructorForm = document.getElementById('instructor-login-form');
        if (instructorForm) {
            instructorForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const username = document.getElementById('instructor-username').value;
                const password = document.getElementById('instructor-password').value;

                const result = Auth.login('instructor', { username, password });
                if (result.success) {
                    window.location.href = 'instructor-panel.html';
                } else {
                    Utils.showAlert('Invalid instructor credentials', 'error');
                }
            });
        }

        // Student login
        const studentForm = document.getElementById('student-login-form');
        if (studentForm) {
            studentForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const studentId = document.getElementById('student-id').value;
                const password = document.getElementById('student-password').value;

                const result = Auth.login('student', { studentId, password });
                if (result.success) {
                    window.location.href = 'student-panel.html';
                } else {
                    Utils.showAlert('Invalid student ID or password', 'error');
                }
            });
        }
    };

    return {
        init
    };
})();

// Start app when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.init());
} else {
    App.init();
}