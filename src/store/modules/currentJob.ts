const myJobs = {
  firestorePath: 'jobs/{jobID}',
  firestoreRefType: 'doc',
  moduleName: 'currentJob',
  statePropName: 'data',
  namespaced: true,
  sync: {
    preventInitialDocInsertion: true
  },
  getters: {
    job(state: any) {
      return state.data
    }
  }
}

export default myJobs