import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AppBar as MuiAppBar,
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  CssBaseline,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  InputBase,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Toolbar,
  Typography,
  Tooltip,
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import useMediaQuery from '@mui/material/useMediaQuery';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import CookieOutlinedIcon from '@mui/icons-material/CookieOutlined';
import CakeOutlinedIcon from '@mui/icons-material/CakeOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import PointOfSaleOutlinedIcon from '@mui/icons-material/PointOfSaleOutlined';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { Link, Navigate, Outlet, useLocation, useNavigate, matchPath } from 'react-router-dom';

import { getCurrentUser, isTokenValid, logout as doLogout } from '../utils/auth';

const drawerWidth = 256;
const collapsedWidth = 72;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: collapsedWidth,
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: collapsedWidth,
    ...(open && {
      marginLeft: drawerWidth,
    }),
  })
);

const routesConfig = [
  { label: 'Inicio', icon: <DashboardOutlinedIcon />, path: '/' },
  { label: 'Ingredientes', icon: <CookieOutlinedIcon />, path: '/ingredientes' },
  { label: 'Tortas', icon: <CakeOutlinedIcon />, path: '/tortas' },
  { label: 'Recetas', icon: <ReceiptLongOutlinedIcon />, path: '/recetas' },
  { label: 'Ventas', icon: <PointOfSaleOutlinedIcon />, path: '/ventas' },
];
const extraTitles = {
  '/perfil': 'Mi perfil',
};

const readUserInfo = () => {
  const tokenUser = getCurrentUser();
  let stored = null;
  try {
    stored = JSON.parse(localStorage.getItem('userInfo')) || null;
  } catch (_) {
    stored = null;
  }
  if (!tokenUser && !stored) return null;
  return {
    ...stored,
    ...tokenUser,
    name: tokenUser?.name || stored?.name || stored?.nombre || null,
    email: tokenUser?.email || stored?.email || null,
    role: tokenUser?.role || stored?.role || 'Administrador',
  };
};

