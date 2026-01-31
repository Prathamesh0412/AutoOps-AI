import { useMemo, useState } from 'react'
import { Stack, Typography, Button, Chip, Grid, Alert } from '@mui/material'
import FilterAltRoundedIcon from '@mui/icons-material/FilterAltRounded'
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded'
import Loader from '../components/common/Loader.jsx'
import ActionCard from '../components/actions/ActionCard.jsx'
import { useFetch } from '../hooks/useFetch.js'
import { getActions } from '../services/api.js'
import emptyState from '../assets/empty-state.svg'

const filters = ['ALL', 'PENDING', 'IN_PROGRESS', 'EXECUTED']

const Actions = () => {
  const { data: actions = [], loading, error, refetch } = useFetch(getActions)
  const [selectedFilter, setSelectedFilter] = useState('ALL')
  const fallbackActive = Boolean(actions?.__fallback)

  const filteredActions = useMemo(() => {
    if (selectedFilter === 'ALL') return actions
    return actions.filter((action) => action.status === selectedFilter)
  }, [actions, selectedFilter])

  if (loading) {
    return <Loader label="Loading AI-generated actions..." />
  }

  return (
    <Stack spacing={4}>
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={2}>
        <div>
          <Typography variant="h4" fontWeight={600}>
            Actions
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Every AI-recommended playbook, with human-in-the-loop approval.
          </Typography>
        </div>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" startIcon={<RefreshRoundedIcon />} onClick={refetch}>
            Refresh
          </Button>
        </Stack>
      </Stack>

      <Stack direction="row" spacing={1} flexWrap="wrap" alignItems="center">
        <Chip icon={<FilterAltRoundedIcon />} label="Filter" variant="outlined" sx={{ mr: 1 }} />
        {filters.map((filter) => (
          <Chip
            key={filter}
            label={filter}
            color={filter === selectedFilter ? 'primary' : 'default'}
            variant={filter === selectedFilter ? 'filled' : 'outlined'}
            onClick={() => setSelectedFilter(filter)}
            sx={{ borderRadius: 999 }}
          />
        ))}
      </Stack>

      {(error || fallbackActive) && (
        <Alert severity="warning" sx={{ borderRadius: 2 }}>
          Backend unreachable - showing cached sample actions.
        </Alert>
      )}

      {filteredActions.length === 0 ? (
        <Stack alignItems="center" spacing={2} py={6}>
          <img src={emptyState} alt="No actions" width={240} />
          <Typography variant="body2" color="text.secondary">
            Nothing to approve right now.
          </Typography>
        </Stack>
      ) : (
        <Grid container spacing={2.5}>
          {filteredActions.map((action) => (
            <Grid key={action.id} item xs={12} md={6}>
              <ActionCard action={action} />
            </Grid>
          ))}
        </Grid>
      )}
    </Stack>
  )
}

export default Actions
