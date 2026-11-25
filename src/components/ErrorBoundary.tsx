import React from 'react';

interface State {
  failed: boolean;
}

/** Prevents a render error from blanking the whole page. */
export default class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.error('EthnAfrika UI error:', error);
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div className="api-error" role="alert" style={{ margin: 24 }}>
        Something went wrong / Une erreur est survenue.{' '}
        <button onClick={() => window.location.reload()} style={{ textDecoration: 'underline' }}>
          Reload / Recharger
        </button>
      </div>
    );
  }
}
