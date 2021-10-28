import { useEffect, useState } from "react";
import Form from "./Form";
function App() {
  const [msg, setMessage] = useState("test");
  const testApi = async () => {
    const response = await fetch("/v1/api/Hello");
    const data = await response.json();
    console.log(data);
    const mesg = data.message;
    setMessage(mesg);
  };
  useEffect(() => testApi(), []);
  return (
    <div>
      <h1>{msg}</h1>
      <Form />
    </div>
  );
}

export default App;
