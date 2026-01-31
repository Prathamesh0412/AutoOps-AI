import { useState } from 'react'
import {
  Grid,
  Stack,
  Typography,
  TextField,
  MenuItem,
  Button,
  Alert,
  Snackbar,
  Paper,
} from '@mui/material'
import SendRoundedIcon from '@mui/icons-material/SendRounded'
import MessageCard from '../components/messages/MessageCard.jsx'
import Loader from '../components/common/Loader.jsx'
import { useFetch } from '../hooks/useFetch.js'
import { getMessages, sendMessage } from '../services/api.js'
import emptyState from '../assets/empty-state.svg'

const defaultForm = {
  customer: '',
  channel: 'Email',
  sentiment: 'NEUTRAL',
  content: '',
}

const sentimentOptions = [
  { value: 'NEGATIVE', label: 'Negative' },
  { value: 'NEUTRAL', label: 'Neutral' },
  { value: 'POSITIVE', label: 'Positive' },
]

const channelOptions = ['Email', 'Slack Connect', 'SMS', 'Ticket']

const Messages = () => {
  const { data: messages = [], loading, error, refetch, setData } = useFetch(getMessages)
  const fallbackActive = Boolean(messages?.__fallback)
  const [formState, setFormState] = useState(defaultForm)
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' })

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!formState.customer || !formState.content) {
      setToast({ open: true, severity: 'warning', message: 'Add a customer and message first.' })
      return
    }
    setSubmitting(true)
    try {
      const created = await sendMessage(formState)
      setData((prev = []) => {
        const next = [created, ...(prev ?? [])]
        if (prev?.__fallback || created?.__fallback) {
          Object.defineProperty(next, '__fallback', { value: true, enumerable: false })
        }
        return next
      })
      setFormState(defaultForm)
      setToast({ open: true, severity: 'success', message: 'Message ingested and routed.' })
      if (!created?.__fallback) {
        refetch()
      }
    } catch (submitError) {
      setToast({ open: true, severity: 'error', message: 'Unable to submit message.' })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <Loader label="Loading message stream..." />
  }

  return (
    <Stack spacing={4}>
      <Stack spacing={0.5}>
        <Typography variant="h4" fontWeight={600}>
          Messages
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Every inbound signal the AI is monitoring in real time.
        </Typography>
      </Stack>

      <Paper className="surface-blur" sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField label="Customer" name="customer" value={formState.customer} onChange={handleChange} fullWidth required />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField select label="Channel" name="channel" value={formState.channel} onChange={handleChange} fullWidth>
                {channelOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField select label="Sentiment" name="sentiment" value={formState.sentiment} onChange={handleChange} fullWidth>
                {sentimentOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={2} sx={{ display: 'flex', alignItems: 'stretch' }}>
              <Button type="submit" variant="contained" size="large" fullWidth disabled={submitting} startIcon={<SendRoundedIcon />} sx={{ borderRadius: 3 }}>
                {submitting ? 'Sending...' : 'Ingest'}
              </Button>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="What did the customer say?"
                name="content"
                value={formState.content}
                onChange={handleChange}
                placeholder="Paste transcript or summary here."
                fullWidth
                required
                multiline
                minRows={3}
              />
            </Grid>
          </Grid>
        </form>
      </Paper>

      {(error || fallbackActive) && (
        <Alert severity="warning" sx={{ borderRadius: 2 }}>
          Backend unreachable - showing cached demo data.
        </Alert>
      )}

      {messages.length === 0 ? (
        <Stack alignItems="center" spacing={2} py={6}>
          <img src={emptyState} alt="No messages" width={260} />
          <Typography variant="body2" color="text.secondary">
            No messages yet - pipe your first dataset in to light this up.
          </Typography>
        </Stack>
      ) : (
        <Grid container spacing={2.5}>
          {messages.map((message) => (
            <Grid key={message.id} item xs={12} md={6}>
              <MessageCard message={message} />
            </Grid>
          ))}
        </Grid>
      )}

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

export default Messages
