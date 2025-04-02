from django.urls import path
from .views import *

urlpatterns = [
    path("users/", get_users, name="get_users"),
    path("users/filter/", get_user, name="get_user"),
    path('users/login/', login_user, name='login_user'),
    path('users/register/', register_user, name='register_user'),


    path("songs/", get_songs, name="get_songs"),
    path("add-song/", add_song, name="add_song"),
    path("update-song/", update_song, name="update_song"),  # Thêm song_id vào URL

    path("artists/", get_artists, name="get_artists"),
    path("artists/filter/", get_artist_by_filter, name="get_artist_by_filter"),

    path("albums/", get_albums, name="get_albums"),
    path("albums/filter/", get_albums_by_filter, name="get_albums_by_filter"),
    path("add-album/", add_album, name="add_album"),
    
    path("categories/", get_categories, name="get_categories"),

    path('upload/', upload_file, name='upload_file'),
]   
    