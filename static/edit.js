$(document).ready(function() {
    const restaurantId = $("#restaurant-id").val();
    
    // Handle form submission
    $("#edit-restaurant-form").submit(function(e) {
        e.preventDefault();
        
        // Add loading state to button
        const $submitBtn = $(this).find("button[type='submit']");
        $submitBtn.html('<span class="btn-spinner"></span> Saving...').prop('disabled', true);
        
        const formData = {
            title: $("#title").val(),
            image: $("#image").val(),
            description: $("#description").val(),
            address: $("#address").val(),
            rating: $("#rating").val(),
            price: $("#price").val(),
            phone: $("#phone").val(),
            cuisine: $("#cuisine").val(),
            popular_dishes: $("#popular_dishes").val()
        };
        
        // Send AJAX PUT request to update restaurant
        $.ajax({
            url: `/api/restaurants/${restaurantId}`,
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            success: function(response) {
                // Show success message
                showAlert('success', 'Restaurant updated successfully');
                
                setTimeout(function() {
                   window.location.href = `/view/${restaurantId}`;
                }, 1000);
            },
            error: function(xhr, status, error) {
                console.error('Error:', error);
                showAlert('danger', 'Failed to update restaurant. Please try again.');
                
                // Reset button
                $submitBtn.html('Save Changes').prop('disabled', false);
            }
        });
    });
    
    // Enhanced "Discard Changes" button with custom dialog
    $("#discard-changes").click(function() {
        // Create custom confirm dialog
        const dialog = $(`
            <div class="custom-confirm-dialog">
                <div class="confirm-dialog-content">
                    <div class="confirm-dialog-title">Discard Changes?</div>
                    <div class="confirm-dialog-message">All unsaved changes will be lost. This action cannot be undone.</div>
                    <div class="confirm-dialog-buttons">
                        <button class="confirm-btn-cancel">Cancel</button>
                        <button class="confirm-btn-confirm">Discard Changes</button>
                    </div>
                </div>
            </div>
        `).appendTo('body');
        
        // Show dialog with animation
        setTimeout(() => dialog.addClass('active'), 50);
        
        // Handle cancel button
        dialog.find('.confirm-btn-cancel').click(function() {
            dialog.removeClass('active');
            setTimeout(() => dialog.remove(), 300);
        });
        
        // Handle confirm button
        dialog.find('.confirm-btn-confirm').click(function() {
            window.location.href = `/view/${restaurantId}`;
        });
        
        return false;
    });
    
    // Function to display alerts
    function showAlert(type, message) {
        const icon = type === 'success' ? 
            '<i class="fas fa-check-circle me-2"></i>' : 
            '<i class="fas fa-exclamation-circle me-2"></i>';
            
        const alertHtml = `
            <div class="alert alert-${type} alert-dismissible fade show" role="alert">
                ${icon}${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
        $("#alert-container").html(alertHtml);
    }
    
    // Add image preview functionality
    $("#image").on('input', function() {
        const imageUrl = $(this).val();
        if (!$("#image-preview-container").length) {
            $('<div id="image-preview-container"><img id="image-preview" alt="Image Preview"></div>').insertAfter($(this));
        }
        
        if (imageUrl) {
            $("#image-preview").attr("src", imageUrl);
            $("#image-preview-container").slideDown();
        } else {
            $("#image-preview-container").slideUp();
        }
    });
    
    // Initialize image preview if URL exists
    if ($("#image").val()) {
        $("#image").trigger('input');
    }
});