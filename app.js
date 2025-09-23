    const API_URL = "https://jackbox-backend.onrender.com";

    let submission_list = document.querySelector("#submissions")
    let scores = document.querySelector("#scores")

    // Load submissions
    function loadSubmissions() {
      //the endpoint is at API_URL+/submissions
      //You should retrieve the submissions and put them in the ul 'submissions'
      fetch(API_URL + '/submissions')
      .then(response => response.json())
      .then(function(data) {
        // Clear any previous submissions before loading new ones
        submission_list.innerHTML = '';
    
        // Check if data is an object and iterate over its values
        data.forEach(s => {
          const li = document.createElement("li");
          li.textContent = `${s.team}: ${s.answer}`;
          submission_list.appendChild(li);
        })
        console.log(data);
      });
    }

    // Load scores
    function loadScores() {
      //the endpoint is at API_URL+/scores
      //You should retrieve the submissions and put them in the ul 'scores'
      fetch(API_URL+"/scores")
      .then(response => response.json())
        .then(data => {
          const list = document.getElementById("scores");
          list.innerHTML = "";
          for (const team in data){
            const li = document.createElement("li")
            li.textContent = `${team}: ${data[team]} pts`;
            list.appendChild(li); 
          }
        })
    }

    // Handle form submission
    document.getElementById("answerForm").addEventListener("submit", function(e) {
      e.preventDefault();
      const team = document.getElementById("team").value;
      const answer = document.getElementById("answer").value;
      let data = "team=" + team;
      data += "&answer=" + answer;
      fetch(API_URL+"/submit", {
        method:"POST", body:JSON.stringify(data), headers:{"Content-Type":"application/JSON"}
      })
        .then(response => response.json())
        .then(function(data) {
          console.log(data);
          document.getElementById("answer").value = "";
          loadSubmissions();
        })
      })
      //post to the API_URL + /submit
      //use correct headers
      //api expects team and answer
      //after a successful fetch, loadSubmissions()
        


    /*

    DON'T MODIFY ANYTHING BELOW THIS

    */
       const roundTime = 120; // seconds per round

    // Load prompt
    function loadPrompt() {
      fetch(API_URL + "/prompt")
        .then(response => response.json())
        .then(data => {
          document.getElementById("prompt").textContent = data.prompt;
          startTimer();
        })
        .catch(err => console.error("Error loading prompt:", err));
    }

    // Auto-refresh every 5s
    setInterval(function() {
      loadSubmissions();
      loadScores();
    }, 5000);

    // Countdown timer
    function startTimer() {
      let timeLeft = roundTime;
      const timerEl = document.getElementById("timer");
      timerEl.textContent = `Time left: ${timeLeft}s`;

      const interval = setInterval(function() {
        timeLeft--;
        if (timeLeft >= 0) {
          timerEl.textContent = `Time left: ${timeLeft}s`;
        } else {
          timerEl.textContent = "Time's up!";
          document.getElementById("answerForm").querySelector("button").disabled = true;
          clearInterval(interval);
        }
      }, 1000);
    }

    // Initialize
    loadPrompt();
    loadSubmissions();
    loadScores();