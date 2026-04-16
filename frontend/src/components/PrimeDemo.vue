<template>
  <div class="space-y-4">
    <Button 
      label="Japandi Button" 
      :pt="{
        root: 'px-6 py-2 rounded-sm border border-stone-300 bg-white text-stone-700 transition-all hover:bg-stone-50 hover:border-stone-900',
        label: 'font-sans text-sm font-medium uppercase tracking-wider'
      }" 
    />
    
    <div class="flex gap-4">
      <Button 
        label="Ghost Style" 
        :pt="{
          root: 'px-4 py-2 border-none bg-transparent text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-all rounded-sm'
        }" 
      />
    </div>
  </div>
</template>

<script setup>
import Button from 'primevue/button';
</script>
