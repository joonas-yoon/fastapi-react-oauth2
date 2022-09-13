import { AppBar, Box, Toolbar, Typography, styled } from '@mui/material';

import { Link } from 'react-router-dom';

const NavItem = styled(Link)`
  color: white;
  text-decoration-line: none;
`;

const NavLink = ({ href, title, ...props }) => (
  <NavItem to={href} key={`menu-${href}`}>
    <Typography>{title}</Typography>
  </NavItem>
);

const NavBar = ({ links }) => (
  <AppBar position="relative">
    <Toolbar>
      {links &&
        links.map((link) => (
          <Box sx={{ flexGrow: 1 }} key={`nav-${link.href}`}>
            <NavLink href={link.href} title={link.title} />
          </Box>
        ))}
    </Toolbar>
  </AppBar>
);

export default NavBar;
