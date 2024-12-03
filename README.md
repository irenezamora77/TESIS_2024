
# TESIS_2024

SISTEMA DE RECONOCIMIENTO DE GESTOS DE LA LENGUA DE SEÑAS ARGENTINO- FACULTAD DE INGENIERÍA

# Traductor de Señas - BioSonic

Este traductor detecta la seña, y la convierte en texto y audio.


## Tabla de Contenidos
- [Descripción General](#descripción-general)
- [Características](#características)
- [Requisitos Previos](#requisitos-previos)
- [Instalación y Configuración](#instalación-y-configuración)
  - [Backend (FastAPI)](#backend-fastapi)
  - [Frontend (React)](#frontend-react)
- [Uso](#uso)

---

## Descripción General

El proyecto combina un backend desarrollado con **FastAPI** para realizar inferencias con el modelo YOLO y un frontend en **React** para interactuar con el usuario, mostrando resultados. También incluye la conversión de texto a voz.

---

## Características

- **Detección en tiempo real**: Detecta señas en video utilizando un modelo YOLO entrenado.
- **Traducción automática**: Convierte las señas detectadas a texto y las reproduce mediante audio.
- **Soporte para detecciones personalizadas**: Muestra cuadros delimitadores en video con colores personalizados según la seña detectada.

---

## Requisitos Previos

Antes de comenzar, hay que asegúrase de tener instalados los siguientes componentes:

### Software
- **Python 3.8+**
- **Node.js 14+** y npm
- **FastAPI**
- **React.js**

### Dependencias de Python
- `fastapi`
- `uvicorn`
- `numpy`
- `opencv-python`
- `pyttsx3`
- `ultralytics` (YOLO)

---

## Instalación y Configuración

### Backend (FastAPI)

1. Clonar el repositorio:

   git clone https://github.com/irenezamora77/TESIS_2024.git

2. Instalar las dependencias necesarias:

pip install fastapi uvicorn numpy opencv-python pyttsx3 ultralytics

3. Inicia el servidor:

uvicorn app:app --host 0.0.0.0 --port 8000

4. Navegar a la carpeta del frontend:

cd ../frontend

5. Inicia la aplicación React:

npm start

---

## Uso
- Asegúrar de que tanto el backend como el frontend estén en ejecución.
- Abrir la aplicación React en el navegador en http://localhost:3000.
- Permitir el acceso a la cámara para que el sistema pueda capturar imágenes.
- Observar el video con cuadros delimitadores y etiquetas de las señas detectadas.
- Escuchar la traducción en audio de las señas detectadas.
