from django.shortcuts import render


def login_page(request):
    return render(request, "frontend/login.html")


def dashboard_page(request):
    return render(request, "frontend/dashboard.html")


def airport_management_page(request):
    return render(
        request,
        "frontend/airport-management.html",
    )


def route_information_page(request):
    return render(
        request,
        "frontend/route-information.html",
    )