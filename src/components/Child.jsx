export default function Child({ counter, incCounter }) {
  return (
    <div>
      <p>Reciebed count: {counter}</p>
      <button onClick={incCounter}>Increment Parent Count</button>
    </div>
  );
}
