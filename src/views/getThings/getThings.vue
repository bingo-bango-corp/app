<template>
  <div class="getThings">
    <BingoButton class="newRequestButton" :onClick="handleNewClick">{{ $t('getThings.newRequest') }}</BingoButton>
    <div class="yourJobs">
      <JobListView :loading="loading">
        <div class="job" v-for="(job, index) in myJobs" :key="index">
          <Card class="jobCard">
            <h2 class="thing">{{ job.thing }}</h2>
            <h3 class="description">{{ job.description }}</h3>
          </Card>
        </div>
      </JobListView>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import Jobs, { JobList } from '@/classes/Jobs'
import JobListView from '@/components/JobListView'
import { BingoButton, Card } from 'simsalabim-design'

@Component({
  components: {
    BingoButton,
    Card,
    JobListView
  }
})
export default class getThings extends Vue {
  jobs = new Jobs
  myJobs: JobList = []
  loading: boolean = true

  handleNewClick() {
    this.$router.push('get-things/new')
  }

  async mounted() {
    this.loading = true
    this.myJobs = await this.jobs.getOwn()
    this.loading = false
  }
} 
</script>

<style scoped lang="sass" src="./getThings.sass">