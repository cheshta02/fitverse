(function () {
  "use strict";                                                        //to treat all js code accourding to new version of javascript
  let workoutData = { location: "", level: "", goal: "" };
  let dietData = { type: "", goal: "" };
  let selectedSubscriptionPlan = null;

  document.addEventListener("DOMContentLoaded", function () {
    Navbar();
    Hamburger();
    ScrollReveal();
    SmoothScroll();
    BMICalculator();
    CalorieCalculator();
    WorkoutCollapse();
    Chatbot();
    StoryFilter();
    ContactForm();
    SelectionSteps();
    DietSteps();
    LoginSystem();
    Community();
  });
  // ==================== NAVIGATION ====================
  function Navbar() {
    const navbar = document.querySelector(".navbar");
    if (!navbar) return;

    const currentPage = window.location.pathname.split("/").pop() || "index.html";

    document.querySelectorAll(".nav-links a").forEach((link) => {
      const href = link.getAttribute("href");
      if ( href === currentPage || (currentPage === "" && href === "index.html")) {
        link.classList.add("active");
      }
    });
  }

  function Hamburger() {
    const hamburger = document.querySelector(".hamburger");
    const navWrap = document.querySelector(".nav-links");
    if (!hamburger || !navWrap) return;

    hamburger.addEventListener("click", function () {
      hamburger.classList.toggle("active");
      navWrap.classList.toggle("open");
      navWrap.classList.toggle("active");
      document.body.style.overflow = navWrap.classList.contains("open") || navWrap.classList.contains("active") ? "hidden" : "";
    });

    navWrap.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", function () {
        hamburger.classList.remove("active");
        navWrap.classList.remove("open");
        navWrap.classList.remove("active");
        document.body.style.overflow = "";
      });
    });
  }
  // ==================== UI HELPERS ====================
  function ScrollReveal() {                                                          //Animates elements when they appear on screen
    const revealEls = document.querySelectorAll(".reveal, .card, .feature-card, .story-card, .team-card, .testimonial-card");
    if (!revealEls.length) return;

    const observer = new IntersectionObserver(                                        //browser API to detect when elements enter the viewport
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;                                    //IntersectionRatio is percentage of element visible in viewport
          entry.target.classList.add("visible");
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },                // trigger when 10% of the element is visible, and start a bit earlier
    );

    revealEls.forEach((el) => {
      if (!el.classList.contains("reveal")) {
        el.style.opacity = "0";
        el.style.transform = "translateY(20px)";
        el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
      }
      observer.observe(el);
    });
  }

  function SmoothScroll() {                                                 //Overrides default anchor behavior ,Adds smooth scrolling effect
    document.querySelectorAll('a[href="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        const targetId = this.getAttribute("href");
        if (!targetId || targetId === "#") return;
        const target = document.querySelector(targetId);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }
  // ==================== BMI / CALORIE ====================
  function BMICalculator() {
    const openBtn = document.querySelector('[data-testid="bmi-open-btn"]');
    const modal = document.querySelector('[data-testid="bmi-modal"]');
    const closeBtn = document.querySelector('[data-testid="bmi-close-btn"]');
    const calcBtn = document.querySelector('[data-testid="bmi-calc-btn"]');

    if (!openBtn || !modal) return;

    openBtn.addEventListener("click", function (e) {
      e.preventDefault();                                                                     // prevent default link behavior
      modal.classList.add("active");
    });

    if (closeBtn) {
      closeBtn.addEventListener("click", function () {
        modal.classList.remove("active");
      });
    }

    modal.addEventListener("click", function (e) {
      if (e.target === modal) modal.classList.remove("active");
    });

    if (calcBtn) {
      calcBtn.addEventListener("click", function () {
        const weight = parseFloat(                                                           // converting string to number
          document.querySelector('[data-testid="bmi-weight"]')?.value || "0",          //? - optional chaining to avoid errors if element missing
        );
        const heightCm = parseFloat(document.querySelector('[data-testid="bmi-height"]')?.value || "0");
        const resultDiv = document.querySelector('[data-testid="bmi-result"]');
        if (!weight || !heightCm || !resultDiv) return;

        const bmi = weight / Math.pow(heightCm / 100, 2);
        let category = "Obese";
        if (bmi < 18.5) category = "Underweight";
        else if (bmi < 25) category = "Normal Weight";
        else if (bmi < 30) category = "Overweight";

        const numberEl = resultDiv.querySelector(".bmi-number");
        const categoryEl = resultDiv.querySelector(".bmi-category");
        if (numberEl) numberEl.textContent = bmi.toFixed(1);                                       // display BMI with 1 decimal place
        if (categoryEl) categoryEl.textContent = category;
        resultDiv.classList.add("visible");
      });
    }
  }

  function CalorieCalculator() {
    const calcBtn = document.querySelector('[data-testid="calorie-calc-btn"]');
    if (!calcBtn) return;

    calcBtn.addEventListener("click", function () {
      const age = parseInt(document.querySelector('[data-testid="calc-age"]')?.value || "0");
      const gender = document.querySelector('[data-testid="calc-gender"]')?.value || "male";
      const weight = parseFloat(document.querySelector('[data-testid="calc-weight"]')?.value || "0");
      const height = parseFloat(document.querySelector('[data-testid="calc-height"]')?.value || "0");
      const activity = document.querySelector('[data-testid="calc-activity"]')?.value || "moderate";
      const resultDiv = document.querySelector('[data-testid="calorie-result"]');
      if (!age || !weight || !height || !resultDiv) return;

      const bmr = gender === "male" ? 10 * weight + 6.25 * height - 5 * age + 5 : 10 * weight + 6.25 * height - 5 * age - 161;

      const multipliers = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        active: 1.725,
        "very-active": 1.9,
      };

      const tdee = Math.round(bmr * (multipliers[activity] || 1.55));
      const numberEl = resultDiv.querySelector(".calc-result-number");
      if (numberEl) numberEl.textContent = tdee;
      resultDiv.classList.add("visible");
    });
  }
  // ==================== CHATBOT ====================
  function appendChatMessage(messagesDiv, text, type) {
    const msg = document.createElement("div");
    msg.className = "chat-message " + type;
    msg.textContent = text;
    messagesDiv.appendChild(msg);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }

  async function sendChatMessage() {
    const chatInput = document.querySelector('[data-testid="chat-input"]');
    const messagesDiv = document.querySelector('[data-testid="chat-messages"]');

    if (!chatInput || !messagesDiv) return;

    const text = chatInput.value.trim();
    if (!text) return;

    // show user message
    appendChatMessage(messagesDiv, text, "user");
    chatInput.value = "";

    // show typing indicator
    const typing = document.createElement("div");
    typing.className = "chat-message bot";
    typing.textContent = "Typing...";
    messagesDiv.appendChild(typing);

    try {
      const res = await fetch("http://localhost:5007/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
          userData: {
            name: document.getElementById("login-name")?.value || "User",
            goal: "fitness",
          },
        }),
      });

      const data = await res.json();

      typing.remove();
      appendChatMessage(messagesDiv, data.reply, "bot");
    } catch (err) {
      typing.remove();
      appendChatMessage(messagesDiv, "Error connecting to server", "bot");
      console.error(err);
    }
  }

  function Chatbot() {
    const sendBtn = document.querySelector('[data-testid="chat-send-btn"]');
    const chatInput =
      document.querySelector('[data-testid="chat-input"]') ||
      document.getElementById("chatInput");

    if (sendBtn) {
      sendBtn.addEventListener("click", sendChatMessage);
    }

    if (chatInput) {
      chatInput.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
          e.preventDefault();
          sendChatMessage();
        }
      });
    }

    // suggestion buttons
    document.querySelectorAll(".suggestion").forEach((btn) => {
      btn.addEventListener("click", () => {
        chatInput.value = btn.dataset.query;
        sendChatMessage();
      });
    });
  }
  // ==================== CONTACT ====================
  function ContactForm() {
    const form = document.querySelector('[data-testid="contact-form"]');
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const nameInput = document.getElementById("name");
      const emailInput = document.getElementById("email");
      const messageInput = document.getElementById("message");
      if (!nameInput || !emailInput || !messageInput) return;

      const emailPattern = /^[a-zA-Z0-9]+@+[a-zA-Z]+.+[a-zA-Z]{2,3}$/;
      const valid =nameInput.value.trim() && emailPattern.test(emailInput.value.trim()) && messageInput.value.trim();

      if (!valid) return;

      const success = document.getElementById("successMessage");
      if (success) {
        success.classList.add("visible");
        success.style.display = "block";
      }
      form.reset();
    });
  }
  // ==================== STORIES ====================
  function StoryFilter() {
    const filterBtns = document.querySelectorAll('[data-testid="filter-btn"]');
    const storyCards = document.querySelectorAll('[data-testid="story-card"]');
    if (!filterBtns.length || !storyCards.length) return;

    filterBtns.forEach((btn) => {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        const filter = this.getAttribute("data-filter") || "all";

        filterBtns.forEach((b) => b.classList.remove("active"));
        this.classList.add("active");

        storyCards.forEach((card) => {
          const category = card.getAttribute("data-category");
          card.style.display =
            filter === "all" || category === filter ? "" : "none";
        });
      });
    });
  }
  // ==================== WORKOUT COLLAPSE ====================
  function WorkoutCollapse() {
    document.addEventListener("click", function (e) {
      const header = e.target.closest(".workout-header");
      if (!header) return;

      const body = header.nextElementSibling;
      if (!body || !body.classList.contains("workout-body")) return;

      const isOpen = body.classList.contains("open");

      document
        .querySelectorAll(".workout-body")
        .forEach((b) => b.classList.remove("open"));
      document
        .querySelectorAll(".workout-header")
        .forEach((h) => h.classList.remove("active"));

      if (!isOpen) {
        body.classList.add("open");
        header.classList.add("active");
      }
    });
  }
  // ==================== WORKOUT FLOW ====================
  function SelectionSteps() {
    const steps = document.querySelectorAll(".selection-step");
    if (!steps.length) return;
    steps.forEach((step, i) => {
      step.classList.toggle("active", i === 0);
      step.style.display = i === 0 ? "block" : "none";
    });
  }

  function showStep(stepNumber) {
    document.querySelectorAll(".selection-step").forEach((step) => {
      step.classList.remove("active");
      step.style.display = "none";
    });

    const target = document.getElementById(`step${stepNumber}`);
    if (target) {
      target.classList.add("active");
      target.style.display = "block";
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  document.querySelectorAll("[data-location]").forEach((el) => {
    el.addEventListener("click", () => {
      workoutData.location = el.dataset.location;
      showStep(2);
    });
  });

  document.querySelectorAll("[data-level]").forEach((el) => {
    el.addEventListener("click", () => {
      workoutData.level = el.dataset.level;
      showStep(3);
    });
  });

  document.querySelectorAll("[data-goal]").forEach((el) => {
    el.addEventListener("click", () => {
      workoutData.goal = el.dataset.goal;
      generateWorkoutPlan();
      showStep(4);
    });
  });

  function generateWorkoutPlan() {
    const planContainer = document.getElementById("workoutPlan");
    if (!planContainer) return;

    const plans = {
      gym: {
        beginner: {
          muscle: {
            title: "Gym • Beginner • Muscle Gain",
            days: [
              {
                day: "Monday & Thursday",
                focus: "(Chest ,Triceps ,Shoulders)",
                exercises: [
                  "Flat Dumbbell Press - 3x10 - 90 sec rest",
                  "Incline Dumbbell Press - 3x12 - 90 sec rest",
                  "Dumbbell Lateral Raises - 4X15 - 90 sec rest",
                  "Triple Rope Pushdowns - 3x12 - 90 sec rest",
                ],
              },
              {
                day: "Tuesday & Friday",
                focus: "(Back ,Biceps ,Rear Delts)",
                exercises: [
                  "Lat Pulldown - 3x10 - 90 sec rest",
                  "Seated Cable Rows - 3x12 - 90 sec rest",
                  "Face Pulls - 3x12 - 90 sec rest",
                  "Dumbbell Biceps Curls - 3x12 - 90 sec rest",
                  "Hammer Curls - 3x12 - 90 sec rest",
                ],
              },
              {
                day: "Wednesday & Saturday",
                focus: "(Legs, Abs)",
                exercises: [
                  "Goblet Squat - 3x10 - 90 sec rest",
                  "Leg Press - 3x12 - 90 sec rest",
                  "Leg Extensions - 3x15 - 90 sec rest",
                  "Lying Leg Curls - 3x12 - 90 sec rest",
                  "Seated Calf Raises - 3x15 - 90 sec rest",
                  "Hanging Leg Raises - 3x12 - 90 sec rest",
                ],
              },
            ],
          },
          fatloss: {
            title: "Gym • Beginner • Fat Loss",
            days: [
              {
                day: "Monday & Thursday",
                focus: "(Chest ,Triceps ,Shoulders)",
                exercises: [
                  "Flat Dumbbell Press - 3x15 - 45 sec rest",
                  "Incline Dumbbell Press - 3x15 - 45 sec rest",
                  "Seated Dumbbell Shoulder Press - 3x15 - 45 sec rest",
                  "Dumbbell Lateral Raises - 3x15 - 45 sec rest",
                  "Tricep Rope Pushdowns - 3x12 - 45 sec rest",
                ],
              },
              {
                day: "Tuesday & Friday",
                focus: "(Back, Biceps, Rear Delts)",
                exercises: [
                  "Lat Pulldown - 4X12 - 45 sec rest",
                  "Seated Cable Rows - 3x15 - 45 sec rest",
                  "Face Pulls - 3x25 - 45 sec rest",
                  "Dumbbell Biceps Curls - 3x12 - 45 sec rest",
                  "Hammer Curls - 3x12 - 45 sec rest",
                ],
              },
              {
                day: "Wednesday & Saturday",
                focus: "(Legs, Abs)",
                exercises: [
                  "Goblet Squat - 3x15 - 60 sec rest",
                  "Leg Press - 3x15 - 60 sec rest",
                  "Leg Extensions - 3x2 min - 45 sec rest",
                  "Lying Leg Curls - 3x12 - 45 sec rest",
                  "Seated Calf Raises - 3x15 - 45 sec rest",
                  "Hanging Leg Raises - 3x12 - 45 sec rest",
                ],
              },
            ],
          },
        },
        intermediate: {
          muscle: {
            title: "Gym • Intermediate • Muscle Gain",
            days: [
              {
                day: "Monday & Thursday",
                focus: "(Chest, Shoulders, Triceps)",
                exercises: [
                  "Barbell Bench Press - 4x8 - 2 min rest",
                  "Incline Dumbbell Press - 4x10 - 90 sec rest",
                  "Standing Overhead Press - 3x12 - 2 min rest",
                  "Weighted Dips - 3x12 - 2 min rest",
                  "Cable Flyes - 3x12 - 90 sec rest",
                  "EZ-Bar Skullcrushers - 3x12 - 90 sec rest",
                ],
              },
              {
                day: "Tuesday & Friday",
                focus: "(Back, Biceps, Rear Delts)",
                exercises: [
                  "Weighted Pull-up - 4x6 - 2 min rest",
                  "Bent-over Row - 4x10 - 90 sec rest",
                  "Seated Cable Rows - 3x12 - 90 sec rest",
                  "Barbell Face Pulls - 3x12 - 90 sec rest",
                  "Incline Dumbbell Row - 3x12 - 90 sec rest",
                ],
              },
              {
                day: "Wednesday & Saturday",
                focus: "(Legs, Abs)",
                exercises: [
                  "Barbell Back Squat - 4x8 - 2 min rest",
                  "RDL - 3x10 - 90 sec rest",
                  "Leg Press - 3x12 - 90 sec rest",
                  "Standing Calf Raises - 3x15 - 90 sec rest",
                  "Weighted Hanging Leg Raises - 3x12 - 90 sec rest",
                ],
              },
            ],
          },
          fatloss: {
            title: "Gym • Intermediate • Fat Loss",
            days: [
              {
                day: "Monday & Thursday",
                focus: "(Chest, Shoulders, Triceps)",
                exercises: [
                  "Barbell Bench Press - 4x12 - 60 sec rest",
                  "Push-ups - 4x20 - 90 sec rest",
                  "Standing Overhead Press - 4x12 - 90 sec rest",
                  "Dumbbell Lateral Raises - 3x12 - 90 sec rest",
                  "Tricep Dips - 3x12 - 90 sec rest",
                ],
              },
              {
                day: "Tuesday & Friday",
                focus: "(Back, Biceps, Rear Delts)",
                exercises: [
                  "Pull ups - 4x12 - 90 sec rest",
                  "Seated Cable Rows - 4x12 - 90 sec rest",
                  "Hammer Curls - 4x12 - 90 sec rest",
                  "EZ-Bar Biceps Curls - 4x12 - 90 sec rest",
                ],
              },
              {
                day: "Wednesday & Saturday",
                focus: "(Legs, Abs)",
                exercises: [
                  "Barbell Back Squat - 4x12 - 90 sec rest",
                  "Lunges - 4x20 - 90 sec rest",
                  "Sled Push - 8 rounds - 90 sec rest",
                  "Weighted Hanging Leg Raises - 3x12 - 90 sec rest",
                  "Leg Extensions - 3x12 - 90 sec rest",
                ],
              },
            ],
          },
        },
        advanced: {
          muscle: {
            title: "Gym • Advanced • Muscle Gain",
            days: [
              {
                day: "Monday & Thursday",
                focus: "(Chest, Shoulders, Triceps)",
                exercises: [
                  "Pause-Rep Barbell Bench Press - 4X8 - 2 min rest",
                  "Incline Barbell Press - 4x6 - 2 min rest",
                  "Weighted Dips - 4x8 - 2 min rest",
                  "Dumbbell Lateral Raises - 3x12 - 90 sec rest",
                  "Overhead Cable Triceps Extension - 3x12 - 90 sec rest",
                ],
              },
              {
                day: "Tuesday & Friday",
                focus: "(Back, Biceps, Rear Delts)",
                exercises: [
                  "T-Bar Rows - 4x8 - 2 min rest",
                  "Weighted Pull-up - 4x8 - 2 min rest",
                  " Rack Pulls - 4x8 - 2 min rest",
                  "Seated Cable Rows - 4x12 - 90 sec rest",
                  "Incline Dumbbell Row - 3x12 - 90 sec rest",
                  "Barbell Biceps Curl - 3x12 - 90 sec rest",
                ],
              },
              {
                day: "Wednesday & Saturday",
                focus: "(Legs, Abs)",
                exercises: [
                  "Barbell Back Squat - 5x8 - 3 min rest",
                  "Romanian Deadlift - 4x10 - 2 min rest",
                  "Leg Press - 4x10 - 2 min rest",
                  "Leg Extensions - 3x12 - 90 sec rest",
                  "Seated Calf Raises - 3x15 - 90 sec rest",
                ],
              },
            ],
          },
          fatloss: {
            title: "Gym • Advanced • Fat Loss",
            days: [
              {
                day: "Monday & Thursday",
                focus: "(Chest, Shoulders, Triceps)",
                exercises: [
                  "Barbell Bench Press - 4x10 - 2 min rest",
                  "Giant Set: Incline Dumbbell Press - 4X12 - 90 sec rest",
                  "Overhead Triceps Extension - 3x12 - 90 sec rest",
                  "Tricep Dips - 3x12 - 90 sec rest",
                  "Cable Cross-Over - 3x12 - 90 sec rest",
                ],
              },
              {
                day: "Tuesday & Friday",
                focus: "(Back, Biceps, Rear Delts)",
                exercises: [
                  "Weighted Pull-up - 5x10 - 2 min rest",
                  "Dumbbell Hammer Curls - 5x20 - 90 sec rest",
                  "Sprints - 8 rounds - 90 sec rest",
                  "EZ-Bar Biceps Curls - 3x12 - 90 sec rest",
                ],
              },
              {
                day: "Wednesday & Saturday",
                focus: "(Legs, Abs)",
                exercises: [
                  "Barbell Back Squat - 5x8 - 2 min rest",
                  "Romanian Deadlift - 4x24 - 90 sec rest",
                  "Leg Extensions - 3X12 - 90 sec rest",
                  "Weighted Plank - 3x12 - 90 sec rest",
                ],
              },
            ],
          },
        },
      },
      home: {
        beginner: {
          muscle: {
            title: "Home • Beginner • Muscle Gain",
            days: [
              {
                day: "Monday & Thursday",
                focus: "(Chest & Triceps)",
                exercises: [
                  "Standard Push-ups - 4x12 - 60 sec rest",
                  "Bodyweight Squats - 3x10 - 60 sec rest",
                  "Pike Push-ups - 3x12 - 60 sec rest",
                  "Reverse Lunges - 3x12 - 60 sec rest",
                  "Bench or Chair Dips - 3x12 - 60 sec rest",
                ],
              },
              {
                day: "Tuesday & Friday",
                focus: "(Back & Biceps)",
                exercises: [
                  "Doorway Rows - 4x20 - 60 sec rest",
                  "Floor Pulls - 3x15 - 60 sec rest",
                  "Reverse snow Angels - 3x20 - 60 sec rest",
                  "Biceps Self-Resistance Curls - 3x12 - 60 sec rest",
                ],
              },
              {
                day: "Wednesday & Saturday",
                focus: "(Legs & Abs)",
                exercises: [
                  "Bodyweight Squats - 3x12 - 60 sec rest",
                  "Glute Bridges - 3x20 - 60 sec rest",
                  "Standing Calf Raises - 3x15 - 60 sec rest",
                  "Bicycle Crunches - 3x20 - 60 sec rest",
                  "Leg Raises - 3x30s - 60 sec rest",
                ],
              },
            ],
          },
          fatloss: {
            title: "Home • Beginner • Fat Loss",
            days: [
              {
                day: "Monday & Thursday",
                focus: "(Chest & Triceps)",
                exercises: [
                  "Standard Push-ups - 3x15 - 30 sec rest",
                  "Pike Push-ups - 3x15 - 30 sec rest",
                  "Incline Push-ups - 3x15 - 30 sec rest",
                  "Bench or Chair Dips - 3x12 - 30 sec rest",
                  "Mountain Climber - 3x30 - 30 sec rest",
                ],
              },
              {
                day: "Tuesday & Friday",
                focus: "(Back & Biceps)",
                exercises: [
                  "Doorway Rows - 4x12 - 30 sec rest",
                  "Reverse Snow Angels - 3x30 - 30 sec rest",
                  "Bicep Self-Resistance Curls - 3x20 - 30 sec rest",
                  "High Knees - 3x20 - 30 sec rest",
                ],
              },
              {
                day: "Wednesday & Saturday",
                focus: "(Legs & Abs)",
                exercises: [
                  "Bodyweight Squats - 3x20 - 30 sec rest",
                  "Reverse Lunges - 3x12 - 30 sec rest",
                  "Glute Bridges - 3x30s - 30 sec rest",
                  "Bicycle Crunches - 3x20 - 30 sec rest",
                  "Leg Raises - 3x30s - 30 sec rest",
                ],
              },
            ],
          },
        },
        intermediate: {
          muscle: {
            title: "Home • Intermediate • Muscle Gain",
            days: [
              {
                day: "Monday & Thursday",
                focus: "(Chest, Shoulders & Triceps)",
                exercises: [
                  "Decline Push-up - 4x15 - 30 sec rest",
                  "Incline Push-up - 4x10 - 30 sec rest",
                  "Diamond Push-up - 4x12 - 30 sec rest",
                  "Single-arm Push-up - 4x10 - 30 sec rest",
                ],
              },
              {
                day: "Tuesday & Friday",
                focus: "(Back & Biceps)",
                exercises: [
                  "Towel Door Rows - 4x20 - 60 sec rest",
                  "Single-Arm Rows - 4x12 - 90 sec rest",
                  "Reverse Snow Angels - 4x60s - 30 sec rest",
                  "Towel Hammer Curls - 4x12 - 60 sec rest",
                ],
              },
              {
                day: "Wednesday & Saturday",
                focus: "(Legs & Abs)",
                exercises: [
                  "Bulgarian Split Squat - 4x15 - 60 sec rest",
                  "Glute Bridges - 4x15 - 30 sec rest",
                  "Hollow Body Hold - 4x15 - 45 sec rest",
                  "Hanging Knee Raises - 4x10 - 30 sec rest",
                ],
              },
            ],
          },
          fatloss: {
            title: "Home • Intermediate • Fat Loss",
            days: [
              {
                day: "Monday & Thursday",
                focus: "(Chest, Shoulders & Triceps)",
                exercises: [
                  "Decline Push-up - 5x15 - 30 sec rest",
                  "Incline Push-up - 5x20 - 30 sec rest",
                  "Burpees - 5x12 - 30 sec rest",
                  "Shadow Boxing - 3X60s - 30 sec rest",
                ],
              },
              {
                day: "Tuesday & Friday",
                focus: "(Back & Biceps)",
                exercises: [
                  "Towel Door Rows - 5x20 - 30 sec rest",
                  "Push-up - 5x15 - 30 sec rest",
                  "Mountain Climber - 5x40s - 30 sec rest",
                  "Planks with Shoulder Taps - 5x30s - 30 sec rest",
                ],
              },
              {
                day: "Wednesday & Saturday",
                focus: "(Legs & Abs)",
                exercises: [
                  "Bulgarian Split Squat - 4X15 - 60 sec rest",
                  "Jump Squats - 4X15 - 30 sec rest",
                  "Jump Lunges - 4x15 - 30 sec rest",
                  "V-Ups - 4x10 - 30 sec rest",
                  "Hollow Body Hold - 4x15 - 45 sec rest",
                ],
              },
            ],
          },
        },
        advanced: {
          muscle: {
            title: "Home • Advanced • Muscle Gain",
            days: [
              {
                day: "Monday & Thursday",
                focus: "(Chest, Shoulders & Triceps)",
                exercises: [
                  "Archer Push-ups - 5x10 - 30 sec rest",
                  "Handstand Push-up - 5x8 - 60 sec rest",
                  "Pseudo Planche Push ups - 5x12 - 30 sec rest",
                  "Single-arm Push-up - 5x10 - 30 sec rest",
                  "Explosive Push-ups - 5x10 - 30 sec rest",
                ],
              },
              {
                day: "Tuesday & Friday",
                focus: "(Back & Biceps)",
                exercises: [
                  "Bodyweight Pullovers - 5x10 - 30 sec rest",
                  "Single Arm Towel Rows - 5x20 - 30 sec rest",
                  "Reverse Snow Angels - 5x10 - 30 sec rest",
                  "Chin-up Alternatives - 5x10 - 30 sec rest",
                ],
              },
              {
                day: "Wednesday & Saturday",
                focus: "(Legs & Abs)",
                exercises: [
                  "Pistol Squats - 5x8 - 30 sec rest",
                  "Nordic Hamstring Curls - 5x10 - 30 sec rest",
                  "Bulgarian Split Squat - 5x45s - 30 sec rest",
                  "L-Sit Hold - 5x30s - 30 sec rest",
                  "Dragon Flag or V-Ups - 5x10 - 30 sec rest",
                ],
              },
            ],
          },
          fatloss: {
            title: "Home • Advanced • Fat Loss",
            days: [
              {
                day: "Monday & Thursday",
                focus: "(Chest, Shoulders & Triceps)",
                exercises: [
                  "Handstand Push-up - 4X10 - 60 sec rest",
                  "Sprint in Place - 10 rounds - 45 sec rest",
                  "Plank Jacks - 6x40s - 30 sec rest",
                  "Giant Set - 3X10- 60 sec rest",
                  "Shadow Boxing - 3X60s - 30 sec rest",
                ],
              },
              {
                day: "Tuesday & Friday",
                focus: "(Back & Biceps)",
                exercises: [
                  "Bodyweight Lat  Pullovers - 5x10 - 30 sec rest",
                  "Single Arm Towel Rows - 6x20 - 30 sec rest",
                  "Table Rows - 5x10 - 30 sec rest",
                  "Burpees - 5x12 - 30 sec rest",
                ],
              },
              {
                day: "Wednesday & Saturday",
                focus: "(Legs & Abs)",
                exercises: [
                  "Pistol Squats - 4X12 - 30 sec rest",
                  "Plyometric Bulgarian Split Squat - 3X15 - 30 sec rest",
                  "Nordic Hamstring Curls - 4X10 - 30 sec rest",
                  "Jump Squats - 4X15 - 30 sec rest",
                  "Giant Set:V-Ups + Bicycle Crunches + Plank - 3X10- 60 sec rest",
                ],
              },
            ],
          },
        },
      },
    };

    const selected =
      plans[workoutData.location?.toLowerCase()]?.[
        workoutData.level?.toLowerCase()
      ]?.[workoutData.goal?.toLowerCase()];
    if (!selected) {
      planContainer.innerHTML =
        "<p>Please complete all workout selections first.</p>";
      return;
    }

    planContainer.innerHTML = `
      <div class="program-detail reveal" data-testid="generated-workout-plan">
        <div class="program-detail-header">
          <span class="section-label">Custom Plan</span>
          <h2>${selected.title}</h2>
        </div>
        ${selected.days
          .map(
            (day, i) => `
          <div class="workout-level" data-testid="workout-day-${i + 1}">
            <div class="workout-header ${i === 0 ? "active" : ""}">
              <h3>${day.day} - ${day.focus}</h3>
              <span class="workout-toggle">+</span>
            </div>
            <div class="workout-body ${i === 0 ? "open" : ""}">
              <div class="workout-body-inner">
                <div class="exercise-list">
                  ${day.exercises
                    .map((ex) => {
                      const parts = ex.split(" - ");
                      const name = parts[0];
                      const sets = parts[1];
                      const rest = parts[2];

                      return `
                        <div class="exercise-item">
                          <div class="exercise-name">${name}</div>
                          <div class="exercise-info">${sets} | ${rest}</div>
                        </div>
                     `;
                    })
                    .join("")}
                </div>
              </div>
            </div>
          </div>`,
          )
          .join("")}
      </div>
    `;
  }

  document.getElementById("resetBtn").addEventListener("click", function () {
    workoutData = { location: "", level: "", goal: "" };

    const planContainer = document.getElementById("workoutPlan");
    if (planContainer) planContainer.innerHTML = "";

    showStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  // ==================== DIET FLOW ====================
  function DietSteps() {
    const steps = document.querySelectorAll(".diet-step");
    if (!steps.length) return;

    // initial state
    steps.forEach((step, i) => {
      step.classList.toggle("active", i === 0);
    });

    const dietCards = document.querySelectorAll(".diet-choice-card");
    const goalCards = document.querySelectorAll(".diet-goal-card");
    const resetBtn = document.getElementById("resetDietBtn");

    // Step 1 → Step 2 (Diet Type)
    dietCards.forEach((card) => {
      card.addEventListener("click", function () {
        const type = this.dataset.type;
        if (!type) return;

        dietData.type = type;

        document.body.classList.remove("veg-theme", "non-veg-theme");
        document.body.classList.add(
          type === "veg" ? "veg-theme" : "non-veg-theme",
        );
        showDietStep(2);
      });
    });

    // Step 2 → Step 3 (Goal + Meal Plan)
    goalCards.forEach((card) => {
      card.addEventListener("click", function () {
        const goal = this.dataset.goal;
        if (!goal) return;

        dietData.goal = goal;

        generateMealPlan();
        showDietStep(3);
      });
    });

    // Reset
    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        dietData = { type: "", goal: "" };

        document.body.classList.remove("veg-theme", "non-veg-theme");

        const planContainer = document.getElementById("mealPlan");
        if (planContainer) planContainer.innerHTML = "";

        showDietStep(1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }
  }
  // ==================== DIET STEP NAVIGATION ====================
  function showDietStep(stepNumber) {
    document.querySelectorAll(".diet-step").forEach((step) => {
      step.classList.remove("active");
    });

    const target = document.getElementById(`dietStep${stepNumber}`);
    if (target) {
      target.classList.add("active");
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function generateMealPlan() {
    const planContainer = document.getElementById("mealPlan");
    if (!planContainer) return;

    const plans = {
      veg: {
        fatloss: {
          title: "Fat Loss Diet (Veg)",
          breakfast: [
            "Paneer Bhurji (100g): Scrambled paneer with onions, tomatoes, and green chilies",
            "Moong Dal Chilla stuffed with grated paneer",
            "Sprouted Moong Salad with lemon, cucumber, and pomegranate",
            "Oats Upma with peas, carrots, and beans",
            "Greek Yogurt or Hung Curd with walnuts and chia seeds",
            "Tofu Scramble with turmeric and black salt",
          ],
          lunch: [
            "Soya Chunk Curry in light tomato-onion gravy",
            "Missi Roti with yellow or black dal",
            "Paneer Tikka (150g) grilled with bell peppers",
            "Quinoa Vegetable Pulao with seasonal vegetables",
            "Chickpea (Chole) Salad with lemon dressing",
            "Curd Rice (Brown Rice) with probiotic curd",
          ],
          snacks: [
            "Roasted Makhana with salt and pepper",
            "Boiled Black Chana with chaat masala",
            "Roasted Peanuts or Almonds (20–30g)",
            "Roasted Soybeans",
            "Peanut Butter on Apple slices",
            "Whey Protein Shake",
          ],
          dinner: [
            "Grilled Tofu or Paneer Steaks",
            "Vegetable Dalia with moong dal",
            "Lentil Soup (Shorba) with spinach",
            "Palak Paneer (Low Oil)",
            "Stir-fried Broccoli and Mushrooms",
            "Bottle Gourd (Lauki) with curd",
          ],
          macros: {
            calories: "1600-1800",
            protein: "90-110g",
            carbs: "170-200g",
            fats: "45-55g",
          },
        },

        muscle: {
          title: "Muscle Gain Diet (Veg)",
          breakfast: [
            "Paneer & Oats Pancakes with honey",
            "Peanut Butter & Banana Toast",
            "Tofu or Paneer Paratha with curd",
            "Mass Gainer Shake with milk, whey, oats and banana",
            "Besan Chilla stuffed with paneer and cheese",
            "Greek Yogurt Parfait with seeds and berries",
          ],
          lunch: [
            "Soya Chunk & Pea Pulao with raita",
            "Paneer Butter Masala with multigrain roti",
            "Rajma with jeera rice",
            "Chickpea Pasta with pesto or white sauce",
            "Dal Makhani with quinoa",
            "Tofu Stir-Fry with cashews",
          ],
          snacks: [
            "Roasted Soybeans",
            "Paneer Cubes with chaat masala",
            "Hummus with pita bread",
            "Trail Mix with almonds, cashews, walnuts",
            "Sprouts Chaat with peanuts",
            "Milk with 3-4 dates",
          ],
          dinner: [
            "Soya Keema Matar with roti",
            "Vegetable Bean Soup with sourdough",
            "Paneer Tikka Roll",
            "Buckwheat Khichdi with moong dal",
            "Black Bean Burgers",
            "Sweet Potato Chickpea Curry",
          ],
          macros: {
            calories: "2600-3000",
            protein: "140-160g",
            carbs: "320-360g",
            fats: "80-90g",
          },
        },

        maintenance: {
          title: "Maintenance Diet (Veg)",
          breakfast: [
            "Vegetable Poha with peanuts",
            "Paneer Paratha with curd",
            "Multigrain Toast with avocado or butter and milk",
            "Fruit & Nut Oatmeal",
            "Besan Chilla with vegetables",
            "Upma with mixed veggies",
          ],
          lunch: [
            "Dal Chawal Sabzi plate",
            "Paneer Wrap with mint chutney",
            "Quinoa Salad with chickpeas",
            "Curd Rice with tadka",
            "Mixed Veg Khichdi",
            "Roti with Black Chana Curry",
          ],
          snacks: [
            "Roasted Makhana",
            "Mixed Seeds and Nuts",
            "Sprouts Chaat",
            "Tea/Coffee with digestive biscuits",
            "Hummus with cucumber sticks",
            "Paneer Cubes",
          ],
          dinner: [
            "Soya Chunk Stir-fry",
            "Vegetable Daliya",
            "Paneer Mushroom Soup",
            "Lauki Chana Dal with roti",
            "Tofu Broccoli Salad",
            "Moong Dal Soup",
          ],
          macros: {
            calories: "2000-2200",
            protein: "100-120g",
            carbs: "250-280g",
            fats: "60-70g",
          },
        },
      },

      nonveg: {
        fatloss: {
          title: "Fat Loss Diet (Non-Veg)",
          breakfast: [
            "Egg White Omelet with spinach and mushrooms",
            "3-4 Boiled Eggs with black coffee",
            "Grilled Chicken Sausages with sautéed vegetables",
            "Scrambled Eggs with smoked salmon",
            "Egg Bhurji with ginger and green chilies",
            "Protein Pancakes with whey and oats",
          ],
          lunch: [
            "Grilled Chicken Breast with green salad",
            "Fish Curry with steamed vegetables",
            "Chicken Stir-Fry with broccoli and peppers",
            "Tuna Salad with Greek yogurt",
            "Chicken Lettuce Wraps",
            "Chicken Keema with brown rice",
          ],
          snacks: [
            "Chicken Tikka pieces",
            "Boiled Egg Whites",
            "Chicken or Beef Jerky",
            "Shrimp Cocktail",
            "Whey Protein Shake",
            "Greek Yogurt with boiled egg",
          ],
          dinner: [
            "Baked Fish Fillet with asparagus",
            "Clear Chicken Soup",
            "Lemon Garlic Shrimp",
            "Grilled Chicken Skewers",
            "Egg Drop Soup",
            "Chicken Breast Steak with mashed cauliflower",
          ],
          macros: {
            calories: "1700-1900",
            protein: "130-150g",
            carbs: "150-170g",
            fats: "50-60g",
          },
        },

        muscle: {
          title: "Muscle Gain Diet (Non-Veg)",
          breakfast: [
            "Champion Omelet with cheese and toast",
            "Chicken Keema Paratha with curd",
            "Smoked Salmon Avocado Bagel",
            "Steak and Eggs with roasted potatoes",
            "Mass Gainer Egg Shake",
            "Turkish Eggs (Cilbir)",
          ],
          lunch: [
            "Chicken Thigh Rice Bowl",
            "Grilled Fish with Sweet Potato",
            "Classic Chicken Pasta",
            "Mutton Curry with Missi Roti",
            "Chicken Burrito",
            "Egg Potato Salad",
          ],
          snacks: [
            "Tuna Sandwich",
            "Chicken Tikka Skewers",
            "Boiled Eggs with Nuts",
            "Beef or Chicken Jerky",
            "Peanut Butter Egg Toast",
            "Whey Protein with Fruit",
          ],
          dinner: [
            "Baked Chicken Breast with Quinoa",
            "Shrimp Stir-Fry with noodles",
            "Turkey Meatballs with spaghetti",
            "Grilled Lamb Chops with spinach",
            "Chicken Stew",
            "Lean Ground Beef Rice Bowl",
          ],
          macros: {
            calories: "2800-3200",
            protein: "180-200g",
            carbs: "330-370g",
            fats: "90-100g",
          },
        },

        maintenance: {
          title: "Maintenance Diet (Non-Veg)",
          breakfast: [
            "Masala Omelet with whole-wheat toast",
            "Scrambled Eggs with sautéed spinach",
            "Chicken Keema on toast",
            "Boiled Eggs with fruit",
            "Egg Bhurji with paratha",
            "Protein Smoothie",
          ],
          lunch: [
            "Grilled Chicken Salad",
            "Fish Curry with rice",
            "Chicken Pulav",
            "Egg Curry with roti",
            "Chicken Sandwich",
            "Prawn Stir-Fry",
          ],
          snacks: [
            "Tuna Crackers",
            "Chicken Tikka",
            "Boiled Egg Whites",
            "Greek Yogurt with seeds",
            "Almonds with boiled egg",
            "Meat Jerky",
          ],
          dinner: [
            "Baked Lemon Chicken with beans",
            "Egg Drop Soup with vegetables",
            "Grilled Fish Fillet",
            "Chicken Lentil Soup",
            "Shrimp Salad",
            "Chicken Keema Matar",
          ],
          macros: {
            calories: "2200-2400",
            protein: "130-150g",
            carbs: "250-280g",
            fats: "70-80g",
          },
        },
      },
    };

    const selected = plans[dietData.type]?.[dietData.goal];

    if (!selected) {
      planContainer.innerHTML =
        "<p>No plan found. Please select diet type and goal again.</p>";
      return;
    }

    planContainer.innerHTML = `
  <div class="program-detail reveal" data-testid="generated-meal-plan">

    <div class="program-detail-header">
      <span class="section-label">Custom Plan</span>
      <h2>${selected.title}</h2>

      <div class="program-tags">
        <span class="program-tag">${selected.macros.calories} kcal/day</span>
        <span class="program-tag">Protein ${selected.macros.protein}</span>
        <span class="program-tag">Carbs ${selected.macros.carbs}</span>
        <span class="program-tag">Fats ${selected.macros.fats}</span>
      </div>
    </div>

    <div class="diet-detail-grid">

      <div class="diet-detail-card">
        <h3>Breakfast</h3>
        <ul class="diet-tips">${selected.breakfast.map((i) => `<li>${i}</li>`).join("")}</ul>

        <h3 style="margin-top:1rem;">Lunch</h3>
        <ul class="diet-tips">${selected.lunch.map((i) => `<li>${i}</li>`).join("")}</ul>

        <h3 style="margin-top:1rem;">Evening Snacks</h3>
        <ul class="diet-tips">${selected.snacks.map((i) => `<li>${i}</li>`).join("")}</ul>

        <h3 style="margin-top:1rem;">Dinner</h3>
        <ul class="diet-tips">${selected.dinner.map((i) => `<li>${i}</li>`).join("")}</ul>
      </div>

    </div>
  </div>
  `;
  }
  // ==================== OPTIONAL AI MODAL ====================
  function openAIModal() {
    const modal = document.getElementById("aiModal");
    if (modal) modal.classList.add("active");
  }

  function closeAIModal() {
    const modal = document.getElementById("aiModal");
    if (modal) modal.classList.remove("active");
  }

  function selectPlan(element, planType) {
    selectedSubscriptionPlan = planType;
    document.querySelectorAll(".card").forEach((c) => {
      c.style.borderColor = "transparent";
    });
    if (element) element.style.borderColor = "#D4AF37";
  }

  function startTrial() {
    if (!selectedSubscriptionPlan) {
      alert("Please select a subscription plan");
      return;
    }
    closeAIModal();
    window.location.href = "assistant.html";
  }

  // close modal click outside
  window.addEventListener("click", function (e) {
    const modal = document.getElementById("aiModal");
    if (modal && e.target === modal) closeAIModal();
  });
  // ==================== GLOBAL EXPOSE (INLINE ONCLICK) ====================
  window.openAIModal = openAIModal;
  window.closeAIModal = closeAIModal;
  window.selectPlan = selectPlan;
  window.startTrial = startTrial;

  window.sendMessage = sendChatMessage;
  // ==================== LOGIN SYSTEM ====================
  function LoginSystem() {
    const loginOverlay = document.querySelector('[data-testid="login-modal"]');
    const loginForm = document.getElementById("loginForm");
    const planCards = document.querySelectorAll(".plan-card");
    const selectedPlanInput = document.getElementById("selected-plan");
    const planError = document.getElementById("plan-error");
    const chatContainer = document.querySelector(
      '[data-testid="chat-container"]',
    );
    const loginLink = document.getElementById("loginLink");

    if (!loginOverlay || !loginForm) return;

    // Always show login modal and disable chat
    loginOverlay.classList.add("active");
    if (chatContainer) chatContainer.classList.add("disabled");

    // Plan selection
    planCards.forEach((card) => {
      card.addEventListener("click", function () {
        planCards.forEach((c) => c.classList.remove("selected"));
        this.classList.add("selected");
        const plan = this.getAttribute("data-plan");
        selectedPlanInput.value = plan;
        planError.classList.remove("visible");
      });
    });

    // Form submission
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = document.getElementById("login-name").value.trim();
      const phone = document.getElementById("login-phone").value.trim();
      const email = document.getElementById("login-email").value.trim();
      const plan = selectedPlanInput.value;

      // Validation
      if (!name || !phone || !email) {
        alert("Please fill in all required fields");
        return;
      }

      if (!plan) {
        planError.classList.add("visible");
        return;
      }

      // Email validation
      const emailPattern = /^[a-zA-Z0-9]+@+[a-zA-Z]+.+[a-zA-Z]{2,3}$/;
      if (!emailPattern.test(email)) {
        alert("Please enter a valid email address");
        return;
      }

      // Save user data (optional - can be removed if not needed)
      const user = {
        name: name,
        phone: phone,
        email: email,
        plan: plan,
        loginDate: new Date().toISOString(),
      };

      localStorage.setItem("fitverse_logged_in", "true");
      localStorage.setItem("fitverse_user", JSON.stringify(user));

      // Hide login modal and enable chat
      loginOverlay.classList.remove("active");
      if (chatContainer) chatContainer.classList.remove("disabled");

      // Welcome message
      setTimeout(() => {
        const messagesDiv = document.querySelector(
          '[data-testid="chat-messages"]',
        );
        if (messagesDiv) {
          appendChatMessage(
            messagesDiv,
            `Welcome, ${name}! I'm your AI fitness assistant. How can I help you today?`,
            "bot",
          );
        }
      }, 300);
    });

    // Login link (for returning users)
    if (loginLink) {
      loginLink.addEventListener("click", function (e) {
        e.preventDefault();
        const email = prompt("Enter your registered email:");
        if (email) {
          const storedUser = JSON.parse(
            localStorage.getItem("fitverse_user") || "{}",
          );
          if (storedUser.email === email) {
            localStorage.setItem("fitverse_logged_in", "true");
            loginOverlay.classList.remove("active");
            if (chatContainer) chatContainer.classList.remove("disabled");
            alert("Welcome back, " + storedUser.name + "!");
          } else {
            alert("Email not found. Please register first.");
          }
        }
      });
    }
  }

  window.logoutUser = function () {
    localStorage.removeItem("fitverse_logged_in");
  };
  // ==================== COMMUNITY PAGE ====================
  function Community() {
    const feed = document.getElementById("community-feed");
    if (!feed) return;

    const postInput = document.getElementById("post-input");
    const uploadBtn = document.getElementById("upload-image-btn");
    const fileInput = document.getElementById("image-upload");
    const createBtn = document.getElementById("create-post-btn");
    const previewWrap = document.getElementById("image-preview-container");
    const previewImg = document.getElementById("image-preview");
    const removeImageBtn = document.getElementById("remove-image-btn");

    const STORAGE_KEY = "fitverse_community";
    let pendingImage = null;

    const state = loadState();

    function loadState() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return { staticPosts: {}, userPosts: [] };
        const s = JSON.parse(raw);
        s.staticPosts = s.staticPosts || {};
        s.userPosts = s.userPosts || [];
        return s;
      } catch (e) {
        return { staticPosts: {}, userPosts: [] };
      }
    }
    function saveState() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (e) {}
    }
    function getStatic(id) {
      if (!state.staticPosts[id]) {
        state.staticPosts[id] = {
          likeDelta: 0,
          liked: false,
          deletedComments: [],
          addedComments: [],
        };
      }
      return state.staticPosts[id];
    }

    // Restore user posts
    state.userPosts
      .slice()
      .reverse()
      .forEach((p) => feed.prepend(buildUserPostEl(p)));

    // Apply saved state to static posts
    feed.querySelectorAll('.feed-post[data-own="false"]').forEach((post) => {
      const id = post.dataset.postId;
      if (!id) return;
      const s = getStatic(id);
      const likeCountEl = post.querySelector(".like-count");
      if (likeCountEl) {
        likeCountEl.textContent =
          (parseInt(likeCountEl.textContent, 10) || 0) + (s.likeDelta || 0);
      }
      if (s.liked) {
        const lb = post.querySelector(".like-btn");
        if (lb) {
          lb.classList.add("liked");
          const iconEl = lb.querySelector(".icon");
          if (iconEl) iconEl.textContent = "❤️";
        }
      }
      s.deletedComments.forEach((cid) => {
        post.querySelector(`.comment[data-comment-id="${cid}"]`)?.remove();
      });
      const wrap = post.querySelector(".comment-input-wrapper");
      s.addedComments.forEach((c) => {
        wrap?.parentNode.insertBefore(buildCommentEl(c.id, c.text, true), wrap);
      });
      const commentCountEl = post.querySelector(".comment-count");
      if (commentCountEl)
        commentCountEl.textContent = post.querySelectorAll(".comment").length;
    });

    function buildUserPostEl(p) {
      const el = document.createElement("div");
      el.className = "feed-post reveal visible";
      el.setAttribute("data-own", "true");
      el.setAttribute("data-post-id", p.id);
      el.innerHTML = `
      <div class="post-header">
        <div class="user-avatar">YOU</div>
        <div class="post-user-info">
          <strong>You</strong>
          <span class="post-time">${escapeHtml(p.time)}</span>
        </div>
        <button class="post-delete-btn" title="Delete post">🗑 Delete</button>
      </div>
      <div class="post-content">
        ${p.text ? `<p>${escapeHtml(p.text)}</p>` : ""}
        ${p.image ? `<img src="${p.image}" alt="" class="post-image">` : ""}
      </div>
      <div class="post-stats">
        <span class="post-stat"><span class="like-count">${p.likes || 0}</span> likes</span>
        <span class="post-stat"><span class="comment-count">${(p.comments || []).length}</span> comments</span>
      </div>
      <div class="post-actions">
        <button class="post-action-btn like-btn ${p.liked ? "liked" : ""}"><span class="icon">${p.liked ? "❤️" : "🤍"}</span> Like</button> 
        <button class="post-action-btn comment-btn"><span class="icon">💬</span> Comment</button>
        <button class="post-action-btn open-share-btn"><span class="icon">🔗</span> Share</button>
      </div>
      <div class="post-comments" style="display:none;">
        ${(p.comments || []).map((c) => commentHTML(c.id, c.text, true)).join("")}
        <div class="comment-input-wrapper">
          <input type="text" placeholder="Write a comment..." class="comment-input">
          <button class="btn-icon comment-submit-btn">➤</button>
        </div>
      </div>`;
      return el;
    }
    function commentHTML(id, text, own) {
      return `
      <div class="comment" data-comment-id="${id}" data-own="${own}">
        <div class="user-avatar sm">YOU</div>
        <div class="comment-content">
          <strong>You</strong>
          <p>${escapeHtml(text)}</p>
          ${own ? `<button class="comment-delete-btn" title="Delete comment">✖</button>` : ""}
        </div>
      </div>`;
    }
    function buildCommentEl(id, text, own) {
      const div = document.createElement("div");
      div.innerHTML = commentHTML(id, text, own).trim();
      return div.firstChild;
    }
    function uid() {
      return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
    }

    // Image upload
    uploadBtn.addEventListener("click", () => fileInput.click());
    fileInput.addEventListener("change", function () {
      const file = this.files && this.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        pendingImage = e.target.result;
        previewImg.src = pendingImage;
        previewWrap.style.display = "block";
      };
      reader.readAsDataURL(file);
    });
    removeImageBtn.addEventListener("click", () => {
      pendingImage = null;
      fileInput.value = "";
      previewImg.src = "";
      previewWrap.style.display = "none";
    });

    // Create post
    createBtn.addEventListener("click", () => {
      const text = postInput.value.trim();
      if (!text && !pendingImage) {
        alert("Write something or add an image before posting.");
        return;
      }
      const post = {
        id: "user-" + uid(),
        text,
        image: pendingImage,
        time: "Just now",
        likes: 0,
        liked: false,
        comments: [],
      };
      state.userPosts.unshift(post);
      saveState();
      feed.prepend(buildUserPostEl(post));
      postInput.value = "";
      pendingImage = null;
      fileInput.value = "";
      previewImg.src = "";
      previewWrap.style.display = "none";
    });
    postInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        createBtn.click();
      }
    });

    // Delegated feed actions
    feed.addEventListener("click", (e) => {
      const post = e.target.closest(".feed-post");
      if (!post) return;
      const postId = post.dataset.postId;
      const isOwn = post.dataset.own === "true";

      if (e.target.closest(".post-delete-btn")) {
        if (!confirm("Delete this post?")) return;
        post.remove();
        state.userPosts = state.userPosts.filter((p) => p.id !== postId);
        saveState();
        return;
      }

      const likeBtn = e.target.closest(".like-btn");
      if (likeBtn) {
        const countEl = post.querySelector(".like-count");
        const iconEl = likeBtn.querySelector(".icon");
        let n = parseInt(countEl.textContent, 10) || 0;
        const nowLiked = likeBtn.classList.toggle("liked");
        if (iconEl) iconEl.textContent = nowLiked ? "❤️" : "🤍";
        n = nowLiked ? n + 1 : n - 1;
        countEl.textContent = n;
        if (isOwn) {
          const p = state.userPosts.find((x) => x.id === postId);
          if (p) {
            p.liked = nowLiked;
            p.likes = n;
          }
        } else {
          const s = getStatic(postId);
          s.liked = nowLiked;
          s.likeDelta += nowLiked ? 1 : -1;
        }
        saveState();
        return;
      }

      if (e.target.closest(".comment-btn")) {
        const box = post.querySelector(".post-comments");
        box.style.display = box.style.display === "none" ? "block" : "none";
        return;
      }

      // ================= SHARE BUTTON CLICK =================
      document.addEventListener("click", function (e) {
        // OPEN SHARE MODAL (only for post button)
        const openBtn = e.target.closest(".open-share-btn");
        if (openBtn) {
          const post = openBtn.closest(".feed-post");
          if (!post) return;

          const postId = post.dataset.postId || "";
          const postText = post.querySelector(".post-content p")?.textContent || "Check out this post from FitVerse!";

          const postUrl = window.location.href.split("#")[0] + (postId ? "#" + postId : "");

          openShareModal(postText, postUrl);
          return;
        }

        // SHARE BUTTONS INSIDE MODAL
        const modalBtn = e.target.closest(".modal-share-btn");
        if (modalBtn) {
          const platform = modalBtn.dataset.platform;
          const text = modalBtn.dataset.text;
          const url = modalBtn.dataset.url;

          shareTo(platform, text, url);
          return;
        }

        // COPY LINK
        const copyBtn = e.target.closest(".copy-link-btn");
        if (copyBtn) {
          const url = copyBtn.dataset.url;
          copyLink(url);
          return;
        }

        // CLOSE MODAL
        if ( e.target.classList.contains("share-modal") || e.target.closest(".close-share-modal")){
          closeShareModal();
        }
      });
      // ================= OPEN MODAL =================
      function openShareModal(text, url) {
        const existing = document.querySelector(".share-modal");
        if (existing) existing.remove();

        const modal = document.createElement("div");
        modal.className = "share-modal";

        modal.innerHTML = `
        <div class="share-modal-content">
          <h3>Share this post</h3>
          <div class="share-options">
            <button class="modal-share-btn" data-platform="fb">📘 Facebook</button>
            <button class="modal-share-btn" data-platform="tw">𝕏 Twitter</button>
            <button class="modal-share-btn" data-platform="wa">💬 WhatsApp</button>
            <button class="copy-link-btn">🔗 Copy Link</button>
          </div>
          <button class="close-share-modal">Close</button>
        </div> `;

        document.body.appendChild(modal);

        // attach data safely (no inline JS)
        modal.querySelectorAll(".modal-share-btn").forEach((btn) => {
          btn.dataset.text = text;
          btn.dataset.url = url;
        });

        modal.querySelector(".copy-link-btn").dataset.url = url;

        // animation
        modal.style.display = "flex";
        setTimeout(() => {
          modal.style.opacity = "1";
        }, 10);
      }
      // ================= SHARE =================
      function shareTo(platform, text, url) {
        let link = "";

        const encodedText = encodeURIComponent(text);
        const encodedUrl = encodeURIComponent(url);

        if (platform === "fb") {
          link = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        } else if (platform === "tw") {
          link = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
        } else if (platform === "wa") {
          link = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
        }

        if (link) { window.open(link, "_blank");}
        closeShareModal();
      }
      // ================= COPY =================
      function copyLink(url) {
        navigator.clipboard.writeText(url).then(() => {
            alert("Link copied to clipboard!");
            closeShareModal();
          })
          .catch(() => {
            alert("Copy failed. Please copy manually:\n" + url);
          });
      }
      // ================= CLOSE =================
      function closeShareModal() {
        const modal = document.querySelector(".share-modal");
        if (modal) {
          modal.style.opacity = "0";
          setTimeout(() => modal.remove(), 300);
        }
      }

      const submitBtn = e.target.closest(".comment-submit-btn");
      if (submitBtn) {
        const wrap = submitBtn.closest(".comment-input-wrapper");
        const input = wrap.querySelector(".comment-input");
        const text = input.value.trim();
        if (!text) return;
        const cid = "c-" + uid();
        wrap.parentNode.insertBefore(buildCommentEl(cid, text, true), wrap);
        input.value = "";
        if (isOwn) {
          const p = state.userPosts.find((x) => x.id === postId);
          if (p) {
            p.comments = p.comments || [];
            p.comments.push({ id: cid, text });
          }
        } else {
          getStatic(postId).addedComments.push({ id: cid, text });
        }
        post.querySelector(".comment-count").textContent = post.querySelectorAll(".comment").length;
        saveState();
        return;
      }
      if (e.target.closest(".comment-delete-btn")) {
        const comment = e.target.closest(".comment");
        if (!comment || !confirm("Delete this comment?")) return;
        const cid = comment.dataset.commentId;
        comment.remove();
        if (isOwn) {
          const p = state.userPosts.find((x) => x.id === postId);
          if (p) p.comments = (p.comments || []).filter((c) => c.id !== cid);
        } else {
          const s = getStatic(postId);
          s.addedComments = s.addedComments.filter((c) => c.id !== cid);
          if (!cid.startsWith("c-") && !s.deletedComments.includes(cid)) {
            s.deletedComments.push(cid);
          }
        }
        post.querySelector(".comment-count").textContent = post.querySelectorAll(".comment").length;
        saveState();
      }
    });

    feed.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && e.target.classList.contains("comment-input")) {
        e.preventDefault();
        e.target.closest(".comment-input-wrapper").querySelector(".comment-submit-btn").click();
      }
    });

    function escapeHtml(str) {
      return String(str).replace(/[&<>"']/g, (c) =>({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
      })[c]);
    }
  }
})();