import axios from 'axios'
import { API_ENDPOINTS } from './endpoints.js'
import { SAMPLE_ACTIONS, SAMPLE_MESSAGES } from '../utils/constants.js'

const fallbackBaseUrl = 'http://localhost:8080'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || fallbackBaseUrl,
  timeout: 15000,
})

const createId = () => (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}`)

const safeRequest = async (requestFn, fallbackValue) => {
  try {
    const response = await requestFn()
    return response.data
  } catch (error) {
    console.warn('API request failed, falling back to sample data', error)
    const fallbackData = typeof fallbackValue === 'function' ? fallbackValue(error) : fallbackValue
    if (fallbackData && typeof fallbackData === 'object') {
      Object.defineProperty(fallbackData, '__fallback', {
        value: true,
        enumerable: false,
      })
    }
    return fallbackData
  }
}

export const getMessages = () => safeRequest(() => apiClient.get(API_ENDPOINTS.messages), SAMPLE_MESSAGES)

export const sendMessage = (payload) =>
  safeRequest(() => apiClient.post(API_ENDPOINTS.messages, payload), () => ({
    ...payload,
    id: createId(),
    timestamp: new Date().toISOString(),
    sentiment: payload.sentiment || 'NEUTRAL',
  }))

export const getActions = () => safeRequest(() => apiClient.get(API_ENDPOINTS.actions), SAMPLE_ACTIONS)

export const getActionById = (id) =>
  safeRequest(
    () => apiClient.get(API_ENDPOINTS.actionById(id)),
    () => SAMPLE_ACTIONS.find((action) => action.id === id) || null,
  )

export const approveAction = (id, payload = {}) =>
  safeRequest(
    () => apiClient.post(API_ENDPOINTS.approveAction(id), payload),
    () => {
      const baseAction = SAMPLE_ACTIONS.find((action) => action.id === id)
      if (!baseAction) return null
      return {
        ...baseAction,
        status: 'EXECUTED',
        approvedAt: new Date().toISOString(),
        draft: payload.draft ?? baseAction.draft,
      }
    },
  )

export { apiClient }
