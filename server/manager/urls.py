from django.contrib import admin
from django.urls import path, include, re_path
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.conf.urls.static import static
from django.conf import settings
from django.views.generic import TemplateView, RedirectView

models = ['equipment', 'user']

urlpatterns = [
    path('admin/', admin.site.urls),

    path(f'api/user/', include(f'user.urls')) ,
    path(f'api/', include(f'equipment.urls')) ,

    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'),
         name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
     path('', TemplateView.as_view(template_name='index.html')),
    #  re_path(r'^(?!(static|api|admin)/).*$', RedirectView.as_view(url='/static/')),
]
if settings.DEBUG:
    urlpatterns += staticfiles_urlpatterns()
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
