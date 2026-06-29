from django.db import models

# --> Class + Nombre
class Prenda(models.Model):
    id_prenda=models.AutoField(primary_key=True)
    Talle=models.TextField(max_length=3)
    Categoria=models.TextField(max_length=35)
    Descripcion=models.TextField(max_length=200)
    Precio=models.FloatField()
    Calle=models.TextField(max_length=50)
    Altura=models.IntegerField()

    def __str__(self):
        return self.id_prenda
