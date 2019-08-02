import React from 'react';
import firebase from '../components/Firebase';
import Layout from '../components/Layout';

const Xertimer = () => {
  const { currentUser } = firebase.auth;

  return (
    <React.Fragment>
      <Layout />
      <div>Logged In</div>
    </React.Fragment>
  );
};

export default Xertimer;
