from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import re
from .deepseek import call_deepseek
from spotify.models import Song
from spotify.serializers import SongSerializer
from rapidfuzz import fuzz
from unidecode import unidecode

@csrf_exempt
def chat_handler(request):
    if request.method == "POST":
        data = json.loads(request.body)
        message = data.get("message", "").strip()

        # Kiểm tra nếu người dùng yêu cầu phát nhạc hoặc mở bài hát
        match = re.search(r'(mở|phát)(?: bài hát)?\s+"([^"]+)"(?: của "([^"]+)")?', message, re.IGNORECASE)
        if match:
            song_name = match.group(2).strip()
            artist_name = match.group(3).strip() if match.group(3) else None
            song = search_song_in_db(song_name, artist_name)

            if song:
                song_data = SongSerializer(song).data
                return JsonResponse({
                    "type": "music",
                    "id": song_data["id"],
                    "message": "Tôi sẽ phát bài hát này ngay trong ứng dụng."
                })
            else: 
                # Nếu không có trong ứng dụng, gọi AI để gợi ý nguồn ngoài
                prompt = (
                    f"Tôi đang xây dựng một ứng dụng phát nhạc. Người dùng vừa yêu cầu phát bài hát '{song_name}', "
                    f"nhưng ứng dụng không có bài này. Hãy gợi ý nơi họ có thể nghe bài hát đó như trên YouTube, Spotify hoặc Zing MP3. "
                    f"Trả kết quả gọn gàng, kèm đường link nếu có thể."
                )
                ai_response = call_deepseek(prompt)
                return JsonResponse({
                    "type": "ai",
                    "message": f"Không tìm thấy bài hát '{song_name}' trong ứng dụng.\n{ai_response}"
                })

        # Không phải yêu cầu phát nhạc → xử lý bình thường
        
        ai_response = call_deepseek(message)
        ai_response = ai_response.replace('\n', '\n\n')  # Markdown cần 2 dòng để xuống đoạn
        return JsonResponse({"type": "ai", "message": ai_response})

    return JsonResponse({"error": "Chỉ hỗ trợ phương thức POST."}, status=405)



def search_song_in_db(song_name, artist_name=None):
    normalized_song = unidecode(song_name).lower()
    normalized_artist = unidecode(artist_name).lower() if artist_name else None

    songs = Song.objects.filter(status = 1)
    best_match = None
    highest_score = 0

    for song in songs:
        song_name_normalized = unidecode(song.name).lower()
        name_score = fuzz.token_sort_ratio(normalized_song, song_name_normalized)

        if normalized_artist:
            artist_scores = [
                fuzz.token_sort_ratio(normalized_artist, unidecode(artist).lower())
                for artist in song.artists
            ]
            artist_score = max(artist_scores) if artist_scores else 0

            if artist_score < 60:
                continue

            total_score = (name_score + artist_score) / 2
        else:
            total_score = name_score

        if total_score > highest_score:
            highest_score = total_score
            best_match = song

    if highest_score > 70:
        return best_match  # 👈 trả về object Song thay vì dict

    return None
