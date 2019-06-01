<template>
  <div class="home">
    <div class="jobs">
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

  async mounted() {
    this.updateNearbyJobs()
  }

  async updateNearbyJobs() {
    const nearbyJobs = await this.jobs.query(
      52.539883, 
      13.349415, 
      this.radius
    )
    this.nearbyJobs = nearbyJobs
  }
}
</script>

<style scoped lang="sass" src="./makeMoney.sass">