from rest_framework import serializers
from .models import Airport


class AirportSerializer(serializers.ModelSerializer):
    """
    Serializer for Airport model.

    Handles serialization/deserialization and validates
    airport data before saving it to the database.
    """

    class Meta:
        model = Airport
        fields = "__all__"

    def validate_airport_code(self, value):
        """
        Validate airport code.

        - Removes extra spaces.
        - Converts the code to uppercase.
        - Ensures the airport code is unique.
        """
        value = value.strip().upper()

        queryset = Airport.objects.filter(airport_code=value)

        # Exclude the current instance during update
        if self.instance:
            queryset = queryset.exclude(pk=self.instance.pk)

        if queryset.exists():
            raise serializers.ValidationError(
                "Airport code already exists."
            )

        return value

    def validate_position(self, value):
        """
        Validate airport position.

        - Position must be greater than zero.
        - Position must be unique.
        """
        if value <= 0:
            raise serializers.ValidationError(
                "Position must be greater than 0."
            )

        queryset = Airport.objects.filter(position=value)

        # Exclude the current instance during update
        if self.instance:
            queryset = queryset.exclude(pk=self.instance.pk)

        if queryset.exists():
            raise serializers.ValidationError(
                "Position already exists."
            )

        return value

    def validate_duration(self, value):
        """
        Validate airport duration.

        Duration must be greater than zero.
        """
        if value <= 0:
            raise serializers.ValidationError(
                "Duration must be greater than 0."
            )

        return value


class RouteSearchSerializer(serializers.Serializer):
    """
    Serializer for searching airport routes.

    Accepts:
    - airport_code
    - direction (left or right)
    """

    # Airport code entered by the user
    airport_code = serializers.CharField(max_length=10)

    # Direction to traverse the airport route
    direction = serializers.ChoiceField(
        choices=[
            ("left", "Left"),
            ("right", "Right"),
        ]
    )

    def validate_airport_code(self, value):
        """
        Validate the provided airport code.

        - Removes extra spaces.
        - Converts the code to uppercase.
        - Ensures the airport exists before searching.
        """
        value = value.strip().upper()

        if not Airport.objects.filter(airport_code=value).exists():
            raise serializers.ValidationError(
                "Airport not found."
            )

        return value