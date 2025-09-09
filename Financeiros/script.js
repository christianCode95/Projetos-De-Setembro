document.addEventListener('DOMContentLoaded', () => {
    const transactionForm = document.getElementById('transaction-form');
    const descriptionInput = document.getElementById('description');
    const amountInput = document.getElementById('amount');
    const typeSelect = document.getElementById('type');
    const categorySelect = document.getElementById('category');
    const addCategoryBtn = document.getElementById('add-category-btn');
    const currentBalanceSpan = document.getElementById('current-balance');
    const transactionListUl = document.getElementById('transactions-list');

    // Carregar dados do localStorage
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    let categories = JSON.parse(localStorage.getItem('categories')) 
        || ['Alimentação', 'Transporte', 'Salário', 'Contas', 'Lazer'];

    // Salvar transações
    function saveTransactions() {
        localStorage.setItem('transactions', JSON.stringify(transactions));
    }

    // Salvar categorias
    function saveCategories() {
        localStorage.setItem('categories', JSON.stringify(categories));
    }

    // Formatar moeda BRL
    function formatCurrency(value) {
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    // Popular select de categorias
    function populateCategories() {
        categorySelect.innerHTML = '<option value="">Selecione uma categoria</option>';
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        });
    }

    // Adicionar nova categoria
    addCategoryBtn.addEventListener('click', () => {
        const newCategory = prompt('Digite o nome da nova categoria:');
        if (newCategory) {
            const trimmedCategory = newCategory.trim();
            if (trimmedCategory && !categories.includes(trimmedCategory)) {
                categories.push(trimmedCategory);
                saveCategories();
                populateCategories();
                categorySelect.value = trimmedCategory;
            } else if (trimmedCategory) {
                alert('Esta categoria já existe ou está vazia!');
            }
        }
    });

    // Atualizar saldo
    function updateBalance() {
        const totalBalance = transactions.reduce((sum, transaction) => {
            return sum + (transaction.type === 'income' ? transaction.amount : -transaction.amount);
        }, 0);
        currentBalanceSpan.textContent = formatCurrency(totalBalance);
    }

    // Renderizar lista de transações
    function renderTransactions() {
        transactionListUl.innerHTML = '';

        const sortedForDisplay = [...transactions].sort((a, b) =>
            new Date(b.date) - new Date(a.date)
        );

        sortedForDisplay.forEach(transaction => {
            const listItem = document.createElement('li');
            listItem.classList.add(transaction.type);

            const amountSign = transaction.type === 'income' ? '+' : '-';
            const formattedAmount = formatCurrency(transaction.amount);
            const transactionDate = new Date(transaction.date).toLocaleDateString('pt-BR');

            listItem.innerHTML = `
                <div class="transaction-content">
                    <div class="transaction-details">
                        <div class="description">${transaction.description}</div>
                        <span class="category">${transaction.category}</span>
                    </div>
                    <span class="date">${transactionDate}</span>
                    <div class="amount">${amountSign} ${formattedAmount}</div>
                    <button class="delete-btn" data-id="${transaction.id}" title="Excluir transação">
                        <span>x</span>
                    </button>
                </div>
            `;

            transactionListUl.appendChild(listItem);
        });

        // Evento de excluir transação
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const idToDelete = parseInt(e.currentTarget.dataset.id);
                transactions = transactions.filter(t => t.id !== idToDelete);
                saveTransactions();
                updateBalance();
                renderTransactions();
            });
        });
    }

    // Capturar envio do formulário
    transactionForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const newTransaction = {
            id: Date.now(),
            description: descriptionInput.value.trim(),
            amount: parseFloat(amountInput.value),
            type: typeSelect.value,
            category: categorySelect.value || 'Outros',
            date: new Date().toISOString().split('T')[0]
        };

        if (newTransaction.description === '' || isNaN(newTransaction.amount) || newTransaction.amount <= 0) {
            alert('Por favor, preencha todos os campos corretamente (valor deve ser positivo).');
            return;
        }

        if (newTransaction.category === '') {
            alert('Por favor, selecione ou adicione uma categoria.');
            return;
        }

        transactions.push(newTransaction);
        saveTransactions();
        updateBalance();
        renderTransactions();

        // Resetar formulário
        descriptionInput.value = '';
        amountInput.value = '';
        typeSelect.value = 'expense';
        categorySelect.value = '';
    });

    // Inicialização do app
    function initializeApp() {
        populateCategories();
        updateBalance();
        renderTransactions();
    }

    initializeApp();
});

