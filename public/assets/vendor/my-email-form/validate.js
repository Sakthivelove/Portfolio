(function () {
  "use strict";

  // Select all forms with the class .my-email-form
  let forms = document.querySelectorAll('.my-email-form');

  forms.forEach(function (e) {
    e.addEventListener('submit', function (event) {
      event.preventDefault(); // Prevent the default form submission

      let thisForm = this;
      let action = thisForm.getAttribute('action'); // Get the action attribute (API endpoint)

      if (!action) {
        displayError(thisForm, 'The form action property is not set!');
        return;
      }

      // Show loading message and hide previous messages
      thisForm.querySelector('.loading').classList.add('d-block');
      thisForm.querySelector('.error-message').classList.remove('d-block');
      thisForm.querySelector('.sent-message').classList.remove('d-block');

      let formData = new FormData(thisForm); // Create FormData object from the form

      // Submit the form data to the server
      submitForm(thisForm, action, formData);
    });
  });

  function submitForm(thisForm, action, formData) {
    fetch(action, {
      method: 'POST',
      body: formData,
      headers: { 'X-Requested-With': 'XMLHttpRequest' }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok'); // Handle network errors
        }
        return response.text(); // Assuming the server responds with plain text
      })
      .then(data => {
        thisForm.querySelector('.loading').classList.remove('d-block');

        // Reset the error and success messages before setting a new one
        thisForm.querySelector('.sent-message').classList.remove('d-block');
        thisForm.querySelector('.error-message').classList.remove('d-block');

        if (data.trim() === 'OK') {
          thisForm.querySelector('.sent-message').classList.add('d-block'); // Show success message
          thisForm.reset(); // Reset the form
        } else {
          throw new Error(data ? data : 'Form submission failed and no error message returned.');
        }
      })
      .catch((error) => {
        displayError(thisForm, error); // Display any caught errors
      });
  }

  function displayError(thisForm, error) {
    thisForm.querySelector('.loading').classList.remove('d-block');
    thisForm.querySelector('.error-message').innerHTML = error.message || error; // Display error message
    thisForm.querySelector('.error-message').classList.add('d-block'); // Show error message
  }

})();
