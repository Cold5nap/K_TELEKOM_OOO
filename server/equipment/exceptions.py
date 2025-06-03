# exceptions.py
from rest_framework.views import exception_handler, Response
from django.db.models import ProtectedError

def protected_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if isinstance(exc, ProtectedError):
        print(exc)
        data = {
            'error': 'Нельзя удалить, т.к. есть связанные записи'
        }
        response = Response(data, status=400)

    return response