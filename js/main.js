// Efecto de desplazamiento suave al hacer clic en los enlaces del navbar
document.querySelectorAll('.nav-link').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

$('.container1').on('click', function () {
    $('.card').toggleClass('flipped');
  });

const form = document.getElementById('form');
const tablaResultados = document.getElementById('tablaResultados');
const btnReiniciar = document.getElementById('btnReiniciar');

let totalGramosAcumulado = 0;
let totalLibrasAcumulado = 0;
let totalPagarAcumulado = 0;
let productos = [];

const tipoClienteSwitch = document.getElementById('tipoClienteSwitch');
const precioPorLibraElement = document.getElementById('precioPorLibra');
let precioPorLibra = 6.50; // Precio predeterminado para clientes

// Actualizar el precio cuando cambia el switch
tipoClienteSwitch.addEventListener('change', function() {
    if (this.checked) {
        // Socio
        precioPorLibra = 5.50;
        precioPorLibraElement.textContent = '$5.50';
    } else {
        // Cliente normal
        precioPorLibra = 6.50;
        precioPorLibraElement.textContent = '$6.50';
    }
    
    // Si hay productos en la lista, recalcular el total
    if (productos.length > 0) {
        recalcularTotal();
    }
});

// Función para recalcular el total cuando cambia el tipo de cliente
function recalcularTotal() {
    totalPagarAcumulado = 0;
    
    productos.forEach(producto => {
        let libras = parseFloat(producto.libras);
        totalPagarAcumulado += libras * precioPorLibra;
    });
    
    const totalPagarMostrar = totalPagarAcumulado < 3 ? 3 : totalPagarAcumulado;
    document.getElementById('totalPagar').textContent = '$' + totalPagarMostrar.toFixed(2);
}

form.addEventListener('submit', (event) => {
    event.preventDefault();

    const peso = parseFloat(document.getElementById('peso').value);
    const unidad = document.getElementById('unidadMedida').value;

    if (isNaN(peso)) {
        alert("Por favor, ingrese un valor numérico válido para el peso.");
        return;
    }

    let gramos, libras;

    if (unidad === 'gramos') {
        gramos = peso;
        libras = peso / 453.59237;
    } else {
        libras = peso;
        gramos = peso * 453.59237;
    }

    productos.push({ 
        nombre: `Producto ${productos.length + 1}`, 
        gramos: gramos.toFixed(2),
        libras: libras.toFixed(2) 
    });

    // Usar el precio que corresponde al tipo de cliente
    let totalPagar = libras * precioPorLibra;
    
    totalGramosAcumulado += gramos;
    totalLibrasAcumulado += libras;
    totalPagarAcumulado += totalPagar;

    const totalPagarMostrar = totalPagarAcumulado < 3 ? 3 : totalPagarAcumulado;
    
    // Actualizar la visualización con ambas unidades
    const listaProductos = productos.map(p => 
        `${p.nombre}: ${p.gramos}g (${p.libras}lb)<br>`
    ).join('');
    
    document.getElementById('pesoPedidos').innerHTML = listaProductos;
    document.getElementById('totalGramos').textContent = totalGramosAcumulado.toFixed(2);
    document.getElementById('totalLibras').textContent = totalLibrasAcumulado.toFixed(2);
    document.getElementById('totalPagar').textContent = '$' + totalPagarMostrar.toFixed(2);

    tablaResultados.style.display = 'table';
    document.getElementById('peso').value = '';

    // Al final del código existente del evento submit
    mostrarBotonesCompartir();

    // Mostrar botones de compartir
    botonesCompartir.style.display = 'flex';
});

btnReiniciar.addEventListener('click', (event) => {
    event.preventDefault();

    totalGramosAcumulado = 0;
    totalLibrasAcumulado = 0;
    totalPagarAcumulado = 0;
    productos = [];

    document.getElementById('totalGramos').textContent = '';
    document.getElementById('pesoPedidos').innerHTML = '';
    document.getElementById('totalLibras').textContent = '';
    document.getElementById('totalPagar').textContent = '';

    tablaResultados.style.display = 'none';
    document.getElementById('peso').value = '';

    // Al final del código existente del evento click
    botonesCompartir.style.display = 'none';
    botonesCompartir.classList.remove('d-flex');
    botonesCompartir.classList.add('d-none');

    // Ocultar botones de compartir
    botonesCompartir.style.display = 'none';
});

