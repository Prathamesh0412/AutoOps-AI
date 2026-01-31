import { Card, CardContent, Stack, Typography, Divider } from '@mui/material'
import StatusBadge from '../common/StatusBadge.jsx'
import { formatDate, timeAgo } from '../../utils/formatDate.js'

const MessageCard = ({ message }) => (
  <Card>
    <CardContent>
      <Stack spacing={1.5}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Stack spacing={0.5}>
            <Typography variant="subtitle1" fontWeight={600}>
              {message.customer}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {message.channel} | {formatDate(message.timestamp)}
            </Typography>
          </Stack>
          <StatusBadge value={message.sentiment} category="sentiment" />
        </Stack>

        <Typography variant="body2" color="text.primary">
          "{message.content}"
        </Typography>

        <Divider light sx={{ borderColor: 'rgba(15,23,42,0.08)' }} />

        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="caption" color="text.secondary">
            Owner: {message.owner}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {timeAgo(message.timestamp)}
          </Typography>
        </Stack>
      </Stack>
    </CardContent>
  </Card>
)

export default MessageCard
