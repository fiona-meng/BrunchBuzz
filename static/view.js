function display(restaurant) {
    $("#display-container").empty();
    
    // Generate star rating HTML
    let starsHTML = '';
    const fullStars = Math.floor(restaurant.rating);
    const hasHalfStar = restaurant.rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
            starsHTML += '<span class="text-warning">★</span>';
        } else if (i === fullStars && hasHalfStar) {
            starsHTML += '<span class="text-warning">★</span>';
        } else {
            starsHTML += '<span class="text-warning" style="opacity: 0.3">★</span>';
        }
    }

    // Create price string based on restaurant price level
    const priceHTML = restaurant.price !== 'N/A' ? 
        `<span class="price">${restaurant.price}</span>` : '';
    
    // Format popular dishes as pill tags
    let popularDishesHTML = '';
    if (restaurant.popular_dishes && restaurant.popular_dishes.length > 0) {
        popularDishesHTML = restaurant.popular_dishes.map(dish => 
            `<span class="dish-pill">${dish}</span>`
        ).join('');
    } else {
        popularDishesHTML = '<p>No popular dishes listed</p>';
    }
    
    // Truncate description for "show more" feature
    const fullDescription = restaurant.description;
    let truncatedDescription = fullDescription;
    let showMoreButton = '';
    
    // Only add "show more" if description is longer than 150 characters
    if (fullDescription.length > 150) {
        truncatedDescription = fullDescription.substring(0, 150) + '...';
        showMoreButton = `<a href="#" class="show-more-btn">show more</a>`;
    }
    
    // Create restaurant detail card with new design
    let restaurantDetail = `
        <div class="container restaurant-detail mt-4">
            <div class="row">
                <div class="col-12 mb-4">
                    <img src="${restaurant.image}" class="img-fluid detail-image" alt="${restaurant.title}">
                </div>
                
                <div class="col-12 col-md-8">
                    <div class="detail-header">
                        <h1 class="restaurant-title">${restaurant.title}</h1>
                        <div class="cuisine">${restaurant.cuisine.join(" • ")}</div>
                    </div>
                    
                    <div class="rating-container mb-3">
                        <div class="rating">
                            ${starsHTML}
                        </div>
                        <span class="rating-text">${restaurant.rating}</span>
                        <div class="comment-icon">
                            <i class="fa fa-comment-o"></i>
                        </div>
                        <span class="reviews-text">${restaurant.reviews} reviews</span>
                        ${priceHTML}
                    </div>
                    
                    <div class="detail-section">
                        <h4>Popular Dishes:</h4>
                        <p>${popularDishesHTML}</p>
                    </div>
                    
                    <div class="detail-section">
                        <h4>Description</h4>
                        <p class="description-text">${truncatedDescription}</p>
                        <div class="show-more-container">${showMoreButton}</div>
                        <div class="full-description" style="display: none;">${fullDescription}</div>
                    </div>
                </div>
                
                <div class="col-12 col-md-4">
                    <div class="detail-sidebar">
                        <div class="contact-info">
                            <div class="location-info mb-3">
                                <i class="fa fa-map-marker"></i>
                                <span>${restaurant.address}</span>
                            </div>
                            <div class="phone-info">
                                <i class="fa fa-phone"></i>
                                <span>${restaurant.phone}</span>
                            </div>
                        </div>
                    </div>

                    <div class="edit-button">
                        <a href="/edit/${restaurant.id}" class="btn">Edit</a>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    $("#display-container").append(restaurantDetail);
    
    // Add event listener for "show more" button
    $(".show-more-btn").on("click", function(e) {
        e.preventDefault();
        const fullText = $(".full-description").html();
        $(".description-text").html(fullText);
        $(".show-more-container").html('<a href="#" class="show-less-btn">show less</a>');
        
        // Add event listener for "show less" button
        $(".show-less-btn").on("click", function(e) {
            e.preventDefault();
            $(".description-text").html(truncatedDescription);
            $(".show-more-container").html('<a href="#" class="show-more-btn">show more</a>');
            
            // Re-attach the show more event listener
            $(".show-more-btn").on("click", function(e) {
                e.preventDefault();
                $(".description-text").html(fullText);
                $(".show-more-container").html('<a href="#" class="show-less-btn">show less</a>');
            });
        });
    });
    if (restaurant.similar_restaurant_ids && restaurant.similar_restaurant_ids.length > 0) {
        loadSimilarRestaurants(restaurant.similar_restaurant_ids);
    }
}

// Update the loadSimilarRestaurants function to better match homepage structure
function loadSimilarRestaurants(similarIds) {
    // Clear any existing content
    const container = document.getElementById('similar-restaurants');
    container.innerHTML = '';

    let brunchDataArray = brunch_data;
    
    // If brunch_data is an object but not an array, try to extract values
    if (typeof brunchDataArray === 'object' && !Array.isArray(brunchDataArray)) {
        brunchDataArray = Object.values(brunchDataArray);
    }
    
    
    // Create a list container similar to homepage
    const listContainer = document.createElement('div');
    listContainer.className = 'similar-restaurants-list';
    
    // Loop through similar restaurant IDs
    similarIds.forEach((id, i) => {
        // Find the restaurant in brunchDataArray
        const similarRestaurant = brunchDataArray.find(restaurant => 
            restaurant.id === id || String(restaurant.id) === String(id)
        );
        
        if (similarRestaurant) {
            const card = createSimilarRestaurantCard(similarRestaurant);
            
            // Remove the hr from the last item
            if (i === similarIds.length - 1) {
                const hr = card.querySelector('hr');
                if (hr) hr.remove();
            }
            
            listContainer.appendChild(card);
        } else {
            console.error(`Similar restaurant with ID ${id} not found in brunch data.`);
        }
    });
    
    container.appendChild(listContainer);

}

// Update the createSimilarRestaurantCard function to match homepage.js styling
function createSimilarRestaurantCard(restaurant) {
    // Create container for the similar restaurant listing
    const container = document.createElement('div');
    
    // Instead of returning a card, let's match the exact HTML structure from homepage.js
    const listing = `
        <a href="/view/${restaurant.id}" class="text-decoration-none text-dark">
            <div class="restaurant-listing mb-4">
                <div class="row align-items-center">
                    <div class="col-md-3">
                        <img src="${restaurant.image}" alt="${restaurant.title}" class="img-fluid rounded" style="height: 150px; width: 100%; object-fit: cover;">
                    </div>
                    <div class="col-md-9 restaurant-listing-text">
                        <div class="d-flex align-items-center mb-2">
                            <div class="restaurant-title me-3">${restaurant.title}</div>
                            <div class="cuisine-tag">${restaurant.cuisine && restaurant.cuisine.length > 0 ? restaurant.cuisine[0] : ''}</div>
                        </div>
                        <div class="d-flex align-items-center mb-2">
                            <div class="rating-container me-3">
                                <span class="rating">${generateStarRating(restaurant.rating)}</span>
                                <span class="rating-text">
                                    ${restaurant.rating}
                                </span>
                                <span class="material-symbols-outlined comment-icon">
                                    mode_comment
                                </span>
                                <span class="reviews-text"> ${restaurant.reviews} reviews</span>
                                <span class="price">${restaurant.price === "N/A" ? "" : restaurant.price}</span>
                            </div>
                        </div>
                        <div class="row restaurant-address">
                            <span class="material-symbols-outlined">location_on</span>
                            <span>${restaurant.address}</span>
                        </div>
                        <div class="row restaurant-cuisine mt-2">
                            ${generatePopularDishes(restaurant)}
                        </div>
                    </div>
                </div>
            </div>
        </a>
        <hr>
    `;
    
    container.innerHTML = listing;
    return container;
}

// Add a helper function to generate the popular dishes HTML
function generatePopularDishes(restaurant) {
    if (!restaurant.popular_dishes || restaurant.popular_dishes.length === 0) {
        return '';
    }
    
    return restaurant.popular_dishes.map(dish => 
        `<span class="dish-pill">${dish}</span>`
    ).join('');
}

// Use the same star rating generation as in the homepage
function generateStarRating(rating) {
    let starsHTML = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
            starsHTML += '<span class="text-warning">★</span>';
        } else if (i === fullStars && hasHalfStar) {
            starsHTML += '<span class="text-warning">★</span>';
        } else {
            starsHTML += '<span class="text-warning" style="opacity: 0.3">★</span>';
        }
    }
    
    return starsHTML;
}

$(document).ready(function() {
    display(restaurant);
});