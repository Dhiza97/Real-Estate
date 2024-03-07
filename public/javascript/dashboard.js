const li_elements = document.querySelectorAll('.dash-sidebar ul li')
        const item_elements = document.querySelectorAll('.item')

        for(let i = 0; i < li_elements.length; i++) {
            li_elements[i].addEventListener('click', function() {
                li_elements.forEach(function(li) {
                    li.classList.remove('active')
                })
                this.classList.add('active')
                var li_value = this.getAttribute('data-li')
                item_elements.forEach(function(item) {
                    item.style.display = 'none'
                })
                
                if(li_value == 'dashboard') {
                    document.querySelector(`.${li_value}`).style.display = 'block'
                } else if(li_value == 'profile') {
                    document.querySelector(`.${li_value}`).style.display = 'block'
                } else if(li_value == 'statistics') {
                    document.querySelector(`.${li_value}`).style.display = 'block'
                } else if(li_value == 'career') {
                    document.querySelector(`.${li_value}`).style.display = 'block'
                } else if(li_value == 'faq') {
                    document.querySelector(`.${li_value}`).style.display = 'block'
                } else if(li_value == 'testimonials') {
                    document.querySelector(`.${li_value}`).style.display = 'block'
                } else if(li_value == 'settings') {
                    document.querySelector(`.${li_value}`).style.display = 'block'
                } else {
                    console.log('')
                }
            })
        }

        // Get edit profile button and save changes button
        const editProfileBtn = document.getElementById('editProfileBtn');
        const saveChangesBtn = document.getElementById('saveChangesBtn');
        const profileForm = document.getElementById('profileForm');

        // Get all input fields inside the profile form
        const inputFields = document.querySelectorAll('#profileForm input');

        // Function to toggle readonly attribute of input fields
        function toggleInputFieldsEditable(editable) {
            inputFields.forEach(input => {
                input.readOnly = !editable;
            });
        }

        // Function to handle form submission
        function handleSubmit(event) {
            event.preventDefault(); // Prevent default form submission
            
            // Serialize form data
            const formData = new FormData(profileForm);
            const data = {};
            for (let [key, value] of formData) {
                data[key] = value;
            }

            // Send AJAX request to update profile
            fetch('/auth/editProfile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(data => {
                // Handle response from server
                if (data.success) {
                    // Display success message
                    // Optionally, you can redirect the user to another page or update the UI
                    alert(data.success);
                } else {
                    // Display error message
                    alert(data.error);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                // Display error message
                alert('An error occurred. Please try again.');
            });
        }

        // Event listener for edit profile button
        editProfileBtn.addEventListener('click', () => {
            // Make input fields editable
            toggleInputFieldsEditable(true);
            
            // Show save changes button and hide edit profile button
            saveChangesBtn.style.display = 'inline-block';
            editProfileBtn.style.display = 'none';
        });

        // Event listener for save changes button
        saveChangesBtn.addEventListener('click', () => {
            // Make input fields non-editable
            toggleInputFieldsEditable(false);
            
            // Hide save changes button and show edit profile button
            saveChangesBtn.style.display = 'none';
            editProfileBtn.style.display = 'inline-block';

            // Submit the form
            profileForm.submit();
        });

        // Event listener for form submission
        profileForm.addEventListener('submit', handleSubmit);