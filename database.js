// Database simulasi menggunakan localStorage
class Database {
    constructor() {
        this.products = this.loadFromStorage('products') || this.getDefaultProducts();
        this.transactions = this.loadFromStorage('transactions') || [];
        this.settings = this.loadFromStorage('settings') || { taxRate: 0.1 };
        
        this.saveToStorage();
    }

    getDefaultProducts() {
        return [
            { id: 1, code: 'P001', name: 'Buku Tulis', price: 5000, stock: 50, category: 'Alat Tulis' },
            { id: 2, code: 'P002', name: 'Pensil 2B', price: 2000, stock: 100, category: 'Alat Tulis' },
            { id: 3, code: 'P003', name: 'Penghapus', price: 1500, stock: 80, category: 'Alat Tulis' },
            { id: 4, code: 'P004', name: 'Pulpen Biru', price: 3000, stock: 60, category: 'Alat Tulis' },
            { id: 5, code: 'P005', name: 'Penggaris 30cm', price: 4000, stock: 40, category: 'Alat Tulis' },
            { id: 6, code: 'P006', name: 'Spidol Whiteboard', price: 7000, stock: 30, category: 'Alat Tulis' },
            { id: 7, code: 'P007', name: 'Notebook', price: 15000, stock: 20, category: 'Alat Tulis' },
            { id: 8, code: 'P008', name: 'Stapler', price: 12000, stock: 25, category: 'Alat Tulis' }
        ];
    }

    // Product Methods
    getAllProducts() {
        return this.products;
    }

    getProductById(id) {
        return this.products.find(product => product.id === id);
    }

    addProduct(product) {
        const newId = this.products.length > 0 ? Math.max(...this.products.map(p => p.id)) + 1 : 1;
        const newProduct = { ...product, id: newId };
        this.products.push(newProduct);
        this.saveToStorage();
        return newProduct;
    }

    updateProduct(id, updatedProduct) {
        const index = this.products.findIndex(product => product.id === id);
        if (index !== -1) {
            this.products[index] = { ...this.products[index], ...updatedProduct };
            this.saveToStorage();
            return this.products[index];
        }
        return null;
    }

    deleteProduct(id) {
        const index = this.products.findIndex(product => product.id === id);
        if (index !== -1) {
            this.products.splice(index, 1);
            this.saveToStorage();
            return true;
        }
        return false;
    }

    // Transaction Methods
    getAllTransactions() {
        return this.transactions;
    }

    addTransaction(transaction) {
        const newTransaction = {
            ...transaction,
            id: this.transactions.length + 1,
            timestamp: new Date().toISOString()
        };
        this.transactions.unshift(newTransaction);
        this.saveToStorage();
        return newTransaction;
    }

    getTransactionById(id) {
        return this.transactions.find(transaction => transaction.id === id);
    }

    // Sales Statistics
    getTodaySales() {
        const today = new Date().toDateString();
        return this.transactions
            .filter(transaction => new Date(transaction.timestamp).toDateString() === today)
            .reduce((total, transaction) => total + transaction.total, 0);
    }

    getMonthlySales() {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        
        return this.transactions
            .filter(transaction => {
                const transactionDate = new Date(transaction.timestamp);
                return transactionDate.getMonth() === currentMonth && 
                       transactionDate.getFullYear() === currentYear;
            })
            .reduce((total, transaction) => total + transaction.total, 0);
    }

    // Storage Methods
    loadFromStorage(key) {
        try {
            const data = localStorage.getItem(`pos_${key}`);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error loading from storage:', error);
            return null;
        }
    }

    saveToStorage() {
        try {
            localStorage.setItem('pos_products', JSON.stringify(this.products));
            localStorage.setItem('pos_transactions', JSON.stringify(this.transactions));
            localStorage.setItem('pos_settings', JSON.stringify(this.settings));
        } catch (error) {
            console.error('Error saving to storage:', error);
        }
    }

    // Utility Methods
    formatCurrency(amount) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    }

    generateTransactionId() {
        const now = new Date();
        const dateStr = now.toISOString().slice(0,10).replace(/-/g, '');
        const timeStr = now.toTimeString().slice(0,8).replace(/:/g, '');
        return `TRX-${dateStr}-${timeStr}`;
    }
}

// Initialize database
const db = new Database();