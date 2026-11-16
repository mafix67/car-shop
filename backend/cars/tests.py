from django.test import TestCase
from .models import Car

class YourTestClass(TestCase):
    def setUp(self):
        self.car = Car.objects.create(
            brand = 'Test brand',
            model = "Test model",
            year = 2026,
            price = 3000000,
            mileage=1000,
            engine='Test engine',
            transmission='Automatic',
            body_type='suv',
        )

        self.assertIsNotNone(car.id)
        self.assertTrue(Car.objects.filter(id = car.id).exists())
    def tearDown(self):

    
    def test_somfing_that_will_pass(self):
        self.assertFalse(False)
    
    def test_somfing_that_will_fail(self):
        self.assertTrue(False)