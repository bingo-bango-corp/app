<template>
  <div class="plain">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
@Component
export default class Plain extends Vue {}
</script>

<style lang="sass" scoped src="./plain.sass"/>
