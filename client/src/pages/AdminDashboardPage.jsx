import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, RefreshCw, Package, Users, Layers, MessageSquare, CheckCircle, Clock } from 'lucide-react';
import Button from '../components/common/Button';
import PriceDisplay from '../components/common/PriceDisplay';
import api from '../services/api';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [consultations, setConsultations] = useState([]);
  const [consultationFilter, setConsultationFilter] = useState('All');
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState('consultations'); // 'consultations' | 'products'
  const [feedbackMsg, setFeedbackMsg] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const [statsRes, consultRes, prodRes] = await Promise.all([
        api.get('/admin/dashboard'),
        api.get('/admin/consultations'),
        api.get('/admin/products?limit=48'),
      ]);

      if (statsRes.data?.success) setStats(statsRes.data.data);
      if (consultRes.data?.success) setConsultations(consultRes.data.data.consultations || []);
      if (prodRes.data?.success) setProducts(prodRes.data.data.products || prodRes.data.data || []);
    } catch (err) {
      console.error('Failed to load admin data:', err);
      setFeedbackMsg({ type: 'error', text: 'Failed to load administrative data.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleStatusChange = async (consultationId, newStatus) => {
    try {
      setIsUpdating(true);
      const res = await api.patch(`/admin/consultations/${consultationId}/status`, {
        status: newStatus,
      });
      if (res.data?.success) {
        setConsultations((prev) =>
          prev.map((c) => (c.id === consultationId ? { ...c, status: newStatus } : c))
        );
        // Refresh stats
        const statsRes = await api.get('/admin/dashboard');
        if (statsRes.data?.success) setStats(statsRes.data.data);
        setFeedbackMsg({ type: 'success', text: `Consultation status updated to ${newStatus}.` });
        setTimeout(() => setFeedbackMsg(null), 3000);
      }
    } catch (err) {
      console.error('Failed to update consultation status:', err);
      setFeedbackMsg({ type: 'error', text: 'Failed to update consultation status.' });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleProductToggle = async (productId, field, currentValue) => {
    try {
      setIsUpdating(true);
      const res = await api.patch(`/admin/products/${productId}`, {
        [field]: !currentValue,
      });
      if (res.data?.success) {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === productId || p.productId === productId ? { ...p, [field]: !currentValue } : p
          )
        );
        setFeedbackMsg({ type: 'success', text: `Product ${field} updated.` });
        setTimeout(() => setFeedbackMsg(null), 3000);
      }
    } catch (err) {
      console.error(`Failed to update product ${field}:`, err);
      setFeedbackMsg({ type: 'error', text: `Failed to update product ${field}.` });
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredConsultations = consultations.filter((c) => {
    if (consultationFilter === 'All') return true;
    return c.status === consultationFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-sand/40 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest text-forest font-semibold flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" />
              Administrative Control Panel
            </span>
          </div>
          <h1 className="text-3xl font-serif font-semibold text-charcoal mt-1">
            Platform Operations & Pipeline
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={fetchDashboardData}
            disabled={isLoading}
            className="flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>
          <Link to="/">
            <Button variant="secondary" size="sm">
              Public Site
            </Button>
          </Link>
        </div>
      </div>

      {/* Global Feedback Banner */}
      {feedbackMsg && (
        <div
          className={`p-3 rounded text-xs font-medium ${
            feedbackMsg.type === 'error'
              ? 'bg-rose-50 text-rose-700 border border-rose-200'
              : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
          }`}
        >
          {feedbackMsg.text}
        </div>
      )}

      {/* Real-time Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card-architectural p-6 bg-white space-y-1">
          <div className="flex items-center justify-between text-taupe">
            <span className="text-[11px] uppercase tracking-wider font-semibold">Total Products</span>
            <Package className="w-4 h-4 text-forest" />
          </div>
          <span className="text-3xl font-serif font-semibold text-charcoal block">
            {stats ? stats.totalProducts : '—'}
          </span>
          <span className="text-xs text-charcoal-muted block">Handcrafted pieces cataloged</span>
        </div>

        <div className="card-architectural p-6 bg-white space-y-1">
          <div className="flex items-center justify-between text-taupe">
            <span className="text-[11px] uppercase tracking-wider font-semibold">Pending Inquiries</span>
            <MessageSquare className="w-4 h-4 text-amber-600" />
          </div>
          <span className="text-3xl font-serif font-semibold text-amber-600 block">
            {stats ? stats.pendingConsultations : '—'}
          </span>
          <span className="text-xs text-charcoal-muted block">Inquiries requiring review</span>
        </div>

        <div className="card-architectural p-6 bg-white space-y-1">
          <div className="flex items-center justify-between text-taupe">
            <span className="text-[11px] uppercase tracking-wider font-semibold">Registered Accounts</span>
            <Users className="w-4 h-4 text-forest" />
          </div>
          <span className="text-3xl font-serif font-semibold text-charcoal block">
            {stats ? stats.registeredUsers : '—'}
          </span>
          <span className="text-xs text-charcoal-muted block">Active customer profiles</span>
        </div>

        <div className="card-architectural p-6 bg-white space-y-1">
          <div className="flex items-center justify-between text-taupe">
            <span className="text-[11px] uppercase tracking-wider font-semibold">Active Design Boards</span>
            <Layers className="w-4 h-4 text-forest" />
          </div>
          <span className="text-3xl font-serif font-semibold text-charcoal block">
            {stats ? stats.activeDesignBoards : '—'}
          </span>
          <span className="text-xs text-charcoal-muted block">Customer curated suites</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-sand/40 flex items-center gap-6">
        <button
          onClick={() => setActiveTab('consultations')}
          className={`pb-3 text-sm font-medium transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'consultations'
              ? 'border-forest text-forest font-semibold'
              : 'border-transparent text-taupe hover:text-charcoal'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Consultation Pipeline ({consultations.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 text-sm font-medium transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'products'
              ? 'border-forest text-forest font-semibold'
              : 'border-transparent text-taupe hover:text-charcoal'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Catalog Management ({products.length})</span>
        </button>
      </div>

      {/* Tab 1: Consultation Pipeline */}
      {activeTab === 'consultations' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-taupe font-semibold">Filter:</span>
              {['All', 'New', 'Contacted', 'Completed'].map((st) => (
                <button
                  key={st}
                  onClick={() => setConsultationFilter(st)}
                  className={`px-3 py-1 text-xs rounded transition-colors ${
                    consultationFilter === st
                      ? 'bg-forest text-cream font-medium'
                      : 'bg-sand/30 text-charcoal hover:bg-sand/50'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
            <span className="text-xs text-charcoal-muted">
              Showing {filteredConsultations.length} inquiries
            </span>
          </div>

          <div className="card-architectural bg-white overflow-hidden shadow-subtle border border-sand/40">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-sand/20 border-b border-sand/40 text-taupe uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="p-3">Ref Code</th>
                    <th className="p-3">Client</th>
                    <th className="p-3">Room & Style</th>
                    <th className="p-3">Budget</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Pipeline Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sand/30">
                  {filteredConsultations.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="p-6 text-center text-charcoal-muted">
                        No consultation inquiries found.
                      </td>
                    </tr>
                  ) : (
                    filteredConsultations.map((item) => (
                      <tr key={item.id} className="hover:bg-sand/5 transition-colors">
                        <td className="p-3 font-mono font-semibold text-charcoal">
                          {item.referenceCode}
                        </td>
                        <td className="p-3">
                          <div className="font-semibold text-charcoal">{item.fullName}</div>
                          <div className="text-charcoal-muted text-[11px]">{item.email}</div>
                          {item.phone && <div className="text-charcoal-muted text-[11px]">{item.phone}</div>}
                        </td>
                        <td className="p-3">
                          <span className="font-medium text-charcoal">{item.roomType}</span>
                          <span className="text-charcoal-muted block text-[11px]">{item.preferredStyle}</span>
                        </td>
                        <td className="p-3 text-charcoal">{item.budgetRange}</td>
                        <td className="p-3">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                              item.status === 'New'
                                ? 'bg-amber-100 text-amber-800'
                                : item.status === 'Contacted'
                                ? 'bg-sky-100 text-sky-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <select
                            value={item.status}
                            disabled={isUpdating}
                            onChange={(e) => handleStatusChange(item.id, e.target.value)}
                            className="text-xs border border-sand rounded px-2 py-1 bg-white text-charcoal font-medium focus:outline-none focus:border-forest"
                          >
                            <option value="New">Mark New</option>
                            <option value="Contacted">Mark Contacted</option>
                            <option value="Completed">Mark Completed</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Catalog Management */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="card-architectural bg-white overflow-hidden shadow-subtle border border-sand/40">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-sand/20 border-b border-sand/40 text-taupe uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="p-3">Product</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Base Price</th>
                    <th className="p-3">Customizable</th>
                    <th className="p-3">In Stock</th>
                    <th className="p-3">Featured</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sand/30">
                  {products.map((prod) => (
                    <tr key={prod.id || prod.productId} className="hover:bg-sand/5 transition-colors">
                      <td className="p-3">
                        <div className="font-semibold text-charcoal">{prod.name}</div>
                        <div className="text-[11px] font-mono text-charcoal-muted">
                          {prod.id || prod.productId}
                        </div>
                      </td>
                      <td className="p-3 text-charcoal">{prod.category}</td>
                      <td className="p-3">
                        <PriceDisplay amount={prod.basePrice} size="sm" />
                      </td>
                      <td className="p-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                            prod.customizable
                              ? 'bg-forest/10 text-forest'
                              : 'bg-sand/40 text-charcoal-muted'
                          }`}
                        >
                          {prod.customizable ? 'Bespoke' : 'Fixed'}
                        </span>
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() =>
                            handleProductToggle(
                              prod.id || prod.productId,
                              'inStock',
                              prod.inStock
                            )
                          }
                          disabled={isUpdating}
                          className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                            prod.inStock
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                          }`}
                        >
                          {prod.inStock ? 'In Stock' : 'Out of Stock'}
                        </button>
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() =>
                            handleProductToggle(
                              prod.id || prod.productId,
                              'featured',
                              prod.featured
                            )
                          }
                          disabled={isUpdating}
                          className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                            prod.featured
                              ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                              : 'bg-sand/30 text-charcoal-muted hover:bg-sand/50'
                          }`}
                        >
                          {prod.featured ? 'Featured' : 'Standard'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
