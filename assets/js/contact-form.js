// Contact form
document.addEventListener('submit', e => {
	if (!e.target.closest('.js-contact-form')) return;

	e.preventDefault();

	const contactForm = $('#contact-form');
	const formData = contactForm.serialize();
	const honeyPot = $('#honey');

	// Bail if a bot filled out the honey pot.
	if (honeyPot.val() != '') return;

	$.post('https://hooks.zapier.com/hooks/catch/1652389/c4rgm1?' + formData, function(data) {
		const formWrapper = contactForm.parent('div');
		contactForm.remove();

		if (data.status === 'success') {
			formWrapper.append('<p>Thanks, I\'ll get in touch with you soon.</p>')
		} else {
			formWrapper.append('<p>Sorry something went wrong. Feel free to contact me via email at bethanyallenphoto@gmail.com</p>');
		}
	});
})
