from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .models import User, Song, Album, Category, Chat, Message, Purchase
from .serializers import *
from bson import ObjectId

#users
@api_view(["GET"])
def get_users(request):
    try:
        users = User.objects.all()

        #Test api khi lỗi hệ thống
        # users = User.objects.filter(non_existing_field="test")
        if not users.exists():  # Kiểm tra nếu không có dữ liệu
            return Response({"message": [], "status": 200},status=status.HTTP_200_OK)

        serializer = UserSerializer(users, many=True)
        return Response({"message": serializer.data, "status": 200},status=status.HTTP_200_OK)

    except Exception as e:  # Bắt lỗi chung nếu có lỗi xảy ra
        return Response({"error": str(e), "status": 500}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["GET"])
def get_user_by_email(request):
    try:
        filter_params = request.query_params  # Lấy các tham số bộ lọc từ query parameters
        users = User.objects.all()  # Lấy tất cả các album

        # Áp dụng bộ lọc nếu có tham số từ query_params
        # Lọc theo 'id' (sử dụng 'exact' cho ObjectId)
        if 'email' in filter_params:
            try:
                users = users.filter(email=filter_params['email'])  # Lọc theo ObjectId chính xác
            except Exception:
                return Response({"error": "Invalid id format, should be a valid ObjectId", "status": 400}, status=status.HTTP_400_BAD_REQUEST)


        # Nếu không có album nào sau khi lọc
        if not users.exists():
            return Response({"message": [], "status": 200}, status=status.HTTP_200_OK)
        
        # Serialize các album với thông tin bài hát
        serializer = UserFullInforSerializer(users, many=True)
        return Response({"message": serializer.data, "status": 200}, status=status.HTTP_200_OK)

    except Exception as e:
        # Trả về lỗi chi tiết hơn
        return Response({"error": f"Error occurred: {str(e)}", "status": 500}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



#songs
@api_view(["GET"])
def get_songs(request):
    try:
        songs = Song.objects.all()
        if not songs.exists():  # Kiểm tra nếu không có dữ liệu
            return Response({"message": [], "status": 200},status=status.HTTP_200_OK)

        serializer = SongSerializer(songs, many=True)  # Sử dụng serializer có album_data
        return Response({"message": serializer.data, "status": 200},status=status.HTTP_200_OK)

    except Exception as e:  # Bắt lỗi chung nếu có lỗi xảy ra
        return Response({"error": str(e), "status": 500}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["GET"])
def get_artists(request):
    try:
        artists = User.objects.all()
        if not artists.exists():  # Kiểm tra nếu không có dữ liệu
            return Response({"message": [], "status": 200},status=status.HTTP_200_OK)

        serializer = ArtistSerializer.get_artists()  # Sử dụng serializer có album_data
        return Response({"message": serializer, "status": 200},status=status.HTTP_200_OK)

    except Exception as e:  # Bắt lỗi chung nếu có lỗi xảy ra
        return Response({"error": str(e), "status": 500}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



@api_view(["GET"])
def get_albums(request):
    try:
        albums = Album.objects.all()
        if not albums.exists():
            return Response({"message": [], "status": 200}, status=status.HTTP_200_OK)
        
        # Serialize danh sách album với tất cả các trường, bao gồm cả 'songs_data'
        serializer = AlbumSerializer(albums, many=True)
        
        # Trả về dữ liệu của album đã được serialize
        return Response({"message": serializer.data, "status": 200}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e), "status": 500}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["GET"])
def get_albums_by_filter(request):
    try:
        filter_params = request.query_params  # Lấy các tham số bộ lọc từ query parameters
        albums = Album.objects.all()  # Lấy tất cả các album

        # Áp dụng bộ lọc nếu có tham số từ query_params
        # Lọc theo 'id' (sử dụng 'exact' cho ObjectId)
        if 'id' in filter_params:
            try:
                album_id = ObjectId(filter_params['id'])  # Chuyển id sang ObjectId
                albums = albums.filter(id=album_id)  # Lọc theo ObjectId chính xác
            except Exception:
                return Response({"error": "Invalid id format, should be a valid ObjectId", "status": 400}, status=status.HTTP_400_BAD_REQUEST)

        # Lọc theo 'name' (sử dụng 'icontains' cho trường chuỗi)
        if 'name' in filter_params:
            albums = albums.filter(name__icontains=filter_params['name'])  # Lọc theo tên album

        # Nếu không có album nào sau khi lọc
        if not albums.exists():
            return Response({"message": [], "status": 200}, status=status.HTTP_200_OK)
        
        # Serialize các album với thông tin bài hát
        serializer = AlbumFullInforSerializer(albums, many=True)
        return Response({"message": serializer.data, "status": 200}, status=status.HTTP_200_OK)

    except Exception as e:
        # Trả về lỗi chi tiết hơn
        return Response({"error": f"Error occurred: {str(e)}", "status": 500}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["GET"])
def get_artist_by_filter(request):
    try:
        filter_params = request.query_params  # Lấy các tham số bộ lọc từ query parameters
        artists = User.objects.all()  # Lấy tất cả các artists

        # Áp dụng bộ lọc nếu có tham số từ query_params
        # Lọc theo 'id' (sử dụng 'exact' cho ObjectId)
        if 'id' in filter_params:
            try:
                artist_id = ObjectId(filter_params['id'])  # Chuyển id sang ObjectId
                artists = artists.filter(id=artist_id)  # Lọc theo ObjectId chính xác
            except Exception:
                return Response({"error": "Invalid id format, should be a valid ObjectId", "status": 400}, status=status.HTTP_400_BAD_REQUEST)

        # Lọc theo 'name' (sử dụng 'icontains' cho trường chuỗi)
        if 'name' in filter_params:
            artists = artists.filter(name__icontains=filter_params['name'])  # Lọc theo tên album

        # Nếu không có album nào sau khi lọc
        if not artists.exists():
            return Response({"message": [], "status": 200}, status=status.HTTP_200_OK)
        
        # Serialize các album với thông tin bài hát
        serializer = ArtistFullInforSerializer(artists, many=True)
        return Response({"message": serializer.data, "status": 200}, status=status.HTTP_200_OK)

    except Exception as e:
        # Trả về lỗi chi tiết hơn
        return Response({"error": f"Error occurred: {str(e)}", "status": 500}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(["GET"])
def get_categories(request):
    try:
        categories = Category.objects.all()
        if not categories.exists():
            return Response({"message": [], "status": 200}, status=status.HTTP_200_OK)
        
        # Serialize danh sách album với tất cả các trường, bao gồm cả 'songs_data'
        serializer = CategorySerializer(categories, many=True)
        
        # Trả về dữ liệu của album đã được serialize
        return Response({"message": serializer.data, "status": 200}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e), "status": 500}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


