from .models import *
from django import forms

class FormularioRegistro(forms.ModelForm):
    class Meta:
        model=Prenda
        fields='__all__'