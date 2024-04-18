import React from 'react';
import { Route, Router, Routes } from 'react-router-dom';
import { SignUp, SignInRenderer} from "../components/Components-User-Account"
import App from '../App';


export default () => {

    
    return(
        <Routes>
            <Route path='/' element={<SignInRenderer />} />
            <Route path='login' element={<SignInRenderer />} />
            <Route path='signup' element={<SignUp />} />
            <Route path='home' element={<App />} />
            {/* <Route path='forgot-password' element={<ForgotPassword />} />
            <Route element={<Layout ensureAuthenticated />}>{getRoutesByRole(role)}</Route>
            <Route path='*' element={<Err404 />} /> */}
        </Routes>
    )
}