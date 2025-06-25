import React, { useState, useEffect } from 'react';
import { 
  Box, CssBaseline, Toolbar, List, Typography, Divider, 
  IconButton, ListItem, ListItemButton, ListItemIcon, 
  ListItemText, Dialog, DialogTitle, DialogContent, 
  DialogContentText, DialogActions, Button 
} from '@mui/material';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import CakeIcon from '@mui/icons-material/Cake';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import { Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
import { styled, useTheme } from '@mui/material/styles';

// Import views
import HomeScreen from '../views/homeScreen';
import IngredientListScreen from '../views/IngredientListScreen';
import TortasScreen from '../views/TortasScreen';
import RecetaScreen from '../views/Recetas2';
import VentasScreen from '../views/VentasScreen';
import { isTokenValid } from '../utils/auth';

const drawerWidth = 240;
const collapsedWidth = 64;

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
  justifyContent: 'flex-end',
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
  }),
);

const menuItems = [
  { text: 'Inicio', icon: <HomeIcon />, path: '/' },
  { text: 'Ingredientes', icon: <LocalGroceryStoreIcon />, path: '/ingredientes' },
  { text: 'Tortas', icon: <CakeIcon />, path: '/tortas' },
  { text: 'Recetas', icon: <ReceiptIcon />, path: '/recetas2' },
  { text: 'Ventas', icon: <PointOfSaleIcon />, path: '/ventas' },
];

export default function MiniDrawer() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [open, setOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const storedToken = localStorage.getItem('token');
    return storedToken && isTokenValid(storedToken);
  });
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && isTokenValid(token)) {
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem('token');
      setIsAuthenticated(false);
    }
  }, []);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleLogoutClick = () => {
    setLogoutDialogOpen(true);
  };

  const handleLogoutConfirm = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setLogoutDialogOpen(false);
    navigate('/login', { replace: true });
  };

  const handleLogoutCancel = () => {
    setLogoutDialogOpen(false);
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && !isMobile && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Panel de Control
          </Typography>
        </Toolbar>
      </AppBar>
      
      {/* Drawer para mobile y web/tablet */}
      <MuiDrawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={open}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          '& .MuiDrawer-paper': {
            ...(!open && !isMobile && closedMixin(theme)),
            ...(open && openedMixin(theme)),
            boxSizing: 'border-box',
            backgroundColor: theme.palette.background.paper,
            ...(isMobile && {
              marginTop: '64px',
              height: 'calc(100% - 64px)',
            }),
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        <DrawerHeader>
          {!isMobile && (
            <IconButton onClick={handleDrawerToggle}>
              {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          )}
        </DrawerHeader>
        <Divider />
        
        {/* Menú principal */}
        <List sx={{ flexGrow: 1 }}>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                component={Link}
                to={item.path}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
                onClick={isMobile ? handleDrawerToggle : null}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  sx={{ 
                    opacity: open ? 1 : 0,
                    whiteSpace: 'nowrap',
                  }} 
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        
        {/* Sección de Cerrar Sesión */}
        <Box sx={{ p: 2 }}>
          <Divider />
          <ListItem disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              onClick={handleLogoutClick}
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                  color: theme.palette.error.main,
                }}
              >
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Cerrar Sesión" 
                sx={{ 
                  opacity: open ? 1 : 0,
                  whiteSpace: 'nowrap',
                  color: theme.palette.error.main,
                }} 
              />
            </ListItemButton>
          </ListItem>
        </Box>
      </MuiDrawer>
      
      {/* Diálogo de confirmación de cierre de sesión */}
      <Dialog
        open={logoutDialogOpen}
        onClose={handleLogoutCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirmar Cierre de Sesión</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            ¿Estás seguro que deseas cerrar tu sesión?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLogoutCancel} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleLogoutConfirm} color="error" autoFocus>
            Cerrar Sesión
          </Button>
        </DialogActions>
      </Dialog>
      
      <Main open={open}>
        <DrawerHeader />
        <Box
          sx={{
            backgroundColor: theme.palette.background.default,
            flexGrow: 1,
            minHeight: 'calc(100vh - 64px)',
            overflow: 'auto',
            p: isMobile ? 2 : 3,
          }}
        >
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/ingredientes" element={<IngredientListScreen />} />
            <Route path="/tortas" element={<TortasScreen />} />
            <Route path="/recetas2" element={<RecetaScreen />} />
            <Route path="/ventas" element={<VentasScreen />} />
          </Routes>
        </Box>
      </Main>
    </Box>
  );
}