from django.urls import path
from .views import *

urlpatterns = [
    path("users/", get_users, name="get_users"),
    path("users/filter/", get_user_by_email, name="get_user_by_email"),

    path("songs/", get_songs, name="get_songs"),

    path("artists/", get_artists, name="get_artists"),
    path("artists/filter/", get_artist_by_filter, name="get_artist_by_filter"),

    path("albums/", get_albums, name="get_albums"),
    path("albums/filter/", get_albums_by_filter, name="get_albums_by_filter"),
    
    path("categories/", get_categories, name="get_categories"),
    
]   
    