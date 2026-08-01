import { useState } from 'react';
//import { useState } from 'react';
import Child from './Child.jsx';

export default function ParentCounter() {
  const [counter, setCounter] = useState(0);

  function incrementCounter() {
    setCounter(counter + 1);
  }

  return (
    <div>
      <Child counter={counter} incCounter={incrementCounter}></Child>
    </div>
  );
}
