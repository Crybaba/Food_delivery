from django.urls import path
from .views import (
    RegisterView, LoginView, LogoutView,
    CartView, AddToCartView, RemoveFromCartView, ClearCartView, CurrentUserView
)

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path('me/', CurrentUserView.as_view()),

    # корзина
    path("cart/", CartView.as_view(), name="cart"),
    path("cart/add/", AddToCartView.as_view(), name="cart-add"),
    path("cart/remove/", RemoveFromCartView.as_view(), name="cart-remove"),
    path("cart/clear/", ClearCartView.as_view(), name="cart-clear"),
]
