import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ component: Component, render, ...rest }) => {
    const { token } = useContext(AuthContext);

    return (
        <Route
            {...rest}
            render={props =>
                token ? (
                    Component ? <Component {...props} /> : render(props)
                ) : (
                    <Redirect to="/login" />
                )
            }
        />
    );
};

export default ProtectedRoute;