import { useMemo } from 'react'
import {
  Grid,
  Stack,
  Typography,
  Paper,
  Button,
  Box,
  Alert,
  Divider,
  Chip,
} from '@mui/material'
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded'
import TimelineRoundedIcon from '@mui/icons-material/TimelineRounded'
import StatCard from '../components/dashboard/StatCard.jsx'
import StatusBadge from '../components/common/StatusBadge.jsx'
import ActionCard from '../components/actions/ActionCard.jsx'
import Loader from '../components/common/Loader.jsx'
import { useFetch } from '../hooks/useFetch.js'
import { getActions, getMessages } from '../services/api.js'
import emptyState from '../assets/empty-state.svg'
import { timeAgo } from '../utils/formatDate.js'

const fetchDashboardSnapshot = async () => {
  const [messages, actions] = await Promise.all([getMessages(), getActions()])
  const atRiskMessages = messages.filter((message) => message.sentiment === 'NEGATIVE')
  const pendingActions = actions.filter((action) => action.status === 'PENDING')
  const executedActions = actions.filter((action) => action.status === 'EXECUTED')

  const snapshot = {
    metrics: [
      {
        title: 'Total messages ingested',
        value: messages.length,
        delta: '+12% vs yesterday',
        caption: 'Raw signals routed through AI parser',
      },
      {
        title: 'At-risk customers',
        value: atRiskMessages.length,
        delta: '-1 vs last sync',
        caption: 'Flagged by sentiment + payment risk',
      },
      {
        title: 'Actions awaiting approval',
        value: pendingActions.length,
        delta: '4 need review',
        caption: 'Automation paused until human sign-off',
      },
      {
        title: 'Actions executed',
        value: executedActions.length,
        delta: '+3 shipped today',
        caption: 'Completed playbooks in the last 24h',
      },
    ],
    spotlight: atRiskMessages.slice(0, 3),
    pending: pendingActions.slice(0, 3),
    messages,
    actions,
  }

  if (messages?.__fallback || actions?.__fallback) {
    Object.defineProperty(snapshot, '__fallback', { value: true, enumerable: false })
  }

  return snapshot
}

const Dashboard = () => {
  const { data, loading, error, refetch } = useFetch(fetchDashboardSnapshot)

  const metrics = useMemo(() => data?.metrics ?? [], [data])
  const spotlight = data?.spotlight ?? []
  const pending = data?.pending ?? []
  const fallbackActive = Boolean(data?.__fallback)

  if (loading) {
    return <Loader label="Aggregating command-center view..." />
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ borderRadius: 3 }}>
        Unable to load dashboard. Please refresh and confirm the backend is running.
      </Alert>
    )
  }

  return (
    <Stack spacing={4}>
      <Stack direction="row" justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} flexWrap="wrap" rowGap={2}>
        <Box>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            Command center
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Monitor signals -&gt; understand impact -&gt; approve automations in seconds.
          </Typography>
        </Box>
        <Button startIcon={<RefreshRoundedIcon />} variant="outlined" onClick={refetch}>
          Refresh data
        </Button>
      </Stack>

      {fallbackActive && (
        <Alert severity="warning" sx={{ borderRadius: 2 }}>
          Backend API is offline - rendering live demo data instead.
        </Alert>
      )}

      <Grid container spacing={2.5}>
        {metrics.map((metric) => (
          <Grid key={metric.title} item xs={12} sm={6} lg={3}>
            <StatCard {...metric} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={7}>
          <Paper className="surface-blur" sx={{ p: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
              <Stack spacing={0.5}>
                <Typography variant="h6">Signals to watch</Typography>
                <Typography variant="caption" color="text.secondary">
                  AI ranked customer tension by sentiment and payment risk.
                </Typography>
              </Stack>
              <Chip icon={<TimelineRoundedIcon />} label="Sentiment radar" variant="outlined" />
            </Stack>

            {spotlight.length === 0 ? (
              <Stack alignItems="center" spacing={2} py={4}>
                <Box component="img" src={emptyState} alt="No risk signals" sx={{ width: 220, opacity: 0.8 }} />
                <Typography variant="body2" color="text.secondary">
                  No escalations right now. AI will surface the next one automatically.
                </Typography>
              </Stack>
            ) : (
              <Stack spacing={2.5}>
                {spotlight.map((message) => (
                  <Paper key={message.id} variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2} flexWrap="wrap">
                      <Box>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {message.customer}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          "{message.content}"
                        </Typography>
                      </Box>
                      <Stack spacing={1} alignItems={{ xs: 'flex-start', sm: 'flex-end' }}>
                        <StatusBadge value={message.sentiment} category="sentiment" />
                        <Typography variant="caption" color="text.secondary">
                          Updated {timeAgo(message.timestamp)}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} lg={5}>
          <Paper className="surface-blur" sx={{ p: 3, height: '100%' }}>
            <Stack spacing={2.5} sx={{ height: '100%' }}>
              <Box>
                <Typography variant="h6">Pending actions</Typography>
                <Typography variant="caption" color="text.secondary">
                  These automations are waiting on human approval.
                </Typography>
              </Box>
              <Divider light sx={{ borderColor: 'rgba(15,23,42,0.08)' }} />
              <Stack spacing={2.5}>
                {pending.length === 0 ? (
                  <Stack alignItems="center" spacing={2} py={4}>
                    <Box component="img" src={emptyState} alt="No pending actions" sx={{ width: 200, opacity: 0.7 }} />
                    <Typography variant="body2" color="text.secondary">
                      Every action is cleared. Enjoy the calm.
                    </Typography>
                  </Stack>
                ) : (
                  pending.map((action) => <ActionCard key={action.id} action={action} />)
                )}
              </Stack>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Stack>
  )
}

export default Dashboard
