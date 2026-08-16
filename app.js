(function(){
  "use strict";

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal, .reveal-stagger');
  if('IntersectionObserver' in window && !reduceMotion){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.18 });
    revealEls.forEach(function(el){ io.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add('in'); });
  }

  /* ---------- floating hero blocks (generated + parallax on mouse) ---------- */
  var heroBlocks = document.getElementById('heroBlocks');
  var colors = ['grass','dirt','stone','gold','diamond'];
  var blocks = [];
  var COUNT = window.innerWidth < 700 ? 6 : 12;
  for(var i=0;i<COUNT;i++){
    var b = document.createElement('div');
    var c = colors[i % colors.length];
    b.className = 'fblock ' + c;
    var size = 20 + Math.random()*28;
    b.style.width = size+'px';
    b.style.height = size+'px';
    b.style.left = (Math.random()*94)+'%';
    b.style.top = (10 + Math.random()*55)+'%';
    b.style.animationDuration = (5 + Math.random()*4)+'s';
    b.style.animationDelay = (Math.random()*4)+'s';
    b.dataset.depth = (0.02 + Math.random()*0.05).toFixed(3);
    heroBlocks.appendChild(b);
    blocks.push(b);
  }
  if(!reduceMotion){
    var heroSection = document.querySelector('.hero');
    heroSection.addEventListener('mousemove', function(e){
      var cx = window.innerWidth/2, cy = window.innerHeight/2;
      var dx = (e.clientX - cx), dy = (e.clientY - cy);
      blocks.forEach(function(b){
        var depth = parseFloat(b.dataset.depth);
        b.style.marginLeft = (dx*depth)+'px';
        b.style.marginTop = (dy*depth)+'px';
      });
    });
  }

  /* ---------- FAQ accordion ---------- */
  var faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function(item){
    var btn = item.querySelector('.faq-q');
    var panel = item.querySelector('.faq-a');
    btn.addEventListener('click', function(){
      var isOpen = item.classList.contains('open');
      faqItems.forEach(function(other){
        other.classList.remove('open');
        other.querySelector('.faq-q').setAttribute('aria-expanded','false');
        other.querySelector('.faq-a').style.maxHeight = null;
      });
      if(!isOpen){
        item.classList.add('open');
        btn.setAttribute('aria-expanded','true');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });

  /* ---------- signup form (front-end only, no backend) ---------- */
  var form = document.getElementById('signupForm');
  var successMsg = document.getElementById('successMsg');
  form.addEventListener('submit', function(e){
    e.preventDefault();
    if(!form.checkValidity()){
      form.reportValidity();
      return;
    }
    burstParticles(form);
    successMsg.classList.add('show');
    form.querySelectorAll('input').forEach(function(i){ i.value=''; });
  });

  function burstParticles(anchorEl){
    if(reduceMotion) return;
    var rect = anchorEl.getBoundingClientRect();
    var originX = rect.left + rect.width/2;
    var originY = rect.top + rect.height/2;
    var palette = ['#5d9c3f','#ffc94d','#4fe3e0','#e8503a','#8a8a8a'];
    for(var i=0;i<18;i++){
      var p = document.createElement('div');
      p.className = 'particle';
      p.style.left = originX+'px';
      p.style.top = originY+'px';
      p.style.background = palette[i % palette.length];
      document.body.appendChild(p);
      var angle = Math.random()*Math.PI*2;
      var dist = 60 + Math.random()*120;
      var tx = Math.cos(angle)*dist;
      var ty = Math.sin(angle)*dist;
      var rot = (Math.random()*360)|0;
      p.animate([
        { transform:'translate(0,0) rotate(0deg)', opacity:1 },
        { transform:'translate('+tx+'px,'+ty+'px) rotate('+rot+'deg)', opacity:0 }
      ], { duration: 700 + Math.random()*400, easing:'cubic-bezier(.2,.8,.2,1)' });
      (function(el){ setTimeout(function(){ el.remove(); }, 1200); })(p);
    }
  }

  /* ---------- draw timeline connector on scroll ---------- */
  var pathItems = document.querySelectorAll('.path-item');
  if('IntersectionObserver' in window){
    var pio = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting) entry.target.style.setProperty('--seen','1');
      });
    }, { threshold: .4 });
    pathItems.forEach(function(el){ pio.observe(el); });
  }

  /* ---------- mobile nav (simple show/hide) ---------- */
  var toggle = document.querySelector('.nav-toggle');
  // toggle button intentionally omitted from markup complexity for this single-page build;
  // nav links remain reachable via anchor scrolling on all breakpoints.
})();