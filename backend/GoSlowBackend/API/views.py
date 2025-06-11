from django.http import JsonResponse
from .models import Bike
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET
from geopy.distance import geodesic
import json

# Utility function to check distance between two coordinates
def is_within_radius(coord1, coord2, radius=20):
    """
    Returns a tuple (within_radius: bool, distance_in_meters: float)
    """
    distance = geodesic(coord1, coord2).meters
    return distance <= radius, distance


@csrf_exempt
def start_ride(request):
    try:
        data = json.loads(request.body)
        bike_id = data.get('bike_id')

        if not bike_id:
            return JsonResponse({'error': 'bike_id is required'}, status=400)

        Bike.objects.update_or_create(bike_id=bike_id, defaults={'active': True})
        return JsonResponse({'status': 'started'})
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)


@csrf_exempt
def update_location(request):
    try:
        data = json.loads(request.body)
        print("Incoming data:", data)  # Optional: remove in production

        bike_id = data.get('bike_id')
        latitude = data.get('latitude')
        longitude = data.get('longitude')
        speed = data.get('speed', 0)

        if not all([bike_id, latitude, longitude]):
            return JsonResponse({'error': 'bike_id, latitude, and longitude are required'}, status=400)

        try:
            latitude = float(latitude)
            longitude = float(longitude)
            speed = float(speed)
        except ValueError:
            return JsonResponse({'error': 'Latitude, longitude, and speed must be numbers'}, status=400)

        # Update or create current bike's location
        current_bike, _ = Bike.objects.update_or_create(
            bike_id=bike_id,
            defaults={
                'latitude': latitude,
                'longitude': longitude,
                'speed': speed,
                'active': True
            }
        )

        alert = False
        alert_message = None

        # Check for nearby faster bikes
        for other in Bike.objects.filter(active=True).exclude(bike_id=bike_id):
            within, distance = is_within_radius(
                (latitude, longitude),
                (other.latitude, other.longitude),
                radius=20
            )
            if within and other.speed > current_bike.speed:
                alert = True
                alert_message = {
                    'alert': True,
                    'message': f"{other.bike_id} ({other.speed} km/h) is approaching faster than you ({current_bike.speed} km/h) within {distance:.2f} m"
                }
                break

        return JsonResponse(alert_message if alert else {'alert': False})

    except (json.JSONDecodeError, TypeError, ValueError):
        return JsonResponse({'error': 'Invalid data format'}, status=400)


@csrf_exempt
def stop_ride(request):
    try:
        data = json.loads(request.body)
        bike_id = data.get('bike_id')

        if not bike_id:
            return JsonResponse({'error': 'bike_id is required'}, status=400)

        Bike.objects.filter(bike_id=bike_id).update(active=False)
        return JsonResponse({'status': 'stopped'})

    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)


@require_GET
def check_alert(request, bike_id):
    try:
        bike = Bike.objects.get(bike_id=bike_id, active=True)
        alert = False
        alert_message = None

        for other in Bike.objects.filter(active=True).exclude(bike_id=bike_id):
            within, distance = is_within_radius(
                (bike.latitude, bike.longitude),
                (other.latitude, other.longitude),
                radius=20
            )
            if within and other.speed > bike.speed:
                alert = True
                alert_message = {
                    'alert': True,
                    'message': f"{other.bike_id} ({other.speed} km/h) is approaching faster than you ({bike.speed} km/h) within {distance:.2f} m"
                }
                break

        return JsonResponse(alert_message if alert else {'alert': False})

    except Bike.DoesNotExist:
        return JsonResponse({'error': 'Bike not found or not active'}, status=404)




