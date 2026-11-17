from django.shortcuts import render
from rest_framework import viewsets
from .models import Car
from .serializer import CarSerializer


class CarViewSet(viewsets.ModelViewSet):
    queryset = Car.objects.all()
    serializer_class = CarSerializer


def index(request):
    num_cars = Car.objects.count()
    num_visits = request.session.get('num_visits', 0)

    request.session['num_visits'] = num_visits + 1

    return render(
        request,
        'index.html',
        context={
            'num_cars': num_cars,
            'num_visits': num_visits + 1,
        }
    )