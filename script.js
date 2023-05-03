/*****************************************************
 * Global Variables
 ****************************************************/
let countdown_started = false;
// this is used to reset the countdown if cancel is clicked
let countdown_intervalID;
// this is used to reset the html after confetti effect when start is clicked again
const wrapper = document.getElementById("cc");
let wrapper_html = wrapper.innerHTML;
// get the dom elements
const display_days = document.querySelector("#days-container span");
const display_hours = document.querySelector("#hours-container span");
const display_minutes = document.querySelector("#minutes-container span");
const display_seconds = document.querySelector("#seconds-container span");

/*****************************************************
 * Start Countdown when start button is clicked
 ****************************************************/
// when submit button is clicked get start the countdown
const submit_btn = document.getElementById("submit-btn");

submit_btn.addEventListener("click", () => {
  if (!countdown_started) {
    countdown_started = true;
    submit_btn.style = "background-color: rgb(136, 4, 4)";
    submit_btn.textContent = "Cancel";
    clearInterval(countdown_intervalID);
    countdown_intervalID = null;
    get_Countdown();
  } else {
    countdown_started = false;
    wrapper.innerHTML = wrapper_html;
    submit_btn.style = "background-color: #F5756B;";
    submit_btn.textContent = "Start";
    document.getElementById("date").value = "";
    document.getElementById("time").value = "";
    display_days.textContent = "00";
    display_hours.textContent = "00";
    display_minutes.textContent = "00";
    display_seconds.textContent = "00";
    clearInterval(countdown_intervalID); // clear the interval
    countdown_intervalID = null;
  }
});

/*****************************************************
 * Separation of Concern - Functions
 ****************************************************/

/**
 * Gets the user's date and time choice from the date and time picker,
 * sets them in the global object 'userChoice', and returns the event date as an ISO 8601 formatted string.
 * @returns {String} The event date in user's localtime zone
 * @throws {Error} If there is an error in fetching the user's date and time choice
 */
function get_UserChoice() {
  // format yyyy-mm-dd
  const dateValue = document.getElementById("date").value;
  // fomat hh:mm:ss -> hh is the hour (00-23), mm is the minute (00-59), and ss is the second (00-59)
  const timeValue = document.getElementById("time").value;

  /**
   * When you call the toISOString() method on a Date object,
   * it first converts the date and time values to their corresponding UTC values,
   * and then represents those values in the ISO 8601 format.
   */
  // combine the selected date and time into a single string
  const dateTimeString = new Date(
    dateValue + "T" + timeValue + ":00"
  ).toISOString();

  // create a new Date object from the UTC string
  const eventDate = new Date(dateTimeString);
  return eventDate;
}
/**
 * Calculates the time remaining between event date and now date date in milliseconds.
 * @param {Date} eventDate - the event date in UTC Format
 * @returns {number} the time remaining in milliseconds as a positive integer
 */
function get_TimeRemaining(eventDate) {
  // Date.now() returns miliseconds until now in UTC Time
  let result = eventDate.getTime() - Date.now();

  return result;
}

/**
 * DHMS stands for Days Hours Minutes Seconds.
 * Calculates the remaining time in days, hours, minutes, and seconds based on a given time remaining in milliseconds.
 * @param {number} timeRemaining - The time remaining in milliseconds.
 * @returns {Array<number>} An array of four positive integers representing the remaining [days, hours, minutes, seconds] respectively.
 */
function get_DHMS(timeRemaining) {
  var seconds = Math.floor((timeRemaining / 1000) % 60);
  var minutes = Math.floor((timeRemaining / 1000 / 60) % 60);
  var hours = Math.floor((timeRemaining / (1000 * 60 * 60)) % 24);
  var days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));

  const result = [days, hours, minutes, seconds];
  return result;
}

/**
 * Gets the DOM elements and updates the DOM on the screen with remaing days, hours, minutes and seconds
 * @param {Array<number>} dhms_array - [days, hours, minutes, seconds] obtained from get_DHMS(timeRemaining)
 */
function update_DOM_with_timeRemaining(dhms_array) {
  // update the dom elements
  /*!!we update these DOM elements directly because once the celebration is started the html is replaced with confetti effect
   *and that means we can't use the wrapper variable to get the elements again!!
   */
  document.querySelector("#days-container span").textContent = dhms_array[0];
  document.querySelector("#hours-container span").textContent = dhms_array[1];
  document.querySelector("#minutes-container span").textContent = dhms_array[2];
  document.querySelector("#seconds-container span").textContent = dhms_array[3];
}

