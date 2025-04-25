import json
import hmac
import hashlib
import requests
import uuid
import time
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from spotify.models import User, Purchase
from datetime import date
from urllib.parse import parse_qs

# parse_qs: phân tích chuỗi truy vấn (query string) — tức là chuỗi dạng "key1=value1&key2=value2"

@csrf_exempt
def create_payment(request):
    data = json.loads(request.body)
    amount = data.get("amount", "10000")
    user_id = data.get("userId", "123")
    duration = data.get("duration", "3")  # Số ngày dùng premium
    content = data.get("content", "")

    endpoint = "https://test-payment.momo.vn/v2/gateway/api/create"
    partnerCode = "MOMO"
    accessKey = "F8BBA842ECF85"
    secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz"

    orderInfo = "Thanh toan " + content + duration + " ngày"
    redirectUrl = "http://100.24.32.198/premium"
    ipnUrl = "http://100.24.32.198:8000/momo_api/ipn/"
    orderId = f"order_{int(time.time())}_{uuid.uuid4().hex[:6]}"
    requestId = f"req_{int(time.time())}_{uuid.uuid4().hex[:6]}"
    requestType = "captureWallet"
    expire_time = (int(time.time()) + 600) * 1000

    # 👉 Tạo extraData có userId để nhận lại khi Momo trả kết quả
    extraData = f"userId={user_id}&date={duration}"

    # Tạo chữ ký
    rawSignature = (
        f"accessKey={accessKey}&amount={amount}&extraData={extraData}"
        f"&ipnUrl={ipnUrl}&orderId={orderId}&orderInfo={orderInfo}"
        f"&partnerCode={partnerCode}&redirectUrl={redirectUrl}"
        f"&requestId={requestId}&requestType={requestType}"
    )

    signature = hmac.new(
        secretKey.encode("utf-8"),
        rawSignature.encode("utf-8"),
        hashlib.sha256
    ).hexdigest()

    body = {
        "partnerCode": partnerCode,
        "accessKey": accessKey,
        "requestId": requestId,
        "amount": amount,
        "orderId": orderId,
        "orderInfo": orderInfo,
        "redirectUrl": redirectUrl,
        "ipnUrl": ipnUrl,
        "lang": "vi",
        "extraData": extraData,
        "requestType": requestType,
        "signature": signature,
        "expireTime": expire_time
    }
    res = requests.post(endpoint, json=body)
    print("Momo response:", res.status_code, res.text)

    try:
        return JsonResponse(res.json())
    except ValueError:
        return JsonResponse({
            "error": "Không thể phân tích phản hồi từ Momo.",
            "status_code": res.status_code,
            "response_text": res.text
        }, status=500)

@csrf_exempt
def momo_ipn(request):
    print(f"Method received: {request.method}")
    if request.method != 'POST':
        print("❌ Yêu cầu không phải POST")
        return HttpResponse("Method Not Allowed", status=405)
    if request.method == 'POST':
        data = json.loads(request.body)

        print("📥 IPN nhận từ MoMo:", data)

        order_id = data.get('orderId')
        result_code = data.get('resultCode')
        message = data.get('message')
        extra_data = data.get('extraData', '')

        # 🎯 Lấy user_id từ extraData (ví dụ: "userId=abc123")
        parsed_extra = parse_qs(extra_data)
        user_id = parsed_extra.get('userId', [None])[0]
        date_use = parsed_extra.get('date', [None])[0]

        # Kiểm tra dữ liệu nhận được
        if not user_id or not date_use:
            print("❌ Thiếu user_id hoặc date_use trong extraData:", extra_data)
            return HttpResponse("Missing data", status=400)

        # Chuyển đổi date_use từ string sang int
        date_use = int(date_use)

        if result_code == 0:
            print(f"✅ Thanh toán {order_id} THÀNH CÔNG")

            try:
                user = User.objects.get(id=user_id)
                purchase = Purchase.objects.create(
                    user_id=user_id,
                    purchase_date=date.today(),  # Chuẩn định dạng DateField
                    date=date_use
                )
                print("📦 Đã tạo mới Purchase:", purchase.id)
            except User.DoesNotExist:
                print("❗ Không tìm thấy user với id:", user_id)

        else:
            print(f"❌ Đơn hàng {order_id} thanh toán THẤT BẠI: {message}")

        return HttpResponse("IPN received", status=200)

    return HttpResponse("Method Not Allowed", status=405)
