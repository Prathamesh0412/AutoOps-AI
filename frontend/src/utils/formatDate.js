const DEFAULT_OPTIONS = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
}

export const formatDate = (value, options = DEFAULT_OPTIONS) => {
  if (!value) {
    return '--'
  }
  try {
    return new Intl.DateTimeFormat('en-US', options).format(new Date(value))
  } catch (error) {
    console.warn('Unable to format date', value, error)
    return value
  }
}

export const timeAgo = (value) => {
  if (!value) {
    return 'moments ago'
  }
  const now = Date.now()
  const delta = now - new Date(value).getTime()
  const minutes = Math.floor(delta / (1000 * 60))
  if (minutes < 1) return 'moments ago'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export default formatDate
