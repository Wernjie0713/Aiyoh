const createEasterEgg = () => {
  const easterEgg = document.createElement("img");
  const easterEggContainer = document.getElementById("easterEgg"); // places to appear egg

  easterEgg.src = "./assets/img/easterEgg.png";
  easterEgg.classList.add("easter-egg", "animate-in");

  easterEgg.addEventListener("click", (event) => {
    event.currentTarget.classList.add("break");

    party.confetti(event.currentTarget, {
      spread: 25,
      size: 0.7,
      count: 40,
    });

    // Create and add the second image when the first image is clicked
    const newEasterEgg = document.createElement("img");
    newEasterEgg.src = "./assets/img/focus_toaster.png"; // New image source
    newEasterEgg.classList.add("easter-egg", "animate-in", "small-easter-egg");

    newEasterEgg.addEventListener("click", (event) => {
      event.currentTarget.classList.add("break");

      party.confetti(event.currentTarget, {
        spread: 30,
        size: 0.8,
        count: 50,
      });

      // Update the score again when the second image is clicked
      let score = localStorage.getItem("score");
      if (score) {
        score = Number(score) + 4; // Add 4 points
        localStorage.setItem("score", score);
      } else {
        localStorage.setItem("score", 92); // Default score
      }
    });

    easterEggContainer.append(newEasterEgg); // Add the new image to the container
  });

  easterEggContainer.append(easterEgg);

  setTimeout(() => easterEgg.classList.remove("animate-in"), 300);

  let score = localStorage.getItem("score");
  if (score) {
    // found score
    if (score === "92") {
      // ori score (1st time)
      score = 96;
    } else {
      console.log("Data Found");
      score = Number(score) + 4;
      localStorage.setItem("score", score);
    }
  } else {
    // Data does not exist in Local Storage
    console.log("No data found in Local Storage.");
    localStorage.setItem("score", 92);
  }
};

const testing = () => {
  createEasterEgg();
};
