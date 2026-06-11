from django.shortcuts import render
from .forms import *

# def ---> Funcion
# ---> Request : Retorna la Pagina Web
def Home(request):
    # -->Cada vez que llamemos a "Home"
    # --> estamos hablando de la pagina Base.html
    return render(request,'Base.html')

def Registro(request):
    data={
        'Formulario':FormularioRegistro()
    }
    # --->Si el metodo de HTML es post
    if request.method=="POST":
        # --> Guarda lo que registro a la Base de DATOS
        query=FormularioRegistro(data=request.POST,files=request.FILES)
        if query.is_valid():
            query.save()
            data["Mensaje"]="Datos Registrados"
        else:
            data['Mensaje']="No se pudo Registrar"
    return render(request,'Pages/Registro.html',data)

def Integrantes(request):
    return render(request,'Pages/Integrantes.html')
