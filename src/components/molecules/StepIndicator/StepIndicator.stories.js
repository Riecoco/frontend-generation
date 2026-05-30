import StepIndicator from './StepIndicator.vue'

export default {
    title: 'Molecules/StepIndicator',
    component: StepIndicator,
    tags: ['autodocs'],
    argTypes: {
        steps: {
            control: 'object',
        },
        currentStep: {
            control: {
                type: 'number',
                min: 1,
            },
        },
    },
    args: {
        steps: ['Details', 'Confirm'],
        currentStep: 1,
    },
}

export const Default = {}

export const ConfirmStep = {
    args: {
        currentStep: 2,
    },
}