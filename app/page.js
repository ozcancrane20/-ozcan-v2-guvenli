'use client';

import React, { useState, useEffect } from 'react';
import { Package, AlertTriangle, ShoppingCart, Activity, LogOut, Eye, EyeOff } from 'lucide-react';

export default function Home() {
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showAddMovementModal, setShowAddMovementModal] = useState(false);
  const [showAddOrderModal, setShowAddOrderModal] = useState(false);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [movementFilter, setMovementFilter] = useState('all');
  const [orderFilter, setOrderFilter] = useState('all');
  
  // ŞİFRELİ KULLANICILAR - Buraya şifre ekleyin!
  const users = {
    'Nedret': { password: '1234', role: 'Admin' },
    'Yasemin': { password: '1234', role: 'Depo' },
    'Erdo': { password: '1234', role: 'Depo' },
    'Musa': { password: '1234', role: 'Depo' },
    'Safiye': { password: '1234', role: 'Muhasebe' }
  };

  const [products, setProducts] = useState([
    { id: 1, name: 'TEST_BOK', code: '150.151.152', group: 'A', location: 'A2', initialStock: 29950, criticalLevel: 3, currentStock: 299 },
    { id: 2, name: 'TEST_B', code: '151', group: 'B', location: 'BB1', initialStock: 0, criticalLevel: 2, currentStock: -82 },
    { id: 3, name: 'TEST_C', code: '155', group: 'C', location: 'C1', initialStock: 0, criticalLevel: 0, currentStock: -3 },
    { id: 4, name: 'TEEE', code: '156', group: 'D', location: 'D2', initialStock: 0, criticalLevel: 15, currentStock: 0 },
    { id: 5, name: 'DENEME5', code: '150.152.11', group: 'E', location: 'M2', initialStock: 9, criticalLevel: 15, currentStock: 9 },
  ]);

  const [movements, setMovements] = useState([
    { id: 1, date: '2024-12-19 14:30', productName: 'TEST_BOK', type: 'Giriş', quantity: 50, location: 'A2', description: 'Tedarikçiden gelen sipariş', receivedBy: 'Nedret', deliveredBy: 'Tedarikçi A' },
    { id: 2, date: '2024-12-19 13:15', productName: 'TEST_B', type: 'Çıkış', quantity: 20, location: 'BB1', description: 'Müşteri siparişi', receivedBy: 'Müşteri X', deliveredBy: 'Yasemin' },
    { id: 3, date: '2024-12-18 16:45', productName: 'TEST_C', type: 'Giriş', quantity: 100, location: 'C1', description: 'Stok yenileme', receivedBy: 'Erdo', deliveredBy: 'Depo A' },
    { id: 4, date: '2024-12-18 10:20', productName: 'DENEME5', type: 'Çıkış', quantity: 15, location: 'M2', description: 'İç transfer', receivedBy: 'Depo B', deliveredBy: 'Musa' },
  ]);

  const [orders, setOrders] = useState([
    { id: 1, productName: 'TEST_B', minQuantity: 100, supplier: 'Tedarikçi A', orderDate: '2024-12-15', receivedQuantity: 0, status: 'Beklemede', unitPrice: 25.50 },
    { id: 2, productName: 'TEST_C', minQuantity: 50, supplier: 'Tedarikçi B', orderDate: '2024-12-16', receivedQuantity: 50, status: 'Tamamlandı', unitPrice: 18.75 },
    { id: 3, productName: 'TEEE', minQuantity: 200, supplier: 'Tedarikçi C', orderDate: '2024-12-17', receivedQuantity: 0, status: 'Beklemede', unitPrice: 32.00 },
  ]);

  const [newProduct, setNewProduct] = useState({
    name: '', code: '', group: '', location: '', initialStock: 0, criticalLevel: 0, currentStock: 0
  });

  const [newMovement, setNewMovement] = useState({
    productName: '', type: 'Giriş', quantity: 0, location: '', description: '', receivedBy: '', deliveredBy: ''
  });

  const [newOrder, setNewOrder] = useState({
    productName: '', minQuantity: 0, supplier: '', unitPrice: 0, notes: ''
  });

  // SAYFA YENİLENİNCE KULLANICI BİLGİSİNİ KORU
  useEffect(() => {
    const savedUser = localStorage.getItem('ozcan-current-user');
    if (savedUser) {
      setCurrentUser(savedUser);
    }

    const savedProducts = localStorage.getItem('ozcan-products');
    const savedMovements = localStorage.getItem('ozcan-movements');
    const savedOrders = localStorage.getItem('ozcan-orders');
    
    if (savedProducts) setProducts(JSON.parse(savedProducts));
    if (savedMovements) setMovements(JSON.parse(savedMovements));
    if (savedOrders) setOrders(JSON.parse(savedOrders));
  }, []);

  // VERİLERİ KAYDET
  useEffect(() => {
    localStorage.setItem('ozcan-products', JSON.stringify(products));
    localStorage.setItem('ozcan-movements', JSON.stringify(movements));
    localStorage.setItem('ozcan-orders', JSON.stringify(orders));
  }, [products, movements, orders]);

  // İKİ SEKME ARASINDA SENKRONIZASYON
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'ozcan-products' && e.newValue) {
        setProducts(JSON.parse(e.newValue));
      }
      if (e.key === 'ozcan-movements' && e.newValue) {
        setMovements(JSON.parse(e.newValue));
      }
      if (e.key === 'ozcan-orders' && e.newValue) {
        setOrders(JSON.parse(e.newValue));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    if (newMovement.productName) {
      const product = products.find(p => p.name === newMovement.productName);
      if (product) {
        setNewMovement(prev => ({ ...prev, location: product.location }));
      }
    }
  }, [newMovement.productName, products]);

  // ŞİFRELİ GİRİŞ
  const handleLogin = () => {
    setLoginError('');
    
    if (!selectedUser) {
      setLoginError('Lütfen bir kullanıcı seçin!');
      return;
    }
    
    if (!password) {
      setLoginError('Lütfen şifrenizi girin!');
      return;
    }

    const user = users[selectedUser];
    if (!user) {
      setLoginError('Kullanıcı bulunamadı!');
      return;
    }

    if (user.password !== password) {
      setLoginError('Şifre yanlış!');
      return;
    }

    // GİRİŞ BAŞARILI
    setCurrentUser(selectedUser);
    localStorage.setItem('ozcan-current-user', selectedUser);
    setPassword('');
    setLoginError('');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setSelectedUser('');
    setPassword('');
    localStorage.removeItem('ozcan-current-user');
  };

  const handleAddProduct = () => {
    if (newProduct.name && newProduct.code) {
      setProducts([...products, { ...newProduct, id: Date.now() }]);
      setNewProduct({ name: '', code: '', group: '', location: '', initialStock: 0, criticalLevel: 0, currentStock: 0 });
      setShowAddProductModal(false);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setNewProduct(product);
    setShowEditProductModal(true);
  };

  const handleUpdateProduct = () => {
    if (newProduct.name && newProduct.code) {
      setProducts(products.map(p => p.id === editingProduct.id ? { ...newProduct, id: editingProduct.id } : p));
      setNewProduct({ name: '', code: '', group: '', location: '', initialStock: 0, criticalLevel: 0, currentStock: 0 });
      setEditingProduct(null);
      setShowEditProductModal(false);
    }
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleAddMovement = () => {
    if (newMovement.productName && newMovement.quantity > 0) {
      const now = new Date();
      const dateStr = `${now.toLocaleDateString('tr-TR')} ${now.toLocaleTimeString('tr-TR', {hour: '2-digit', minute: '2-digit'})}`;
      
      setMovements([{ id: Date.now(), date: dateStr, ...newMovement }, ...movements]);

      const product = products.find(p => p.name === newMovement.productName);
      if (product) {
        setProducts(products.map(p => {
          if (p.name === newMovement.productName) {
            return {
              ...p,
              currentStock: newMovement.type === 'Giriş' ? p.currentStock + newMovement.quantity : p.currentStock - newMovement.quantity
            };
          }
          return p;
        }));
      }

      setNewMovement({ productName: '', type: 'Giriş', quantity: 0, location: '', description: '', receivedBy: '', deliveredBy: currentUser || '' });
      setShowAddMovementModal(false);
    }
  };

  const handleDeleteMovement = (id) => {
    if (window.confirm('Bu hareketi silmek istediğinizden emin misiniz?')) {
      setMovements(movements.filter(m => m.id !== id));
    }
  };

  const handleAddOrder = () => {
    if (newOrder.productName && newOrder.minQuantity > 0) {
      const now = new Date();
      const dateStr = now.toLocaleDateString('tr-TR');
      
      setOrders([...orders, { 
        id: Date.now(),
        orderDate: dateStr,
        receivedQuantity: 0,
        status: 'Beklemede',
        ...newOrder 
      }]);

      setNewOrder({ productName: '', minQuantity: 0, supplier: '', unitPrice: 0, notes: '' });
      setShowAddOrderModal(false);
    }
  };

  const handleCompleteOrder = (orderId) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const receivedQty = prompt(`${order.productName} için teslim alınan miktarı girin:`, order.minQuantity);
    if (receivedQty === null) return;

    const qty = Number(receivedQty);
    if (isNaN(qty) || qty <= 0) {
      alert('Geçerli bir miktar girin!');
      return;
    }

    setOrders(orders.map(o => o.id === orderId ? { ...o, receivedQuantity: qty, status: 'Tamamlandı' } : o));

    const product = products.find(p => p.name === order.productName);
    if (product) {
      setProducts(products.map(p => p.name === order.productName ? { ...p, currentStock: p.currentStock + qty } : p));
    }

    const now = new Date();
    const dateStr = `${now.toLocaleDateString('tr-TR')} ${now.toLocaleTimeString('tr-TR', {hour: '2-digit', minute: '2-digit'})}`;
    
    setMovements([{
      id: Date.now(),
      date: dateStr,
      productName: order.productName,
      type: 'Giriş',
      quantity: qty,
      location: product?.location || '',
      description: `Sipariş teslim alındı - ${order.supplier}`,
      receivedBy: currentUser || 'Sistem',
      deliveredBy: order.supplier
    }, ...movements]);

    alert('Sipariş başarıyla tamamlandı!');
  };

  const handleDeleteOrder = (id) => {
    if (window.confirm('Bu siparişi silmek istediğinizden emin misiniz?')) {
      setOrders(orders.filter(o => o.id !== id));
    }
  };

  const handleExportToExcel = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Ürün Adı,Kod,Grup,Yer,Başlangıç,Kritik,Güncel\n"
      + products.map(p => `${p.name},${p.code},${p.group},${p.location},${p.initialStock},${p.criticalLevel},${p.currentStock}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ozcan-crane-rapor-${new Date().toLocaleDateString('tr-TR')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'critical' && product.currentStock < product.criticalLevel) ||
                         (filterStatus === 'normal' && product.currentStock >= product.criticalLevel);
    
    return matchesSearch && matchesFilter;
  });

  const filteredMovements = movements.filter(movement => {
    const matchesSearch = movement.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         movement.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = movementFilter === 'all' || 
                         (movementFilter === 'giris' && movement.type === 'Giriş') ||
                         (movementFilter === 'cikis' && movement.type === 'Çıkış');
    
    return matchesSearch && matchesFilter;
  });

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = orderFilter === 'all' || 
                         (orderFilter === 'beklemede' && order.status === 'Beklemede') ||
                         (orderFilter === 'tamamlandi' && order.status === 'Tamamlandı');
    
    return matchesSearch && matchesFilter;
  });

  const criticalProducts = products.filter(p => p.currentStock < p.criticalLevel);

  // ŞİFRELİ GİRİŞ EKRANI
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <Package className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">ÖZCAN CRANE</h1>
            <p className="text-gray-600">Stok Yönetim Sistemi</p>
            <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-sm text-green-800 font-semibold">🔒 Güvenli Giriş</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kullanıcı Adı</label>
              <select
                value={selectedUser}
                onChange={(e) => {
                  setSelectedUser(e.target.value);
                  setLoginError('');
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">Seçiniz...</option>
                {Object.keys(users).map(user => (
                  <option key={user} value={user}>{user}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Şifre</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setLoginError('');
                  }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') handleLogin();
                  }}
                  placeholder="Şifrenizi girin"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {loginError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-800">{loginError}</p>
              </div>
            )}

            <button
              onClick={handleLogin}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              Giriş Yap
            </button>

            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-800 text-center">
                💡 Test şifresi: <span className="font-bold">1234</span> (Tüm kullanıcılar için)
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard render fonksiyonu devam edecek...
  // Dosya çok uzun olduğu için buradan itibaren eski kodla aynı

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Toplam Ürün</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{products.length}</p>
            </div>
            <Package className="w-12 h-12 text-blue-500 opacity-80" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Kritik Stok</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{criticalProducts.length}</p>
            </div>
            <AlertTriangle className="w-12 h-12 text-red-500 opacity-80" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Aktif Siparişler</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{orders.filter(o => o.status === 'Beklemede').length}</p>
            </div>
            <ShoppingCart className="w-12 h-12 text-green-500 opacity-80" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Bugünkü Hareketler</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{movements.filter(m => m.date.includes(new Date().toLocaleDateString('tr-TR'))).length}</p>
            </div>
            <Activity className="w-12 h-12 text-purple-500 opacity-80" />
          </div>
        </div>
      </div>

      {criticalProducts.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 rounded-xl p-6">
          <div className="flex items-start">
            <AlertTriangle className="w-6 h-6 text-red-500 mt-1 mr-3 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-red-800 mb-2">Kritik Stok Uyarısı!</h3>
              <p className="text-red-700 mb-3">Aşağıdaki ürünlerin stok seviyesi kritik düzeyin altında:</p>
              <div className="space-y-2">
                {criticalProducts.map(product => (
                  <div key={product.id} className="bg-white rounded-lg p-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                      <p className="font-semibold text-gray-800">{product.name}</p>
                      <p className="text-sm text-gray-600">Kod: {product.code} | Yer: {product.location}</p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-sm text-gray-600">Mevcut: <span className="font-bold text-red-600">{product.currentStock}</span></p>
                      <p className="text-sm text-gray-600">Kritik: {product.criticalLevel}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Son Hareketler</h3>
          <div className="space-y-3">
            {movements.slice(0, 5).map(movement => (
              <div key={movement.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-gray-50 rounded-lg gap-2">
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{movement.productName}</p>
                  <p className="text-sm text-gray-600">{movement.date}</p>
                </div>
                <div className="text-left sm:text-right">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    movement.type === 'Giriş' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {movement.type === 'Giriş' ? '+' : '-'}{movement.quantity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Bekleyen Siparişler</h3>
          <div className="space-y-3">
            {orders.filter(o => o.status === 'Beklemede').slice(0, 5).map(order => (
              <div key={order.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-gray-50 rounded-lg gap-2">
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{order.productName}</p>
                  <p className="text-sm text-gray-600">{order.supplier}</p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="font-semibold text-gray-800">{order.minQuantity} adet</p>
                  <p className="text-sm text-gray-600">{order.orderDate}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
            <Activity className="w-12 h-12 text-purple-500 opacity-80" />
          </div>
        </div>
      </div>

      {criticalProducts.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 rounded-xl p-6">
          <div className="flex items-start">
            <AlertTriangle className="w-6 h-6 text-red-500 mt-1 mr-3 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-red-800 mb-2">Kritik Stok Uyarısı!</h3>
              <p className="text-red-700 mb-3">Aşağıdaki ürünlerin stok seviyesi kritik düzeyin altında:</p>
              <div className="space-y-2">
                {criticalProducts.map(product => (
                  <div key={product.id} className="bg-white rounded-lg p-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                      <p className="font-semibold text-gray-800">{product.name}</p>
                      <p className="text-sm text-gray-600">Kod: {product.code} | Yer: {product.location}</p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-sm text-gray-600">Mevcut: <span className="font-bold text-red-600">{product.currentStock}</span></p>
                      <p className="text-sm text-gray-600">Kritik: {product.criticalLevel}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Son Hareketler</h3>
          <div className="space-y-3">
            {movements.slice(0, 5).map(movement => (
              <div key={movement.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-gray-50 rounded-lg gap-2">
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{movement.productName}</p>
                  <p className="text-sm text-gray-600">{movement.date}</p>
                </div>
                <div className="text-left sm:text-right">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    movement.type === 'Giriş' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {movement.type === 'Giriş' ? '+' : '-'}{movement.quantity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Bekleyen Siparişler</h3>
          <div className="space-y-3">
            {orders.filter(o => o.status === 'Beklemede').slice(0, 5).map(order => (
              <div key={order.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-gray-50 rounded-lg gap-2">
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{order.productName}</p>
                  <p className="text-sm text-gray-600">{order.supplier}</p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="font-semibold text-gray-800">{order.minQuantity} adet</p>
                  <p className="text-sm text-gray-600">{order.orderDate}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Ürünler sayfası
  const renderProducts = () => (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Ürün Listesi</h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleExportToExcel}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
          >
            Excel'e Aktar
          </button>
          <button
            onClick={() => setShowAddProductModal(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
          >
            + Yeni Ürün Ekle
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Ürün adı, kod veya yer ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="all">Tüm Ürünler</option>
            <option value="critical">Kritik Stok</option>
            <option value="normal">Normal Stok</option>
          </select>
        </div>

        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Ürün Adı</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Kod</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden sm:table-cell">Grup</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden md:table-cell">Yer</th>
                  <th className="px-3 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider hidden lg:table-cell">Başlangıç</th>
                  <th className="px-3 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider hidden lg:table-cell">Kritik</th>
                  <th className="px-3 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Güncel</th>
                  <th className="px-3 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Durum</th>
                  <th className="px-3 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">İşlem</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map(product => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-3 py-3 whitespace-nowrap font-medium text-gray-800 text-sm">{product.name}</td>
                    <td className="px-3 py-3 whitespace-nowrap text-gray-600 text-sm">{product.code}</td>
                    <td className="px-3 py-3 whitespace-nowrap text-gray-600 text-sm hidden sm:table-cell">{product.group}</td>
                    <td className="px-3 py-3 whitespace-nowrap text-gray-600 text-sm hidden md:table-cell">{product.location}</td>
                    <td className="px-3 py-3 whitespace-nowrap text-right text-gray-600 text-sm hidden lg:table-cell">{product.initialStock}</td>
                    <td className="px-3 py-3 whitespace-nowrap text-right text-gray-600 text-sm hidden lg:table-cell">{product.criticalLevel}</td>
                    <td className="px-3 py-3 whitespace-nowrap text-right font-semibold text-gray-800 text-sm">{product.currentStock}</td>
                    <td className="px-3 py-3 whitespace-nowrap text-center">
                      {product.currentStock < product.criticalLevel ? (
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">
                          Kritik
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                          Normal
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-center">
                      <div className="flex justify-center gap-1">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs"
                        >
                          Düzenle
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
                        >
                          Sil
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  // Hareketler sayfası
  const renderMovements = () => (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Stok Hareketleri</h2>
        <button
          onClick={() => setShowAddMovementModal(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
        >
          + Yeni Hareket Ekle
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Ürün adı veya yer ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <select
            value={movementFilter}
            onChange={(e) => setMovementFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="all">Tüm Hareketler</option>
            <option value="giris">Sadece Giriş</option>
            <option value="cikis">Sadece Çıkış</option>
          </select>
        </div>

        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Tarih/Saat</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Ürün</th>
                  <th className="px-3 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Tür</th>
                  <th className="px-3 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Miktar</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden md:table-cell">Yer</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden lg:table-cell">Açıklama</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden xl:table-cell">Teslim Alan</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden xl:table-cell">Teslim Eden</th>
                  <th className="px-3 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">İşlem</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMovements.map(movement => (
                  <tr key={movement.id} className="hover:bg-gray-50">
                    <td className="px-3 py-3 whitespace-nowrap text-gray-600 text-xs">{movement.date}</td>
                    <td className="px-3 py-3 whitespace-nowrap font-medium text-gray-800 text-sm">{movement.productName}</td>
                    <td className="px-3 py-3 whitespace-nowrap text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        movement.type === 'Giriş' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {movement.type}
                      </span>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-right font-semibold text-gray-800 text-sm">{movement.quantity}</td>
                    <td className="px-3 py-3 whitespace-nowrap text-gray-600 text-sm hidden md:table-cell">{movement.location}</td>
                    <td className="px-3 py-3 text-gray-600 text-sm hidden lg:table-cell max-w-xs truncate">{movement.description}</td>
                    <td className="px-3 py-3 whitespace-nowrap text-gray-600 text-sm hidden xl:table-cell">{movement.receivedBy}</td>
                    <td className="px-3 py-3 whitespace-nowrap text-gray-600 text-sm hidden xl:table-cell">{movement.deliveredBy}</td>
                    <td className="px-3 py-3 whitespace-nowrap text-center">
                      <button
                        onClick={() => handleDeleteMovement(movement.id)}
                        className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
                      >
                        Sil
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  // Siparişler sayfası
  const renderOrders = () => (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Sipariş Yönetimi</h2>
        <button
          onClick={() => setShowAddOrderModal(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
        >
          + Yeni Sipariş Oluştur
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Ürün adı veya tedarikçi ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <select
            value={orderFilter}
            onChange={(e) => setOrderFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="all">Tüm Siparişler</option>
            <option value="beklemede">Beklemede</option>
            <option value="tamamlandi">Tamamlandı</option>
          </select>
        </div>

        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Ürün</th>
                  <th className="px-3 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Miktar</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden md:table-cell">Tedarikçi</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden lg:table-cell">Tarih</th>
                  <th className="px-3 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider hidden lg:table-cell">Birim</th>
                  <th className="px-3 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider hidden xl:table-cell">Toplam</th>
                  <th className="px-3 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider hidden sm:table-cell">Teslim</th>
                  <th className="px-3 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Durum</th>
                  <th className="px-3 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">İşlem</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-3 py-3 whitespace-nowrap font-medium text-gray-800 text-sm">{order.productName}</td>
                    <td className="px-3 py-3 whitespace-nowrap text-right text-gray-600 text-sm">{order.minQuantity}</td>
                    <td className="px-3 py-3 whitespace-nowrap text-gray-600 text-sm hidden md:table-cell">{order.supplier}</td>
                    <td className="px-3 py-3 whitespace-nowrap text-gray-600 text-xs hidden lg:table-cell">{order.orderDate}</td>
                    <td className="px-3 py-3 whitespace-nowrap text-right text-gray-600 text-sm hidden lg:table-cell">{order.unitPrice.toFixed(2)} ₺</td>
                    <td className="px-3 py-3 whitespace-nowrap text-right font-semibold text-gray-800 text-sm hidden xl:table-cell">
                      {(order.minQuantity * order.unitPrice).toFixed(2)} ₺
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-right text-gray-600 text-sm hidden sm:table-cell">{order.receivedQuantity}</td>
                    <td className="px-3 py-3 whitespace-nowrap text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        order.status === 'Beklemede' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-center">
                      <div className="flex justify-center gap-1">
                        {order.status === 'Beklemede' && (
                          <button
                            onClick={() => handleCompleteOrder(order.id)}
                            className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs"
                          >
                            Tamamla
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteOrder(order.id)}
                          className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
                        >
                          Sil
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  // Modal Components
  const ProductModal = ({ isEdit = false }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-2xl font-bold text-gray-800">
            {isEdit ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}
          </h3>
        </div>
        
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ürün Adı *</label>
              <input
                type="text"
                value={newProduct.name}
                onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ürün Kodu *</label>
              <input
                type="text"
                value={newProduct.code}
                onChange={(e) => setNewProduct({...newProduct, code: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Grup</label>
              <input
                type="text"
                value={newProduct.group}
                onChange={(e) => setNewProduct({...newProduct, group: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Depo Yeri</label>
              <input
                type="text"
                value={newProduct.location}
                onChange={(e) => setNewProduct({...newProduct, location: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Başlangıç Stok</label>
              <input
                type="number"
                value={newProduct.initialStock}
                onChange={(e) => setNewProduct({...newProduct, initialStock: Number(e.target.value)})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kritik Seviye</label>
              <input
                type="number"
                value={newProduct.criticalLevel}
                onChange={(e) => setNewProduct({...newProduct, criticalLevel: Number(e.target.value)})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Güncel Stok</label>
              <input
                type="number"
                value={newProduct.currentStock}
                onChange={(e) => setNewProduct({...newProduct, currentStock: Number(e.target.value)})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
        
        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={() => {
              if (isEdit) {
                setShowEditProductModal(false);
                setEditingProduct(null);
              } else {
                setShowAddProductModal(false);
              }
              setNewProduct({ name: '', code: '', group: '', location: '', initialStock: 0, criticalLevel: 0, currentStock: 0 });
            }}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold"
          >
            İptal
          </button>
          <button
            onClick={isEdit ? handleUpdateProduct : handleAddProduct}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold"
          >
            {isEdit ? 'Güncelle' : 'Ekle'}
          </button>
        </div>
      </div>
    </div>
  );

  const MovementModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-2xl font-bold text-gray-800">Yeni Stok Hareketi</h3>
        </div>
        
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ürün Seç *</label>
              <select
                value={newMovement.productName}
                onChange={(e) => setNewMovement({...newMovement, productName: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">Seçiniz...</option>
                {products.map(product => (
                  <option key={product.id} value={product.name}>{product.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hareket Türü *</label>
              <select
                value={newMovement.type}
                onChange={(e) => setNewMovement({...newMovement, type: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="Giriş">Giriş</option>
                <option value="Çıkış">Çıkış</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Miktar *</label>
              <input
                type="number"
                value={newMovement.quantity}
                onChange={(e) => setNewMovement({...newMovement, quantity: Number(e.target.value)})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Depo Yeri</label>
              <input
                type="text"
                value={newMovement.location}
                onChange={(e) => setNewMovement({...newMovement, location: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Teslim Alan</label>
              <input
                type="text"
                value={newMovement.receivedBy}
                onChange={(e) => setNewMovement({...newMovement, receivedBy: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Teslim Eden</label>
              <input
                type="text"
                value={newMovement.deliveredBy}
                onChange={(e) => setNewMovement({...newMovement, deliveredBy: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama</label>
              <textarea
                value={newMovement.description}
                onChange={(e) => setNewMovement({...newMovement, description: e.target.value})}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
        
        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={() => {
              setShowAddMovementModal(false);
              setNewMovement({ productName: '', type: 'Giriş', quantity: 0, location: '', description: '', receivedBy: '', deliveredBy: '' });
            }}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold"
          >
            İptal
          </button>
          <button
            onClick={handleAddMovement}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold"
          >
            Kaydet
          </button>
        </div>
      </div>
    </div>
  );

  const OrderModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-2xl font-bold text-gray-800">Yeni Sipariş Oluştur</h3>
        </div>
        
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ürün Seç *</label>
              <select
                value={newOrder.productName}
                onChange={(e) => setNewOrder({...newOrder, productName: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">Seçiniz...</option>
                {products.map(product => (
                  <option key={product.id} value={product.name}>{product.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Miktar *</label>
              <input
                type="number"
                value={newOrder.minQuantity}
                onChange={(e) => setNewOrder({...newOrder, minQuantity: Number(e.target.value)})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tedarikçi *</label>
              <input
                type="text"
                value={newOrder.supplier}
                onChange={(e) => setNewOrder({...newOrder, supplier: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Birim Fiyat (₺) *</label>
              <input
                type="number"
                step="0.01"
                value={newOrder.unitPrice}
                onChange={(e) => setNewOrder({...newOrder, unitPrice: Number(e.target.value)})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Notlar</label>
              <textarea
                value={newOrder.notes}
                onChange={(e) => setNewOrder({...newOrder, notes: e.target.value})}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            
            {newOrder.minQuantity > 0 && newOrder.unitPrice > 0 && (
              <div className="md:col-span-2 bg-indigo-50 p-4 rounded-lg">
                <p className="text-lg font-semibold text-indigo-900">
                  Toplam Tutar: {(newOrder.minQuantity * newOrder.unitPrice).toFixed(2)} ₺
                </p>
              </div>
            )}
          </div>
        </div>
        
        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={() => {
              setShowAddOrderModal(false);
              setNewOrder({ productName: '', minQuantity: 0, supplier: '', unitPrice: 0, notes: '' });
            }}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold"
          >
            İptal
          </button>
          <button
            onClick={handleAddOrder}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold"
          >
            Sipariş Oluştur
          </button>
        </div>
      </div>
    </div>
  );

  // Ana render
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Package className="w-10 h-10" />
              <div>
                <h1 className="text-2xl font-bold">ÖZCAN CRANE</h1>
                <p className="text-indigo-100 text-sm">Stok Yönetim Sistemi</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-center sm:text-right">
                <p className="text-sm text-indigo-100">Hoş geldiniz,</p>
                <p className="font-semibold">{currentUser}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">Çıkış</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b border-gray-200 shadow-sm overflow-x-auto">
        <div className="container mx-auto px-4">
          <div className="flex gap-1 min-w-max">
            <button
              onClick={() => {
                setActiveMenu('dashboard');
                setSearchTerm('');
              }}
              className={`px-4 sm:px-6 py-3 sm:py-4 font-semibold transition-colors whitespace-nowrap ${
                activeMenu === 'dashboard'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-600 hover:text-indigo-600'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => {
                setActiveMenu('products');
                setSearchTerm('');
              }}
              className={`px-4 sm:px-6 py-3 sm:py-4 font-semibold transition-colors whitespace-nowrap ${
                activeMenu === 'products'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-600 hover:text-indigo-600'
              }`}
            >
              Ürünler
            </button>
            <button
              onClick={() => {
                setActiveMenu('movements');
                setSearchTerm('');
              }}
              className={`px-4 sm:px-6 py-3 sm:py-4 font-semibold transition-colors whitespace-nowrap ${
                activeMenu === 'movements'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-600 hover:text-indigo-600'
              }`}
            >
              Hareketler
            </button>
            <button
              onClick={() => {
                setActiveMenu('orders');
                setSearchTerm('');
              }}
              className={`px-4 sm:px-6 py-3 sm:py-4 font-semibold transition-colors whitespace-nowrap ${
                activeMenu === 'orders'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-600 hover:text-indigo-600'
              }`}
            >
              Siparişler
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 sm:py-8">
        {activeMenu === 'dashboard' && renderDashboard()}
        {activeMenu === 'products' && renderProducts()}
        {activeMenu === 'movements' && renderMovements()}
        {activeMenu === 'orders' && renderOrders()}
      </div>

      {/* Modals */}
      {showAddProductModal && <ProductModal />}
      {showEditProductModal && <ProductModal isEdit={true} />}
      {showAddMovementModal && <MovementModal />}
      {showAddOrderModal && <OrderModal />}
    </div>
  );
}
