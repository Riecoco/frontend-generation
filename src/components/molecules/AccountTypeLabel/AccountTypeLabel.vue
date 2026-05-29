<template>
  <div :class="classes">
    <component :is="typeConfig.icon" class="size-4" />

    <MyText
        :text="typeConfig.label"
        as="span"
        size="sm"
        weight="bold"
        :color="typeConfig.color"
    />
  </div>
</template>

<script setup>
import { computed } from "vue";
import { PiggyBank, Wallet } from "lucide-vue-next";
import MyText from "../../atoms/Text/Text.vue";

const props = defineProps({
  accountType: {
    type: String,
    required: true,
    validator: (value) => ["CHECKING", "SAVINGS"].includes(value),
  },
});

const typeMap = {
  CHECKING: {
    label: "CHECKING",
    color: "primary",
    colorClass: "text-primary",
    icon: Wallet,
  },
  SAVINGS: {
    label: "SAVINGS",
    color: "success",
    colorClass: "text-success",
    icon: PiggyBank,
  },
};

const typeConfig = computed(() => typeMap[props.accountType]);

const classes = computed(() => [
  "inline-flex items-center justify-center gap-2 uppercase tracking-wider",
  typeConfig.value.colorClass,
]);
</script>