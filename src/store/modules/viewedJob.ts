const viewedJob = {
  firestorePath: 'jobs/{jobID}',
  firestoreRefType: 'doc',
  moduleName: 'viewedJob',
  statePropName: 'data',
  namespaced: true,
  sync: {
    preventInitialDocInsertion: true
  }
}

export default viewedJob