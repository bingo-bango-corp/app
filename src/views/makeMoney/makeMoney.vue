<template>
  <div class="makeMoney">
    <div class="jobs">
      <JobListView :loading="loading">
        <div class="job" v-for="(job, index) in nearbyJobs" :key="index">
          <JobCard class="jobCard"
            :title="job.thing"
            :jobId="job.id"
            :description="job.description"
            :actions="jobActions"
            :distance="job.queryMetadata.distance"
            :tip="{
              cents: job.tip.cents,
              currency: job.tip.currency
            }"
            :locale="$i18n.locale"
            :collapsed="(selected != index)"
            @click.native="toggleJob(index)"
          />
        </div>
      </JobListView>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import { queryNearbyJobs, takeJob } from '@/helpers/jobs'
import JobListView from '@/components/JobListView'
import { JobCard } from 'simsalabim-design'
import { Route } from 'vue-router'
import store from '@/store'
import { mapState } from 'vuex'
import { Job } from '../../store/models/job'

Component.registerHooks([
  'beforeRouteEnter'
])

@Component({
  components: {
    JobCard,
    JobListView
  },
})
export default class makeMoney extends Vue {
  loading = false
  selected: number | null = null

  jobActions = [
    {
      title: '🤚 Pick it up',
      backgroundColor: 'var(--secondary)',
      onClick: (event: any) => {
        event.event.stopPropagation()
        this.takeJob(event.meta.jobId)
      }
    },
  ]
  
  nearbyJobs: Array<any> = []
  radius: number = 8
 
  async created() {
    this.loading = true
    await this.$store.dispatch('updateLocation')
    await this.updateNearbyJobs()
    this.loading = false
  }

  async updateNearbyJobs() {
    const location = this.$store.getters.currentLocation
    this.loading = true

    const nearbyJobs = await queryNearbyJobs(
      this.$store.getters.uid,
      location[0], 
      location[1], 
      this.radius
    )
    this.nearbyJobs = nearbyJobs

    this.loading = false
  }

  toggleJob(index: number) {
    this.selected = (this.selected === index)
      ? null
      : index
  }

  async takeJob(id: string) {
    this.loading = true
    await takeJob(this.$store.getters.uid, id)
    this.$router.push('/make-money/current-job/')
  }
}
</script>

<style scoped lang="sass" src="./makeMoney.sass">