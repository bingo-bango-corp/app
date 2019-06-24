<template>
  <div class="getThings">
    <BingoButton class="newRequestButton" @clicked="handleNewClick">{{ $t('getThings.newRequest') }}</BingoButton>
    <div class="yourJobs">
      <JobListView :loading="loading">
        <div class="open" v-if="openJobs.length > 0">
          <h3>Current Jobs</h3>
          <div class="job" v-for="(job) in openJobs" :key="job.id">
            <JobCardWithActions
              :title="job.thing"
              :description="job.description"
              :jobId="job.id"
              :tip="job.tip"
              :state="job.state"
              :job="job"
              @cancelJob="handleCancelJob($event)"
              @confirmDelivery="handleConfirmDelivery($event)"
              @goToChat="handleGoToChat($event)"
            />
          </div>
        </div>
        <div class="settled" v-if="settledJobs.length > 0">
          <h3>Past Jobs</h3>
          <div class="job" v-for="(job) in settledJobs" :key="job.id">
            <JobCardWithActions
              :title="job.thing"
              :description="job.description"
              :jobId="job.id"
              :tip="job.tip"
              :state="job.state"
              :job="job"
            />
          </div>
        </div>
      </JobListView>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { 
  getOwnJobs,
  JobList,
  cancelJob,
  confirmDelivery
} from '@/helpers/jobs'
import JobListView from '@/components/JobListView'
import router from '@/router'
import JobCardWithActions from '@/components/JobCardWithActions'
import { BingoButton } from 'simsalabim-design'
import { Job, OPEN_STATES, SETTLED_STATES, State } from '../../store/models/job'

@Component({
  components: {
    BingoButton,
    JobListView,
    JobCardWithActions
  }
})
export default class getThings extends Vue {
  myJobs: Job[] = []
  loading: boolean = true

  handleNewClick(): void {
    this.$router.push('get-things/new')
  }

  handleGoToChat(id: string): void {
    this.$router.push(`/get-things/${id}`)
  }

  get openJobs(): Job[] {
    return this.myJobs.filter((j: Job) => {
      return OPEN_STATES.includes(j.state)
    })
  }

  get settledJobs(): Job[] {
    return this.myJobs.filter((j: Job) => {
      return SETTLED_STATES.includes(j.state)
    })
  }

  jobArrayFromJobList(jobList: JobList): Array<Job> {
    return Object.keys(jobList).map((k) => {
      return {
        id: k,
        ...jobList[k]
      }
    })
  }

  async handleCancelJob(id: string): Promise<void> {
    this.loading = true
    await cancelJob(id, this.$store.getters.uid)
    this.updateJobs()
  }

  async handleConfirmDelivery(id: string): Promise<void> {
    this.loading = true
    await confirmDelivery(id, this.$store.getters.uid)
    this.updateJobs()
  }

  async updateJobs(): Promise<void> {
    this.loading = true
    this.myJobs = this.jobArrayFromJobList(await getOwnJobs(this.$store.getters.uid))
    this.loading = false
  }

  async mounted(): Promise<void> {
    await this.updateJobs()
  }
} 
</script>

<style scoped lang="sass" src="./getThings.sass">