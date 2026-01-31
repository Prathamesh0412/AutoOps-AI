import {
  Box,
  Paper,
  Stack,
  Typography,
  Divider,
  LinearProgress,
  Chip,
  Avatar,
} from '@mui/material'
import RadarIcon from '@mui/icons-material/Radar'
import TimelineRoundedIcon from '@mui/icons-material/TimelineRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import { LIVE_METRICS, WATCHERS } from '../../utils/constants.js'

const Sidebar = () => (
  <Paper className="surface-blur" sx={{ p: 3 }}>
    <Stack spacing={3}>
      <Stack direction="row" spacing={1.5} alignItems="center">
        <Avatar sx={{ bgcolor: 'rgba(29, 78, 216, 0.12)', color: '#1d4ed8' }}>
          <RadarIcon />
        </Avatar>
        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            Live stream
          </Typography>
          <Typography variant="h6">Ops signal intake</Typography>
        </Box>
      </Stack>

      <Divider flexItem light sx={{ borderColor: 'rgba(15,23,42,0.08)' }} />

      <Stack spacing={2.4}>
        {LIVE_METRICS.map((metric) => (
          <Box key={metric.label}>
            <Typography variant="caption" color="text.secondary">
              {metric.label}
            </Typography>
            <Stack direction="row" justifyContent="space-between" alignItems="baseline">
              <Typography variant="h5">{metric.value}</Typography>
              <Typography variant="caption" color="success.light">
                {metric.delta}
              </Typography>
            </Stack>
          </Box>
        ))}
      </Stack>

      <Divider flexItem light sx={{ borderColor: 'rgba(15,23,42,0.08)' }} />

      <Stack spacing={1}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle2" color="text.secondary">
            Decision confidence
          </Typography>
          <Chip label="87%" size="small" color="primary" sx={{ fontWeight: 600 }} />
        </Stack>
        <LinearProgress variant="determinate" value={87} sx={{ borderRadius: 999, height: 6 }} />
        <Typography variant="caption" color="text.secondary">
          AI is routing playbooks with high confidence
        </Typography>
      </Stack>

      <Divider flexItem light sx={{ borderColor: 'rgba(15,23,42,0.08)' }} />

      <Stack spacing={1.5}>
        <Stack direction="row" spacing={1} alignItems="center">
          <TimelineRoundedIcon fontSize="small" color="primary" />
          <Typography variant="subtitle2" color="text.secondary">
            Watchlist
          </Typography>
        </Stack>
        <Stack spacing={1.2}>
          {WATCHERS.map((item) => (
            <Stack
              key={item.label}
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{
                p: 1.2,
                borderRadius: 2,
                bgcolor: 'rgba(15, 23, 42, 0.04)',
                border: '1px solid rgba(15,23,42,0.08)',
              }}
            >
              <Box>
                <Typography variant="body2">{item.label}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {item.detail}
                </Typography>
              </Box>
              <CheckCircleRoundedIcon fontSize="small" color="success" />
            </Stack>
          ))}
        </Stack>
      </Stack>
    </Stack>
  </Paper>
)

export default Sidebar
