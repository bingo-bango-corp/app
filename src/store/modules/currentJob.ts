const myJobs = {
  firestorePath: 'jobs/{jobID}',
  firestoreRefType: 'doc',
  moduleName: 'currentJob',
  statePropName: 'data',
  namespaced: true,
  sync: {
    preventInitialDocInsertion: true
  }
}

export default myJobs