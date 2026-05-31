<template>
  <div class="space-y-2">
    <Label
        v-if="label"
        :label="label"
        :html-for="id"
    />

    <Input
        :id="id"
        :model-value="modelValue"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :invalid="hasError"
        @update:model-value="onInput"
    />

    <Text
        v-if="errorMessage"
        size="sm"
        color="destructive"
    >
      {{ errorMessage }}
    </Text>

    <Text
        v-else-if="helpText"
        size="sm"
        color="muted"
    >
      {{ helpText }}
    </Text>
  </div>
</template>

<script>
import { Label, Input, Text } from '../../atoms'

export default {
  name: 'InputField',

  components: {
    Label,
    Input,
    Text,
  },

  props: {
    id: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      default: '',
    },
    modelValue: {
      type: [String, Number],
      default: '',
    },
    type: {
      type: String,
      default: 'text',
      validator: (value) =>
          ['text', 'email', 'password', 'number', 'tel', 'search'].includes(value),
    },
    placeholder: {
      type: String,
      default: '',
    },
    helpText: {
      type: String,
      default: '',
    },
    errorMessage: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['update:modelValue'],

  computed: {
    hasError() {
      return Boolean(this.errorMessage)
    },
  },

  methods: {
    onInput(value) {
      this.$emit('update:modelValue', value)
    },
  },
}
</script>