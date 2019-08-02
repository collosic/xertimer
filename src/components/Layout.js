import React from 'react';
// import PropTypes from 'prop-types';
import Navbar from './Navbar';

const Layout = ({ userSignedIn }) => (
  <div>
    <Navbar userSignedIn />
  </div>
);

Layout.propTypes = {};

export default Layout;
