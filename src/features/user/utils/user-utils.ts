// This file contains shared utility functions for user management.

export const formatUserName = (firstName: string, lastName: string): string => {
    return `${firstName} ${lastName}`;
};

export const isEmailValid = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const getUserInitials = (firstName: string, lastName: string): string => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};