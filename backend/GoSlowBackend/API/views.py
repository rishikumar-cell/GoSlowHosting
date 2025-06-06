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

    current_bike, _ = Bike.objects.update_or_create(
        bike_id=bike_id,
        defaults={'latitude': latitude, 'longitude': longitude, 'active': True}
    )

    alert = False
    alert_message = None
    for other in Bike.objects.filter(active=True).exclude(bike_id=bike_id):
        within, distance = is_within_radius(
            (latitude, longitude),
            (other.latitude, other.longitude),
            radius=30
        )
        if within:
            alert = True
            alert_message = format_alert(bike_id, other.bike_id, distance)
            break

    return JsonResponse(alert_message if alert else {'alert': False})


@csrf_exempt
def stop_ride(request):
    data = json.loads(request.body)
    bike_id = data['bike_id']
    Bike.objects.filter(bike_id=bike_id).update(active=False)
    return JsonResponse({'status': 'stopped'})
