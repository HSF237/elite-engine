import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-[#111113] border border-red-500/20 rounded-3xl p-8 shadow-2xl">
            <div className="text-4xl mb-4">🚨</div>
            <h1 className="font-outfit font-black text-2xl text-white mb-2 uppercase tracking-tight">System Crash</h1>
            <p className="text-white/40 text-sm mb-6 leading-relaxed">
              An unexpected error occurred. This is usually caused by missing environment variables or a configuration issue.
            </p>
            <div className="bg-black/50 rounded-xl p-4 mb-6 text-left overflow-x-auto">
              <code className="text-red-400 text-xs font-mono">
                {this.state.error?.toString()}
              </code>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-[#c9a962] text-black font-black py-4 rounded-2xl uppercase tracking-widest text-xs hover:bg-[#b09452] transition-colors"
            >
              Attempt Reboot
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
