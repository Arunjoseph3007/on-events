import { useState } from "react";

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>hello there</h1>
      <button onClick={() => setCount((p) => p - 1)}>-</button>
      <p>{count}</p>
      <button onClick={() => setCount((p) => p + 1)}>+</button>
    </div>
  );
}
