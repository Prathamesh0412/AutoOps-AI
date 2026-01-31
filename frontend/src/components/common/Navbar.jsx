import { NavLink, useLocation } from 'react-router-dom'
import {
  AppBar,
  Toolbar,
  Stack,
  Box,
  Typography,
  Button,
  Avatar,
  IconButton,
  Chip,
} from '@mui/material'
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded'
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded'
import logo from '../../assets/logo.png'

const Navbar = ({ routes = [] }) => {
  const location = useLocation()

  return (
    <AppBar position="static" elevation={0} color="transparent" sx={{ background: 'transparent', mb: 3 }}>
      <Toolbar disableGutters sx={{ justifyContent: 'space-between', gap: 3 }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box component="img" src={logo} alt="AutoOps AI" sx={{ width: 38, height: 38, borderRadius: 2 }} />
          <Box>
            <Typography variant="h6" fontWeight={600} lineHeight={1.1}>
              AutoOps AI
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Human-in-the-loop automation desk
            </Typography>
          </Box>
          <Chip
            label="Live"
            size="small"
            sx={{
              bgcolor: 'rgba(16, 185, 129, 0.15)',
              color: '#047857',
              fontWeight: 600,
              ml: 1,
            }}
          />
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" justifyContent="center">
          {routes.map((route) => {
            const isActive = location.pathname.startsWith(route.path)
            return (
              <Button
                key={route.path}
                component={NavLink}
                to={route.path}
                className="nav-pill"
                color={isActive ? 'primary' : 'inherit'}
                variant={isActive ? 'contained' : 'text'}
                sx={{ gap: 0.8, px: 2, color: isActive ? undefined : 'text.secondary' }}
              >
                {route.icon}
                {route.label}
              </Button>
            )
          })}
        </Stack>

        <Stack direction="row" spacing={1.5} alignItems="center">
          <Button
            variant="outlined"
            size="small"
            startIcon={<CalendarMonthRoundedIcon fontSize="small" />}
            sx={{ borderRadius: 2 }}
          >
            Demo script
          </Button>
          <IconButton color="primary" sx={{ bgcolor: '#edf2ff' }}>
            <NotificationsNoneRoundedIcon />
          </IconButton>
          <Avatar alt="Ops Admin" sx={{ bgcolor: '#1d4ed8', color: '#ffffff', fontWeight: 600 }}>
            AO
          </Avatar>
        </Stack>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar
