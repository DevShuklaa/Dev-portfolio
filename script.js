document.addEventListener('DOMContentLoaded', () => {
  function loco() {
    gsap.registerPlugin(ScrollTrigger);

    // Using Locomotive Scroll from Locomotive https://github.com/locomotivemtl/locomotive-scroll

    const locoScroll = new LocomotiveScroll({
      el: document.querySelector("#main"),
      smooth: true
    });
    window.locoScroll = locoScroll;
    // each time Locomotive Scroll updates, tell ScrollTrigger to update too (sync positioning)
    locoScroll.on("scroll", ScrollTrigger.update);

    // tell ScrollTrigger to use these proxy methods for the "#main" element since Locomotive Scroll is hijacking things
    ScrollTrigger.scrollerProxy("#main", {
      scrollTop(value) {
        return arguments.length ? locoScroll.scrollTo(value, 0, 0) : locoScroll.scroll.instance.scroll.y;
      }, // we don't have to define a scrollLeft because we're only scrolling vertically.
      getBoundingClientRect() {
        return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
      },
      // LocomotiveScroll handles things completely differently on mobile devices - it doesn't even transform the container at all! So to get the correct behavior and avoid jitters, we should pin things with position: fixed on mobile. We sense it by checking to see if there's a transform applied to the container (the LocomotiveScroll-controlled element).
      pinType: document.querySelector("#main").style.transform ? "transform" : "fixed"
    });




    // each time the window updates, we should refresh ScrollTrigger and then update LocomotiveScroll. 
    ScrollTrigger.addEventListener("refresh", () => locoScroll.update());

    // after everything is set up, refresh() ScrollTrigger and update LocomotiveScroll because padding may have been added for pinning, etc.
    ScrollTrigger.refresh();

  }
  loco();

  // === Opening Animation Sequence ===
  const loadTl = gsap.timeline();

  // Initial states
  gsap.set(".BackImageContainer", { scale: 0, rotationZ: 720, opacity: 0 });
  if (window.innerWidth <= 1024) {
    gsap.set(".modern-nav", { x: -100, opacity: 0, yPercent: -50 });
  } else {
    gsap.set(".modern-nav", { y: -100, opacity: 0 });
  }
  gsap.set(".TextPart", { x: -200, opacity: 0, rotationY: -45, transformPerspective: 1000 });

  loadTl.to(".BackImageContainer", {
    scale: 1,
    rotationZ: 0,
    opacity: 0.5,
    duration: 2.5,
    ease: "power4.out"
  })
    .to(".modern-nav", 
      window.innerWidth <= 1024 
        ? { x: 0, opacity: 1, duration: 1, ease: "power2.out" }
        : { y: 0, opacity: 1, duration: 1, ease: "bounce.out" }
    , "-=2.0")
    .to(".TextPart", {
      x: 0,
      opacity: 1,
      rotationY: 0,
      duration: 1.5,
      ease: "power3.out"
    }, "-=1.5")
    .from(".TextPart .hero-title, .TextPart .hero-subtitle, .TextPart .hero-desc, .TextPart .hero-actions", {
      y: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: "power2.out"
    }, "-=1.0");
  // ==================================

  let block = document.getElementsByClassName('blob');
  // console.log(block)
  let body = document.getElementsByTagName('body');
  document.addEventListener('mousemove', (dets) => {
    // block is an HTMLCollection, not a single element
    // You need to loop through each element in the collection
    for (let i = 0; i < block.length; i++) {
      block[i].style.left = dets.x + "px";
      block[i].style.top = dets.y + "px";
    }
  });
  const eyees = document.querySelectorAll('.eye');

  const t1 = gsap.timeline({
    scrollTrigger: {
      trigger: "main",
      scroller: "#main",
      start: "550vh 20vh",
      end: "700vh 10",
      scrub: 1,
      // markers: true,
    }
  });

  let me = document.querySelectorAll('.aboutH1 h1,footer h1');
  console.log(me);

  me.forEach((e) => {

    document.addEventListener('mousemove', (event) => {
      // console.log("Hello in listner")
      const x = event.clientX; // Or pageX, depending on your needs
      const y = event.clientY; // Or pageY
      const totalWidth = window.innerWidth;
      const totalHeight = window.innerHeight;

      // Calculate the hue value based on mouse coordinates
      const hue = (x / totalWidth) * 360 + (y / totalHeight) * 100; // Example: map x to full hue spectrum

      // Create the HSL color string
      const color = `hsl(${hue}, 100%, 50%)`;

      // Apply the color to the target element (example for background)
      e.style.color = color;
    });

  });






  const eyes = document.querySelectorAll('.eye');
  // console.log(eyes);


  function getEyeRestOffset(eye) {
    const restX = Number.parseFloat(eye.dataset.restX || '0');
    const restY = Number.parseFloat(eye.dataset.restY || '0');
    return {
      restX: Number.isFinite(restX) ? restX : 0,
      restY: Number.isFinite(restY) ? restY : 0
    };
  }

  function setRestingPupilPositions() {
    eyes.forEach((eye) => {
      const pupil = eye.querySelector('.pupil');
      if (!pupil) {
        return;
      }
      const { restX, restY } = getEyeRestOffset(eye);
      pupil.style.left = '50%';
      pupil.style.top = '50%';
      pupil.style.transform = `translate(-50%, -50%) translate(${restX}px, ${restY}px)`;
    });
  }

  // Function to update eye positions
  function updateEyePositions(event) {
    eyes.forEach((eye) => {
      const pupil = eye.querySelector('.pupil');
      if (!pupil) {
        return;
      }

      const { restX, restY } = getEyeRestOffset(eye);

      const eyeRect = eye.getBoundingClientRect();
      const pupilRect = pupil.getBoundingClientRect();
      const eyeCenterX = eyeRect.left + eyeRect.width / 2;
      const eyeCenterY = eyeRect.top + eyeRect.height / 2;

      const dx = event.clientX - eyeCenterX;
      const dy = event.clientY - eyeCenterY;

      // Calculate the local offset proportion based on the eye dimensions
      // This maps the distance into an elliptical orbit instead of a strict circle
      const localDx = dx / eyeRect.width;
      const localDy = dy / eyeRect.height;
      const localDistance = Math.hypot(localDx, localDy);

      // Max movement in each axis before clipping the edge minus 1 pixel safety margin
      const maxPupilMovementX = Math.max(0, (eyeRect.width - pupilRect.width) / 2 - 1);
      const maxPupilMovementY = Math.max(0, (eyeRect.height - pupilRect.height) / 2 - 1);

      // Scale up factor to ensure the eye reaches the edge when your mouse is roughly 1.5 container sizes away
      const distanceFactor = Math.min(localDistance / 1.5, 1);

      let pupilX = 0;
      let pupilY = 0;

      if (localDistance > 0) {
        // (localDx / localDistance) computes the angle components, independently scaled for X and Y axes
        pupilX = (localDx / localDistance) * maxPupilMovementX * distanceFactor;
        pupilY = (localDy / localDistance) * maxPupilMovementY * distanceFactor;
      }

      pupil.style.left = '50%';
      pupil.style.top = '50%';
      pupil.style.transform = `translate(-50%, -50%) translate(${pupilX + restX}px, ${pupilY + restY}px)`;
    });
  }

  setRestingPupilPositions();

  // Mouse move event listener
  document.addEventListener('mousemove', updateEyePositions);

  // Touch support for mobile devices
  document.addEventListener('touchmove', (event) => {
    event.preventDefault();
    const touch = event.touches[0];
    const mouseEvent = new MouseEvent('mousemove', {
      clientX: touch.clientX,
      clientY: touch.clientY
    });
    updateEyePositions(mouseEvent);
  });

  // Window resize event listener to recalculate positions
  window.addEventListener('resize', () => {
    // Reset pupils to center position on resize
    setRestingPupilPositions();
  });

  // Orientation change support for mobile devices
  window.addEventListener('orientationchange', () => {
    setTimeout(() => {
      setRestingPupilPositions();
    }, 100);
  });


  let box = document.querySelectorAll('.technologies ul li .box');
  let skills = document.querySelectorAll('.technologies ul li');

  skills.forEach((e) => {
    e.addEventListener('mouseover', () => {
      let eld = e.getElementsByClassName('box');
      eld[0].style.display = "block";
    })
  })
  skills.forEach((e) => {
    e.addEventListener('mouseleave', () => {
      let eld = e.getElementsByClassName('box');
      eld[0].style.display = "none";
    })
  })

  gsap.from(('.technologies h1,.technologies ul li'), {
    y: "20vh",
    scrollTrigger: {
      trigger: ".aboutMePage",
      scroller: "#main",
      start: "200vh top",
      end: "500vh 10vh ",
      scrub: 1,
    }
  });

  // Carousel 3D Rotation scroll trigger
  gsap.to(".carousel", {
    rotationY: -360,
    ease: "none",
    scrollTrigger: {
      trigger: ".projects",
      scroller: "#main",
      start: "top top",
      end: "+=200%",
      scrub: 1,
      pin: true,
    }
  });

  // Background Image Merge Animation into Footer
  gsap.fromTo(".BackImageContainer",
    {
      top: "7vh",      // Original CSS top
      right: "-9vw",   // Original CSS right
      xPercent: 0,
      yPercent: 0,
      scale: 1,
      opacity: 0.5,
      filter: "blur(0px)"
    },
    {
      scrollTrigger: {
        trigger: "footer",
        scroller: "#main",
        start: "top 90%",
        end: "top 30%",
        scrub: true,
      },
      top: "50%",         // Move towards center
      right: "50%",       // Center horizontally
      xPercent: 50,       // Offset correction
      yPercent: -50,      // Offset correction
      scale: 0.2,         // Shrink down towards N.png size
      opacity: 0,         // Fade out fully as it merges into N.png
      filter: "blur(10px)", // Add motion blur
      ease: "power1.inOut"
    }
  );
});
