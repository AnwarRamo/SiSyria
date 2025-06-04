// components/ErrorBoundary.jsx
import React from 'react';

export default class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h3>Error in {this.props.component}</h3>
          <p>{this.state.error.message}</p>
          <button onClick={this.props.onRetry}>Retry</button>
        </div>
      );
    }
    return this.props.children;
  }
}