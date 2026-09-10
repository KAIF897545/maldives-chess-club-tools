// Instructor panel functionality
const InstructorPanel = (() => {
    let currentStudent = null;
    let allStudents = [];
    let filteredStudents = [];

    const init = () => {
        // Check authentication
        if (!Auth.isInstructor()) {
            window.location.href = 'index.html';
            return;
        }

        loadStudents();
        setupUI();
    };

    const loadStudents = () => {
        const data = Storage.getData();
        allStudents = data.students;
        filteredStudents = allStudents;
        renderStudentList();
    };

    const setupUI = () => {
        // Header
        const user = Auth.getCurrentUser();
        document.getElementById('instructor-name').textContent = user.name || user.username;

        // Logout button
        document.getElementById('logout-btn').addEventListener('click', () => {
            Auth.logout();
            window.location.href = 'index.html';
        });

        // Search functionality
        const searchInput = document.getElementById('search-students');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase();
                filteredStudents = allStudents.filter(s => 
                    s.name.toLowerCase().includes(query) || 
                    s.id.toLowerCase().includes(query)
                );
                renderStudentList();
            });
        }

        // Category filter
        const categoryFilter = document.getElementById('category-filter');
        if (categoryFilter) {
            const data = Storage.getData();
            data.categories.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat.name;
                option.textContent = cat.name;
                categoryFilter.appendChild(option);
            });

            categoryFilter.addEventListener('change', (e) => {
                const selected = e.target.value;
                if (selected) {
                    filteredStudents = allStudents.filter(s => s.category === selected);
                } else {
                    filteredStudents = allStudents;
                }
                renderStudentList();
            });
        }

        // Add new student
        const addStudentBtn = document.getElementById('add-student-btn');
        if (addStudentBtn) {
            addStudentBtn.addEventListener('click', showAddStudentModal);
        }

        renderCategories();
    };

    const renderStudentList = () => {
        const list = document.getElementById('students-list');
        list.innerHTML = '';

        if (filteredStudents.length === 0) {
            list.innerHTML = '<p class="text-center" style="grid-column: 1/-1; padding: 20px; color: #7f8c8d;">No students found</p>';
            return;
        }

        filteredStudents.forEach(student => {
            const card = createStudentCard(student);
            list.appendChild(card);
        });
    };

    const createStudentCard = (student) => {
        const card = document.createElement('div');
        card.className = 'student-card';
        card.innerHTML = `
            <div class="student-card-header">
                <div>
                    <div class="student-name">${student.name}</div>
                    <div class="student-id">ID: ${student.id}</div>
                </div>
                <span class="student-category" style="background-color: ${Utils.getCategoryColor(student.category)}">
                    ${student.category}
                </span>
            </div>
            <div style="font-size: 12px; color: #7f8c8d;">
                Joined: ${Utils.formatDate(student.dateAdded)}
            </div>
        `;
        
        card.addEventListener('click', () => showStudentProgress(student));
        return card;
    };

    const showStudentProgress = (student) => {
        currentStudent = student;
        const modal = document.getElementById('progress-modal');
        document.getElementById('progress-modal-title').textContent = `${student.name}'s Progress`;
        
        renderProgressContent();
        modal.classList.add('active');
    };

    const renderProgressContent = () => {
        const content = document.getElementById('progress-modal-content');
        const student = currentStudent;
        
        let html = '';

        // Activities Section
        html += '<div class="checklist-group"><h4>📋 Activity Checklist</h4>';
        html += '<div class="checklist-items">';
        Object.entries(student.progress.activities).forEach(([activity, completed]) => {
            const id = `activity-${activity.replace(/\s+/g, '-')}`;
            html += `
                <div class="checklist-item">
                    <input type="checkbox" id="${id}" ${completed ? 'checked' : ''} 
                           onchange="InstructorPanel.updateActivity('${student.id}', '${activity}', this.checked)">
                    <label for="${id}">${activity}</label>
                </div>
            `;
        });
        html += '</div></div>';

        // Chess Skills Section
        html += '<div class="checklist-group"><h4>♟️ Chess Skills Progress</h4>';
        html += '<div class="checklist-items">';
        Object.entries(student.progress.chess).forEach(([skill, data]) => {
            const id = `chess-${skill.replace(/\s+/g, '-')}`;
            html += `
                <div style="background: #f9f9f9; padding: 12px; border-radius: 5px; margin-bottom: 10px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                        <label for="${id}" style="font-weight: 600;">${skill}</label>
                        <input type="checkbox" id="${id}" ${data.completed ? 'checked' : ''}
                               onchange="InstructorPanel.updateChessSkill('${student.id}', '${skill}', this.checked)">
                    </div>
                    <div class="rating-stars" id="rating-${skill.replace(/\s+/g, '-')}">
                        ${renderRatingStars(data.rating, skill)}
                    </div>
                </div>
            `;
        });
        html += '</div></div>';

        // Comments Section
        html += `
            <div class="comments-section">
                <h4>💬 Comments & Notes</h4>
                <textarea class="comment-input" id="new-comment" placeholder="Add a comment or note..."></textarea>
                <button class="btn btn-primary" style="margin-top: 10px;" onclick="InstructorPanel.addComment('${student.id}')">Add Comment</button>
                <div class="comments-list" id="comments-list">
        `;
        
        student.progress.comments.forEach(comment => {
            html += `
                <div class="comment-item">
                    <div>${comment.text}</div>
                    <div class="comment-date">${Utils.formatDate(comment.date)}</div>
                </div>
            `;
        });
        
        html += '</div></div>';

        content.innerHTML = html;
    };

    const renderRatingStars = (rating, skill) => {
        let html = '';
        for (let i = 1; i <= 5; i++) {
            const active = i <= rating ? 'active' : '';
            html += `<span class="star ${active}" onclick="InstructorPanel.updateRating('${currentStudent.id}', '${skill}', ${i})">★</span>`;
        }
        return html;
    };

    const updateActivity = (studentId, activity, completed) => {
        const student = Storage.getStudent(studentId);
        student.progress.activities[activity] = completed;
        Storage.updateStudent(studentId, student);
        currentStudent = student;
        Utils.showAlert('Activity updated successfully', 'success');
    };

    const updateChessSkill = (studentId, skill, completed) => {
        const student = Storage.getStudent(studentId);
        student.progress.chess[skill].completed = completed;
        Storage.updateStudent(studentId, student);
        currentStudent = student;
        Utils.showAlert('Skill status updated', 'success');
    };

    const updateRating = (studentId, skill, rating) => {
        const student = Storage.getStudent(studentId);
        student.progress.chess[skill].rating = rating;
        Storage.updateStudent(studentId, student);
        currentStudent = student;
        renderProgressContent();
        Utils.showAlert('Rating updated', 'success');
    };

    const addComment = (studentId) => {
        const commentInput = document.getElementById('new-comment');
        const text = commentInput.value.trim();
        
        if (!text) {
            Utils.showAlert('Please enter a comment', 'error');
            return;
        }

        const student = Storage.getStudent(studentId);
        student.progress.comments.push({
            date: new Date().toISOString(),
            text: text
        });
        
        Storage.updateStudent(studentId, student);
        currentStudent = student;
        commentInput.value = '';
        renderProgressContent();
        Utils.showAlert('Comment added', 'success');
    };

    const renderCategories = () => {
        const categoryList = document.getElementById('category-list');
        const categories = Storage.getCategories();
        
        categoryList.innerHTML = '';
        categories.forEach(cat => {
            const li = document.createElement('li');
            li.className = 'category-item';
            li.textContent = cat.name;
            li.style.borderLeftColor = cat.color;
            li.addEventListener('click', () => {
                document.querySelectorAll('.category-item').forEach(item => item.classList.remove('active'));
                li.classList.add('active');
                filteredStudents = allStudents.filter(s => s.category === cat.name);
                renderStudentList();
            });
            categoryList.appendChild(li);
        });
    };

    const showAddStudentModal = () => {
        // Implementation for adding new student
        const studentId = Utils.generateStudentId();
        const name = prompt('Enter student name:');
        if (!name) return;
        
        const password = prompt('Set student password:');
        if (!password) return;
        
        const category = prompt('Select category (Beginner/Intermediate/Advanced):') || 'Beginner';
        
        const newStudent = {
            id: studentId,
            name: name,
            password: password,
            category: category,
            dateAdded: new Date().toISOString(),
            progress: {
                activities: {
                    'Attended Training': false,
                    'Completed Homework': false,
                    'Participated in Tournament': false,
                    'Problem Set Complete': false,
                    'Game Analysis': false
                },
                chess: {
                    'Opening Principles': { completed: false, rating: 0 },
                    'Opening Repertoire': { completed: false, rating: 0 },
                    'Middlegame Tactics': { completed: false, rating: 0 },
                    'Middlegame Strategy': { completed: false, rating: 0 },
                    'Endgame Basics': { completed: false, rating: 0 },
                    'Endgame Techniques': { completed: false, rating: 0 },
                    'Problem Solving': { completed: false, rating: 0 },
                    'Tournament Performance': { completed: false, rating: 0 }
                },
                comments: []
            }
        };
        
        Storage.addStudent(newStudent);
        loadStudents();
        Utils.showAlert(`Student ${name} (${studentId}) added successfully!`, 'success');
    };

    return {
        init,
        updateActivity,
        updateChessSkill,
        updateRating,
        addComment
    };
})();

// Initialize on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => InstructorPanel.init());
} else {
    InstructorPanel.init();
}