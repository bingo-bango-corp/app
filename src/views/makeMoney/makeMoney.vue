<template>
  <div class="makeMoney">
    <div class="jobs">
      <HeadlineContentPair
        headline=""
        description="Nearby Requests"
        refreshButton
        :loading="loading"
        @refreshButtonClicked="updateNearbyJobs"
      >
        <JobListView :loading="loading">
          <div class="job" v-for="(job, index) in nearbyJobs" :key="job.id">
            <JobCardWithActions
              :title="job.thing"
              :description="job.description"
              :jobId="job.id"
              :tip="job.tip"
              :state="job.state"
              :job="job"
              :collapsed="selected !== index"
              role="assignee"
              @click.native="toggleJob(index)"
              @shouldGoToLoading="handleShouldGoToLoading()"
              @shouldUpdateJobs="handleShouldUpdateJobs()"
              :actionsDisabled="shouldActionsBeDisabled"
            />
          </div>
        </JobListView>
      </HeadlineContentPair>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import { queryNearbyJobs, takeJob } from '@/helpers/jobs'
import JobListView from '@/components/JobListView'
import JobCardWithActions from '@/components/JobCardWithActions'
import { HeadlineContentPair } from 'simsalabim-design'
import { Route } from 'vue-router'
import store from '@/store'
import { mapState } from 'vuex'
import { Job } from '../../store/models/job'

Component.registerHooks([
  'beforeRouteEnter'
])

@Component({
  components: {
    HeadlineContentPair,
    JobCardWithActions,
    JobListView
  },
})
export default class makeMoney extends Vue {
  loading = false
  selected: number | null = null

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

  get shouldActionsBeDisabled(): boolean {
    return this.$store.getters['currentJob/exists']
  }

  toggleJob(index: number) {
    this.selected = this.selected === index
      ? null
      : index
  }

  handleShouldGoToLoading(): void {
    this.loading = true
  }

  handleShouldUpdateJobs(): void {
    this.updateNearbyJobs()
  }
}
</script>

<style scoped lang="sass" src="./makeMoney.sass">