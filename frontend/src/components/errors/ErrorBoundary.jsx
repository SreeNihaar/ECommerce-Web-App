import React from 'react';
import ErrorPage from './ErrorPage';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorPage
          statusCode={500}
          title="Oops! Something went wrong"
          message="An unexpected error occurred in the application"
          details={process.env.NODE_ENV === 'development' ? this.state.error?.message : 'Please try refreshing the page'}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
