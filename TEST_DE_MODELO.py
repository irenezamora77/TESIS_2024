import cv2
from ultralytics import YOLO

# Cargar el modelo
model = YOLO('MODELO_150_EPOCAS.pt')

# Inicializar la cámara web
cap = cv2.VideoCapture(0)

if not cap.isOpened():
    print("Error: No se puede acceder a la cámara.")
    exit()

try:
    while True:
        # Leer un frame de la cámara
        ret, frame = cap.read()
        if not ret:
            print("Error: No se puede leer el frame.")
            break

        # Realizar la detección en el frame usando la función predict()
        results = model.predict(source=frame, conf=0.4, iou=0.45)[0]

        # Usar la función `plot()` para obtener el frame anotado
        annotated_frame = results.plot()

        # Mostrar el frame anotado
        cv2.imshow('Detección de Señas', annotated_frame)

        # Presionar 'q' para salir del bucle
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

finally:
    # Liberar recursos
    cap.release()
    cv2.destroyAllWindows()
