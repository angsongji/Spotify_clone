from django.contrib.auth.hashers import make_password, check_password
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from storages.backends.s3boto3 import S3Boto3Storage
from rest_framework.decorators import api_view, parser_classes
from rest_framework import status
from .models import User, Song, Album, Category, Chat, Message, Purchase, Playlist
from .serializers import *
from bson import ObjectId
from datetime import datetime
from django.utils import timezone
from django.conf import settings

#upload aws
ALLOWED_EXTENSIONS = ["png", "jpg", "jpeg", "mp3", "mp4"]

@api_view(["POST"]) 
@parser_classes([MultiPartParser, FormParser])
def upload_file(request):
    print("DEFAULT_FILE_STORAGE from settings:", settings.DEFAULT_FILE_STORAGE)  # Debug

    # Khởi tạo storage S3
    storage_instance = S3Boto3Storage()

    serializer = FileUploadSerializer(data=request.data)

    if serializer.is_valid():
        uploaded_file = serializer.validated_data['file']
        file_extension = uploaded_file.name.split(".")[-1].lower()

        if file_extension not in ALLOWED_EXTENSIONS:
            return Response({"message": "Định dạng file không hợp lệ!", "status": 400}, status=400)

        # Xác định thư mục lưu trên S3
        folder_mapping = {"png": "images", "jpg": "images", "jpeg": "images",
                          "mp3": "audio", "mp4": "videos"}
        folder = folder_mapping.get(file_extension, "others")

        # Tạo đường dẫn lưu file
        file_path = f"{folder}/{uploaded_file.name}"

        # Lưu file lên S3
        saved_file_path = storage_instance.save(file_path, uploaded_file)
        file_url = f"{settings.AWS_S3_CUSTOM_DOMAIN}/{saved_file_path}"


        return Response({"message": file_url, "status": 200}, status=200)

    return Response({"message": serializer.errors, "status": 400}, status=400)
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
def get_user(request):
    try:
        filter_params = request.query_params  # Lấy các tham số bộ lọc từ query parameters

        # Áp dụng bộ lọc nếu có tham số từ query_params
        if 'id' in filter_params:
            try:
                user_id = ObjectId(filter_params['id'])  # Chuyển id sang ObjectId
                user = User.objects.filter(id=user_id).first()
                if not user:
                    return Response({"message": [], "status": 200}, status=status.HTTP_200_OK)
              
                if user.role == "artist":
                    
                    artist_data = ArtistFullInforSerializer(user).data
                    
                    user_data = UserFullInforSerializer(user).data
                    
                    serializer = {**user_data, **artist_data}
                else:
                    serializer = UserFullInforSerializer(user).data

            except Exception:
                return Response({"error": "Invalid id format, should be a valid ObjectId", "status": 400}, status=status.HTTP_400_BAD_REQUEST)

        else:
            return Response({"error": "Missing id query parameter", "status": 400}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"message": serializer, "status": 200}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": f"Error occurred: {str(e)}", "status": 500}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["POST"])
