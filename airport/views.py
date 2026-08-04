from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import (
    IsAuthenticated,
    AllowAny,
)

from .models import Airport
from .serializers import AirportSerializer, RouteSearchSerializer
from .services import (
    find_last_reachable_airport,
    get_route_airports,
    get_longest_duration_airport,
    get_shortest_duration_airport,
)

class AirportListCreateAPIView(generics.ListCreateAPIView):
    """
    API to list all airports and create a new airport.

    Permissions:
    - GET  : Accessible to everyone.
    - POST : Requires an authenticated user.
    """

    queryset = Airport.objects.all()
    serializer_class = AirportSerializer

    def get_permissions(self):
        """
        Assign permissions based on the request method.
        """
        if self.request.method == "POST":
            return [IsAuthenticated()]
        return [AllowAny()]


class AirportRetrieveUpdateDestroyAPIView(
    generics.RetrieveUpdateDestroyAPIView
):
    """
    API to retrieve, update and delete a single airport.

    Permissions:
    - GET                : Accessible to everyone.
    - PUT/PATCH/DELETE   : Requires an authenticated user.
    """

    queryset = Airport.objects.all()
    serializer_class = AirportSerializer

    def get_permissions(self):
        """
        Assign permissions based on the request method.
        """
        if self.request.method in ["PUT", "PATCH", "DELETE"]:
            return [IsAuthenticated()]
        return [AllowAny()]


class SearchRouteAPIView(APIView):
    """
    API to find the last reachable airport from a selected airport
    based on the given direction (left or right).

    Permission:
    - Public endpoint.
    """

    permission_classes = [AllowAny]

    def post(self, request):
        """
        Search for the last reachable airport and return
        the complete route.
        """
        serializer = RouteSearchSerializer(data=request.data)

        if serializer.is_valid():

            airport_code = serializer.validated_data["airport_code"]
            direction = serializer.validated_data["direction"]

            # Retrieve the selected airport using its airport code
            try:
                start_airport = Airport.objects.get(
                    airport_code__iexact=airport_code
                )
            except Airport.DoesNotExist:
                return Response(
                    {"error": "Airport not found"},
                    status=status.HTTP_404_NOT_FOUND,
                )

            # Find the last reachable airport
            last_airport = find_last_reachable_airport(
                start_airport,
                direction,
            )

            # Retrieve every airport in the selected route
            route_airports = get_route_airports(
                start_airport,
                direction,
            )

            # Convert queryset into a list of airport codes
            route = [
                airport.airport_code
                for airport in route_airports
            ]

            return Response({
                "start_airport": start_airport.airport_code,
                "direction": direction,
                "last_reachable_airport": last_airport.airport_code,
                "route": route,
            })

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )
        
        
class LongestDurationAPIView(APIView):
    """
    API to retrieve the airport with the highest duration.

    Permission:
    - Public endpoint.
    """

    permission_classes = [AllowAny]

    def get(self, request):
        """
        Return the airport with the longest duration.
        """
        airport = get_longest_duration_airport()

        if not airport:
            return Response(
                {"message": "No airports found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        return Response({
            "airport": airport.airport_code,
            "duration": airport.duration,
        })


class ShortestDurationAPIView(APIView):
    """
    API to retrieve the airport with the lowest duration.

    Permission:
    - Public endpoint.
    """

    permission_classes = [AllowAny]

    def get(self, request):
        """
        Return the airport with the shortest duration.
        """
        airport = get_shortest_duration_airport()

        if not airport:
            return Response(
                {"message": "No airports found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        return Response({
            "airport": airport.airport_code,
            "duration": airport.duration,
        })