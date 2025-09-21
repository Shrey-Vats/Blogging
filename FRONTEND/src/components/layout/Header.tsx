import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  PlusCircle,
  UserCircle,
  LogOut,
  LayoutDashboard,
  MenuIcon,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

const Header: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState<null | HTMLElement>(null);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMobileMenuAnchorEl(null);
  };

  const handleCreateBlog = () => {
    navigate("/create");
    handleMenuClose();
  };

  const handleDashboard = () => {
    navigate("/");
    handleMenuClose();
  };

  const handleSignOut = () => {
    signOut();
    handleMenuClose();
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const menuId = "primary-search-account-menu";
  const mobileMenuId = "primary-search-account-menu-mobile";

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
      PaperProps={{
        sx: {
          mt: 1,
          minWidth: 200,
        },
      }}
    >
      <MenuItem disabled>
        <Box>
          <Typography variant="subtitle2" fontWeight="bold">
            {user?.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user?.email}
          </Typography>
        </Box>
      </MenuItem>
      <Divider />
      <MenuItem onClick={handleDashboard}>
        <LayoutDashboard style={{ marginRight: 8 }} size={20} />
        Dashboard
      </MenuItem>
      <Divider />
      <MenuItem onClick={handleSignOut}>
        <LogOut style={{ marginRight: 8 }} size={20} />
        Sign Out
      </MenuItem>
    </Menu>
  );

  return (
    <>
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: "bold",
              cursor: "pointer",
            }}
            onClick={() => navigate("/")}
          >
            BlogTech
          </Typography>

          {user && (
            <Typography
              variant="body2"
              sx={{
                mr: 2,
                display: { xs: "none", sm: "block" },
                color: "rgba(255, 255, 255, 0.7)",
              }}
            >
              Welcome, {user.name}!
            </Typography>
          )}

          {!isMobile && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Button
                color="inherit"
                startIcon={<PlusCircle size={20} />}
                onClick={handleCreateBlog}
                sx={{ textTransform: "none" }}
              >
                Create Blog
              </Button>
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <Avatar sx={{ width: 32, height: 32, fontSize: 14 }}>
                  {user ? getInitials(user.name) : <UserCircle size={20} />}
                </Avatar>
              </IconButton>
            </Box>
          )}

          {isMobile && (
            <IconButton
              size="large"
              edge="end"
              color="inherit"
              aria-label="open drawer"
              onClick={handleMobileMenuOpen}
            >
              <MenuIcon className="h-6" />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>
      {renderMenu}
    </>
  );
};

export default Header;
