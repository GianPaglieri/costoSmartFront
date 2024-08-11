import React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/Inbox';
import HomeIcon from '@mui/icons-material/Home';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import EggIcon from '@mui/icons-material/Egg';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import CakeIcon from '@mui/icons-material/Cake';
import logo from '../uploads/logo.png'; // Importa la imagen del logo



import { Link, Route, Routes, BrowserRouter } from 'react-router-dom';

// Importacion de vistas
import LoginScreen from '../views/Login';
import RegisterScreen from '../views/Register';
import HomeScreen from '../views/homeScreen';
import IngredientListScreen from '../views/IngredientListScreen';
import TortasScreen from '../views/TortasScreen';
import RecetaScreen from '../views/Recetas2';
import VentasScreen from '../views/VentasScreen';


const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const LogoContainer = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center', // Para centrar vertical y horizontalmente
  height: '100%', // Para ocupar todo el espacio vertical
  width: '100%', // Para ocupar todo el espacio horizontal
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between', // Para centrar elementos horizontalmente
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

function Navigation() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <BrowserRouter>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="fixed" open={open}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{ mr: 2, ...(open && { display: 'none' }) }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              Costo Smart
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
          variant="persistent"
          anchor="left"
          open={open}
        >
          <DrawerHeader>
  <div>
    <IconButton onClick={handleDrawerClose}>
      {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
    </IconButton>
  </div>
  <div>
    <img src={logo} alt="Logo" style={{ width: '40px', height: '40px', marginRight: '10px' }} />
  </div>
</DrawerHeader>
          <List>
            {/* Agrega elementos de menú para tus vistas aquí con enlaces */}
            <ListItem key="Home" disablePadding>
              <ListItemButton component={Link} to="/">
                <ListItemIcon>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText primary="Home" />
              </ListItemButton>
            </ListItem>
            <ListItem key="IngredientListScreen" disablePadding>
              <ListItemButton component={Link} to="/ingredientes">
                <ListItemIcon>
                  <EggIcon />
                </ListItemIcon>
                <ListItemText primary="Ingredientes" />
              </ListItemButton>
            </ListItem>
            <ListItem key="TortasScreen" disablePadding>
              <ListItemButton component={Link} to="/tortas">
                <ListItemIcon>
                  <CakeIcon />
                </ListItemIcon>
                <ListItemText primary="Tortas" />
              </ListItemButton>
            </ListItem>
            <ListItem key="RecetaScreen" disablePadding>
              <ListItemButton component={Link} to="/recetas2">
                <ListItemIcon>
                  <MenuBookIcon />
                </ListItemIcon>
                <ListItemText primary="Recetas" />
              </ListItemButton>
            </ListItem>
            <ListItem key="VentasScreen" disablePadding>
              <ListItemButton component={Link} to="/ventas">
                <ListItemIcon>
                  <PointOfSaleIcon />
                </ListItemIcon>
                <ListItemText primary="Ventas" />
              </ListItemButton>
            </ListItem>
          </List>
        </Drawer>
        <Main open={open}>
          <DrawerHeader />
          <Routes>
            {/* Configura tus rutas aquí */}
            <Route path="/" element={<HomeScreen />} />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/register" element={<RegisterScreen />} />
            <Route path="/ingredientes" element={<IngredientListScreen />} />
            <Route path="/tortas" element={<TortasScreen />} />
            <Route path="/recetas2" element={<RecetaScreen />} />
            <Route path="/ventas" element={<VentasScreen />} />
            
          </Routes>
        </Main>
      </Box>
    </BrowserRouter>
  );
}

export default Navigation;






