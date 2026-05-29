import MyLabel from "./Label.vue";

export default {
    title: "Atoms/Label",
    component: MyLabel,
    tags: ["autodocs"],
    argTypes: {
        label: {
            control: "text",
        },
        htmlFor: {
            control: "text",
        },
    },
    args: {
        label: "Email address",
        htmlFor: "email",
    },
};

export const Default = {
    args: {
        label: "Email address",
        htmlFor: "email",
    },
};

export const Password = {
    args: {
        label: "Password",
        htmlFor: "password",
    },
};