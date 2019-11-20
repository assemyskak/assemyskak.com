const rgb2hex = (rgb) => {
  // Choose correct separator
  const sep = rgb.indexOf(",") > -1 ? "," : " ";
  // Turn "rgb(r,g,b)" into [r,g,b]
  rgb = rgb.substr(4).split(")")[0].split(sep);

  let r = (+rgb[0]).toString(16),
    g = (+rgb[1]).toString(16),
    b = (+rgb[2]).toString(16);

  if (r.length === 1) {
    r = "0" + r;
  }
  if (g.length === 1) {
    g = "0" + g;
  }
  if (b.length === 1) {
    b = "0" + b;
  }

  return "#" + r + g + b;
};


const lookup = (el, selector) => {
  let _el = el;
  while (_el && _el.matches && !_el.matches(selector)) {
    if (_el.parentElement === document) {
      return null;
    }
    _el = _el.parentElement;
  }
  return _el;
};


const subscribe = (eventName, selector, callback) => {
  const on = event => {
    const el = lookup(event.target, selector);
    if (el) {
      callback(event, el);
    }
  };
  document.addEventListener(eventName, on);
  return () => document.removeEventListener(eventName, on);
};


const updateTitle = (string = 'Assem Yskak') => {
  document.querySelector('head title').innerHTML = string;
};


const popup = document.querySelector('#popup');


subscribe('click', '[data-project] > a', (event, el) => {
  event.preventDefault();
  const project = lookup(el, '[data-project]');
  project.classList.toggle('opened');
});


subscribe('click', '[data-work] > a', async (event, el) => {
  event.preventDefault();

  document.body.classList.add('lock');

  const workEl = lookup(el, '[data-work]');
  const projectEl = lookup(workEl, '[data-project]');

  const work = workEl.dataset.work;
  const project = projectEl.dataset.project;
  const content = await (await fetch(`./${project}-${work}.html`)).text();
  const doc = new DOMParser().parseFromString(content, 'text/html');
  const app = doc.querySelector(`#${project}-${work}`);
  if (app) {
    updateTitle(doc.querySelector('head title').innerHTML);
    popup.innerHTML = app.outerHTML;
  } else {
    popup.innerHTML = '';
  }

  const {x, y} = event;
  popup.classList.remove('animated');
  requestAnimationFrame(() => {
    popup.style.top = `${y}px`;
    popup.style.left = `${x}px`;
    const fill = el.querySelector('.frame .fill');
    popup.style.backgroundColor = getComputedStyle(fill).fill;
    requestAnimationFrame(() => {
      popup.classList.add('animated');
      popup.style.top = `0px`;
      popup.style.left = `0px`;
      popup.classList.add('opened');
    });
  });
});


subscribe('click', '#popup', event => {
  event.preventDefault();

  const {x, y} = event;
  popup.style.top = `${y}px`;
  popup.style.left = `${x}px`;
  popup.classList.remove('opened');

  document.body.classList.remove('lock');

  updateTitle();
});

const mood = document.querySelector('#girl-blink');
const onScroll = () => {
  mood.classList.toggle('blink', Math.round(scrollY / 150) === 1);
};

let timer = null;
addEventListener('scroll', () => {
  if (!timer) {
    timer = requestAnimationFrame(() => {
      onScroll();
      timer = null;
    });
  }
});
