import React, { useEffect, useState } from 'react';
import { getAccessToken, getNewAccessToken, spotifyApi } from './Services/spotify';
import { useDispatch, useSelector } from 'react-redux';
import { authActions, fetchAccessToken, fetchUserData } from './Store/authSlice';
import Login from './Pages/Login/Login';
import Body from './Pages/Body/Body';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DotLoader } from 'react-spinners';

// create HTML audio element for music streaming
export const audioElement = new Audio();

const App = () => {
  const loading = useSelector((state) => state.auth.authLoading)
  const accessToken = useSelector((state) => state.auth.accessToken);
  const error = useSelector(state => state.auth.error);

  const dispatch = useDispatch()

  useEffect(() => {
    if (!accessToken) {
      dispatch(fetchAccessToken());
    }
  }, []);

  useEffect(() => {
    if (accessToken) {
      spotifyApi.setAccessToken(accessToken);
      dispatch(fetchUserData());
    }
  }, []);

  return (
    <React.Fragment>
      {error && (
        <div className='error-box'>
          <h2 style={{ color: "red" }}>{error}</h2>
          <p>Please Login Again Or Ask Developer to give you access</p>
        </div>
      )}
      <ToastContainer />
      {(loading) ? (
        <DotLoader className="loading-component" color='orange' />
      ) : (
        (accessToken && !error) ? <Body /> : <Login />
      )}
    </React.Fragment>
  );
};

export default App;
