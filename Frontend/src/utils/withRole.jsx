// src/hoc/withRole.jsx
import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const withRole = (roles) => (WrappedComponent) => {
  const RoleComponent = (props) => {
    const user = useSelector((state) => state.auth.user);

    if (!user || !roles.includes(user.role)) {
      return <Navigate to="/login" replace />;
    }

    return <WrappedComponent {...props} />;
  };

  return RoleComponent;
};

export default withRole;
