import React, { useEffect, useState } from "react";

export const CourseCountdown = () => {
  const [countdown, setCountdown] = useState("");
  useEffect(() => {
    const countDownDate = new Date("Sep 20, 2021 6:00:00").getTime();

    const intervalCounter = setInterval(() => {
      const now = new Date().getTime();
      const timeLeft = countDownDate - now;
      // Calculating the days, hours, minutes and seconds left
      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
      const countdownStr = days + "days " + hours + " " + minutes + " " + seconds;
      setCountdown(countdownStr);
    }, 1000);
  }, []);
  return <div>
    {countdown}
  </div>
};
