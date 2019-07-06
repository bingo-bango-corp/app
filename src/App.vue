<template>
  <ThemeProvider :theme="$store.getters.currentTheme" id="app">
    <div id="appBackground" />
    <component mode="out-in" :is="desiredLayout">
      <transition name="fade" mode="out-in">
        <router-view/>
      </transition>
    </component>
  </ThemeProvider>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import {Route} from 'vue-router'
import layouts from '@/layouts'
import { ThemeProvider } from 'simsalabim-design'
import { setThemeColorForTheme } from '@/util/setThemeColor'
import { ensureMyJobsSynced, updateCurrentJobStore } from '@/helpers/jobs'
import store from '@/store'

@Component({
  components: {
    ThemeProvider,
    ...layouts
  }
})
export default class App extends Vue {
  async beforeCreate() {
    await ensureMyJobsSynced()
    await updateCurrentJobStore(store.getters.uid)
  }

  mounted() {
    setThemeColorForTheme(this.$store.getters.currentThemeObject)
  }

  get desiredLayout() {
    return this.$route.meta ? this.$route.meta.layout || 'plain' : 'plain'
  }
}
</script>

<style lang="sass">
body
  margin: 0
  overflow-y: scroll
  padding: 0
#app
  color: var(--foreground)
  position: fixed
  width: 100%
  height: 100%
  overflow-x: hidden
#appBackground
  z-index: -500
  position: fixed
  height: 100vh
  width: 100vw
  background: var(--background)
.fade-enter-active, .fade-leave-active
  transition: all .05s ease
.fade-enter, .fade-leave-to
  opacity: 0
</style>
