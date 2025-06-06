from geopy.distance import geodesic

# Check if two points are within a radius (in meters)
def is_within_radius(coord1, coord2, radius=30):
    distance = geodesic(coord1, coord2).meters
    return distance <= radius, distance

# Format and log alerts if needed (expandable)
def format_alert(bike_id, other_bike_id, distance):
    return {
        'alert': True,
        'message': f"{bike_id} is too close to {other_bike_id} ({distance:.2f} m)"
    }
