from django.urls import path
from . import views

urlpatterns = [
    path('start-ride/', views.start_ride),
    path('update-location/', views.update_location),
    path('stop-ride/', views.stop_ride),
    path('check-alert/<str:bike_id>/', views.check_alert),
]

