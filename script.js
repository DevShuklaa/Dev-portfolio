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
console.log(block)
let body = document.getElementsByTagName('body');
document.addEventListener('mousemove', (dets) => {
  // block is an HTMLCollection, not a single element
  // You need to loop through each element in the collection
  for (let i = 0; i < block.length; i++) {
    block[i].style.left = dets.x + "px";
    block[i].style.top = dets.y + "px";
  }
});
gsap.to("main img", {
  height: "10vh",
  left: "0vh",
  top: "150vh",
  opacity: "0.01",
  scrollTrigger: {
    trigger: "main",
    scroller: "#main",
    start: "top 16vh",
    end: "500vh 50vh",
    scrub: true,
    // preventOverlaps: true,
    // markers: true,
  }
})
const scroll = new LocomotiveScroll({
  el: document.querySelector('[data-scroll-container]'),
  smooth: true,
  lerp: 0.075
});

const home = document.querySelector('.home');
console.log(home);
const Home = document.querySelector('.Home');
const about = document.querySelector('.about');
const project = document.querySelector('.project');
const contact = document.querySelector('.contact');
const ul = document.querySelectorAll('#mainPart2 .nav ul li');
let a = 0;
home.addEventListener('click', () => {
  if (a == 0) {
    console.log("if");
    home.style.height = "100px";
    home.style.transform = "rotate(360deg)";
    ul.forEach((e) => {
      e.style.display = "block";
    })
    a += 1;
  } else {
    home.style.height = "150px";
    home.style.transform = "rotate(-360deg)";
    console.log("else");
    ul.forEach((e) => {
      e.style.display = "none";
    })
    a -= 1;
  }
});

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
t1.to("#mainPart2 .home", {
  height: "100px",
  transform: "rotate(160deg)",
  duration: 1,
  onComplete: () => a += 1,
})
t1.to("#mainPart2 ul li", {
  display: "block",
  opacity: 1,
  duration: 1,
})
t1.to("#eyegay .devImg", {
  top: "35vh",
  // opacity: 0.8,
  duration: 3,
})
t1.to("#eyegay .eye", {
  top: "41vh",
  duration: 3,
})


let me = document.querySelectorAll('.aboutMePage h1')
// console.log(me);
me.forEach((e) => {
  document.addEventListener('mousemove', (event) => {
    const x = event.clientX; // Or pageX, depending on your needs
    const y = event.clientY; // Or pageY
    const totalWidth = window.innerWidth;
    const totalHeight = window.innerHeight;

    // Calculate the hue value based on mouse coordinates
    const hue = (x / totalWidth) * 360; // Example: map x to full hue spectrum

    // Create the HSL color string
    const color = `hsl(${hue}, 100%, 50%)`;

    // Apply the color to the target element (example for background)
    e.style.color = color;
  });
  
});




const eyes = document.querySelectorAll('.eye');
// console.log(eyes);


document.addEventListener('mousemove', (event) => {
  eyes.forEach(eye => {
    // console.log(eye
    const pupil = eye.querySelector('.pupil');
    // console.log(pupil);
    const rect = eye.getBoundingClientRect();
    const eyeCenterX = rect.left + rect.width / 2;
    const eyeCenterY = rect.top + rect.height / 2;

    const dx = event.clientX - eyeCenterX;
    const dy = event.clientY - eyeCenterY;
    const angle = Math.atan2(dy, dx);

    const radius = 30;
    const pupilX = Math.cos(angle) * radius;
    const pupilY = Math.sin(angle) * radius;

    pupil.style.left = `${6 + pupilX * 0.25}px`;
    pupil.style.top = `${3 + pupilY * 0.25}px`;
  });
});
