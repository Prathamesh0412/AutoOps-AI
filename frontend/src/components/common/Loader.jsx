import { Box, CircularProgress, Typography } from '@mui/material'

const Loader = ({ label = 'Syncing live data...' }) => (
  <Box sx={{ py: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
    <CircularProgress color="primary" thickness={4} size={48} />
    <Typography variant="body2" color="text.secondary">
      {label}
    </Typography>
  </Box>
)

export default Loader
