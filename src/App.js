import React, { useEffect, useRef, useState } from "react"; // Importar React y hooks necesarios
import logo from './logo.png'; // Importar el logo

const App = () => {
    const videoRef = useRef(null); // Referencia para el elemento de video
    const canvasRef = useRef(null); // Referencia para el elemento de canvas
    const [isDetecting, setIsDetecting] = useState(false); // Estado para controlar si se está detectando
    
    // NUEVO 
    const [detections, setDetections] = useState([]); // Estado para almacenar las detecciones NUEVO

    useEffect(() => {
        // Función para acceder a la cámara y mostrar el video
        const startCamera = async () => {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true }); // Solicitar acceso a la cámara
            if (videoRef.current) {
                videoRef.current.srcObject = stream; // Asignar el stream de video al elemento de video
            }
        };

        startCamera(); // Iniciar la cámara

        return () => {
            // Función de limpieza para detener la cámara al desmontar el componente
            // eslint-disable-next-line
            const currentVideoRef = videoRef.current; // Guardar referencia actual del video

            if (currentVideoRef && currentVideoRef.srcObject) {
                const stream = currentVideoRef.srcObject; // Obtener el stream
                const tracks = stream.getTracks(); // Obtener las pistas del stream
                tracks.forEach(track => track.stop()); // Detener cada pista
            }

        };
    }, []); // Ejecutar solo una vez al montar el componente

    // Mover la función captureImage dentro del efecto para evitar cambios de dependencia
    const captureImage = async () => {
        // Evitar enviar si ya se está detectando
        if (isDetecting) return;
        setIsDetecting(true); // Activar el estado de detección

        const videoElement = videoRef.current; // Obtener el elemento de video
        const canvas = canvasRef.current; // Obtener el elemento de canvas

        // Asegurarse de que el canvas tenga el mismo tamaño que el video
        canvas.width = videoElement.videoWidth; 
        canvas.height = videoElement.videoHeight;

        const context = canvas.getContext("2d"); // Obtener el contexto del canvas
        context.drawImage(videoElement, 0, 0, canvas.width, canvas.height); // Dibujar el video en el canvas

        // Convertir el canvas a un Blob en formato JPEG
        canvas.toBlob(async (blob) => {
            const file = new File([blob], "image.jpg", { type: "image/jpeg" });
            const formData = new FormData();
            formData.append("file", file); // Adjuntar la imagen al FormData

            try {
                const response = await fetch("http://localhost:8000/detect/", {
                    method: "POST",
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error("Error en la solicitud");
                }

                const data = await response.json(); // Obtener la respuesta JSON
                
                handleDetections(data.detections); // Manejar las detecciones recibidas

            } catch (error) {
                console.error("Error:", error); // Mostrar error en la consola
            } finally {
                setIsDetecting(false); // Rehabilitar la detección
            }
        }, "image/jpeg");
    };

    const handleDetections = (newDetections) => {

        // Manejar las detecciones nuevas
        drawDetections(newDetections); // Dibuja las detecciones en el canvas
        speakDetections(newDetections); // Reproduce audio de las detecciones

        setDetections(newDetections); // Actualizar las detecciones en el estado NUEVO

    };

    const drawDetections = (newDetections) => {
        const canvas = canvasRef.current; // Obtener el canvas
        const context = canvas.getContext("2d"); // Obtener el contexto del canvas
        context.clearRect(0, 0, canvas.width, canvas.height); // Limpiar el canvas

        const videoElement = videoRef.current; // Obtener el elemento de video
        const scaleX = canvas.width / videoElement.videoWidth; // Escala X
        const scaleY = canvas.height / videoElement.videoHeight; // Escala Y

        newDetections.forEach(detection => {
            const [x1, y1, x2, y2] = detection.bbox; // Obtener las coordenadas de la detección

            // Ajustar las coordenadas del cuadro según la escala del video
            const adjustedX1 = x1 * scaleX;
            const adjustedY1 = y1 * scaleY;
            const adjustedX2 = x2 * scaleX;
            const adjustedY2 = y2 * scaleY;

            // Obtener el color desde la detección y convertirlo a formato rgb
            const color = `rgb(${detection.color[0]}, ${detection.color[1]}, ${detection.color[2]})`;

            context.strokeStyle = color; // Color del cuadro
            context.lineWidth = 5; // Grosor del recuadro
            context.strokeRect(adjustedX1, adjustedY1, adjustedX2 - adjustedX1, adjustedY2 - adjustedY1); // Dibuja el cuadro delimitador


            // Dibuja el texto de la etiqueta
            context.fillStyle = color; // Color del texto
            context.font = "bold 25px Arial";
            context.fillText(`${detection.label} (${detection.confidence.toFixed(2)}%)`, adjustedX1, adjustedY1 > 10 ? adjustedY1 - 5 : 10);

        });
    };

    const speakDetections = (newDetections) => {
        // Reproduce audio de las detecciones
        newDetections.forEach(detection => {

            if (detection.speak_time !== null) {
                const utterance = new SpeechSynthesisUtterance(detection.label);
                window.speechSynthesis.speak(utterance); // Hablar el texto
            }

        });
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
            captureImage(); // Capturar imagen cada 500 ms
        }, 500); 

        return () => clearInterval(intervalId); // Limpiar el intervalo al desmontar
        // eslint-disable-next-line
    }, []); // Removemos captureImage de las dependencias

    // Renderizar la interfaz de usuario
    return (
        <div style={{ 
            backgroundColor: "#00274D", // Color de fondo oscuro
            color: "white", 
            display: "flex", 
            flexDirection: "column", 
            justifyContent: "center", 
            alignItems: "center", 
            width: "100vw", 
            height: "100vh", 
            margin: 0, 
            padding: 0 
        }}>
            <h1 style={{ 
                margin: "40px", // Espaciado alrededor del título
                textAlign: "center", 
                fontFamily: "Roboto, sans-serif", // Fuente del título
                fontSize: "36px" // Tamaño de la fuente del título
            }}>
                Traductor de señas - BioSonic
            </h1>
            <div style={{ 
                position: "relative", 
                width: "640px", 
                height: "480px", 
                borderRadius: "15px", // Bordes redondeados
                overflow: "hidden", 
                boxShadow: "0 4px 8px rgba(0,0,0,0.2)" // Sombra para darle profundidad
            }}>
                <video 
                    ref={videoRef} 
                    autoPlay 
                    style={{ 
                        width: "100%", 
                        height: "100%", 
                        borderRadius: "15px", // Bordes redondeados
                        border: "none" // Sin borde
                    }} 
                />
                <canvas 
                    ref={canvasRef} 
                    style={{ 
                        position: "absolute", 
                        top: 0, 
                        left: 0, 
                        width: "100%", 
                        height: "100%", 
                        borderRadius: "15px" // Bordes redondeados
                    }} 
                />
            </div>

            {/* Cuadro de detecciones NUEVO */}
            <div style={{
                marginTop: "20px",
                width: "640px",
                padding: "15px",
                borderRadius: "10px",
                backgroundColor: "#003366",
                color: "white",
                fontFamily: "Roboto, sans-serif",
                fontSize: "30px",
                textAlign: "center",
                boxShadow: "0 4px 8px rgba(0,0,0,0.2)"
            }}>
                {detections.length > 0 ? (
                    detections.map((detection, index) => (
                        <div key={index} style={{ marginBottom: "5px" }}>
                            {detection.label} - {Math.round(
                                detection.confidence > 1 ? detection.confidence : detection.confidence * 100
                            )}%
                        </div>
                    ))
                ) : (
                    <div>No hay detecciones</div>
                )}
            </div>


            <footer style={{ marginTop: "40px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                <img src={logo} alt="Logo" style={{ height: "50px", width: "auto" }} />
                <h2 style={{ fontSize: '18px', color: '#fff', marginTop: '10px', fontFamily: "Roboto, sans-serif"}}>Proyecto Final - Irene Zamora</h2>
            </footer>
        </div>
    );
};

export default App; // Exportar el componente App