/*****************************************************
 * Uses all the functions together step by step
 ****************************************************/
function get_Countdown() {
  //1000 miliseconds are 1 second
  let timer = 1000;
  clearInterval(countdown_intervalID);
  countdown_intervalID = setInterval(() => {
    // Step 1
    // get user event date
    let endDate = get_UserChoice();

    // Step 2
    // get time remaining
    const timeRemaining = get_TimeRemaining(endDate);

    // if the time remaining is not negative or not yet completed
    if (timeRemaining > 0) {
      // Step 3
      // convert timeRemaining which is in miliseconds into Days Hours Minutes Seconds (DHMS)
      let DHMS = [];
      DHMS = get_DHMS(timeRemaining);
      // Step 4
      // update the DOM on the screen
      update_DOM_with_timeRemaining(DHMS);
    } else {
      // if the time remaining is negative or completed
      clearInterval(countdown_intervalID);
      // show confetti effect and reload after 15 seconds
      confetti_runner();
      timer = 15000;
    }
  }, timer);
}

/*****************************************************
 * Confetti Effect
 ****************************************************/
/**
 * Replaces the content on screen with confetti canvas and displays "No Time Left!"
 */
function confetti_runner() {
  wrapper.innerHTML = '<h1>No Time Left!</h1><canvas id="canvas"></canvas>';
  confetti_script();
}

// Celebration Confetti
/**
 * source for confetti script: https://codepen.io/jonathanbell/pen/OvYVYw
 */
function confetti_script() {
  let W = window.innerWidth;
  let H = window.innerHeight;
  const canvas = document.getElementById("canvas");
  const context = canvas.getContext("2d");
  const maxConfettis = 150;
  const particles = [];

  const possibleColors = [
    "DodgerBlue",
    "OliveDrab",
    "Gold",
    "Pink",
    "SlateBlue",
    "LightBlue",
    "Gold",
    "Violet",
    "PaleGreen",
    "SteelBlue",
    "SandyBrown",
    "Chocolate",
    "Crimson",
  ];

  function randomFromTo(from, to) {
    return Math.floor(Math.random() * (to - from + 1) + from);
  }

  function confettiParticle() {
    this.x = Math.random() * W; // x
    this.y = Math.random() * H - H; // y
    this.r = randomFromTo(11, 33); // radius
    this.d = Math.random() * maxConfettis + 11;
    this.color =
      possibleColors[Math.floor(Math.random() * possibleColors.length)];
    this.tilt = Math.floor(Math.random() * 33) - 11;
    this.tiltAngleIncremental = Math.random() * 0.07 + 0.05;
    this.tiltAngle = 0;

    this.draw = function () {
      context.beginPath();
      context.lineWidth = this.r / 2;
      context.strokeStyle = this.color;
      context.moveTo(this.x + this.tilt + this.r / 3, this.y);
      context.lineTo(this.x + this.tilt, this.y + this.tilt + this.r / 5);
      return context.stroke();
    };
  }

  function Draw() {
    const results = [];

    // Magical recursive functional love
    requestAnimationFrame(Draw);

    context.clearRect(0, 0, W, window.innerHeight);

    for (var i = 0; i < maxConfettis; i++) {
      results.push(particles[i].draw());
    }

    let particle = {};
    let remainingFlakes = 0;
    for (var i = 0; i < maxConfettis; i++) {
      particle = particles[i];

      particle.tiltAngle += particle.tiltAngleIncremental;
      particle.y += (Math.cos(particle.d) + 3 + particle.r / 2) / 2;
      particle.tilt = Math.sin(particle.tiltAngle - i / 3) * 15;

      if (particle.y <= H) remainingFlakes++;

      // If a confetti has fluttered out of view,
      // bring it back to above the viewport and let if re-fall.
      if (particle.x > W + 30 || particle.x < -30 || particle.y > H) {
        particle.x = Math.random() * W;
        particle.y = -30;
        particle.tilt = Math.floor(Math.random() * 10) - 20;
      }
    }

    return results;
  }

  window.addEventListener(
    "resize",
    function () {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    },
    false
  );

  // Push new confetti objects to `particles[]`
  for (var i = 0; i < maxConfettis; i++) {
    particles.push(new confettiParticle());
  }

  // Initialize
  canvas.width = W;
  canvas.height = H;
  Draw();
}
