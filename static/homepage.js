// Function to display top 3 restaurants
function displayTopRestaurants() {
    $("#display-container").empty();
    
    let top3 = [];
    let count = 0;
    for (let id in restaurantData) {
        if (count < 50) {
            top3.push(restaurantData[id]);
            count++;
        } else {
            break;
        }
    }
    $("#display-container").append(`
      <div class="section-header">
        <div class="header-line"></div>
        <h2 class="popular-restaurants-header">Popular Restaurants</h2>
        <p class="header-subtitle">Discover NYC's most loved brunch destinations</p>
      </div>
    `);
    
    // Create container for listings
    let listContainer = $("<div class='restaurant-listings'></div>");
    
    // Add each restaurant listing
    $.each(top3, function(i, restaurant) {
        let dishesHTML = '';
        let dishLimit = Math.min(3, restaurant.popular_dishes.length);
        
        for (let j = 0; j < dishLimit; j++) {
            dishesHTML += `<span class="dish-tag">${restaurant.popular_dishes[j]}</span>`;
        }
        
        let listing = `
            <a href="/view/${restaurant.id}" class="text-decoration-none text-dark">
                <div class="restaurant-listing mb-4">
                    <div class="row align-items-center">
                        <div class="col-md-3">
                            <img src="${restaurant.image}" alt="${restaurant.title}" class="img-fluid rounded" style="height: 150px; width: 100%; object-fit: cover;">
                        </div>
                        <div class="col-md-9 restaurant-listing-text">
                            <div class="d-flex align-items-center mb-2">
                                <div class="restaurant-title me-3">${restaurant.title}</div>
                                <div class="cuisine-tag">${restaurant.cuisine[0]}</div>
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
                                ${dishesHTML}
                            </div>
                        </div>
                    </div>
                </div>
            </a>
            ${i < top3.length - 1 ? '<hr>' : ''}
        `;
        listContainer.append(listing);
    });
    
    $("#display-container").append(listContainer);
}

$(document).ready(function() {
    displayTopRestaurants();
});