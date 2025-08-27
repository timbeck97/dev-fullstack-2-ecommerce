import { useEffect, useState } from "react";
import axios from "axios";
import Routes from "./routes/Routes";

function App() {
  const [msg, setMsg] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/api/teste")
      .then(res => setMsg(res.data.message))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen w-full">
      <Routes />
    </div>
  );
}

export default App;