document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('stockChart');
    const ctx = canvas.getContext('2d');
    const currentPriceSpan = document.getElementById('current-price');
    const priceChangeSpan = document.getElementById('price-change');
    const startSimulationBtn = document.getElementById('start-simulation-btn');
    const stopSimulationBtn = document.getElementById("stop-simulation-btn");
    const resetChartBtn = document.getElementById('reset-chart-btn');

    const MAX_DATA_POINTS = 50;
    const UPDATE_INTERVAL_MS = 500;

    let priceHistory = [];
    let lastPrice = 100.00;
    let isSimulating = false;
    let intervalId = null;

    const COLORS = {
        POSITIVE_PRICE: '#28a745',
        NEGATIVE_PRICE: '#dc3545',
        NEUTRAL_PRICE: '#333'
    };

    function formatCurrency(value) {
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    function drawChart() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const padding = 40;
        const chartWidth = canvas.width - 2 * padding;
        const chartHeight = canvas.height - 2 * padding;

        if (priceHistory.length < 2) {
            ctx.font = '16px Arial';
            ctx.fillStyle = '#666';
            ctx.fillText('Nenhum dado para exibir no gráfico.', canvas.width / 2 - 120, canvas.height / 2);
            return;
        }

        const minPrice = Math.min(...priceHistory);
        const maxPrice = Math.max(...priceHistory);
        const priceRange = maxPrice - minPrice;
        const effectivePriceRange = priceRange === 0 ? (maxPrice === 0 ? 10 : maxPrice * 0.1) : priceRange;
        const effectiveMinPrice = priceRange === 0 ? (maxPrice === 0 ? 0 : minPrice - (maxPrice * 0.05)) : minPrice;

        // eixo Y
        const yAxisSteps = 5;
        ctx.fillStyle = '#666';
        ctx.font = '10px Arial';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';

        for (let i = 0; i <= yAxisSteps; i++) {
            const y = padding + chartHeight - (i / yAxisSteps) * chartHeight;
            const priceValue = effectiveMinPrice + (i / yAxisSteps) * effectivePriceRange;
            ctx.fillText(formatCurrency(priceValue), padding - 5, y);

            // linhas horizontais
            ctx.beginPath();
            ctx.strokeStyle = '#eee';
            ctx.moveTo(padding, y);
            ctx.lineTo(canvas.width - padding, y);
            ctx.stroke();
        }

        // linha do gráfico
        ctx.beginPath();
        ctx.lineWidth = 2;
        const firstPrice = priceHistory[0];
        const lastPriceGraph = priceHistory[priceHistory.length - 1];
        ctx.strokeStyle = lastPriceGraph > firstPrice ? COLORS.POSITIVE_PRICE :
                           lastPriceGraph < firstPrice ? COLORS.NEGATIVE_PRICE : COLORS.NEUTRAL_PRICE;

        priceHistory.forEach((price, index) => {
            const x = padding + (index / (MAX_DATA_POINTS - 1)) * chartWidth;
            const y = padding + chartHeight - ((price - effectiveMinPrice) / effectivePriceRange) * chartHeight;
            if (index === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.stroke();

        // ponto final
        const lastX = padding + ((priceHistory.length - 1) / (MAX_DATA_POINTS - 1)) * chartWidth;
        const lastY = padding + chartHeight - ((lastPriceGraph - effectiveMinPrice) / effectivePriceRange) * chartHeight;
        ctx.beginPath();
        ctx.arc(lastX, lastY, 4, 0, Math.PI * 2);
        ctx.fillStyle = ctx.strokeStyle;
        ctx.fill();
    }

    function generateNextPrice(currentPrice) {
        const volatility = 0.5;
        const trendFactor = 0.0005;
        const randomChange = (Math.random() - 0.5) * 2 * volatility;
        const trendChange = currentPrice * trendFactor * (Math.random() > 0.5 ? 1 : -1);
        let newPrice = currentPrice + randomChange + trendChange;
        if (newPrice < 1.0) newPrice = 1.0 + Math.random() * 0.5;
        return parseFloat(newPrice.toFixed(2));
    }

    function updateStockData() {
        const newPrice = generateNextPrice(lastPrice);
        const change = newPrice - lastPrice;
        const percentageChange = (change / lastPrice) * 100;

        currentPriceSpan.textContent = formatCurrency(newPrice);
        priceChangeSpan.textContent = `(${change >= 0 ? '+' : ''}${percentageChange.toFixed(2)}%)`;

        priceChangeSpan.classList.remove('change-positive', 'change-negative', 'change-neutral');

        if (change > 0) {
            priceChangeSpan.classList.add('change-positive');
            currentPriceSpan.style.color = COLORS.POSITIVE_PRICE;
        } else if (change < 0) {
            priceChangeSpan.classList.add('change-negative');
            currentPriceSpan.style.color = COLORS.NEGATIVE_PRICE;
        } else {
            priceChangeSpan.classList.add('change-neutral');
            currentPriceSpan.style.color = COLORS.NEUTRAL_PRICE;
        }

        lastPrice = newPrice;
        priceHistory.push(newPrice);
        if (priceHistory.length > MAX_DATA_POINTS) priceHistory.shift();

        drawChart();
    }

    function startSimulation() {
        if (isSimulating) return;
        isSimulating = true;
        startSimulationBtn.disabled = true;
        stopSimulationBtn.disabled = false;
        resetChartBtn.disabled = true;
        updateStockData();
        intervalId = setInterval(updateStockData, UPDATE_INTERVAL_MS);
    }

    function stopSimulation() {
        if (!isSimulating) return;
        isSimulating = false;
        clearInterval(intervalId);
        intervalId = null;
        startSimulationBtn.disabled = false;
        stopSimulationBtn.disabled = true;
        resetChartBtn.disabled = false;
    }

    function resetChart() {
        stopSimulation();
        priceHistory = [];
        lastPrice = 100.0;
        currentPriceSpan.textContent = formatCurrency(lastPrice);
        priceChangeSpan.textContent = '(0.00%)';
        priceChangeSpan.className = 'change-neutral';
        currentPriceSpan.style.color = COLORS.NEUTRAL_PRICE;
        drawChart();
    }

    function resizeCanvas() {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
        drawChart();
    }

    startSimulationBtn.addEventListener('click', startSimulation);
    stopSimulationBtn.addEventListener('click', stopSimulation);
    resetChartBtn.addEventListener('click', resetChart);
    window.addEventListener('resize', resizeCanvas);

    resizeCanvas();
    drawChart();
});
