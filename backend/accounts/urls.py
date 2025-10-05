from django.urls import path
from .views import (
    CurrentUserView, RegisterView, LoginView, LogoutView,
    CartView, AddToCartView, RemoveFromCartView, ClearCartView,
    AllUsersView, AddCourierView, RemoveCourierView, CourierActiveOrdersView
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

      # управление пользователями / курьерами
    path("users/", AllUsersView.as_view(), name="all_users"),
    path("couriers/add/", AddCourierView.as_view(), name="add_courier"),
    path("couriers/<int:courier_id>/remove/", RemoveCourierView.as_view(), name="remove_courier"),
    path("couriers/<int:courier_id>/active_orders/", CourierActiveOrdersView.as_view(), name="courier_active_orders"),
]
