import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';

class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service
    console.error("Error boundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <Navigate to="/crash" />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
