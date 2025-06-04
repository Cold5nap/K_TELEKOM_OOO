from django.contrib import admin
from django.urls import path, include, re_path
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.conf.urls.static import static
from django.conf import settings
from django.views.generic import TemplateView, RedirectView
from django.views.static import serve

models = ['equipment', 'user']

urlpatterns = [
    path('admin/', admin.site.urls),

    path(f'api/user/', include(f'user.urls')) ,
    path(f'api/', include(f'equipment.urls')) ,

    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
	 re_path(
        r'^(?!(api|admin|media)/)(?P<path>.*\.(css|js|png|jpg|jpeg|gif|svg|ico|woff2?|ttf|eot|mp4|webm|json))$',
        serve,
        {'document_root': settings.STATIC_ROOT},
    ),

    # Все остальные URL → index.html (для SPA)
    re_path(r'^.*$', TemplateView.as_view(template_name='index.html')),
]
if settings.DEBUG:
    urlpatterns += staticfiles_urlpatterns()
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
