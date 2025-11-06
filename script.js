document.addEventListener('DOMContentLoaded', () => {
  function loco() {
    gsap.registerPlugin(ScrollTrigger);

    // Using Locomotive Scroll from Locomotive https://github.com/locomotivemtl/locomotive-scroll

    const locoScroll = new LocomotiveScroll({
      el: document.querySelector("#main"),
      smooth: true
    });
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


  // Function to update eye positions
  function updateEyePositions(event) {
    eyes.forEach(eye => {
      const pupil = eye.querySelector('.pupil');
      const rect = eye.getBoundingClientRect();
      const eyeCenterX = rect.left + rect.width / 2;
      const eyeCenterY = rect.top + rect.height / 2;

      const dx = event.clientX - eyeCenterX;
      const dy = event.clientY - eyeCenterY;
      const angle = Math.atan2(dy, dx);

      // Calculate radius based on eye size for better responsiveness
      const eyeRadius = Math.min(rect.width, rect.height) / 2;
      const maxPupilMovement = eyeRadius * 0.6; // Increased to 60% for more movement

      const pupilX = Math.cos(angle) * maxPupilMovement;
      const pupilY = Math.sin(angle) * maxPupilMovement;

      // Use percentage-based positioning with more range for better responsiveness
      const pupilXPercent = (50 + (pupilX / eyeRadius) * 35); // 15% to 85% range
      const pupilYPercent = (50 + (pupilY / eyeRadius) * 35);

      pupil.style.left = `${Math.max(15, Math.min(85, pupilXPercent))}%`;
      pupil.style.top = `${Math.max(15, Math.min(85, pupilYPercent))}%`;
    });
  }

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
    eyes.forEach(eye => {
      const pupil = eye.querySelector('.pupil');
      pupil.style.left = '50%';
      pupil.style.top = '50%';
    });
  });

  // Orientation change support for mobile devices
  window.addEventListener('orientationchange', () => {
    setTimeout(() => {
      eyes.forEach(eye => {
        const pupil = eye.querySelector('.pupil');
        pupil.style.left = '50%';
        pupil.style.top = '50%';
      });
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
});
