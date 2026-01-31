// Scripts
document.addEventListener("DOMContentLoaded", () => {
  // Header Scroll Effect
  const header = document.querySelector(".navbar");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 800) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });

  // Smooth Scroll for Navigation Links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
        });

        // Close mobile menu if open
        const navLinks = document.querySelector(".nav-links");
        const hamburger = document.querySelector(".hamburger");
        if (navLinks.classList.contains("active")) {
          navLinks.classList.remove("active");
          hamburger.classList.remove("active");
        }
      }
    });
  });

  // Animated Statistics
  const observerOptions = {
    threshold: 0.5,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const counters = entry.target.querySelectorAll(".stat-number");
        counters.forEach((counter) => {
          const target = +counter.getAttribute("data-target");
          const duration = 2000; // 2 seconds
          const increment = target / (duration / 16); // 60fps

          let current = 0;
          const updateCounter = () => {
            current += increment;
            if (current < target) {
              counter.innerText = Math.ceil(current);
              requestAnimationFrame(updateCounter);
            } else {
              counter.innerText = target;
            }
          };
          updateCounter();
        });
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const statsSection = document.querySelector(".stats-section");
  if (statsSection) {
    observer.observe(statsSection);
  }

  // Hero Content Animation
  setTimeout(() => {
    const heroContent = document.querySelector(".hero-content");
    if (heroContent) {
      heroContent.style.opacity = "1";
      heroContent.style.transform = "translateY(0)";
    }
  }, 100);

  // Mobile Menu Toggle
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");

  if (hamburger) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      navLinks.classList.toggle("active");
    });
  }

  // Close Button Logic
  const closeBtn = document.querySelector(".close-menu-btn");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      hamburger.classList.remove("active");
      navLinks.classList.remove("active");
    });
  }

  // Shutter Slider Logic
  const initShutterSlider = (sliderId, dotsId, interval = 5000) => {
    const wrapper = document.getElementById(sliderId);
    const dotsContainer = document.getElementById(dotsId);
    if (!wrapper || !dotsContainer) return;

    const slides = Array.from(wrapper.children);
    const dots = Array.from(dotsContainer.children);
    const total = slides.length;
    let currentIndex = 0;
    let autoSlideInterval;
    let touchStartX = 0;
    let touchEndX = 0;

    // Initialize Styles
    slides.forEach((slide, i) => {
      slide.style.zIndex = i === 0 ? "10" : "0";
      slide.style.transform = "none"; // Ensure no transform interference
      // Right-to-Left Wipe: Start with left edge at 100% (hidden on right)
      slide.style.clipPath = i === 0 ? "inset(0 0 0 0)" : "inset(0 0 0 100%)";
      slide.style.transition = "clip-path 1.5s ease-in-out";
    });

    const updateDots = (index) => {
      // Check for 'dots-expanding' class if you use it, or fallback to simple opacity
      const isExpanding = dotsContainer.classList.contains("dots-expanding");
      dots.forEach((dot, i) => {
        if (isExpanding) {
          if (i === index) {
            dot.classList.remove("w-3", "bg-[#E8E1D5]");
            dot.classList.add("w-8", "bg-[#CBA65A]");
          } else {
            dot.classList.remove("w-8", "bg-[#CBA65A]");
            dot.classList.add("w-3", "bg-[#E8E1D5]");
          }
          dot.classList.remove("bg-black", "bg-opacity-75", "bg-opacity-100");
        } else {
          // Default logic for simple dots
          if (i === index) {
            dot.classList.add("bg-white");
            dot.classList.remove("bg-white/50");
          } else {
            dot.classList.add("bg-white/50");
            dot.classList.remove("bg-white");
          }
        }
      });
    };

    const goToSlide = (nextIndex) => {
      if (nextIndex === currentIndex) return;

      const currentSlide = slides[currentIndex];
      const nextSlide = slides[nextIndex];

      // Prepare Next Slide
      nextSlide.style.transition = "none";
      nextSlide.style.clipPath = "inset(0 0 0 100%)"; // Hidden on right
      nextSlide.style.zIndex = "20"; // On top

      // Force Reflow
      void nextSlide.offsetWidth;

      // Animate
      nextSlide.style.transition = "clip-path 1.5s ease-in-out";
      nextSlide.style.clipPath = "inset(0 0 0 0)"; // Reveal fully

      // Current Slide layer management
      currentSlide.style.zIndex = "10";

      // Update Index
      currentIndex = nextIndex;
      updateDots(currentIndex);

      // Cleanup after transition
      setTimeout(() => {
        currentSlide.style.zIndex = "0";
        currentSlide.style.clipPath = "inset(0 0 0 100%)"; // Reset for next time
        nextSlide.style.zIndex = "10";
      }, 1500);
    };

    const nextSlide = () => {
      goToSlide((currentIndex + 1) % total);
    };

    const startAuto = () => {
      clearInterval(autoSlideInterval);
      autoSlideInterval = setInterval(nextSlide, interval);
    };

    const stopAuto = () => {
      clearInterval(autoSlideInterval);
    };

    // Dot Events
    dots.forEach((dot, i) => {
      dot.addEventListener("click", () => {
        stopAuto();
        goToSlide(i);
        startAuto();
      });
    });

    // Swipe Events
    wrapper.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].screenX;
      stopAuto();
    });

    wrapper.addEventListener("touchend", (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
      startAuto();
    });

    const handleSwipe = () => {
      // Swipe Left (drag right to left)
      if (touchStartX - touchEndX > 50) {
        nextSlide();
      }
    };

    // Init
    updateDots(0);
    startAuto();
  };

  // Initialize Shutter Slider
  // initShutterSlider("slides", "dots", 5000);
});
