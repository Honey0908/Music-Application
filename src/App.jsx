import React, { useEffect } from 'react';
import { getAccessToken, spotifyApi } from './Services/spotify';
import { useDispatch, useSelector } from 'react-redux';
import { authActions, fetchUserData } from './Store/authSlice';
import Login from './Pages/Login/Login';
import Body from './Pages/Body/Body';


// create HTML audio element for music streaming
export const audioElement = new Audio();

const App = () => {

  const accessToken = useSelector((state) => state.auth.accessToken);
  const error = useSelector(state => state.auth.error);

  const dispatch = useDispatch()


  useEffect(() => {

    if (!accessToken) {
      const token = getAccessToken();
      if (token) {
        dispatch(authActions.setAccessToken(token));
      }
    }

    if (accessToken) {
      spotifyApi.setAccessToken(accessToken);
      dispatch(fetchUserData());
    }

  }, [accessToken]);




  return (
    <React.Fragment>
      {error &&
        <div className='error-box'>
          <h2 style={{ color: "red" }}>{error}</h2>
          <p>Please Login Again Or Ask Developer to give you access</p>
        </div>
      }
      {
        (accessToken && !error) ? (
          <Body />
        ) : (
          <Login />
        )
      }
    </React.Fragment >
  );
};

export default App;