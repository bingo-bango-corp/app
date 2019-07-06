import { OPEN_STATES, SETTLED_STATES, Job } from '../models/job';

const myJobs = {
  firestorePath: 'jobs',
  firestoreRefType: 'collection',
  moduleName: 'myJobs',
  statePropName: 'data',
  namespaced: true,
  getters: {
    openJobs(state: any) {
      return Object.values(state.data).filter((j: any) => {
        return OPEN_STATES.includes(j.state)
      })
    },
    settledJobs(state: any) {
      return Object.values(state.data).filter((j: any) => {
        return SETTLED_STATES.includes(j.state)
      })
    }
  },
  sync: {
    where: [['owner.uid', '==', '{userId}']]
  }
}

export default myJobs