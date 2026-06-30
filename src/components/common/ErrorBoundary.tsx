import { Component, type ReactNode, type ErrorInfo } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[400px] flex flex-col items-center justify-center gap-4 p-8">
          <div className="glass-card p-6 text-center max-w-md">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
              出错了
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {this.state.error?.message || '发生了未知错误'}
            </p>
            <Button onClick={this.handleReset} icon={<RefreshCw className="w-4 h-4" />}>
              重新加载
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}