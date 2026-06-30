import React, { Component } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import Button from './Button'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    this.setState({ errorInfo })
  }

  handleReload = () => {
    window.location.reload()
  }

  handleGoHome = () => {
    window.location.hash = '/'
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20 flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <div className="backdrop-blur-xl bg-white/70 border border-white/40 shadow-2xl rounded-3xl p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-rose-100 to-amber-100 flex items-center justify-center">
                <AlertTriangle className="w-10 h-10 text-rose-500" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-800 mb-2">出了点问题</h2>
              <p className="text-gray-600 mb-6">
                很抱歉，应用遇到了一些问题。您可以尝试刷新页面或返回首页。
              </p>

              {this.state.error && process.env.NODE_ENV === 'development' && (
                <div className="mb-6 p-4 bg-rose-50 rounded-xl text-left overflow-auto max-h-40">
                  <p className="text-xs text-rose-600 font-mono">
                    {this.state.error.toString()}
                  </p>
                </div>
              )}

              <div className="flex gap-3 justify-center">
                <Button variant="primary" icon={RefreshCw} onClick={this.handleReload}>
                  刷新页面
                </Button>
                <Button variant="secondary" onClick={this.handleGoHome}>
                  返回首页
                </Button>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
