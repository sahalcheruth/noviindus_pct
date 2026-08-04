from django.urls import path
from .views import (
    AirportListCreateAPIView,
    AirportRetrieveUpdateDestroyAPIView,
    SearchRouteAPIView,
    LongestDurationAPIView,
    ShortestDurationAPIView,
)

# URL patterns for Airport Route APIs
urlpatterns = [

    # List all airports (GET) and create a new airport (POST)
    path(
        "airports/",
        AirportListCreateAPIView.as_view(),
    ),

    # Retrieve, update or delete a specific airport using its ID
    path(
        "airports/<int:pk>/",
        AirportRetrieveUpdateDestroyAPIView.as_view(),
    ),

    # Find the last reachable airport based on the selected
    # airport code and traversal direction (left/right)
    path(
        "airports/search-route/",
        SearchRouteAPIView.as_view(),
    ),

    # Retrieve the airport with the longest duration
    path(
        "airports/longest-duration/",
        LongestDurationAPIView.as_view(),
    ),

    # Retrieve the airport with the shortest duration
    path(
        "airports/shortest-duration/",
        ShortestDurationAPIView.as_view(),
    ),
]