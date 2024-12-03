<<<<<<< HEAD
# TESIS_2024
SISTEMA DE RECONOCIMIENTO DE GESTOS DE LA LENGUA DE SEÑAS - FACULTAD DE INGENIERÍA
=======
# Traductor de Señas - BioSonic

El **Traductor de Señas - BioSonic** es una aplicación de detección de señas en tiempo real basada en visión por computadora. Utiliza un modelo YOLO para detectar señas específicas, las traduce a texto y reproduce su significado en audio.

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

El proyecto combina un backend desarrollado con **FastAPI** para realizar inferencias con el modelo YOLO y un frontend en **React** para interactuar con el usuario, mostrando resultados en tiempo real. También incluye un sistema de conversión de texto a voz.

---

## Características

- **Detección en tiempo real**: Detecta señas en video utilizando un modelo YOLO entrenado.
- **Traducción automática**: Convierte las señas detectadas a texto y las reproduce mediante audio.
- **Interfaz moderna**: Una aplicación web diseñada para ser intuitiva y fácil de usar.
- **Soporte para detecciones personalizadas**: Muestra cuadros delimitadores en video con colores personalizados según la seña detectada.

---

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalados los siguientes componentes:

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

1. Clona el repositorio:

   git clone https://github.com/tu_usuario/tu_repositorio.git
   cd tu_repositorio/backend

2. Instala las dependencias necesarias:

pip install fastapi uvicorn numpy opencv-python pyttsx3 ultralytics

3. Inicia el servidor:

uvicorn app:app --host 0.0.0.0 --port 8000

4. Navega a la carpeta del frontend:

cd ../frontend

5. Inicia la aplicación React:

npm start

## Uso
- Asegúrate de que tanto el backend como el frontend estén en ejecución.
- Abre la aplicación React en tu navegador en http://localhost:3000.
- Permite el acceso a tu cámara para que el sistema pueda capturar imágenes.
- Observa el video en tiempo real con cuadros delimitadores y etiquetas de las señas detectadas.
- Escucha la traducción en audio de las señas detectadas.
>>>>>>> dev
