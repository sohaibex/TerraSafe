import os
import base64
import tempfile
import requests
from flask import jsonify, Request
from google.cloud import storage
import functions_framework

storage_client = storage.Client()
bucket_name = 'earthquick-images'
api_key = os.getenv('OPENAI_API_KEY')

def encode_image_to_base64(file_path):
    print("Starting to encode image to Base64...")
    with open(file_path, 'rb') as image_file:
        encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
    print("Image encoded to Base64 successfully.")
    return encoded_string

def analyze_image_with_openai(base64_image):
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }

    payload = {
        "model": "gpt-4o",
        "messages": [
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": "Analyze the given earthquake image and describe its details."
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{base64_image}"
                        }
                    }
                ]
            }
        ],
        "max_tokens": 300
    }

    try:
        print("Sending request to OpenAI API...")
        response = requests.post("https://api.openai.com/v1/chat/completions", json=payload, headers=headers)
        response.raise_for_status()
        print("Received response from OpenAI API.")
        return response.json()['choices'][0]['message']['content']
    except requests.exceptions.RequestException as error:
        print('Error calling OpenAI API:', error.response.json() if error.response else error)
        raise

@functions_framework.http
def analyzeEarthquakeImage(request: Request):
    if request.method != 'POST':
        return ('Method Not Allowed', 405)

    print("Initializing file upload...")
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.jpg')
    temp_file.close()

    try:
        file = request.files['file']
        file.save(temp_file.name)
        print(f"File saved to {temp_file.name}")

        print("Starting to encode image...")
        base64_image = encode_image_to_base64(temp_file.name)
        print("Image encoded successfully.")

        description = analyze_image_with_openai(base64_image)
        return jsonify(description=description)
    except Exception as error:
        print('Error processing image:', error)
        return ('Error processing image', 500)
    finally:
        os.unlink(temp_file.name)  # Clean up the temp file
