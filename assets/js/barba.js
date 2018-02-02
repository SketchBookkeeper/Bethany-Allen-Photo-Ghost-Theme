const Barba = require('barba.js');
const anime = require('animejs');

document.addEventListener("DOMContentLoaded", function () {
	Barba.Pjax.init();

	const FadeTransition = Barba.BaseTransition.extend({
		start: function () {
			/**
			 * This function is automatically called as soon the Transition starts
			 * this.newContainerLoading is a Promise for the loading of the new container
			 * (Barba.js also comes with an handy Promise polyfill!)
			 */

			// As soon the loading is finished and the old page is faded out, let's fade the new page
			Promise
				.all([this.newContainerLoading, this.fadeOut()])
				.then(this.fadeIn.bind(this));
		},

		fadeOut: function () {
			/**
			 * this.oldContainer is the HTMLElement of the old Container
			 */

			let deferred = Barba.Utils.deferred(); // Setup a promise, fadeIn will not run until promise is resolved

			const noClickOverlay = $('.js-no-click');
			noClickOverlay.show(); // Prevent any clicks while animation is running by overlaying body with transparent div

			const applyOverlay = anime({
				targets: ['.page-transition-overlay'],
				translateX: {
					value: '100%',
					duration: 400,
					elasticity: 0,
					easing: 'easeInQuad',
				},
				complete: function (anim) {
					//document.body.scrollTop = 0; todo
					deferred.resolve(); // Complete the Promise
				}
			});

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

			/**
			 * Do not forget to call .done() as soon your transition is finished!
			 * .done() will automatically remove from the DOM the old Container
			 */
			$(this.oldContainer).hide();
			_this.done(); // We are not animating old container, so remove it now

			const removeOverlay = anime.timeline(); // Animate transition overlay out and reset it's position
			const noClickOverlay = $('.no-click');

			removeOverlay
				.add({
					targets: '.page-transition-overlay',
					translateX: {
						value: '+=100%',
						duration: 400,
						elasticity: 0,
						easing: 'easeInQuad',
					},
					complete: function() {
						noClickOverlay.hide(); // Remove the click barrier
					}
				})
				.add({
					targets: '.page-transition-overlay',
					translateX: {
						value: 0,
						duration: 0,
						elasticity: 0,
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

		return FadeTransition;
	};
});
