from rest_framework import viewsets
from .models import Car
from .serializer import CarSerializer

class CarViewSet(viewsets.ModelViewSet):
    queryset = Car.objects.all()
    serializer_class = CarSerializer
