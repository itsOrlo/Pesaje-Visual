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

        let totalGramosAcumulado = 0;
        let totalLibrasAcumulado = 0;
        let totalPagarAcumulado = 0;
        let productos = [];

        form.addEventListener('submit', (event) => {
            event.preventDefault();

            const gramos = parseFloat(document.getElementById('peso').value);

            if (isNaN(gramos)) {
                alert("Por favor, ingrese un valor numérico válido para el peso.");
                return;
            }

            productos.push({ nombre: `Producto ${productos.length + 1}`, gramos });

            const libras = gramos / 453.59237;
            const precioPorLibra = 6.50;
            const totalPagar = libras * precioPorLibra;

            totalGramosAcumulado += gramos;
            totalLibrasAcumulado += libras;
            totalPagarAcumulado += totalPagar;

            // Actualizar la celda "Peso de Pedidos" con saltos de línea
            const listaProductos = productos.map(p => `${p.nombre}: ${p.gramos}g<br>`).join(''); 
            document.getElementById('pesoPedidos').innerHTML = listaProductos; 

            document.getElementById('totalGramos').textContent = totalGramosAcumulado;
            document.getElementById('totalLibras').textContent = totalLibrasAcumulado.toFixed(2);
            document.getElementById('totalPagar').textContent = '$' + totalPagarAcumulado.toFixed(2);

            tablaResultados.style.display = 'table'; 
        });

        const botonReiniciar = document.createElement('button');
        botonReiniciar.textContent = 'Reiniciar';
        botonReiniciar.classList.add('btn', 'btn-secondary');
        botonReiniciar.style.marginLeft = '10px';

        const divBotones = document.createElement('div');
        divBotones.appendChild(document.querySelector('button[type="submit"]'));
        divBotones.appendChild(botonReiniciar);
        form.appendChild(divBotones);

        botonReiniciar.addEventListener('click', (event) => {
            event.preventDefault();

            totalGramosAcumulado = 0;
            totalLibrasAcumulado = 0;
            totalPagarAcumulado = 0;
            productos = [];

            document.getElementById('totalGramos').textContent = '';
            document.getElementById('pesoPedidos').innerHTML = ''; // Limpiar el contenido HTML
            document.getElementById('totalLibras').textContent = '';
            document.getElementById('totalPagar').textContent = '';

            tablaResultados.style.display = 'none';

            document.getElementById('peso').value = ''; 
        });