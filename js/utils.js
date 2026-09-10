// Utility functions
const Utils = (() => {
    const showAlert = (message, type = 'info') => {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type}`;
        alertDiv.textContent = message;
        
        const container = document.body;
        container.insertBefore(alertDiv, container.firstChild);
        
        setTimeout(() => alertDiv.remove(), 4000);
    };

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const generateStudentId = () => {
        const data = Storage.getData();
        const maxId = Math.max(...data.students.map(s => parseInt(s.id.replace('STU', ''))), 0);
        return `STU${String(maxId + 1).padStart(3, '0')}`;
    };

    const getRatingStars = (rating) => {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            stars += i <= rating ? '★' : '☆';
        }
        return stars;
    };

    const getCategoryColor = (categoryName) => {
        const categories = Storage.getCategories();
        const category = categories.find(c => c.name === categoryName);
        return category ? category.color : '#95a5a6';
    };

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const sanitizeInput = (input) => {
        const textarea = document.createElement('textarea');
        textarea.textContent = input;
        return textarea.innerHTML;
    };

    return {
        showAlert,
        formatDate,
        generateStudentId,
        getRatingStars,
        getCategoryColor,
        validateEmail,
        sanitizeInput
    };
})();
