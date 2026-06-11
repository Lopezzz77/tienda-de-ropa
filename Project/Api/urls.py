from django.urls import path
from .views import *

urlpatterns = [
    # ---> Pagina, Funcion , Hipervinculo
    path('',Home,name="Inicio"),
    path('registro/',Registro,name="Registro"),
    path('integrantes/',Integrantes,name="integrantes"),
]
