<template>
  <Badge
      :variant="statusConfig.variant"
      size="large"
  >
    <component :is="statusConfig.icon" />
    {{ statusConfig.label }}
  </Badge>
</template>

<script setup>
import { computed } from "vue";
import { CircleCheck, Clock, CircleX } from "lucide-vue-next";
import Badge from "../../atoms/Badge/Badge.vue";

const props = defineProps({
  status: {
    type: String,
    required: true,
    validator: (value) =>
        ["PENDING", "APPROVED", "DENIED"].includes(value),
  },
});

const statusMap = {
  APPROVED: {
    label: "Approved",
    variant: "success",
    icon: CircleCheck,
  },
  PENDING: {
    label: "Pending",
    variant: "warning",
    icon: Clock,
  },
  DENIED: {
    label: "Denied",
    variant: "danger",
    icon: CircleX,
  },
};

const statusConfig = computed(() => statusMap[props.status]);
</script>