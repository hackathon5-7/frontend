import React from 'react';
import MyNavbar from '../components/Navbar.js';

import { Navigate, useLocation } from 'react-router-dom';
import { checkTokenExist } from '../utils/token_utils';
import { NotificationContainer } from 'react-notifications';
import { AuthenticationRoutePath } from '../routers/AppRouter';

import './style.css'

const PageTemplate = ({ children, title = 'Online Queue', show_navbar = true, check_token = true}) => {
    document.title = title;
    const location = useLocation();

    if (!(location.pathname === AuthenticationRoutePath) && check_token && !checkTokenExist()) {
        return <Navigate to={AuthenticationRoutePath} />
    }

    return (
        <div>
            {
                show_navbar && <MyNavbar />
            }
            <div className="mt-4">
                {children}
            </div>

            <NotificationContainer/>
        </div>
    );
};

export default PageTemplate;