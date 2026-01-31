import { Chip } from '@mui/material'
import { ACTION_STATUS_CONFIG, SENTIMENT_CONFIG } from '../../utils/constants.js'

const StatusBadge = ({ value, category = 'action', ...chipProps }) => {
  const dictionary = category === 'sentiment' ? SENTIMENT_CONFIG : ACTION_STATUS_CONFIG
  const key = value?.toUpperCase?.() || 'PENDING'
  const config = dictionary[key] || { label: value || 'Unknown', color: '#9aa7c7', background: 'rgba(154,167,199,0.18)' }

  return (
    <Chip
      label={config.label}
      size="small"
      sx={{
        bgcolor: config.background,
        color: config.color,
        fontWeight: 600,
        letterSpacing: '0.02em',
      }}
      {...chipProps}
    />
  )
}

export default StatusBadge
