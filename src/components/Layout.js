import React, { useState, useEffect } from 'react';
// import PropTypes from 'prop-types';
import Navbar from './Navbar';
import LoggedInAppBar from './LoggedInAppBar';

const Layout = ({ isSignedIn }) => {
  return <div>{isSignedIn ? <LoggedInAppBar /> : <Navbar />}</div>;
};

Layout.propTypes = {};

export default React.memo(Layout);
