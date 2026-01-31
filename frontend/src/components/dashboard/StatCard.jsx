import { Card, CardContent, Stack, Typography, Avatar } from '@mui/material'
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded'
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded'

const StatCard = ({ title, value, delta, trend = 'up', caption }) => {
  const TrendIcon = trend === 'down' ? TrendingDownRoundedIcon : TrendingUpRoundedIcon
  const trendColor = trend === 'down' ? '#d92d20' : '#12b76a'
  const trendBackground = trend === 'down' ? 'rgba(217, 45, 32, 0.12)' : 'rgba(18, 183, 106, 0.12)'

  return (
    <Card>
      <CardContent>
        <Stack spacing={1.5}>
          <Typography variant="caption" color="text.secondary">
            {title}
          </Typography>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Typography variant="h4" component="p">
              {value}
            </Typography>
            {delta && (
              <Stack direction="row" spacing={1} alignItems="center">
                <Avatar sx={{ bgcolor: trendBackground, width: 32, height: 32 }}>
                  <TrendIcon sx={{ color: trendColor, fontSize: 18 }} />
                </Avatar>
                <Typography variant="body2" color={trendColor}>
                  {delta}
                </Typography>
              </Stack>
            )}
          </Stack>
          {caption && (
            <Typography variant="caption" color="text.secondary">
              {caption}
            </Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  )
}

export default StatCard
