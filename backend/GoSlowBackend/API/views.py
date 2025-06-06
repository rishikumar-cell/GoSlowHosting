from django.http import JsonResponse
from .models import Bike
from geopy.distance import geodesic
from django.views.decorators.csrf import csrf_exempt
import json
from .utils import is_within_radius, format_alert

@csrf_exempt
def start_ride(request):
    data = json.loads(request.body)
    bike_id = data['bike_id']
    Bike.objects.update_or_create(bike_id=bike_id, defaults={'active': True})
    return JsonResponse({'status': 'started'})


@csrf_exempt
def update_location(request):
    data = json.loads(request.body)
    bike_id = data['bike_id']
    latitude = data['latitude']
    longitude = data['longitude']
    speed = data.get('speed', 0)  # fallback to 0 if not sent

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

    for other in Bike.objects.filter(active=True).exclude(bike_id=bike_id):
        within, distance = is_within_radius(
            (latitude, longitude),
            (other.latitude, other.longitude),
            radius=30
        )
        if within and other.speed > current_bike.speed:
            alert = True
            alert_message = {
                'alert': True,
                'message': f"{other.bike_id} ({other.speed} km/h) is approaching faster than you ({current_bike.speed} km/h) within {distance:.2f} m"
            }
            break

    return JsonResponse(alert_message if alert else {'alert': False})

@csrf_exempt
def stop_ride(request):
    data = json.loads(request.body)
    bike_id = data['bike_id']
    Bike.objects.filter(bike_id=bike_id).update(active=False)
    return JsonResponse({'status': 'stopped'})