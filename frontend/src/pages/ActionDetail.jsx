import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Stack,
  Typography,
  Button,
  Paper,
  Alert,
  Snackbar,
  Grid,
  Chip,
  TextField,
} from '@mui/material'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import Loader from '../components/common/Loader.jsx'
import StatusBadge from '../components/common/StatusBadge.jsx'
import { useFetch } from '../hooks/useFetch.js'
import { approveAction, getActionById } from '../services/api.js'
import { formatDate } from '../utils/formatDate.js'

const ActionDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [draft, setDraft] = useState('')
  const [approving, setApproving] = useState(false)
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' })

  const fetchAction = useCallback(() => getActionById(id), [id])
  const { data: action, loading, error, refetch, setData } = useFetch(fetchAction, { immediate: Boolean(id) })

  useEffect(() => {
    if (action?.draft) {
      setDraft(action.draft)
    }
  }, [action])

  const fallbackActive = Boolean(action?.__fallback)

  const handleApprove = async () => {
    setApproving(true)
    try {
      const updated = await approveAction(id, { draft })
      if (updated) {
        setData(updated)
        setToast({ open: true, severity: 'success', message: 'Action approved and executed.' })
      } else {
        setToast({ open: true, severity: 'warning', message: 'Action not found.' })
      }
    } catch (approveError) {
      setToast({ open: true, severity: 'error', message: 'Approval failed.' })
    } finally {
      setApproving(false)
      refetch()
    }
  }

  if (loading) {
    return <Loader label="Loading action detail..." />
  }

  if (error) {
    return (
      <Alert severity="warning" sx={{ borderRadius: 2 }}>
        Unable to reach the backend. Showing cached sample data.
      </Alert>
    )
  }

  if (!action && !loading) {
    return (
      <Alert severity="warning" sx={{ borderRadius: 2 }}>
        Action not found. Please return to the action list.
      </Alert>
    )
  }

  return (
    <Stack spacing={3}>
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={2}>
        <Stack spacing={1}>
          <Button startIcon={<ArrowBackRoundedIcon />} onClick={() => navigate('/actions')} sx={{ alignSelf: 'flex-start' }}>
            Back to actions
          </Button>
          <Typography variant="h4" fontWeight={600}>
            {action.type}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {action.reason}
          </Typography>
        </Stack>
        <Stack spacing={1} alignItems={{ xs: 'flex-start', md: 'flex-end' }}>
          <StatusBadge value={action.status} />
          <Typography variant="caption" color="text.secondary">
            Created {formatDate(action.createdAt)}
          </Typography>
        </Stack>
      </Stack>

      {fallbackActive && (
        <Alert severity="info" sx={{ borderRadius: 2 }}>
          Working against demo data because the backend is offline.
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Paper className="surface-blur" sx={{ p: 3 }}>
            <Stack spacing={2.5}>
              <Typography variant="h6">AI explanation</Typography>
              <Typography variant="body1" color="text.secondary">
                {action.summary}
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {action.metrics?.exposure && <Chip label={`Exposure ${action.metrics.exposure}`} />}
                {action.metrics?.riskWindow && <Chip label={`Risk window ${action.metrics.riskWindow}`} />}
                {action.metrics?.playbook && <Chip label={action.metrics.playbook} variant="outlined" />}
              </Stack>
              <TextField
                label="Draft message / runbook"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                multiline
                minRows={5}
                fullWidth
              />
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<CheckRoundedIcon />}
                  onClick={handleApprove}
                  disabled={approving}
                >
                  {approving ? 'Approving...' : 'Approve & execute'}
                </Button>
                <Button variant="outlined" onClick={refetch} disabled={approving}>
                  Re-run AI summary
                </Button>
              </Stack>
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper className="surface-blur" sx={{ p: 3 }}>
            <Stack spacing={2}>
              <Typography variant="h6">Metadata</Typography>
              <Stack spacing={1.2}>
                <Typography variant="body2">Customer: {action.customer}</Typography>
                <Typography variant="body2">Owner: {action.owner}</Typography>
                <Typography variant="body2">Impact: {action.impact}</Typography>
              </Stack>
              <Alert severity="info" icon={<CheckRoundedIcon fontSize="small" />} sx={{ borderRadius: 2 }}>
                Approval locks in automation and posts an update back to the source channel.
              </Alert>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          severity={toast.severity}
          variant="filled"
          onClose={() => setToast((prev) => ({ ...prev, open: false }))}
          sx={{ width: '100%' }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Stack>
  )
}

export default ActionDetail
