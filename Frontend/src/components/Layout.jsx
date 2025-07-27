// src/components/DashboardLayout.js
import React from "react";
import { Outlet, Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  Button,
} from "@mui/material";

const drawerWidth = 220;

const Layout = () => {
  return (
    <Box sx={{ display: "flex" }}>
      {/* Navbar */}
      <AppBar position="fixed" sx={{ zIndex: 1300 }}>
        <Toolbar>
          <Typography variant="h6" noWrap>
            School Management System
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box" },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List>
            <ListItem button component={Link} to="students">
              <ListItemText primary="Students" />
            </ListItem>
            <ListItem button component={Link} to="teachers">
              <ListItemText primary="Teachers" />
            </ListItem>
            <ListItem button>
              <Button color="error">Logout</Button>
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Page Content */}
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, ml: `${drawerWidth}px`, mt: "64px" }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