export default function DashboardLayout() {
  const theme = useTheme();
  const prefersDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const [open, setOpen] = useState(() => {
    try {
      const saved = localStorage.getItem('ui:drawer-open');
      if (saved !== null) return saved === 'true';
    } catch (_) {}
    return prefersDesktop;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const storedToken = localStorage.getItem('token');
    return storedToken && isTokenValid(storedToken);
  });
  const [profileAnchor, setProfileAnchor] = useState(null);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [quickOpen, setQuickOpen] = useState(false);
  const [quickQuery, setQuickQuery] = useState('');
  const [userInfo, setUserInfo] = useState(() => readUserInfo());

  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef(null);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isCompact = useMediaQuery(theme.breakpoints.between('md', 'lg'));

  const pageTitle = useMemo(() => {
    const matched = routesConfig.find((route) => matchPath({ path: route.path, end: route.path === '/' }, location.pathname));
    if (matched) return matched.label;
    return extraTitles[location.pathname] || 'CostoSmart';
  }, [location.pathname]);

  useEffect(() => {
    const updateFromToken = (tokenValue) => {
      setUserInfo(readUserInfo());
      if (tokenValue) {
        setIsAuthenticated(isTokenValid(tokenValue));
      } else {
        const storedToken = localStorage.getItem('token');
        setIsAuthenticated(!!(storedToken && isTokenValid(storedToken)));
      }
    };

    updateFromToken();

    const handleAuthChanged = (event) => updateFromToken(event?.detail?.token || null);
    const handleStorage = (event) => {
      if (event.key === 'token' || event.key === 'userInfo') {
        updateFromToken(event.newValue || null);
      }
    };

    window.addEventListener('auth:token-changed', handleAuthChanged);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('auth:token-changed', handleAuthChanged);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const handleDrawerToggle = () => {
    const next = !open;
    setOpen(next);
    try {
      if (!isMobile) {
        localStorage.setItem('ui:drawer-open', String(next));
      }
    } catch (_) {}
  };

  const requestLogout = () => {
    setProfileAnchor(null);
    setLogoutConfirmOpen(true);
  };

  const handleLogoutCancel = () => setLogoutConfirmOpen(false);

  const handleLogoutConfirm = () => {
    setLogoutConfirmOpen(false);
    doLogout();
    navigate('/login', { replace: true });
  };

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === '/' && !event.ctrlKey && !event.metaKey && !event.altKey) {
        event.preventDefault();
        searchRef.current?.focus();
      }
      if (event.key === 'Escape') {
        setSearchValue('');
        try { window.dispatchEvent(new CustomEvent('ui:search', { detail: { q: '' } })); } catch (_) {}
      }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setQuickOpen(true);
        setQuickQuery('');
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const displayName = userInfo?.name || 'Usuario';
  const userEmail = userInfo?.email || null;
  const userRole = userInfo?.role || 'Administrador';
  const avatarLabel = (userInfo?.name || userInfo?.nombre || 'US').slice(0, 2).toUpperCase();
  const tooltipTitle = userEmail
    ? `${displayName} | ${userRole} | ${userEmail}`
    : `${displayName} | ${userRole}`;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        open={open}
        sx={{
          background: 'linear-gradient(90deg, #4fc3f7 0%, #3788ac 100%)',
          boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
        }}
      >
        <Toolbar>
          <IconButton color="inherit" aria-label="open drawer" onClick={handleDrawerToggle} edge="start" sx={{ mr: 2, ...(open && !isMobile && { display: 'none' }) }}>
            <MenuIcon />
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1, minWidth: 0 }}>
            {((!open) || isMobile) && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
                <Box component="img" src="/logo.png" alt="Logo" sx={{ width: 28, height: 28, borderRadius: '6px' }} />
                <Typography variant="h6" noWrap sx={{ fontWeight: 700 }}>
                  CostoSmart
                </Typography>
              </Box>
            )}
            <Typography
              variant="h6"
              noWrap
              sx={{ opacity: 0.95, fontWeight: 500, flexShrink: 1, textOverflow: 'ellipsis', overflow: 'hidden', ml: (!open || isMobile || isCompact) ? 1 : 0 }}
            >
              {pageTitle}
            </Typography>
            {!isMobile && (
              <Paper
                elevation={0}
                sx={{
                  ml: 2,
                  px: 1,
                  py: 0.5,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  bgcolor: 'rgba(255,255,255,0.18)',
                  border: '1px solid rgba(255,255,255,0.6)',
                  borderRadius: 2,
                }}
              >
                <SearchIcon sx={{ color: 'white', opacity: 0.9 }} />
                <InputBase
                  placeholder="Buscar..."
                  inputProps={{ 'aria-label': 'buscar' }}
                  sx={{ color: 'white', width: 320 }}
                  inputRef={searchRef}
                  value={searchValue}
                  onChange={(event) => {
                    setSearchValue(event.target.value);
                    try { window.dispatchEvent(new CustomEvent('ui:search', { detail: { q: event.target.value } })); } catch (_) {}
                  }}
                />
              </Paper>
            )}
          </Box>
          <Tooltip title={tooltipTitle}>
            <IconButton onClick={(event) => setProfileAnchor(event.currentTarget)} sx={{ ml: 1 }} aria-label="Cuenta">
              <Avatar sx={{ width: 28, height: 28 }}>{avatarLabel}</Avatar>
            </IconButton>
          </Tooltip>
          <Menu anchorEl={profileAnchor} open={Boolean(profileAnchor)} onClose={() => setProfileAnchor(null)}>
            <MenuItem onClick={() => { setProfileAnchor(null); navigate('/perfil'); }}>
              <ListItemIcon>
                <AccountCircleOutlinedIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Mi perfil" />
            </MenuItem>
            <MenuItem onClick={requestLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Cerrar sesión" />
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <MuiDrawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={open}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          '& .MuiDrawer-paper': {
            ...(!open && !isMobile && closedMixin(theme)),
            ...(open && openedMixin(theme)),
            boxSizing: 'border-box',
            backgroundColor: theme.palette.background.paper,
            ...(isMobile && { marginTop: '64px', height: 'calc(100% - 64px)' }),
            display: 'flex',
            flexDirection: 'column',
            borderRight: '1px solid',
            borderColor: 'divider',
          },
        }}
      >
        <DrawerHeader>
          {!isMobile && (
            <IconButton onClick={handleDrawerToggle}>
              {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          )}
          {!isMobile && open && !isCompact && (
            <Box sx={{ display: 'flex', alignItems: 'center', ml: 1, gap: 1 }}>
              <Box component="img" src="/logo.png" alt="Logo" sx={{ width: 24, height: 24, borderRadius: '6px' }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>CostoSmart</Typography>
            </Box>
          )}
        </DrawerHeader>
        <Divider />

        <List sx={{ flexGrow: 1 }}>
          {routesConfig.map((item) => {
            const isActive = !!matchPath({ path: item.path, end: item.path === '/' }, location.pathname);
            const button = (
              <ListItemButton
                component={Link}
                to={item.path}
                selected={isActive}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                  position: 'relative',
                  '&.Mui-selected': {
                    bgcolor: 'action.selected',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      left: 0,
                      top: 6,
                      bottom: 6,
                      width: 3,
                      borderRadius: 2,
                      backgroundColor: 'primary.main',
                    },
                  },
                  '&:hover': { bgcolor: 'action.hover' },
                }}
                onClick={isMobile ? handleDrawerToggle : undefined}
              >
                <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} sx={{ opacity: open ? 1 : 0, whiteSpace: 'nowrap' }} />
              </ListItemButton>
            );
            return (
              <ListItem key={item.label} disablePadding sx={{ display: 'block' }}>
                {open ? button : <Tooltip title={item.label} placement="right">{button}</Tooltip>}
              </ListItem>
            );
          })}
        </List>

        <Box sx={{ p: 2 }}>
          <Divider />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block', textAlign: open ? 'left' : 'center' }}>
            {userInfo?.email || 'Conectado'}
          </Typography>
        </Box>
      </MuiDrawer>

      <Dialog open={quickOpen} onClose={() => setQuickOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Ir a…</DialogTitle>
        <DialogContent>
          <Paper sx={{ display: 'flex', alignItems: 'center', px: 1, py: 0.5, mb: 1 }}>
            <SearchIcon sx={{ color: 'action.active' }} />
            <InputBase
              autoFocus
              placeholder="Buscar sección"
              value={quickQuery}
              onChange={(event) => setQuickQuery(event.target.value)}
              fullWidth
              sx={{ ml: 1 }}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  const first = routesConfig.filter((route) => route.label.toLowerCase().includes(quickQuery.toLowerCase()))[0] || routesConfig[0];
                  navigate(first.path);
                  setQuickOpen(false);
                }
              }}
            />
          </Paper>
          <List>
            {routesConfig
              .filter((route) => route.label.toLowerCase().includes(quickQuery.toLowerCase()))
              .map((route) => (
                <ListItem key={route.path} disablePadding>
                  <ListItemButton onClick={() => { navigate(route.path); setQuickOpen(false); }}>
                    <ListItemIcon>{route.icon}</ListItemIcon>
                    <ListItemText primary={route.label} />
                  </ListItemButton>
                </ListItem>
              ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setQuickOpen(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={logoutConfirmOpen} onClose={handleLogoutCancel} maxWidth="xs" fullWidth>
        <DialogTitle>Confirmar cierre de sesión</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            ¿Seguro que querés cerrar tu sesión? Vas a necesitar iniciar sesión nuevamente para continuar.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLogoutCancel}>Cancelar</Button>
          <Button color="error" onClick={handleLogoutConfirm} variant="contained">
            Cerrar sesión
          </Button>
        </DialogActions>
      </Dialog>

      <Main open={open}>
        <DrawerHeader />
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Breadcrumbs aria-label="migas de pan" separator="/">
            <Typography color="text.secondary" component={Link} to="/" style={{ textDecoration: 'none' }}>Inicio</Typography>
            <Typography color="text.primary">{pageTitle}</Typography>
          </Breadcrumbs>
          {isMobile && (
            <Button size="small" variant="outlined" onClick={() => setQuickOpen(true)}>Ir a… (Ctrl+K)</Button>
          )}
        </Box>
        <Box sx={{ backgroundColor: theme.palette.background.default, flexGrow: 1, minHeight: 'calc(100vh - 64px)', overflow: 'auto', p: isMobile ? 2 : 3 }}>
          <Outlet />
        </Box>
      </Main>
    </Box>
  );
}

