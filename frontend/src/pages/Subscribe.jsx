import React, { useState } from "react";

function Subscribe() {
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    setSubscribed(true);
  };

  return (
    <div className="min-h-screen py-16 px-4 max-w-md mx-auto bg-white">
      <h1 className="text-3xl font-bold mb-6 text-deep-plum font-heading">
        Subscribe
      </h1>
      {subscribed ? (
        <p className="text-green-600 font-primary">
          Thank you for subscribing!
        </p>
      ) : (
        <form onSubmit={handleSubscribe} className="space-y-4 font-primary">
          <input
            className="w-full p-2 border rounded"
            type="email"
            placeholder="Your Email"
            required
          />
          <button
            type="submit"
            className="bg-serene-blue text-white px-4 py-2 rounded hover:bg-deep-plum"
          >
            Subscribe
          </button>
        </form>
      )}
    </div>
  );
}

export default Subscribe;