// Elementos para compartir
const btnCompartir = document.getElementById('btnCompartir');
const btnDescargar = document.getElementById('btnDescargar');
const botonesCompartir = document.getElementById('botonesCompartir');

// Función para mostrar los botones de compartir cuando aparezca la tabla
function mostrarBotonesCompartir() {
    if (tablaResultados.style.display === 'table') {
        botonesCompartir.style.display = 'flex !important';
        botonesCompartir.classList.remove('d-none');
        botonesCompartir.classList.add('d-flex');
    } else {
        botonesCompartir.style.display = 'none !important';
        botonesCompartir.classList.remove('d-flex');
        botonesCompartir.classList.add('d-none');
    }
}

// Función para generar la nota de venta como un elemento HTML
function generarNotaVenta() {
    // Crear un contenedor para la nota
    const notaVenta = document.createElement('div');
    notaVenta.className = 'nota-venta';
    
    // Cabecera de la nota
    const header = document.createElement('div');
    header.className = 'nota-header';
    header.innerHTML = `
        <h3>Pesaje Pedidos</h3>
        <p>Nota de Venta</p>
        <p>${new Date().toLocaleDateString('es-ES')} ${new Date().toLocaleTimeString('es-ES')}</p>
        <p>Tipo de cliente: ${tipoClienteSwitch.checked ? 'Socio' : 'Cliente'}</p>
    `;
    
    // Clonar la tabla de resultados
    const tabla = tablaResultados.cloneNode(true);
    tabla.style.display = 'table';
    tabla.classList.add('table-bordered');
    
    // Pie de nota
    const footer = document.createElement('div');
    footer.className = 'nota-footer';
    footer.innerHTML = `
        <p>Gracias por su compra</p>
        <p>Precio por libra: ${precioPorLibraElement.textContent}</p>
    `;
    
    // Ensamblar la nota
    notaVenta.appendChild(header);
    notaVenta.appendChild(tabla);
    notaVenta.appendChild(footer);
    
    return notaVenta;
}

// Función para capturar la nota como imagen
async function capturarNotaComoImagen() {
    const notaVenta = generarNotaVenta();
    
    // Añadir temporalmente al DOM para capturar
    document.body.appendChild(notaVenta);
    
    try {
        const canvas = await html2canvas(notaVenta, {
            scale: 2, // Mayor calidad
            backgroundColor: '#ffffff',
            logging: false
        });
        
        document.body.removeChild(notaVenta);
        return canvas;
    } catch (error) {
        console.error('Error al capturar la nota:', error);
        document.body.removeChild(notaVenta);
        throw error;
    }
}

// Función para compartir la nota como imagen
async function compartirNota() {
    try {
        const canvas = await capturarNotaComoImagen();
        
        // Convertir canvas a blob
        const blob = await new Promise(resolve => {
            canvas.toBlob(resolve, 'image/png');
        });
        
        // Verificar si la API Web Share está disponible
        if (navigator.share) {
            const file = new File([blob], 'nota-pesaje.png', { type: 'image/png' });
            
            await navigator.share({
                title: 'Nota de Pesaje',
                text: 'Aquí está tu nota de pesaje',
                files: [file]
            });
        } else {
            // Alternativa para navegadores que no soportan Web Share API
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'nota-pesaje.png';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    } catch (error) {
        console.error('Error al compartir:', error);
        alert('No se pudo compartir la nota. Intente descargarla.');
    }
}

// Función para descargar la nota como PDF
async function descargarNota() {
    try {
        const canvas = await capturarNotaComoImagen();
        const imgData = canvas.toDataURL('image/png');
        
        // Usar jsPDF para crear un PDF
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });
        
        // Calcular dimensiones para ajustar la imagen al PDF
        const imgWidth = 210 - 20; // A4 width (210mm) - margins
        const imgHeight = canvas.height * imgWidth / canvas.width;
        
        pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
        pdf.save('nota-pesaje.pdf');
    } catch (error) {
        console.error('Error al descargar:', error);
        alert('No se pudo descargar la nota como PDF. Intente compartirla como imagen.');
        
        // Intentar descargar como imagen si falla el PDF
        try {
            await compartirNota();
        } catch (e) {
            console.error('Error al intentar alternativa:', e);
        }
    }
}

// Eventos para los botones de compartir y descargar
btnCompartir.addEventListener('click', compartirNota);
btnDescargar.addEventListener('click', descargarNota);