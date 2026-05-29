import { fn } from "storybook/test";

import MyButton from "./Button.vue";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
  title: "Atoms/Button",
  component: MyButton,
  tags: ["autodocs"],
  argTypes: {
    label: {
      control: "text",
    },
    primary: {
      control: "boolean",
    },
    variant: {
      control: { type: "select" },
      options: [null, "default", "destructive", "outline", "secondary", "ghost", "link"],
    },
    size: {
      control: { type: "select" },
      options: ["small", "medium", "large"],
    },
    backgroundColor: { control: "color" },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#story-args
  args: {
    label: "Button",
    primary: false,
    variant: null,
    size: "medium",
    backgroundColor: null,
    onClick: fn(),
  },
};

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary = {
  args: {
    variant: "default",
    label: "Button",
  },
};

export const Secondary = {
  args: {
    variant: "secondary",
    label: "Button",
  },
};

export const Large = {
  args: {
    ...Primary.args,
    size: "large",
    label: "Button",
  },
};

export const Small = {
  args: {
    ...Primary.args,
    size: "small",
    label: "Button",
  },
};

export const Outline = {
  args: {
    variant: "outline",
    label: "Cancel",
  },
};

export const Destructive = {
  args: {
    variant: "destructive",
    label: "Delete",
  },
};

export const Ghost = {
  args: {
    variant: "ghost",
    label: "Ghost",
  },
};

export const Link = {
  args: {
    variant: "link",
    label: "Link",
  },
};
