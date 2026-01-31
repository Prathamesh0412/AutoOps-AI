import { Link as RouterLink } from 'react-router-dom'
import { Card, CardContent, Stack, Typography, Button, Chip, Divider } from '@mui/material'
import StatusBadge from '../common/StatusBadge.jsx'
import { formatDate } from '../../utils/formatDate.js'

const ActionCard = ({ action }) => (
  <Card>
    <CardContent>
      <Stack spacing={1.5}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1.5}>
          <Stack spacing={0.5}>
            <Typography variant="subtitle1" fontWeight={600}>
              {action.type}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {action.customer} | {formatDate(action.createdAt)}
            </Typography>
          </Stack>
          <StatusBadge value={action.status} />
        </Stack>

        <Typography variant="body2" color="text.secondary">
          {action.reason}
        </Typography>

        <Stack direction="row" spacing={1} flexWrap="wrap">
          {action.metrics?.exposure && <Chip label={action.metrics.exposure} size="small" />}
          {action.metrics?.riskWindow && <Chip label={`Risk window ${action.metrics.riskWindow}`} size="small" />}
          {action.metrics?.playbook && <Chip label={action.metrics.playbook} size="small" variant="outlined" />}
        </Stack>

        <Divider light sx={{ borderColor: 'rgba(15,23,42,0.08)' }} />

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} justifyContent="space-between" alignItems={{ xs: 'stretch', sm: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            Owner: {action.owner} | Impact: {action.impact}
          </Typography>
          <Button
            component={RouterLink}
            to={`/actions/${action.id}`}
            variant="contained"
            size="small"
            sx={{ alignSelf: { xs: 'flex-start', sm: 'auto' } }}
          >
            View action
          </Button>
        </Stack>
      </Stack>
    </CardContent>
  </Card>
)

export default ActionCard
