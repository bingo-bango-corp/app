<template>
  <div class="home">
    <div class="themeSwitcher" @click="switchLight">Switch to light theme</div>
    <div class="themeSwitcher" @click="switchDark">Switch to dark theme</div>
    <div class="themeSwitcher" @click="switchInsane">Switch to insane theme</div>
  </div>
</template>

<script>
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class makeMoney extends Vue {
  switchLight() {
    this.$store.dispatch('setCurrentTheme', 'light')
  }
  switchDark() {
    this.$store.dispatch('setCurrentTheme', 'dark')
  }
  switchInsane() {
    this.$store.dispatch('setCurrentTheme', 'insane')
  }
} 
</script>

<style scoped lang="sass" src="./you.sass">