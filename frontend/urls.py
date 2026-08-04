from django.urls import path
from . import views

urlpatterns = [

    path("", views.login_page, name="login"),

    path("login/", views.login_page, name="login"),

    path("dashboard/", views.dashboard_page, name="dashboard"),

    path(
        "airport-management/",
        views.airport_management_page,
        name="airport-management",
    ),

    path(
        "route-information/",
        views.route_information_page,
        name="route-information",
    ),

]