import { useState } from "react";
function Form() {
  const [name, setName] = useState("");
  const changeHandler = (e) => setName(e.target.value);
  return (
    <div>
      <form onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="name">Name</label>
        <input type="text" name="name" onChange={changeHandler} />
        <button
          onClick={async () => {
            const res = await fetch("/v1/api/Send", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },

              body: JSON.stringify({ name: name }),
            });
            const data = await res.json();
            setName(data.name);
            console.log("Post api called");
          }}
        >
          Send
        </button>
      </form>
      <h1>{name}</h1>
    </div>
  );
}

export default Form;
