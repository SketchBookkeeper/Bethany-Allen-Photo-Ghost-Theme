const Barba = require('barba.js');
const anime = require('animejs');

document.addEventListener("DOMContentLoaded", function () {
	let lastElementClicked;
	Barba.Pjax.init();

	// can now reference lastElementClicked
	Barba.Dispatcher.on('linkClicked', function(el) {
		lastElementClicked = el;
	});

	Barba.Dispatcher.on('initStateChange', function() {

	});

	//------------------------------
	// Fade Transition
	//------------------------------
	const slideTransition = Barba.BaseTransition.extend({
		start: function () {
			/**
			 * This function is automatically called as soon the Transition starts
			 * this.newContainerLoading is a Promise for the loading of the new container
			 * (Barba.js also comes with an handy Promise polyfill!)
			 */

			// As soon the loading is finished and the old page is faded out, let's fade the new page
			Promise
				.all([this.newContainerLoading, this.slideIn()])
				.then(this.slideOut.bind(this));
		},

		slideIn: function () {
			let deferred = Barba.Utils.deferred(); // Setup a promise, fadeIn will not run until promise is resolved

			$('.js-loader').show();

			const oldContainer = anime({
				targets: '.js-transition-cover',
				easing: 'linear',
				translateX: '100%',
				duration: 500,
				complete: (anim) => {
					deferred.resolve();
				}
			});

			return deferred.promise;
		},

		slideOut: function () {
			/**
			 * this.newContainer is the HTMLElement of the new Container
			 * At this stage newContainer is on the DOM (inside our #barba-container and with visibility: hidden)
			 * Please note, newContainer is available just after newContainerLoading is resolved!
			 */

			const _this = this;
			const $el = $(this.newContainer);
			const $oldContainer = $(this.oldContainer);
			const transition = anime.timeline();

			$oldContainer.hide();
			_this.done();

			$el.css({
				visibility: 'visible',
			});

			window.scroll({
				top: 0,
				left: 0,
			});

			transition
			 .add({
				targets: '.js-transition-cover',
				duration: 500,
				easing: 'linear',
				translateX: '200%',
			})
			.add({
				targets: '.js-transition-cover',
				duration: 0,
				translateX: 0,
				easing: 'linear',
				complete: function(anim) {
					$('.js-loader').hide();
				}
			});


		}
	});


	//------------------------------
	// Zoom Transition
	//------------------------------
	const zoomTransition = Barba.BaseTransition.extend({
		start: function () {
			/**
			 * This function is automatically called as soon the Transition starts
			 * this.newContainerLoading is a Promise for the loading of the new container
			 * (Barba.js also comes with an handy Promise polyfill!)
			 */

			// As soon the loading is finished and the old page is faded out, let's fade the new page
			Promise
				.all([this.newContainerLoading, this.zoomIn()])
				.then(this.fadeIn.bind(this));
		},

		zoomIn: function () {
			/**
			 * this.oldContainer is the HTMLElement of the old Container
			 */

			let deferred = Barba.Utils.deferred(); // Setup a promise, fadeIn will not run until promise is resolved

			const noClickOverlay = $('.js-no-click');
			noClickOverlay.show(); // Prevent any clicks while animation is running by overlaying body with transparent div

			const image = lastElementClicked.querySelector('.js-photo-zoom__image');
			const imageParent = image.parentElement;
			const imageClone = image.cloneNode(false);

			$(imageClone) .css({
				position: 'absolute',
				left: 0,
				right: 0,
				top: 0,
				bottom: 0,
				height: '100%',
			});

			imageParent.appendChild(imageClone);
			fillScreen(imageClone);

			function fillScreen(el) {
				// get information about current position in relation to viewport
				let rect = el.getBoundingClientRect();
				let windowWidth = window.innerWidth;
				let windowHeight = window.innerHeight;

				el.style.position = 'fixed';
				el.style.zIndex = 2;

				// animejs timeline
				let fill = anime.timeline();

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
					duration: 600,
					elasticity: 0,
					easing: 'easeInSine',
					complete: function(anim) {
						noClickOverlay.hide(); // Remove the click barrier
						deferred.resolve(); // Complete the Promise

						window.scroll({
							top: 0,
							left: 0,
						});
					}
				});
			}

			return deferred.promise;
		},

		fadeIn: function () {
			/**
			 * this.newContainer is the HTMLElement of the new Container
			 * At this stage newContainer is on the DOM (inside our #barba-container and with visibility: hidden)
			 * Please note, newContainer is available just after newContainerLoading is resolved!
			 */

			let _this = this;
			let $el = $(this.newContainer);

			// Show new container behind transition overlay
			$el.css({
				visibility: 'visible',
			});

			const newContainerAnimation = anime.timeline();

			newContainerAnimation
			.add({
				targets: this.newContainer,
				opacity: 0.5,
				duration: 0,
			})
			.add({
				targets: this.newContainer,
				opacity: 1,
				duration: 500,
				complete: () => {
					$('.js-fade-in-up').addClass('fade-in-up');
					$(this.oldContainer).hide();
					_this.done();
				}
			});
		}
	});

	/**
	 * Next step, you have to tell Barba to use the new Transition
	 */
	Barba.Pjax.getTransition = function () {
		/**
		 * Here you can use your own logic!
		 * For example you can use different Transition based on the current page or link...
		 */

		// If these do not match, back button was pressed
		const currentURL = getUrlEnding(Barba.HistoryManager.currentStatus().url);
		let lastElementClickedURL;

		if (lastElementClicked) {
			lastElementClickedURL = getUrlEnding(lastElementClicked.getAttribute('href'));
		}

		const URLsMatch = lastElementClickedURL === currentURL;

		if (URLsMatch && lastElementClicked.classList.contains('js-photo-zoom')) {
			return zoomTransition;
		}

		return slideTransition;
	};

	//------------------------------
	// Views
	//------------------------------
	const post_view = Barba.BaseView.extend({
		namespace: 'post_view',
		onLeave: function() {

		},
		onLeaveCompleted: function() {

		}
	});

	post_view.init();
});

// Get URL ending
function getUrlEnding(url) {
	url = url.slice(0, -1); // remove '/' from end of url string
	url = url.substr(url.lastIndexOf('/') + 1);

	return url;
}
