export const API_ENDPOINTS = {
  messages: '/messages',
  actions: '/actions',
  actionById: (id) => `/actions/${id}`,
  approveAction: (id) => `/actions/${id}/approve`,
}

export default API_ENDPOINTS
