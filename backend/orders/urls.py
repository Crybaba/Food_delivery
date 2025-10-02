from django.urls import path
from .views import OrderListCreateView, OrderListView, AssignCourierView, UpdateStatusView

urlpatterns = [
    path("", OrderListCreateView.as_view(), name="order-list-create"),
    path("list/", OrderListView.as_view(), name="order-list"), 
    path("<int:pk>/assign-courier/", AssignCourierView.as_view(), name="assign-courier"),
    path("<int:pk>/update-status/", UpdateStatusView.as_view(), name="update-status"),
]