import InsightsRoundedIcon from '@mui/icons-material/InsightsRounded'
import ForumRoundedIcon from '@mui/icons-material/ForumRounded'
import RuleFolderRoundedIcon from '@mui/icons-material/RuleFolderRounded'
import Dashboard from './pages/Dashboard.jsx'
import Messages from './pages/Messages.jsx'
import Actions from './pages/Actions.jsx'
import ActionDetail from './pages/ActionDetail.jsx'

export const appRoutes = [
  {
    path: '/dashboard',
    label: 'Dashboard',
    description: 'Risk radar & KPIs',
    element: <Dashboard />,
    icon: <InsightsRoundedIcon fontSize="small" />, 
    showInNav: true,
  },
  {
    path: '/messages',
    label: 'Messages',
    description: 'Data ingestion log',
    element: <Messages />,
    icon: <ForumRoundedIcon fontSize="small" />, 
    showInNav: true,
  },
  {
    path: '/actions',
    label: 'Actions',
    description: 'AI playbooks',
    element: <Actions />,
    icon: <RuleFolderRoundedIcon fontSize="small" />, 
    showInNav: true,
  },
  {
    path: '/actions/:id',
    label: 'Action Detail',
    element: <ActionDetail />,
    showInNav: false,
  },
]
