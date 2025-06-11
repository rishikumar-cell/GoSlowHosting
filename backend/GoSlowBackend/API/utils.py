from geopy.distance import geodesic

def is_within_radius(coord1, coord2, radius):
    """
    Returns (True, distance) if the two coordinates are within the given radius (in meters).
    """
    distance = geodesic(coord1, coord2).meters
    return distance <= radius, distance

