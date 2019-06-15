const chat = {
  firestorePath: 'jobs/{jobID}/chat',
  firestoreRefType: 'collection',
  moduleName: 'chat',
  statePropName: 'data',
  namespaced: true,
  getters: {
    messages: (state: any) => {
      return Object.values(state.data).filter((d: any) => {
        return d.id !== 'typing'
      }).sort((a: any, b: any) => {
        return a.seconds - b.seconds
      })
    },
    typing: (state: any) => {
      return state.data.typing
    }
  },
  sync: {
    orderBy: ['seconds'],
    guard: ['created_at', 'updated_at']
  }
}

export default chat