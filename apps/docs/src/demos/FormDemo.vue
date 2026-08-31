<script setup lang="ts">
import { reactive, ref } from 'vue'

const formRef = ref<{ validate: () => boolean; resetFields: () => void }>()
const submitted = ref('')

const model = reactive({
  name: '',
  city: 'vue',
  agree: true
})

const rules = {
  name: [{ required: true, message: '请输入姓名' }],
  city: [{ required: true, message: '请选择城市' }]
}

const submit = () => {
  submitted.value = formRef.value?.validate() ? '校验通过' : '请检查表单'
}
</script>

<template>
  <div class="demo">
    <wt-form
      ref="formRef"
      v-model="model"
      :rules="rules"
      label-position="left"
      label-width="90px"
      @submit.prevent="submit"
    >
      <wt-form-item label="姓名" prop="name" required>
        <wt-input v-model="model.name" placeholder="请输入姓名" />
      </wt-form-item>

      <wt-form-item label="城市" prop="city" required>
        <wt-select v-model="model.city" :options="[
          { label: 'Vue 3', value: 'vue' },
          { label: 'React', value: 'react' },
          { label: 'Svelte', value: 'svelte' }
        ]" />
      </wt-form-item>

      <wt-form-item label="同意" prop="agree">
        <wt-checkbox v-model="model.agree">同意当前条款</wt-checkbox>
      </wt-form-item>

      <wt-space>
        <wt-button type="primary" @click="submit">提交</wt-button>
        <wt-button @click="formRef?.resetFields()">重置</wt-button>
      </wt-space>
    </wt-form>

    <wt-text v-if="submitted" type="secondary" block>{{ submitted }}</wt-text>
  </div>
</template>

<style scoped>
.demo { max-width: 520px; }
</style>
