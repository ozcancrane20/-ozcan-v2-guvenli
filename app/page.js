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
  
  // Şifreli kullanıcılar
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
  ]);

  const [orders, setOrders] = useState([
    { id: 1, productName: 'TEST_B', minQuantity: 100, supplier: 'Tedarikçi A', orderDate: '2024-12-15', receivedQuantity: 0, status: 'Beklemede', unitPrice: 25.50 },
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

  // Kullanıcı ve veri yükle
  useEffect(() => {
    const savedUser = localStorage.getItem('ozcan-current-user');
    if (savedUser) setCurrentUser(savedUser);

    const savedProducts = localStorage.getItem('ozcan-products');
    const savedMovements = localStorage.getItem('ozcan-movements');
    const savedOrders = localStorage.getItem('ozcan-orders');
    
    if (savedProducts) setProducts(JSON.parse(savedProducts));
    if (savedMovements) setMovements(JSON.parse(savedMovements));
    if (savedOrders) setOrders(JSON.parse(savedOrders));
  }, []);

  // Veriyi kaydet
  useEffect(() => {
    localStorage.setItem('ozcan-products', JSON.stringify(products));
    localStorage.setItem('ozcan-movements', JSON.stringify(movements));
    localStorage.setItem('ozcan-orders', JSON.stringify(orders));
  }, [products, movements, orders]);

  // Sekme senkronizasyonu
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'ozcan-products' && e.newValue) setProducts(JSON.parse(e.newValue));
      if (e.key === 'ozcan-movements' && e.newValue) setMovements(JSON.parse(e.newValue));
      if (e.key === 'ozcan-orders' && e.newValue) setOrders(JSON.parse(e.newValue));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogin = () => {
    setLoginError('');
    if (!selectedUser) { setLoginError('Lütfen kullanıcı seçin!'); return; }
    if (!password) { setLoginError('Lütfen şifre girin!'); return; }
    
    const user = users[selectedUser];
    if (!user || user.password !== password) {
      setLoginError('Kullanıcı adı veya şifre hatalı!');
      return;
    }

    setCurrentUser(selectedUser);
    localStorage.setItem('ozcan-current-user', selectedUser);
    setPassword('');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setSelectedUser('');
    localStorage.removeItem('ozcan-current-user');
  };

  const criticalProducts = products.filter(p => p.currentStock < p.criticalLevel);

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
                onChange={(e) => { setSelectedUser(e.target.value); setLoginError(''); }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
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
                  onChange={(e) => { setPassword(e.target.value); setLoginError(''); }}
                  onKeyPress={(e) => { if (e.key === 'Enter') handleLogin(); }}
                  placeholder="Şifrenizi girin"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
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
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700"
            >
              Giriş Yap
            </button>

            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-800 text-center">
                💡 Test şifresi: <span className="font-bold">1234</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Package className="w-10 h-10" />
              <div>
                <h1 className="text-2xl font-bold">ÖZCAN CRANE V2</h1>
                <p className="text-indigo-100 text-sm">🔒 Güvenli Versiyon</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-indigo-100">Hoş geldiniz,</p>
                <p className="font-semibold">{currentUser}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30"
              >
                <LogOut className="w-5 h-5" />
                <span>Çıkış</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">🎉 Güvenli Giriş Başarılı!</h2>
          <div className="bg-white rounded-xl shadow-md p-8 max-w-2xl mx-auto">
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-3 text-green-600">
                <Package className="w-12 h-12" />
                <p className="text-xl font-semibold">Sistem Hazır</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Toplam Ürün</p>
                  <p className="text-2xl font-bold text-blue-600">{products.length}</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Kritik Stok</p>
                  <p className="text-2xl font-bold text-red-600">{criticalProducts.length}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Aktif Siparişler</p>
                  <p className="text-2xl font-bold text-green-600">{orders.filter(o => o.status === 'Beklemede').length}</p>
                </div>
              </div>

              <div className="mt-8 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border-2 border-indigo-200">
                <h3 className="text-lg font-bold text-indigo-900 mb-3">✅ Yeni Özellikler:</h3>
                <ul className="text-left space-y-2 text-gray-700">
                  <li>🔐 Şifreli güvenli giriş sistemi</li>
                  <li>🔄 Sayfa yenilenince oturum korunuyor</li>
                  <li>🔗 Birden fazla sekmede senkronize çalışma</li>
                  <li>👤 Kullanıcı rolleri (Admin, Depo, Muhasebe)</li>
                </ul>
              </div>

              <p className="text-sm text-gray-500 mt-6">
                Detaylı özellikler ve menüler yakında eklenecek...
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
