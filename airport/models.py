from django.db import models


class Airport(models.Model):
    """
    Model to store airport route information.

    Fields:
    - airport_code: Unique airport code (e.g., COK, DEL, MAA)
    - position: Defines the airport's order in the route
    - duration: Duration value associated with the airport
    """

    # Unique airport code
    airport_code = models.CharField(max_length=10, unique=True)

    # Position of the airport in the route
    position = models.PositiveIntegerField(unique=True)

    # Duration associated with the airport
    duration = models.PositiveIntegerField()

    class Meta:
        # Return airports ordered by their position
        ordering = ["position"]

    def __str__(self):
        # Display airport code in Django Admin and shell
        return self.airport_code