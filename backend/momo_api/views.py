import json
import hmac
import hashlib
import requests
import uuid
import time
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse


@csrf_exempt
def create_payment(request):
    data = json.loads(request.body)
    amount = data.get("amount", "10000")
    user_id = data.get("userId", "123")
    duration = data.get("duration", "3") #Số ngày dùng premium
    content = data.get("content", "")

    endpoint = "https://test-payment.momo.vn/v2/gateway/api/create"
    partnerCode = "MOMO"
    accessKey = "F8BBA842ECF85"
    secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz"

    orderInfo = "Thanh toan " + content + duration + " ngày"
    redirectUrl = "http://localhost:5173/premium"
    ipnUrl = "http://localhost:8000/momo_api/ipn/"
    orderId = f"order_{int(time.time())}_{uuid.uuid4().hex[:6]}"
    requestId = f"req_{int(time.time())}_{uuid.uuid4().hex[:6]}"
    requestType = "captureWallet"

    # 👉 Tạo extraData có userId để nhận lại khi Momo trả kết quả
    extraData = f"userId={user_id}"

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
        "signature": signature
    }
    res = requests.post(endpoint, json=body)
    return JsonResponse(res.json())


@csrf_exempt
def momo_ipn(request):
    if request.method == 'POST':
        import json
        data = json.loads(request.body)

        print(data)
        orderId = data.get('orderId')
        resultCode = data.get('resultCode')  # 0: thành công, khác 0: thất bại
        message = data.get('message')
        
        # 👉 Bạn có thể lưu orderId và trạng thái vào DB ở đây.
        print("📥 IPN nhận từ MoMo:", data)

        if resultCode == 0:
            print(f"✅ Đơn hàng {orderId} thanh toán THÀNH CÔNG")
        else:
            print(f"❌ Đơn hàng {orderId} thanh toán THẤT BẠI: {message}")

        return HttpResponse("IPN received", status=200)

    return HttpResponse("Method Not Allowed", status=405)
