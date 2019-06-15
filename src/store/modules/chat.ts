const chat = {
  firestorePath: 'jobs/{jobID}/chat',
  firestoreRefType: 'collection',
  moduleName: 'chat',
  statePropName: 'data',
  namespaced: true,
  getters: {
    messages: (state: any) => {
      return Object.values(state.data).sort((a: any, b: any) => {
        return a.created_at.seconds - b.created_at.seconds
      }).filter((d: any) => {
        return d.id !== 'typing'
      })
    },
    typing: (state: any) => {
      return state.data.typing
    }
  },
  sync: {
    guard: ['created_at', 'updated_at']
  }
}

export default chat