import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { auth } from '../_actions/user_action';
import { useNavigate } from 'react-router-dom';

export default function Auth1 (SpecificComponent, option, adminRoute = null) {
  // null: 아무나, true: 로그인한 사람만, false: 로그인한 사람은 x
  function AuthenticationCheck() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
      dispatch(auth()).then(res => {
        console.log(res);

        if (!res.payload.isAuth)
        if (option) navigate('/login');

         if (res.payload.isAuth) {
           if (!option) navigate('/');
        // 로그인안한 상태로 로그인 들어갈때
        else {
             if (adminRoute && !res.payload.isAdmin) navigate('/');
           // 로그인 상태로 
             else if (option === false) navigate('/');
           }
       }
      });
    }, [dispatch, navigate]);

    return <SpecificComponent />;
  }

  return <AuthenticationCheck/>;
}




