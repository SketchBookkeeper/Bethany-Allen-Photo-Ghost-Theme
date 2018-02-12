const navTrigger = document.querySelector('.js-toggle-nav');
const nav = document.querySelector('.js-nav');
const body = document.querySelector('body');

navTrigger.addEventListener('click', e => {
	body.classList.toggle('nav-is-open');
});
