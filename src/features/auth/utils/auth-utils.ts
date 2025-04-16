export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
    return password.length >= 6; // Example: Password must be at least 6 characters
};

export const hashPassword = async (password: string): Promise<string> => {
    const bcrypt = await import('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

export const comparePasswords = async (password: string, hashedPassword: string): Promise<boolean> => {
    const bcrypt = await import('bcryptjs');
    return await bcrypt.compare(password, hashedPassword);
};