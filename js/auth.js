// Authentication system
const Auth = (() => {
    const login = (type, credentials) => {
        const data = Storage.getData();

        if (type === 'instructor') {
            const instructor = data.instructors.find(
                i => i.username === credentials.username && i.password === credentials.password
            );
            if (instructor) {
                const authData = {
                    type: 'instructor',
                    id: instructor.id,
                    username: instructor.username,
                    name: instructor.name,
                    loginTime: new Date().toISOString()
                };
                Storage.setAuth(authData);
                return { success: true, data: authData };
            }
        } else if (type === 'student') {
            const student = data.students.find(
                s => s.id === credentials.studentId && s.password === credentials.password
            );
            if (student) {
                const authData = {
                    type: 'student',
                    id: student.id,
                    name: student.name,
                    loginTime: new Date().toISOString()
                };
                Storage.setAuth(authData);
                return { success: true, data: authData };
            }
        }

        return { success: false, message: 'Invalid credentials' };
    };

    const logout = () => {
        Storage.clearAuth();
    };

    const isAuthenticated = () => {
        return Storage.getAuth() !== null;
    };

    const getCurrentUser = () => {
        return Storage.getAuth();
    };

    const isInstructor = () => {
        const auth = Storage.getAuth();
        return auth && auth.type === 'instructor';
    };

    const isStudent = () => {
        const auth = Storage.getAuth();
        return auth && auth.type === 'student';
    };

    return {
        login,
        logout,
        isAuthenticated,
        getCurrentUser,
        isInstructor,
        isStudent
    };
})();
