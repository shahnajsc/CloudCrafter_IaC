import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState<string>("Loading...");

  useEffect(() => {
    // Update this URL once your backend is deployed
    fetch("http://localhost:3000/api/hello")
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(() => setMessage("Failed to connect to backend"));
  }, []);

  // return (
  //   <div style={{ textAlign: "center", marginTop: "4rem" }}>
  //     <h1>🌩️ CloudCrafter Frontend</h1>
  //     <p>{message}</p>
  //   </div>
  // );
  return (
  <div className="text-center mt-20">
    <h1 className="text-4xl font-bold mb-4 text-blue-600">🌩️ CloudCrafter</h1>
    <p className="text-gray-700">{message}</p>
  </div>
);
}

export default App;
