from django.db import models

class Bike(models.Model):
    bike_id = models.CharField(max_length=100, unique=True)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    speed = models.FloatField(default=0)
    active = models.BooleanField(default=False)

    def __str__(self):
        return self.bike_id
