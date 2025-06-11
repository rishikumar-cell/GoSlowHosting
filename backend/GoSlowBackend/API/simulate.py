import requests
import time
import random

# Local backend URL
URL = "http://127.0.0.1:8000/update-location/"

# Simulate 2 bikes with movement\
speed = random.randint(5, 20)  # km/h

bikes = {
    "bike001": [12.9716, 77.5946],
    "bike002": [12.9717, 77.5947],
}

def move(lat, lng):
    """Random small movement generator"""
    return lat + random.uniform(-0.0001, 0.0001), lng + random.uniform(-0.0001, 0.0001)

while True:
    for bike_id in bikes:
        lat, lng = move(*bikes[bike_id])
        bikes[bike_id] = [lat, lng]

        speed = random.randint(5, 20)  # km/h
        res = requests.post(URL, json={
    'bike_id': bike_id,
    'latitude': lat,
    'longitude': lng,
    'speed': speed,
        })

        print(f"[{bike_id}] Sent location ({lat:.5f}, {lng:.5f}) | Alert: {res.json().get('alert')}")
    
    time.sleep(2)