import React, { useState } from 'react';

export default function PaymentForm() {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  // Validation function
  const validate = () => {
    if (!amount || isNaN(amount)) {
      setError('Please enter a valid number.');
      return false;
    }
    if (parseFloat(amount) < 10) {
      setError('Minimum payment is $10.00.');
      return false;
    }
    setError(''); // Clear error if valid
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // TRAP: Run validation
    validate();

    // Check if there is an error in the state
    if (error === '') {
      // If no error, process the payment
      console.log(`Processing payment of $${amount}...`);
      // API call would go here
    } else {
      console.log('Validation failed, payment stopped.');
    }
  };

  return (
    <div className="p-4 border rounded-md w-80">
      <h2 className="text-xl mb-4">Make a Payment</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <label htmlFor="amount">Amount ($)</label>
        <input
          id="amount"
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border p-2 rounded"
        />

        {/* Render error if it exists */}
        {error && <span className="text-red-500 text-sm">{error}</span>}

        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded mt-2"
        >
          Pay Now
        </button>
      </form>
    </div>
  );
}
