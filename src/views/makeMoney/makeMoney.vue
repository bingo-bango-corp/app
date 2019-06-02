<template>
  <div class="home">
    <div class="jobs">
      {{ $store.state.location.data.loading }}
      <div class="job" v-for="(job, index) in nearbyJobs" :key="index">
        {{ job.thing }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import Jobs from '@/classes/Jobs'

@Component
export default class makeMoney extends Vue {
  jobs = new Jobs
  
  nearbyJobs: Array<any> = []
  radius: number = .5

  loading: boolean = this.$store.getters.loading

  async mounted() {
    await this.$store.dispatch('updateLocation')
    this.updateNearbyJobs()
  }

  async updateNearbyJobs() {
    const location = this.$store.getters.currentLocation

    const nearbyJobs = await this.jobs.query(
      location[0], 
      location[1], 
      this.radius
    )
    this.nearbyJobs = nearbyJobs
  }
}
</script>

<style scoped lang="sass" src="./makeMoney.sass">