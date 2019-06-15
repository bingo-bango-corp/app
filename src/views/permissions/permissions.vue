<template>
  <div class="permissions">
    <stub
      :headline="currentPermissionConfig.headline"
      :description="currentPermissionConfig.description"
      :pemFunction="handleShowPermissionDialog"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import Stub from './stub'
import setUpNotifications from '@/util/setUpNotifications'

@Component({
  components: {
    Stub
  }
})
export default class Permissions extends Vue {
  config: {
    [key: string] : {
      headline: string
      description: string
      pemFunction: Function
    }
  } = {
    location: {
      headline: 'Please let us know your location',
      description: 'We need it',
      pemFunction: async (next: Function) => {
        const request = await this.$store.dispatch('updateLocation')
        next()
      }
    },
    notifications: {
      headline: 'we need to send you notifications',
      description: 'We need it',
      pemFunction: async (next: Function) => {
        const request = await setUpNotifications(this.$store.getters.publicProfile.uid)
        next()
      }
    }
  }

  currentIndex: number = 0

  async beforeCreate() {
    if (this.$store.getters['permissions/allGranted']) this.$router.push('/')
  }

  get requiredPermissions(): Array<Array<string>> {
    return Object.entries({
      location: this.$store.state.permissions.data.location,
      notifications: this.$store.state.permissions.data.notifications
    }).filter(a => a[1] !== 'granted')
  }

  get currentPermission(): string {
    return this.requiredPermissions[this.currentIndex][0]
  }

  get currentPermissionConfig(): Object {
    return this.config[this.currentPermission]
  }

  handleShowPermissionDialog() {
    this.config[this.currentPermission].pemFunction(this.next)
  }

  next() {
    if ((this.currentIndex + 1) === this.requiredPermissions.length) {
      this.done()
    } else {
      this.currentIndex++
    }
  }

  async done() {
    await this.$store.dispatch('permissions/updatePermissions')
    this.$router.push('/')
  }
}
</script>

<style scoped lang="sass" src="./permissions.sass">
