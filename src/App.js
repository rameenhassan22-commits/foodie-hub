import Navbar from "./components/Navbar";
import Loader from "./components/Loader";
import ErrorMessage from "./components/ErrorMessage";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="p-6 space-y-6 max-w-md mx-auto">
        <Loader label="Testing loader..." />
        <ErrorMessage
          message="Test error message"
          onRetry={() => alert("Retry clicked!")}
        />
      </div>
    </div>
  );
}

export default App;