def login_user(request):
    try:
        # Lấy dữ liệu từ body request
        email = request.data.get('email')
        password = request.data.get('password')

        # Validate input
        if not email or not password:
            return Response({
                "success": False,
                "message": "Email và mật khẩu là bắt buộc",
                "status": 400
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Tìm user theo email
            user = User.objects.get(email=email)
            # Kiểm tra password đã hash
            if check_password(password, user.password):
                if user.role == "artist":
                    artist_data = ArtistFullInforSerializer(user).data
                    user_data = UserFullInforSerializer(user).data
                    serializer = {**user_data, **artist_data}  
                    # Gộp hai dictionary, Nếu hai serializer có cùng key, dữ liệu của artist_data sẽ ghi đè lên user_data.
                else:
                    serializer = UserFullInforSerializer(user).data
                return Response({
                    "success": True,
                    "message": "Đăng nhập thành công",
                    "data": serializer,
                    "status": 200
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    "success": False,
                    "message": "Mật khẩu không chính xác",
                    "status": 401
                }, status=status.HTTP_401_UNAUTHORIZED)

        except User.DoesNotExist:
            return Response({
                "success": False,
                "message": "Email không tồn tại trong hệ thống",
                "status": 404
            }, status=status.HTTP_404_NOT_FOUND)

    except Exception as e:
        return Response({
            "success": False,
            "message": f"Lỗi server: {str(e)}",
            "status": 500
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# API Đăng ký
@api_view(["POST"])
def register_user(request):
    try:
        email = request.data.get('email')
        password = request.data.get('password')
        name = request.data.get('name')
        avatar = request.data.get('image')

        print(avatar)
        # Validate input    
        if not all([email, password, name,avatar]):
            return Response({
                "success": False,
                "message": "Vui lòng điền đầy đủ thông tin",
                "status": 400
            }, status=status.HTTP_400_BAD_REQUEST)

        # Kiểm tra email đã tồn tại
        if User.objects.filter(email=email).exists():
            return Response({
                "success": False,
                "message": "Email đã được sử dụng",
                "status": 400
            }, status=status.HTTP_400_BAD_REQUEST)
        # Validate độ mạnh của password
        if len(password) < 6:
            return Response({
                "success": False,
                "message": "Mật khẩu phải có ít nhất 6 ký tự",
                "status": 400
            }, status=status.HTTP_400_BAD_REQUEST)
        current_time = timezone.now()
        
        # Thay vì dùng create(), tạo instance và gọi save()
        user = User(
            avatar = avatar,
            email=email,
            password=password,  # Password sẽ được hash trong save()
            name=name,
            role="user",
            status=1,
            created_at = current_time,
            liked_songs=[],
            liked_albums=[]
        )
        user.save()  # Gọi save() để trigger password hashing
        # Serialize và trả về thông tin user mới
        serializer = UserFullInforSerializer(user)
        return Response({
            "success": True,
            "message": "Xứ lí thành công",
            "data": {
                "user": serializer.data
            },
            "status": 201
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        print(serializer.error)
        return Response({
            "success": False,
            "message": f"Lỗi server: {str(e)}",
            "status": 500
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(["PATCH"]) #update những cái cần update, chỉ cần gửi cho api những cái cần update khác với put
def update_user(request):
    user_id = request.query_params["id"] # Lấy song_id từ param
    if not user_id:
        return Response({"message": "Thiếu id", "status": 400}, status=status.HTTP_400_BAD_REQUEST)

    try:
        object_id = ObjectId(user_id)  # Chuyển đổi song_id thành ObjectID của MongoDB
        user = User.objects.get(id=object_id)
    except (User.DoesNotExist, ValueError):
        return Response({"message": "Không tìm thấy người dùng", "status": 404}, status=status.HTTP_404_NOT_FOUND)

    serializer = UserSerializer(user, data=request.data, partial=True)
    if serializer.is_valid():
     
        serializer.save()
        print(serializer.data)
        return Response({"message": serializer.data, "status": 200}, status=status.HTTP_200_OK)

    return Response({"message": serializer.errors, "status": 400}, status=status.HTTP_400_BAD_REQUEST)


#songs
@api_view(["GET"])
def get_songs(request):
    try:
        songs_data = SongSerializer.get_songs()
        if not songs_data:  # Dữ liệu rỗng
            return Response({"message": [], "status": 200}, status=status.HTTP_200_OK)

        return Response({"message": songs_data, "status": 200}, status=status.HTTP_200_OK)

    except Exception as e:  # Bắt lỗi chung nếu có lỗi xảy ra
        return Response({"error": str(e), "status": 500}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["POST"])
def add_song(request):
    serializer = SongSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response({"message": serializer.data, "status": 201}, status=status.HTTP_201_CREATED)
    
    print(serializer.errors)
    return Response({"message": serializer.errors, "status": 400}, status=status.HTTP_400_BAD_REQUEST)

@api_view(["PATCH"]) #update những cái cần update, chỉ cần gửi cho api những cái cần update khác với put
def update_song(request):
    song_id = request.query_params["id"] # Lấy song_id từ param
    if not song_id:
        return Response({"message": "Thiếu id", "status": 400}, status=status.HTTP_400_BAD_REQUEST)

    try:
        object_id = ObjectId(song_id)  # Chuyển đổi song_id thành ObjectID của MongoDB
        song = Song.objects.get(id=object_id)
    except (Song.DoesNotExist, ValueError):
        return Response({"message": "Không tìm thấy bài hát", "status": 404}, status=status.HTTP_404_NOT_FOUND)

    serializer = SongSerializer(song, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": serializer.data, "status": 200}, status=status.HTTP_200_OK)

    return Response({"message": serializer.errors, "status": 400}, status=status.HTTP_400_BAD_REQUEST)

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


#album
@api_view(["GET"])
def get_albums(request):
    try:
        albums_data = AlbumSerializer.get_albums()
        if not albums_data:  # Dữ liệu rỗng
            return Response({"message": [], "status": 200}, status=status.HTTP_200_OK)

        return Response({"message": albums_data, "status": 200}, status=status.HTTP_200_OK)
    
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

@api_view(["POST"])
def add_album(request):
    serializer = AlbumSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response({"message": serializer.data, "status": 201}, status=status.HTTP_201_CREATED)
    
    print(serializer.errors)
    return Response({"message": serializer.errors, "status": 400}, status=status.HTTP_400_BAD_REQUEST)

@api_view(["PATCH"]) #update những cái cần update, chỉ cần gửi cho api những cái cần update khác với put
def update_album(request):
    album_id = request.query_params["id"] # Lấy song_id từ param
    if not album_id:
        return Response({"message": "Thiếu id", "status": 400}, status=status.HTTP_400_BAD_REQUEST)

    try:
        object_id = ObjectId(album_id)  # Chuyển đổi song_id thành ObjectID của MongoDB
        album = Album.objects.get(id=object_id)
    except (Album.DoesNotExist, ValueError):
        return Response({"message": "Không tìm thấy album", "status": 404}, status=status.HTTP_404_NOT_FOUND)

    serializer = AlbumSerializer(album, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": serializer.data, "status": 200}, status=status.HTTP_200_OK)

    return Response({"message": serializer.errors, "status": 400}, status=status.HTTP_400_BAD_REQUEST)


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
                artists = artists.filter(id=artist_id).first()  # Lọc theo ObjectId chính xác
            except Exception:
                return Response({"error": "Invalid id format, should be a valid ObjectId", "status": 400}, status=status.HTTP_400_BAD_REQUEST)
       
        
        
        # Serialize các album với thông tin bài hát
        return Response({"message": ArtistFullInforSerializer(artists).data if artists else None, "status": 200}, status=status.HTTP_200_OK)

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

@api_view(["POST"])
def add_category(request):
    serializer = CategorySerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response({"message": serializer.data, "status": 201}, status=status.HTTP_201_CREATED)
    else:    
        print(str(serializer.errors))
        return Response({"message": serializer.errors, "status": 400}, status=status.HTTP_400_BAD_REQUEST)

#chat
@api_view(["POST"])
def add_chat(request):
    serializer = ChatSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response({"message": serializer.data, "status": 201}, status=status.HTTP_201_CREATED)
    else:    
        print(str(serializer.errors))
        return Response({"message": serializer.errors, "status": 400}, status=status.HTTP_400_BAD_REQUEST)
@api_view(["GET"])
def get_chats_by_userid(request):
    try:
        user_id_str = request.query_params.get('userId')
        print(user_id_str)
        if not user_id_str:
            return Response({"error": "Missing userId", "status": 400}, status=400)

        # Lọc chats có user trong danh sách
        chats = Chat.objects.filter(users__contains=[user_id_str])
        print(chats)
        return Response({
            "message": ChatSerializer(chats, many=True).data,
            "status": 200
        }, status=200)

    except Exception as e:
        return Response({
            "error": f"Error occurred: {str(e)}",
            "status": 500
        }, status=500)

#message
@api_view(["GET"])
def get_messages_by_chatid(request):
    try:
        filter_params = request.query_params
        messages = Message.objects.all()
        if not messages.exists():
            return Response({"message": [], "status": 200}, status=status.HTTP_200_OK)
        
        if 'chatId' in filter_params:
            try:
                chat_id = ObjectId(filter_params['chatId'])  # Chuyển id sang ObjectId
                messages = messages.filter(chat_id=chat_id).all()  # Lọc theo ObjectId chính xác
            except Exception:
                return Response({"error": "Invalid id format, should be a valid ObjectId", "status": 400}, status=status.HTTP_400_BAD_REQUEST)
       
        
        
        # Serialize các album với thông tin bài hát
        return Response({"message": MessageSerializer(messages, many=True).data if messages else None, "status": 200}, status=status.HTTP_200_OK)

    except Exception as e:
        # Trả về lỗi chi tiết hơn
        return Response({"error": f"Error occurred: {str(e)}", "status": 500}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

#playlist
@api_view(["POST"])
def add_playlist(request):
    serializer = PlaylistSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response({"message": serializer.data, "status": 201}, status=status.HTTP_201_CREATED)
    else:    
        print(str(serializer.errors))
        return Response({"message": serializer.errors, "status": 400}, status=status.HTTP_400_BAD_REQUEST)
