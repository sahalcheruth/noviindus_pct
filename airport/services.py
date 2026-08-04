from .models import Airport


def find_last_reachable_airport(start_airport, direction):
    """
    Find the last reachable airport from the selected airport
    based on the given traversal direction.

    Args:
        start_airport: Airport object selected by the user.
        direction: Route direction ("left" or "right").

    Returns:
        Airport object representing the last reachable airport.
        Returns None if the direction is invalid.
    """

    # Traverse towards the right by selecting airports
    # with greater than or equal position values.
    if direction == "right":
        return (
            Airport.objects.filter(position__gte=start_airport.position)
            .order_by("-position")
            .first()
        )

    # Traverse towards the left by selecting airports
    # with lower than or equal position values.
    elif direction == "left":
        return (
            Airport.objects.filter(position__lte=start_airport.position)
            .order_by("position")
            .first()
        )

    # Return None for an invalid direction
    return None




def get_route_airports(start_airport, direction):
    """
    Retrieve all airports in the selected traversal direction.

    Args:
        start_airport: Airport object selected by the user.
        direction: Route direction ("left" or "right").

    Returns:
        QuerySet containing all airports along the route.
    """

    if direction == "right":
        return Airport.objects.filter(
            position__gte=start_airport.position
        ).order_by("position")

    elif direction == "left":
        return Airport.objects.filter(
            position__lte=start_airport.position
        ).order_by("-position")

    return Airport.objects.none()


def get_longest_duration_airport():
    """
    Retrieve the airport with the highest duration.

    Returns:
        Airport object with the maximum duration.
    """
    return Airport.objects.order_by("-duration").first()


def get_shortest_duration_airport():
    """
    Retrieve the airport with the lowest duration.

    Returns:
        Airport object with the minimum duration.
    """
    return Airport.objects.order_by("duration").first()

