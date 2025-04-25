document.addEventListener("DOMContentLoaded", () => {
  // Initialize GSAP animations
  gsap.registerPlugin(ScrollTrigger);

  // Timeline item animations
  gsap.utils.toArray(".timeline-item").forEach((item) => {
    gsap.from(item, {
      scrollTrigger: {
        trigger: item,
        start: "top 80%",
        toggleActions: "play none none none",
      },
      opacity: 0,
      y: 50,
      duration: 0.8,
      ease: "power2.out",
    });
  });

  // Photo hover animations
  gsap.utils.toArray(".photo-item").forEach((photo) => {
    photo.addEventListener("mouseenter", () => {
      gsap.to(photo.querySelector("img"), {
        scale: 1.05,
        duration: 0.3,
      });
    });

    photo.addEventListener("mouseleave", () => {
      gsap.to(photo.querySelector("img"), {
        scale: 1,
        duration: 0.3,
      });
    });
  });

  // Calculate relationship duration
  const startDate = new Date("March 4, 2025");
  const today = new Date();

  const diffTime = Math.abs(today - startDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const diffMonths = Math.floor(diffDays / 30.44); // Average month length

  document.getElementById("months-together").textContent = diffMonths;
  document.getElementById("days-together").textContent = diffDays % 30;

  // Special anniversary animation
  if (diffDays % 30 === 0 || diffDays === 100 || diffDays === 365) {
    const congrats = document.createElement("div");
    congrats.className = "congrats-message";
    congrats.innerHTML = `
      <div class="confetti"></div>
      <h2>Congratulations!</h2>
      <p>We've been together for ${diffMonths} months!</p>
    `;
    document.body.appendChild(congrats);

    gsap.from(congrats, {
      opacity: 0,
      y: 50,
      duration: 1,
      ease: "elastic.out(1, 0.5)",
    });

    setTimeout(() => {
      gsap.to(congrats, {
        opacity: 0,
        y: -50,
        duration: 0.5,
        onComplete: () => congrats.remove(),
      });
    }, 5000);
  }
});
