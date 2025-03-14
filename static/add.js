function handleNewRestaurant() {
    let title = $.trim($("#title").val())
    let image = $.trim($("#image").val())
    let description = $.trim($("#description").val())
    let address = $.trim($("#address").val())
    let rating = $.trim($("#rating").val())
    let price = $.trim($("#price").val())
    let cuisine = $.trim($("#cuisine").val())
    let phone = $.trim($("#phone").val())
    let popular_dishes = $.trim($("#popular_dishes").val())
    let no_error = true

    // Clear previous warnings
    $(".warning-message").text("")

    if (title == "") {
      $("#title-warning").text("Title is required")
      $("#title").focus()
      no_error = false
    } 
    if (description == "") {
      $("#description-warning").text("Description is required")
      $("#description").focus()
      no_error = false
    }
    if (address == "") {
      $("#address-warning").text("Address is required")
      $("#address").focus()
      no_error = false
    }  
    if (rating == "") {
      $("#rating-warning").text("Rating is required")
      $("#rating").focus()
      no_error = false
    } else if (isNaN(parseFloat(rating)) || parseFloat(rating) < 0 || parseFloat(rating) > 5) {
      $("#rating-warning").text("Rating must be a number between 0 and 5")
      $("#rating").focus()
      no_error = false
    }
    if (price == "") {
      $("#price-warning").text("Price is required")
      $("#price").focus()
      no_error = false
    }     
    if (cuisine == "") {
      $("#cuisine-warning").text("Cuisine is required")
      $("#cuisine").focus()
      no_error = false
    }    
    if (phone == "") {
      $("#phone-warning").text("Phone is required")
      $("#phone").focus()
      no_error = false
    } else if (!/^\d+$/.test(phone)) {
      $("#phone-warning").text("Phone must contain only numeric digits")
      $("#phone").focus()
      no_error = false
    }
    if (popular_dishes == "") {
      $("#popular_dishes-warning").text("Popular dishes is required")
      $("#popular_dishes").focus()
      no_error = false
    }      

    if (no_error) {
      let new_restaurant = {
        "title": title,
        "image": image,
        "description": description,
        "address": address,
        "rating": parseFloat(rating), // Convert to number
        "price": price,
        "cuisine": cuisine,
        "phone": phone,
        "popular_dishes": popular_dishes
      }
      save_restaurant(new_restaurant)
    } 
}

function save_restaurant(new_restaurant) {
  $.ajax({
    type: "POST",
    url: "/api/restaurants",
    dataType: "json",
    contentType: "application/json; charset=utf-8",
    data: JSON.stringify(new_restaurant),
    success: function(result) {
      // Reset all form fields
      $("#title").val("");
      $("#image").val("");
      $("#description").val("");
      $("#address").val("");
      $("#rating").val("");
      $("#price").val(""); // Reset dropdown to default
      $("#cuisine").val("");
      $("#phone").val("");
      $("#popular_dishes").val("");
      
      // Reset image preview
      $("#image-preview").attr("src", "https://via.placeholder.com/150?text=Preview");
      
      // Create enhanced success message
      let successMessage = $("<div class='alert alert-success mt-3'></div>")
        .text("New item successfully created. ")
        .append($("<a></a>").attr("href", "/view/" + result.id).text("See it here"))
        .prependTo("#add-restaurant-container");
      
      // Focus on title field for next entry
      $("#title").focus();
      
      // No timeout or animation - the message will stay on screen
    },
    error: function(request, status, error) {
      console.log("Error");
      console.log(request);
      console.log(status);
      console.log(error);
    }   
  });
}

function display_restaurant_list(restaurants) {
  $("#restaurant-list").empty()
  $.each(restaurants, function(index, restaurant) {
    $("#restaurant-list").append("<li>" + restaurant.title + "</li>")
  })
}

$(document).ready(function() {
    $("#submit").click(function(e) {
        e.preventDefault(); // Prevent form submission
        handleNewRestaurant();
    });
});