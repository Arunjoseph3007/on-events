import { useState } from "react";
import { Link } from "react-router-dom";

export default function HomePage() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>Index page</h1>
      <button onClick={() => setCount((p) => p - 1)}>-</button>
      <p>{count}</p>
      <button onClick={() => setCount((p) => p + 1)}>+</button>
      <Link to={"/page"}>page</Link>
    </div>
  );
}
