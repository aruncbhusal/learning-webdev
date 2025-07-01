import React from "react";

// Challenge 1: Update time on Click
/*
function App() {
  // First of all, let's create the useState hook which is tied to the current time
  const [time, setTime] = React.useState("TIME");
  // This time I'm using the React.useState way of getting the function

  // At first the string is time, I could show the time on load as well but I would need to get time twice
  // Let me just create the function that will update the time to current time
  function getTime() {
    setTime(new Date().toLocaleTimeString([], { hour12: false }));
  }
  // I would like to use the vanilla toLocaleTimeString function, but since my local time is 12 hrs format
  // I will need to set an international locale for the 24 hour format (Took GPT's help for fast service with arguments)

  return (
    <div className="container">
      <h1>{time}</h1>
      <button onClick={getTime}>Get Time</button>
    </div>
  );
}
*/

// Now that the first challenge is done and dusted, it's time for the secod one. Let me copy the code and modify
// Challenge 2: Update time each second
function App() {
  const [time, setTime] = React.useState("TIME");

  // This time instead of on click, we will setInterval so that it starts without even clicking
  function getTime() {
    setTime(new Date().toLocaleTimeString([], { hour12: false }));
  }
  setInterval(getTime, 1000);
  // Simple enough, code reuse 100%. But for future, if using codeSandbox, always specify interval as ms first
  // If we give callback only, it tries to call it every millisecond and the tab will hang

  // Difference betn my solution and course soln is that she sets the time at the start as well, which I didn't because... DRY
  // And she has both the click and auto update in the same code, which I have separated. That's it... for today, actually

  return (
    <div className="container">
      <h1>{time}</h1>
      <button>Get Time</button>
    </div>
  );
}

export default App;
