import { AppBar, Box, Toolbar, Typography, styled } from '@mui/material';
import React, { useCallback } from 'react';

import { Link } from 'react-router-dom';
import { useAuth } from 'providers/AuthProvider';

const NavItem = styled(Link)`
  color: white;
  text-decoration-line: none;
`;

const NavBar = ({ links }) => {
  const { isAuthenticated } = useAuth();

  const isHidden = (credential) => {
    if (credential === undefined) return false;
    return credential === isAuthenticated;
  };

  const Item = useCallback(
    ({ href, title, credential }) => {
      console.log('item', href, credential, isAuthenticated);
      if (isHidden(credential)) {
        return <></>;
      } else {
        return (
          <Box sx={{ flexGrow: 1 }}>
            <NavItem to={href} key={`menu-${href}`}>
              <Typography>{title}</Typography>
            </NavItem>
          </Box>
        );
      }
    },
    [isAuthenticated],
  );

  return (
    <AppBar position="relative">
      <Toolbar>
        {links && links.map((link) => <Item key={`nav-item-${link.href}`} {...link} />)}
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
