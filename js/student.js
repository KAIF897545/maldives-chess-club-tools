// Student/Parent panel functionality
const StudentPanel = (() => {
    const init = () => {
        // Check authentication
        if (!Auth.isStudent()) {
            window.location.href = 'index.html';
            return;
        }

        setupUI();
    };

    const setupUI = () => {
        const currentUser = Auth.getCurrentUser();
        const student = Storage.getStudent(currentUser.id);

        if (!student) {
            Utils.showAlert('Student data not found', 'error');
            return;
        }

        // Header
        document.getElementById('student-name-header').textContent = student.name;
        document.getElementById('student-id-display').textContent = student.id;
        document.getElementById('student-category').textContent = student.category;

        // Logout button
        document.getElementById('logout-btn').addEventListener('click', () => {
            Auth.logout();
            window.location.href = 'index.html';
        });

        renderProgressData(student);
    };

    const renderProgressData = (student) => {
        const container = document.getElementById('progress-content');
        let html = '';

        // Activities Section
        html += `
            <div class="progress-card">
                <h2>📋 Your Activities</h2>
        `;

        Object.entries(student.progress.activities).forEach(([activity, completed]) => {
            const status = completed ? 'completed' : 'pending';
            const statusText = completed ? 'Completed' : 'Pending';
            html += `
                <div class="progress-item">
                    <div class="progress-item-name">${activity}</div>
                    <div class="progress-item-status">
                        <span class="status-badge ${status}">${statusText}</span>
                        <span>${completed ? '✓' : '○'}</span>
                    </div>
                </div>
            `;
        });

        html += '</div>';

        // Chess Skills Section
        html += `
            <div class="progress-card">
                <h2>♟️ Chess Skills Development</h2>
        `;

        Object.entries(student.progress.chess).forEach(([skill, data]) => {
            const status = data.completed ? 'completed' : 'pending';
            const statusText = data.completed ? 'Mastered' : 'In Progress';
            let stars = '';
            for (let i = 1; i <= 5; i++) {
                stars += i <= data.rating ? '<span class="star-filled">★</span>' : '<span class="star-empty">☆</span>';
            }
            
            html += `
                <div class="progress-item">
                    <div>
                        <div class="progress-item-name">${skill}</div>
                        <div class="rating-display" style="margin-top: 5px;">${stars}</div>
                    </div>
                    <div class="progress-item-status">
                        <span class="status-badge ${status}">${statusText}</span>
                    </div>
                </div>
            `;
        });

        html += '</div>';

        // Comments Section
        html += `
            <div class="progress-card">
                <h2>💬 Instructor Feedback</h2>
        `;

        if (student.progress.comments.length === 0) {
            html += '<p style="color: #7f8c8d; text-align: center; padding: 20px;">No feedback yet</p>';
        } else {
            student.progress.comments.forEach(comment => {
                html += `
                    <div style="background: #f0f0f0; padding: 15px; border-radius: 5px; margin-bottom: 15px; border-left: 4px solid var(--info-color);">
                        <div>${comment.text}</div>
                        <div class="comment-date">${Utils.formatDate(comment.date)}</div>
                    </div>
                `;
            });
        }

        // Summary Stats
        const activitiesCompleted = Object.values(student.progress.activities).filter(Boolean).length;
        const skillsCompleted = Object.values(student.progress.chess).filter(s => s.completed).length;
        const totalSkills = Object.keys(student.progress.chess).length;
        const avgRating = Object.values(student.progress.chess).reduce((sum, s) => sum + s.rating, 0) / totalSkills;

        html += `
            </div>
            <div class="progress-card" style="background: linear-gradient(135deg, #ecf0f1 0%, #d5dbdb 100%); border: 2px solid var(--primary-color);">
                <h2>📊 Your Progress Summary</h2>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 15px;">
                    <div style="background: white; padding: 15px; border-radius: 5px; text-align: center;">
                        <div style="font-size: 28px; font-weight: bold; color: var(--success-color);">${activitiesCompleted}</div>
                        <div style="font-size: 12px; color: #7f8c8d; margin-top: 5px;">Activities Completed</div>
                    </div>
                    <div style="background: white; padding: 15px; border-radius: 5px; text-align: center;">
                        <div style="font-size: 28px; font-weight: bold; color: var(--info-color);">${skillsCompleted}/${totalSkills}</div>
                        <div style="font-size: 12px; color: #7f8c8d; margin-top: 5px;">Skills Mastered</div>
                    </div>
                    <div style="background: white; padding: 15px; border-radius: 5px; text-align: center;">
                        <div style="font-size: 28px; font-weight: bold; color: var(--warning-color);">${avgRating.toFixed(1)}/5</div>
                        <div style="font-size: 12px; color: #7f8c8d; margin-top: 5px;">Average Skill Rating</div>
                    </div>
                    <div style="background: white; padding: 15px; border-radius: 5px; text-align: center;">
                        <div style="font-size: 28px; font-weight: bold; color: var(--accent-color);">${Math.round((skillsCompleted / totalSkills) * 100)}%</div>
                        <div style="font-size: 12px; color: #7f8c8d; margin-top: 5px;">Overall Progress</div>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = html;
    };

    return {
        init
    };
})();

// Initialize on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => StudentPanel.init());
} else {
    StudentPanel.init();
}