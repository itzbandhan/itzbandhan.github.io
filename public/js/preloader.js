window.addEventListener("load", () => {
  // Force preloader to show for at least 3 seconds
  const preloader = document.querySelector(".preloader");
  const startTime = Date.now();
  const minDisplayTime = 3000; // 3 seconds

  function hidePreloader() {
    const elapsedTime = Date.now() - startTime;
    const remainingTime = Math.max(0, minDisplayTime - elapsedTime);

    setTimeout(() => {
      gsap.to(preloader, {
        opacity: 0,
        duration: 0.5,
        onComplete: () => {
          preloader.style.display = "none";
        },
      });
    }, remainingTime);
  }

  hidePreloader();
});
