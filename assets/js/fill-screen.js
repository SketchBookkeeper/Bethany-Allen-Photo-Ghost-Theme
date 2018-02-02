const anime = require('animejs');

export function fillScreen(el) {
	// get information about current position in relation to viewport
	const rect = el.getBoundingClientRect();
	const windowWidth = window.innerWidth;
	const windowHeight = window.innerHeight;

	el.style.position = 'fixed';
	el.style.zIndex = 2;

	// animejs timeline
	const fill = anime.timeline();

	fill
	  .add({
		targets: el,
		duration: 0,
		top: rect.top,
		left: rect.left,
		bottom: rect.bottom,
		right: rect.right,
		height: rect.height,
		width: rect.width,
	  })
	  .add({
		targets: el,
		top: 0,
		left: 0,
		bottom: 0,
		right: 0,
		height: windowHeight,
		width: windowWidth,
		duration: 700,
		elasticity: 0,
		easing: 'easeInOutCirc',
	  });
  }
