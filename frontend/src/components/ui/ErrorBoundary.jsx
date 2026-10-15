import { Component } from "react";
import { AlertTriangle } from "lucide-react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("Error boundary caught:", error, info);
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="glass px-6 py-6 text-center my-4">
          <AlertTriangle
            size={24}
            className="mx-auto mb-2"
            style={{ color: "#f87171" }}
          />
          <p className="text-sm mb-1">
            {this.props.label || "Something broke in this section"}
          </p>
          <p
            className="text-xs mb-3"
            style={{ color: "var(--text-muted)" }}
          >
            {this.state.error?.message || "Unknown error"}
          </p>
          <button
            onClick={this.reset}
            className="text-xs px-3 py-1.5 rounded-md"
            style={{
              background: "var(--accent)",
              color: "#0b1020",
              fontWeight: 500,
            }}
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
