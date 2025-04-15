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
});