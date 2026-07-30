import { Component, type ReactNode } from 'react';

import { ErrorView } from '@/components/ui';
import { errorReporter } from '@/utils/errorReporting';

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

/** Root-level safety net so an unhandled render error shows a recoverable screen, not a crash. */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    errorReporter.reportError(error, { componentStack: info.componentStack });
  }

  reset = () => this.setState({ error: null });

  render() {
    if (this.state.error) {
      return (
        <ErrorView message="Something went wrong. Please restart the app." onRetry={this.reset} />
      );
    }
    return this.props.children;
  }
}
