<template>
  <div class="login">
    <BingoButton :onClick="signInWithGoogle">Sign in with Google</BingoButton>
    <BingoButton :onClick="signInWithFacebook">Sign in with Facebook</BingoButton>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import firebase from 'firebase/app'
import 'firebase/auth'
import { BingoButton } from 'simsalabim-design'
import { Route } from 'vue-router'

Component.registerHooks([
  'beforeRouteEnter'
])

@Component({
  components: {
    BingoButton
  }
})
export default class BottomNav extends Vue {
  signInWithGoogle(): void {
    const provider = new firebase.auth.GoogleAuthProvider()
    firebase.auth().useDeviceLanguage()
    this.initializeAuth(provider)
  }

  signInWithFacebook(): void {
    const provider = new firebase.auth.FacebookAuthProvider()
    firebase.auth().useDeviceLanguage()
    this.initializeAuth(provider)
  }

  initializeAuth(provider: firebase.auth.FacebookAuthProvider): void {
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(async () => {
        await this.$store.dispatch('updateProfileFromFirebase')
        this.$router.push('/')
      })
      .catch(e => {
        // eslint-disable-next-line no-console
        console.error(e)
      });
  }

  beforeRouteEnter(to: Route, from: Route, next: Function) {
    next((vm: Vue) => {
      if (vm.$store.state.profile.data.loggedIn) {
        vm.$router.push('/')
      }
    })
  }
}
</script>

<style scoped lang="sass" src="./login.sass"/>