import ServerErrorDisplay from './ServerErrorDisplay.vue'

export default {
    title: 'Molecules/ServerErrorDisplay',
    component: ServerErrorDisplay,
    tags: ['autodocs'],
    argTypes: {
        error: {
            control: 'object',
        },
    },
}

export const StringError = {
    args: {
        error: 'Something went wrong. Please try again.',
    },
}

export const MessageOnlyError = {
    args: {
        error: {
            message: 'The provided credentials are incorrect.',
        },
    },
}

export const WithFieldErrors = {
    args: {
        error: {
            message: 'The form contains errors.',
            errors: [
                { field: 'email', message: 'Email is already in use.' },
                { field: 'password', message: 'Password must be at least 8 characters.' },
            ],
        },
    },
}

export const SingleFieldError = {
    args: {
        error: {
            message: 'Validation failed.',
            errors: [
                { field: 'username', message: 'Username is already taken.' },
            ],
        },
    },
}

export const NoError = {
    args: {
        error: null,
    },
}