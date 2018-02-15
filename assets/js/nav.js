const navTrigger = document.querySelector('.js-toggle-nav');
const overlay = document.querySelector('.js-nav-overlay');
const body = document.querySelector('body');

navTrigger.addEventListener('click', e => body.classList.toggle('nav-is-open'));
overlay.addEventListener('click', e => body.classList.toggle('nav-is-open'));
