function displaySearchResults(results, count, search_query) {
    console.log(results);
    
    $("#display-container").empty();
    if (count == 0) {
        $("#display-container").append(`
        <span class="search-results-header-no-results">No results found for: ${search_query}</span>
        `);
    } else {
        $("#display-container").append(`
        <span class="search-results-header">Search Results for: ${search_query}</span>
        <br>
        <span class="search-results-count">Found ${count} results</span>
        `);
    }
    // Create container for listings
    let listContainer = $("<div class='restaurant-listings'></div>");

    $.each(results, function(i, result) {
        let dishesHTML = '';
        let dishLimit = Math.min(3, result.popular_dishes.length);
        
        // Process title with potential highlighting
        let titleDisplay = result.title;
        if (result.match_fields && result.match_fields.includes('title')) {
            // Highlight the matching part in title
            let titleLower = result.title.toLowerCase();
            let queryLower = search_query.toLowerCase();
            let index = titleLower.indexOf(queryLower);
            
            if (index >= 0) {
                let before = result.title.substring(0, index);
                let match = result.title.substring(index, index + search_query.length);
                let after = result.title.substring(index + search_query.length);
                titleDisplay = `${before}<span style="font-weight: bold; color: #cea338;">${match}</span>${after}`;
            }
        }
        
        // Process cuisine with potential highlighting
        let cuisineDisplay = result.cuisine[0];
        if (result.match_fields && result.match_fields.includes('cuisine')) {
            // Highlight the matching part in cuisine
            let cuisineLower = result.cuisine[0].toLowerCase();
            let queryLower = search_query.toLowerCase();
            let index = cuisineLower.indexOf(queryLower);
            
            if (index >= 0) {
                let before = result.cuisine[0].substring(0, index);
                let match = result.cuisine[0].substring(index, index + search_query.length);
                let after = result.cuisine[0].substring(index + search_query.length);
                cuisineDisplay = `${before}<span style="font-weight: bold; color: #cea338;">${match}</span>${after}`;
            }
        }
        
        // Process dishes with potential highlighting
        for (let j = 0; j < dishLimit; j++) {
            let dishDisplay = result.popular_dishes[j];
            
            if (result.match_fields && result.match_fields.includes('popular_dishes')) {
                // Highlight the matching part in dish
                let dishLower = result.popular_dishes[j].toLowerCase();
                let queryLower = search_query.toLowerCase();
                let index = dishLower.indexOf(queryLower);
                
                if (index >= 0) {
                    let before = result.popular_dishes[j].substring(0, index);
                    let match = result.popular_dishes[j].substring(index, index + search_query.length);
                    let after = result.popular_dishes[j].substring(index + search_query.length);
                    dishDisplay = `${before}<span style="font-weight: bold; color: #cea338;">${match}</span>${after}`;
                }
            }
            
            dishesHTML += `<span class="dish-tag">${dishDisplay}</span>`;
        }
        
        let listing = `
            <a href="/view/${result.id}" class="text-decoration-none text-dark">
                <div class="restaurant-listing mb-4">
                    <div class="row align-items-center">
                        <div class="col-md-3">
                            <img src="${result.image}" alt="${result.title}" class="img-fluid rounded search-result-image">
                        </div>
                        <div class="col-md-9 restaurant-listing-text">
                            <div class="d-flex align-items-center mb-2">
                                <div class="restaurant-title me-3">${titleDisplay}</div>
                                <div class="cuisine-tag">${cuisineDisplay}</div>
                            </div>
                            <div class="d-flex align-items-center mb-2">
                                <div class="rating-container me-3">
                                    <span class="rating">${generateStarRating(result.rating)}</span>
                                    <span class="rating-text">
                                        ${result.rating}
                                    </span>
                                    <span class="material-symbols-outlined comment-icon">
                                        mode_comment
                                    </span>
                                    <span class="reviews-text"> ${result.reviews} reviews</span>
                                    <span class="price">${result.price === "N/A" ? "" : result.price}</span>
                                </div>
                            </div>
                            <div class="row restaurant-address">
                                <span class="material-symbols-outlined">location_on</span>
                                <span>${result.address}</span>
                            </div>
                            <div class="row restaurant-cuisine mt-2">
                                ${dishesHTML}
                            </div>
                        </div>
                    </div>
                </div>
            </a>
            ${i < results.length - 1 ? '<hr>' : ''}
        `;
        listContainer.append(listing);
    });
    
    $("#display-container").append(listContainer);
}   

$(document).ready(function() {
    // Handle search form submission
    $("#search-form").submit(function(e) {
        let query = $("#search-input").val().trim();
        if (!query) {
            e.preventDefault();
            $("#search-input").val('').focus();
        }
    });
    displaySearchResults(results, count, search_query);
});
    