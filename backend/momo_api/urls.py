from django.urls import path
from .views import *

urlpatterns = [
    path("create/", create_payment),
    path("ipn/", momo_ipn),
]
