from django.urls import path
from .views import OrderListCreateView, OrderListView, AssignCourierView, UpdateStatusView, AdminOrderListView, CourierListView

urlpatterns = [
    path("", OrderListCreateView.as_view(), name="order-list-create"),
    path("list/", OrderListView.as_view(), name="order-list"), 
    path("<int:pk>/assign_courier/", AssignCourierView.as_view(), name="assign-courier"),
    path("<int:pk>/update_status/", UpdateStatusView.as_view(), name="update-status"),
    path("admin/", AdminOrderListView.as_view(), name="admin-order-list"),
    path("couriers/", CourierListView.as_view(), name="courier-list")
]