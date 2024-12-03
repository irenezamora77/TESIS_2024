from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import cv2
from ultralytics import YOLO
import numpy as np
import threading
import pyttsx3
import time

# Inicializar la aplicación FastAPI
app = FastAPI()

# Configuración de CORS para permitir solicitudes desde localhost
origins = [
    "http://localhost:3000",  # Agregar el origen que deseas permitir
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inicializar el modelo YOLO con el archivo de pesos
model = YOLO('MODELO_150_EPOCAS.pt')

# Inicializar el motor de texto a voz
engine = pyttsx3.init()

# Mapa de colores para las palabras detectadas
color_map = {
    "Buenas noches": (200, 150, 255),   # Púrpura
    "Buenas tardes": (255, 182, 193),   # Rosa
    "Buenos dias": (255, 215, 0),       # Naranja
    "Sordo": (100, 100, 255),           # Índigo
    "Te quiero": (210, 180, 140),       # Marrón
    "Hola": (255, 255, 102),            # Amarillo
    "Saludos": (135, 206, 250),         # Azul
    "Gracias": (144, 238, 144)          # Verde
}

# Configuración de tiempos
required_detection_time = 1      # Tiempo en segundos para detectar la palabra
tolerance_time = 3               # Tiempo en segundos para evitar repetir la palabra

# Variables para controlar la detección y tiempos
last_seen_time = {}              # Última vez que se detectó cada palabra
detected_duration = {}           # Duración acumulada de detección de cada palabra
last_said_time = {}              # Última vez que se dijo cada palabra

def speak(label):
    """Función para hablar una etiqueta detectada."""
    engine.say(label)
    engine.runAndWait()

def check_detection_duration(label, current_time):
    """
    Verifica que la palabra haya estado presente en pantalla
    durante el tiempo requerido para hablar.
    """
    if label in last_seen_time:
        detected_duration[label] += current_time - last_seen_time[label]
    else:
        detected_duration[label] = 0
    last_seen_time[label] = current_time
    return detected_duration[label] >= required_detection_time

def can_speak(label, current_time):
    """
    Verifica que no se haya dicho la palabra recientemente.
    """
    if label not in last_said_time or (current_time - last_said_time[label] > tolerance_time):
        last_said_time[label] = current_time
        return True
    return False

@app.post("/detect/")
async def detect(file: UploadFile = File(...)):
    """Endpoint para la detección de palabras en imágenes."""
    # Leer el archivo de imagen y convertirlo a un formato adecuado
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    # Realizar la detección utilizando el modelo YOLO
    results = model.predict(source=frame, conf=0.5, iou=0.45)[0]
    current_time = time.time()  # Tiempo actual para control de detección

    detections = []  # Lista para almacenar resultados de detección

    for box in results.boxes:
        # Obtener coordenadas de la caja delimitadora
        x1, y1, x2, y2 = box.xyxy[0].cpu().numpy().astype(int)
        confidence = int(box.conf[0].cpu().numpy() * 100)  # Convertir a porcentaje
        class_id = int(box.cls[0].cpu().numpy())

        # Obtener la etiqueta y el color correspondiente
        label = model.names[class_id]
        color = color_map.get(label, (255, 255, 255))  # Blanco por defecto si no está en color_map

        # Verificar si cumple con el tiempo de permanencia y si puede hablar
        if check_detection_duration(label, current_time):
            if can_speak(label, current_time):

                # REPRODUCE TEXTO A AUDIO
                # threading.Thread(target=speak, args=(label,), daemon=True).start()

                detected_duration[label] = 0  # Reiniciar contador después de hablar
                last_said_time[label] = current_time  # Actualizar el tiempo en que se dijo la palabra
                
                # Agregar información del momento en que se debe hablar
                detections.append({
                    "label": label,
                    "confidence": float(confidence),  # Convertir a float para JSON
                    "bbox": [int(x1), int(y1), int(x2), int(y2)],  # Asegurar que los valores son int
                    "speak_time": current_time,  # Momento en que se debe decir la palabra
                    "color": color  # Agregar el color correspondiente
                })
            else:
                # Si no se debe hablar, agregar información sin tiempo de habla
                detections.append({
                    "label": label,
                    "confidence": float(confidence),
                    "bbox": [int(x1), int(y1), int(x2), int(y2)],
                    "speak_time": None,  # No se debe hablar
                    "color": color  # Agregar el color correspondiente
                })
        else:
            # Si no cumple el tiempo de permanencia, agrega detección sin hablar
            detections.append({
                "label": label,
                "confidence": float(confidence),
                "bbox": [int(x1), int(y1), int(x2), int(y2)],
                "speak_time": None,
                "color": color
            })

    return JSONResponse(content={"detections": detections, "color_map": color_map})

# Instrucción para iniciar el servidor:
# uvicorn app:app --host 0.0.0.0 --port 8000
