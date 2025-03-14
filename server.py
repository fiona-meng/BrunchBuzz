# Fanyue Meng
from flask import Flask
from flask import render_template
from flask import Response, request, jsonify, redirect, url_for
import json

app = Flask(__name__)

# Load restaurant data once
brunch_data = json.load(open('yelp_brunch_new_york_city.json'))


@app.route('/')
def homepage():
    """Render the homepage with all restaurant data"""
    return render_template('homepage.html', restaurants=brunch_data)

@app.route('/view/<id>')
def view(id):
    restaurant = brunch_data[id]
    return render_template('view.html', restaurant=restaurant, brunch_data=brunch_data)

@app.route('/edit/<id>')
def edit(id):
    """Render the edit restaurant page for a specific restaurant."""
    if id not in brunch_data:
        # Handle case when ID doesn't exist
        return redirect(url_for('homepage'))
    
    restaurant = brunch_data[id]
    return render_template('edit.html', restaurant=restaurant)

@app.route('/search_results')
def search_results():
    # Get the search query from the URL parameters
    search_query = request.args.get('query', '')
    
    # If search query is empty, redirect to homepage or show all results
    if not search_query:
        return render_template('search_results.html', 
                              results=[], 
                              count=0,
                              search_query='')

    matching_results = {} 
    for restaurant_id, restaurant in brunch_data.items():
        restaurant_matched = False
        match_fields = []
        
        # Check title (field 1)
        if search_query.lower() in restaurant['title'].lower():
            match_fields.append('title')
            restaurant_matched = True
        
        # Check cuisine type (field 2)
        for cuisine in restaurant['cuisine']:
            if search_query.lower() in cuisine.lower():
                match_fields.append('cuisine')
                restaurant_matched = True
               
            
        # Check popular dishes (field 3)
        for dish in restaurant['popular_dishes']:
            if search_query.lower() in dish.lower():
                match_fields.append('popular_dishes')
                restaurant_matched = True
                        
        
        # If this restaurant matched any criteria, add it to results with all match fields
        if restaurant_matched:
            # Create a copy of the restaurant data to avoid modifying the original
            restaurant_copy = restaurant.copy()
            restaurant_copy['match_fields'] = match_fields
            matching_results[restaurant_id] = restaurant_copy
    
    # Convert the dictionary values to a list for your results
    matching_results = list(matching_results.values())
    
    # Count results
    result_count = len(matching_results)
    
    # Render the template with results
    return render_template('search_results.html', 
                          results=matching_results, 
                          count=result_count,
                          search_query=search_query)

@app.route('/add')
def add_restaurant_page():
    """Render the add restaurant page."""
    return render_template('add.html')

@app.route('/api/restaurants', methods=['POST'])
def add_restaurant():
    data = request.json
    
    cuisine_list = [c.strip() for c in data['cuisine'].split(',') if c.strip()]
    popular_dishes_list = [d.strip() for d in data['popular_dishes'].split(',') if d.strip()]
    
    new_restaurant = {
        'id': generate_unique_id(),
        'title': data['title'],
        'image': data['image'],
        'description': data['description'],
        'address': data['address'],
        'rating': data['rating'],
        'price': data['price'],
        'reviews': 0,
        'cuisine': cuisine_list, 
        'phone': data['phone'],
        'popular_dishes': popular_dishes_list
    }
    
    brunch_data[new_restaurant['id']] = new_restaurant
    return jsonify({'id': new_restaurant['id'], 'message': 'Restaurant added successfully'}), 201

@app.route('/api/restaurants/<id>', methods=['PUT'])
def update_restaurant(id):
    """API endpoint to update an existing restaurant."""
    if id not in brunch_data:
        return jsonify({"error": "Restaurant not found"}), 404
        
    data = request.json
    
    cuisine_list = [c.strip() for c in data['cuisine'].split(',') if c.strip()]
    popular_dishes_list = [d.strip() for d in data['popular_dishes'].split(',') if d.strip()]
    
    # Update the restaurant data
    brunch_data[id]['title'] = data['title']
    brunch_data[id]['image'] = data['image']
    brunch_data[id]['description'] = data['description']
    brunch_data[id]['address'] = data['address']
    brunch_data[id]['rating'] = data['rating']
    brunch_data[id]['price'] = data['price']
    brunch_data[id]['cuisine'] = cuisine_list
    brunch_data[id]['phone'] = data['phone']
    brunch_data[id]['popular_dishes'] = popular_dishes_list
    
    return jsonify({'message': 'Restaurant updated successfully'}), 200

def generate_unique_id():
    import time
    return str(int(time.time() * 1000))

if __name__ == '__main__':
    app.run(debug=True, port=5001)
