<template>
  <div class="home">
    <div class="jobs">
      <JobListView :loading="loading">
        <div class="job" v-for="(job, index) in nearbyJobs" :key="index">
          <JobCard class="jobCard"
            :title="job.thing"
            :description="job.description"
            :actions="null"
            :distance="job.queryMetadata.distance"
            :tip="{
              cents: job.tip.cents,
              currency: job.tip.currency
            }"
            :locale="$i18n.locale"
          />
        </div>
      </JobListView>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import Jobs from '@/classes/Jobs'
import JobListView from '@/components/JobListView'
import { JobCard } from 'simsalabim-design'

@Component({
  components: {
    JobCard,
    JobListView
  }
})
export default class makeMoney extends Vue {
  jobs = new Jobs
  loading = false
  
  nearbyJobs: Array<any> = []
  radius: number = .5

  async mounted() {
    this.loading = true
    await this.$store.dispatch('updateLocation')
    await this.updateNearbyJobs()
    this.loading = false
  }

  async updateNearbyJobs() {
    const location = this.$store.getters.currentLocation
    this.loading = true

    const nearbyJobs = await this.jobs.query(
      location[0], 
      location[1], 
      this.radius
    )
    this.nearbyJobs = nearbyJobs

    this.loading = false
  }
}
</script>

<style scoped lang="sass" src="./makeMoney.sass">