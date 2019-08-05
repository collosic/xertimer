import React, { useState, useEffect } from 'react';
import firebase from '../components/Firebase';
import Layout from '../components/Layout';

const Xertimer = () => {
  const [userInfo, setUserInfo] = useState(null);
  const initUser = async () => {
    const user = await firebase.getCurrentUser();
    if (user && user.uid) {
      setUserInfo(user);
    }
  };

  useEffect(() => {
    initUser();
  }, []);

  return (
    <React.Fragment>
      <Layout />
      <div>
        Logged In as
        {` ${userInfo && !userInfo.isAnonymous ? userInfo.displayName : 'Guest'}`}
      </div>
    </React.Fragment>
  );
};

export default Xertimer;
