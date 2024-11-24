import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const NavbarContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background: #4a90e2;
  color: white;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 15px;

  a {
    text-decoration: none;
    color: white;
    font-weight: bold;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const Navbar = () => {
  return (
    <NavbarContainer>
      <h2>React Chatbot</h2>
      <NavLinks>
        <Link to="/">Home</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/countries">Countries</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/about">About</Link>
        <Link to="/settings">Settings</Link>
      </NavLinks>
    </NavbarContainer>
  );
};

export default Navbar;
