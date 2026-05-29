<template>
  <div class="space-y-2">
    <MyLabel
        v-if="label"
        :label="label"
        :html-for="id"
    />

    <MyInput
        :id="id"
        :model-value="modelValue"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :invalid="hasError"
        @update:model-value="onInput"
    />

    <MyText
        v-if="errorMessage"
        :text="errorMessage"
        size="sm"
        color="destructive"
    />

    <MyText
        v-else-if="helpText"
        :text="helpText"
        size="sm"
        color="muted"
    />
  </div>
</template>

<script>
import MyLabel from "../../atoms/Label/Label.vue";
import MyInput from "../../atoms/Input/Input.vue";
import MyText from "../../atoms/Text/Text.vue";

export default {
  name: "InputField",

  components: {
    MyLabel,
    MyInput,
    MyText,
  },

  props: {
    id: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      default: "",
    },
    modelValue: {
      type: [String, Number],
      default: "",
    },
    type: {
      type: String,
      default: "text",
      validator: (value) =>
          ["text", "email", "password", "number", "tel", "search"].includes(value),
    },
    placeholder: {
      type: String,
      default: "",
    },
    helpText: {
      type: String,
      default: "",
    },
    errorMessage: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },

  emits: ["update:modelValue"],

  computed: {
    hasError() {
      return Boolean(this.errorMessage);
    },
  },

  methods: {
    onInput(value) {
      this.$emit("update:modelValue", value);
    },
  },
};
</script>