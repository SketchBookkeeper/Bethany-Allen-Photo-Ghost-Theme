const anime = require('animejs');

const navTrigger = document.querySelector('.js-toggle-nav');
const overlay = document.querySelector('.js-nav-overlay');
const nav = document.getElementById('js-nav');
const navItems = nav.querySelectorAll('li');
const body = document.querySelector('body');

//hide items on load
window.addEventListener('load', () => {
	hideNavItems();
});

// open
navTrigger.addEventListener('click', e => {
	openNav();
});

// close
overlay.addEventListener('click', e => {
	closeNav();
});

/**
* functions
*/
export function hideNavItems() {
	const hideItems = anime({
		targets: navItems,
		translateX: '25%',
		opacity: 0,
		delay: 500,
	});
}

export function openNav() {
	body.classList.toggle('nav-is-open');

	// animate in nav items
	if (body.classList.contains('nav-is-open')) {
		const showItems = anime({
			targets: navItems,
			translateX: {
				value: 0,
				elasticity: 150,
			},
			opacity: {
				value: 1,
				elasticity: 0,
			},
			elasticity: 0,
			delay: function (el, i, l) {
				return i * 100;
			}
		});
	} else {
		hideNavItems();
	}
}

export function closeNav() {
	body.classList.toggle('nav-is-open')
	hideNavItems();
}
