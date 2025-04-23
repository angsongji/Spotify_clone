from bson import ObjectId
from rest_framework import serializers
from .models import User, Song, Album, Category, Chat, Message, Purchase, Playlist 
import json
class FileUploadSerializer(serializers.Serializer):
    file = serializers.FileField()
class UserSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()
    created_at = serializers.DateTimeField(format="%d-%m-%Y %H:%M:%S")
    class Meta:
        model = User
        fields = ["id","name", "email", "avatar","role", "created_at", "status", "liked_albums", "liked_songs"]
    def get_id(self, obj):
        return str(obj.id)

class UserFullInforSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()
    playlists_data = serializers.SerializerMethodField()
    liked_albums_data = serializers.SerializerMethodField()
    liked_songs_data = serializers.SerializerMethodField()
    # chats_data = serializers.SerializerMethodField()
    purchases_data = serializers.SerializerMethodField()
    
    liked_albums = serializers.SerializerMethodField()
    liked_songs = serializers.SerializerMethodField()

    created_at = serializers.DateTimeField(format="%d-%m-%Y %H:%M:%S")
    class Meta:
        model = User
        fields = ["id","name", "email", "avatar","role", "created_at", "status", "liked_albums_data", "playlists_data", "liked_songs_data",  "purchases_data", "liked_albums", "liked_songs"]
    def get_id(self, obj):
        return str(obj.id)
    
    def get_liked_albums(self, obj):
        # Trả về mảng thật sự (list of strings)
        if isinstance(obj.liked_albums, str):
            return json.loads(obj.liked_albums)
        return obj.liked_albums

    def get_liked_songs(self, obj):
        if isinstance(obj.liked_songs, str):
            return json.loads(obj.liked_songs)
        return obj.liked_songs

    def get_playlists_data(self, obj):
        playlists = Playlist.objects.filter(user_id=obj.id)
        return PlaylistSerializer(playlists, many = True).data if playlists.exists() else []  # Serialize nếu có album
    def get_liked_albums_data(self, obj):
        # Lấy danh sách các album mà người dùng đã like từ mảng liked_albums
        liked_albums_ids = obj.liked_albums  # Đây là mảng chứa ID của các album người dùng đã thích
        if liked_albums_ids:
            # Lấy các album chi tiết từ database dựa trên ID trong liked_albums
            albums = Album.objects.filter(id__in=liked_albums_ids)
            return AlbumSerializer(albums, many=True).data if albums.exists() else []  # Serialize các album và trả về dữ liệu chi tiết
        return []
    def get_liked_songs_data(self, obj):    
        liked_songs_ids = obj.liked_songs  # Đây là mảng chứa ID của các album người dùng đã thích
        if liked_songs_ids:
            # Lấy các bài hát chi tiết từ database dựa trên ID trong liked_songs
            songs = Song.objects.filter(id__in=liked_songs_ids)
            return SongSerializer(songs, many=True).data  if songs.exists() else []# Serialize các bài hát và trả về dữ liệu chi tiết
        return []
    # def get_chats_data(self, obj):
    #     chats = Chat.objects.filter(users__contains=[str(obj.id)])
    #     return ChatSerializer(chats, many=True).data  if chats.exists() else []
    
    def get_purchases_data(self, obj):
        purchases = Purchase.objects.filter(user_id=str(obj.id)).order_by("-purchase_date")
        return PurchaseSerializer(purchases, many = True).data if purchases.exists() else []


class SongSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField() #thêm một trường mới vào API response
    # album_data = serializers.SerializerMethodField() #thêm một trường mới vào API response
    artists_data = serializers.SerializerMethodField()
    categories_data = serializers.SerializerMethodField()
    date = serializers.DateField(format="%d-%m-%Y")
    class Meta:
        model = Song    
        fields = "__all__"

    def get_id(self, obj):
        return str(obj.id)
    
    @classmethod
    def get_songs(cls):
        songs = Song.objects.exclude(status=2)
        return cls(songs, many=True).data 

    
    def get_artists_data(self, obj):
        # Lấy danh sách các artist mà của song
        artists_ids = obj.artists  # Đây là mảng chứa ID của các album người dùng đã thích
        if artists_ids:
            # Lấy các thông tin chi tiết từ database dựa trên ID trong artists
            artists = User.objects.filter(id__in=artists_ids)
            return UserSerializer(artists, many=True).data  # Serialize các album và trả về dữ liệu chi tiết
        return []

    def get_categories_data(self, obj):
       # Lấy danh sách các categories mà của song
        categories_ids = obj.categories  # Đây là mảng chứa ID của các album người dùng đã thích
        if categories_ids:
            # Lấy các thông tin chi tiết từ database dựa trên ID trong categories
            categories = Category.objects.filter(id__in=categories_ids)
            return CategorySerializer(categories, many=True).data  if categories.exists() else []# Serialize các album và trả về dữ liệu chi tiết
        return []

class AlbumSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()
    release_date = serializers.DateField(format="%d-%m-%Y")
    artist_data = serializers.SerializerMethodField()
    class Meta:
        model = Album
        fields = "__all__"

    def get_id(self, obj):
        return str(obj.id)
    
    @classmethod
    def get_albums(cls):
        # Lọc chỉ những song có status khác 2
        albums = Album.objects.exclude(status=2)
        # Sử dụng serializer để chuyển đổi queryset thành dữ liệu
        return cls(albums, many=True).data
    
    def get_artist_data(self, obj):
        # Lấy thông tin chi tiết các bài hát trong album này
        artist = User.objects.filter(id=obj.artist_id).first()
        return UserSerializer(artist).data if artist else None

class AlbumFullInforSerializer(serializers.ModelSerializer):   
    id = serializers.SerializerMethodField()
    release_date = serializers.DateField(format="%d-%m-%Y")  # Định dạng YYYY-MM-DD
    songs_data = serializers.SerializerMethodField()
    artist_data = serializers.SerializerMethodField()
    class Meta:
        model = Album
        fields = "__all__"

    def get_id(self, obj):
        return str(obj.id)

    @classmethod
    def get_albums(cls):
        # Lọc chỉ những song có status khác 2
        albums = Album.objects.exclude(status=2)
        # Sử dụng serializer để chuyển đổi queryset thành dữ liệu
        return cls(albums, many=True).data

    def get_songs_data(self, obj):
        # Lấy thông tin chi tiết các bài hát trong album này
        songs = Song.objects.filter(album_id=obj.id)
        return SongSerializer(songs, many=True).data if songs.exists() else [] #many=true khi kết quả là danh sách
    
    def get_artist_data(self, obj):
        # Lấy thông tin chi tiết các bài hát trong album này
        artist = User.objects.filter(id=obj.artist_id).first()
        return UserSerializer(artist).data if artist else None

class CategorySerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()
    class Meta:
        model = Category
        fields = "__all__"
    def get_id(self, obj):
        return str(obj.id)


class ChatSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()
    users_data = serializers.SerializerMethodField()
    # messages_data = serializers.SerializerMethodField()
    class Meta:
        model = Chat
        fields = "__all__"
    def get_id(self, obj):
        return str(obj.id)
    def get_users_data(self, obj):
        users_id = obj.users
        users = User.objects.filter(id__in = users_id)
        return UserSerializer(users, many=True).data if users.exists() else []
    # def get_messages_data(self, obj):
    #     messages = Message.objects.filter(chat_id=str(obj.id)).order_by("timestamp")
    #     return MessageSerializer(messages, many=True).data if messages.exists() else []

class MessageSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()
    # timestamp = serializers.DateTimeField(format="%d-%m-%Y %H:%M:%S")
    class Meta:
        model = Message
        fields = "__all__"
    def get_id(self, obj):
        return str(obj.id)


class PurchaseSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()
    class Meta:
        model = Purchase
        fields = "__all__"
    def get_id(self, obj):
        return str(obj.id)
   

class PlaylistSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()
    songs_data = serializers.SerializerMethodField()
    release_date = serializers.DateField(format="%d-%m-%Y", read_only=True)
    class Meta:
        model = Playlist
        fields = "__all__"
    def get_id(self, obj):
        return str(obj.id)
    def get_songs_data(self, obj):    
        if obj.songs:
            songs = Song.objects.filter(id__in=obj.songs)
            return SongSerializer(songs, many=True).data  # Serialize các bài hát và trả về dữ liệu chi tiết
        return []
    
class ArtistSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["id", "name", "avatar"]

    def get_id(self, obj):
        return str(obj.id)
    
    @classmethod
    def get_artists(cls):
        # Lọc chỉ những artist có role="artist" và status=1
        artists = User.objects.filter(role='artist', status=1)
        # Sử dụng serializer để chuyển đổi queryset thành dữ liệu
        return cls(artists, many=True).data

class ArtistFullInforSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()
    albums_data = serializers.SerializerMethodField()
    songs_data = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["id", "name", "avatar", "albums_data", "songs_data"]

    def get_id(self, obj):
        return str(obj.id)
    
    def get_albums_data(self, obj):
        # Lấy thông tin chi tiết các bài hát trong album này
        albums = Album.objects.filter(artist_id=obj.id)
        return AlbumSerializer(albums, many=True).data if albums.exists() else []
    
    def get_songs_data(self, obj):
        songs = Song.objects.filter(artists__contains=[str(obj.id)])
        return SongSerializer(songs, many=True).data  if songs.exists() else []# Trả về các bài hát đã được serialize