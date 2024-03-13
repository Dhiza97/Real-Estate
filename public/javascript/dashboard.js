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


        document.addEventListener("DOMContentLoaded", function () {
            // Get edit profile button and save changes button
            const editProfileBtn = document.getElementById('editProfileBtn');
            const saveChangesBtn = document.getElementById('saveChangesBtn');
            const cancelEditBtn = document.getElementById('cancelEditBtn');
            const profileForm = document.getElementById('profileForm');
            const profileEditForm = document.getElementById('profileEditForm');
        
            // Function to toggle readonly attribute of input fields
            function toggleInputFieldsEditable(editable) {
                const formInputs = document.querySelectorAll('#profileForm input');
                formInputs.forEach(input => {
                    input.readOnly = !editable;
                });
            }
        
            // Event listener for edit profile button
            editProfileBtn.addEventListener('click', function () {
                // Show edit profile form
                profileForm.style.display = 'none';
                profileEditForm.style.display = 'block';
        
                // Enable input fields for editing
                toggleInputFieldsEditable(true);
        
                // Hide edit button, show save changes and cancel buttons
                editProfileBtn.style.display = 'none';
                saveChangesBtn.style.display = 'block';
                cancelEditBtn.style.display = 'block';
            });
        
            // Event listener for cancel edit button
            cancelEditBtn.addEventListener('click', function () {
                // Hide edit profile form
                profileEditForm.style.display = 'none';
                profileForm.style.display = 'block';
        
                // Disable input fields
                toggleInputFieldsEditable(false);
        
                
                // Show edit button, hide save changes and cancel buttons
                editProfileBtn.style.display = 'block';
                saveChangesBtn.style.display = 'none';
                cancelEditBtn.style.display = 'none';
            });
        
            // Event listener for save changes button
            saveChangesBtn.addEventListener('click', function () {
                // Submit the edit profile form
                profileEditForm.submit();
            });
        });