<template>
  <div :class="wrapperClasses">
    <component
        :is="variantConfig.icon"
        :class="iconClasses"
    />
  </div>
</template>

<script setup>
import { computed } from "vue";
import {
  ArrowDownLeft,
  ArrowUpRight,
  ArrowLeftRight,
} from "lucide-vue-next";

const props = defineProps({
  variant: {
    type: String,
    default: "neutral",
    validator: (value) =>
        ["positive", "negative", "neutral"].includes(value),
  },
});

const variantMap = {
  positive: {
    icon: ArrowDownLeft,
    wrapperClasses: "bg-success/10",
    iconClasses: "text-success",
  },
  negative: {
    icon: ArrowUpRight,
    wrapperClasses: "bg-destructive/10",
    iconClasses: "text-destructive",
  },
  neutral: {
    icon: ArrowLeftRight,
    wrapperClasses: "bg-primary/10",
    iconClasses: "text-primary",
  },
};

const variantConfig = computed(() => variantMap[props.variant]);

const wrapperClasses = computed(() => [
  "inline-flex shrink-0 items-center justify-center rounded-2xl p-3",
  variantConfig.value.wrapperClasses,
]);

const iconClasses = computed(() => [
  "h-5 w-5",
  variantConfig.value.iconClasses,
]);

</script>