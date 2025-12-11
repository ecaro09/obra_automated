import React, { useState } from 'react';
import { X, Trash2, Printer, Plus, Minus, User, MapPin, Phone, Mail, Ruler, FileText, Download } from 'lucide-react';
import { CartItem } from '@/types';
import { getImageUrl } from '@/utils/imageUtils';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  updateQty: (id: string, delta: number) => void;
  remove: (id: string) => void;
}

export const QuoteModal: React.FC<QuoteModalProps> = ({ isOpen, onClose, cart, updateQty, remove }) => {
  const [clientDetails, setClientDetails] = useState({
    name: '',
    address: '',
    email: '',
    phone: ''
  });
  
  const [financials, setFinancials] = useState({
    discount: 0,
    delivery: 0
  });

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + (item.finalPrice * item.quantity), 0);
  const grandTotal = Math.max(0, subtotal + financials.delivery - financials.discount);

  const handlePrint = () => {
    window.print();
  };

  const handleClientChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setClientDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleFinancialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFinancials(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-0 pt-4 pb-20 text-center sm:block sm:p-0">
        
        {/* Overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-slate-900 bg-opacity-75 print:hidden" 
          onClick={onClose}
        ></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        {/* Modal Panel */}
        <div 
          className="inline-block w-full max-w-5xl text-left align-bottom transition-all transform bg-white rounded-t-2xl sm:rounded-2xl shadow-xl sm:my-8 sm:align-middle overflow-hidden h-[90vh] sm:h-auto flex flex-col" 
          id="printable-section"
        >
          
          {/* Screen Header (Hidden on Print) */}
          <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50 no-print">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-800">Quotation Preview</h3>
              <p className="text-xs sm:text-sm text-slate-500">Review details before printing.</p>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors bg-white p-2 rounded-full shadow-sm hover:shadow-md">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="overflow-y-auto flex-grow p-4 sm:p-8 bg-white print:p-0 print:overflow-visible">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start mb-6 sm:mb-8 pb-6 sm:pb-8 border-b-2 border-teal-600">
              <div className="mb-6 md:mb-0 w-full md:w-auto">
                <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">OBRA FURNITURE</h1>
                <p className="text-slate-600 font-medium mt-1">Professional Furniture Solutions</p>
                <div className="mt-4 text-xs sm:text-sm text-slate-500 space-y-1">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    12 Santan St. Quezon City, Metro Manila Philippines 1116
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    obrafurniture@gmail.com
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    (Viber) +63 915 743 9188
                  </div>
                </div>
              </div>
              <div className="text-left md:text-right w-full md:w-auto bg-slate-50 p-4 rounded-lg print:bg-transparent print:p-0">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-800 uppercase tracking-widest text-teal-700">Quotation</h2>
                <p className="text-sm font-semibold text-slate-600 mt-1">#{Math.floor(Date.now() / 1000)}</p>
                <p className="text-sm text-slate-500 mt-1">{currentDate}</p>
              </div>
            </div>

            {/* Client Details Form */}
            <div className="bg-slate-50 p-4 sm:p-6 rounded-xl border border-slate-100 mb-8 print:bg-transparent print:border-none print:p-0">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-b pb-2">Bill To</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="print:hidden space-y-3">
                  <input
                    type="text"
                    name="name"
                    placeholder="Client Name"
                    value={clientDetails.name}
                    onChange={handleClientChange}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                  <input
                    type="text"
                    name="phone"
                    placeholder="Phone Number"
                    value={clientDetails.phone}
                    onChange={handleClientChange}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={clientDetails.email}
                    onChange={handleClientChange}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                  <textarea
                    name="address"
                    placeholder="Billing Address"
                    rows={2}
                    value={clientDetails.address}
                    onChange={handleClientChange}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none resize-none"
                  />
                </div>
                
                {/* Print View for Client Details */}
                <div className="hidden print:block space-y-1">
                  <p className="font-bold text-lg">{clientDetails.name || "_________________"}</p>
                  <p>{clientDetails.address || "_________________"}</p>
                  <p>{clientDetails.phone || "_________________"}</p>
                  <p>{clientDetails.email || "_________________"}</p>
                </div>
              </div>
            </div>

            {/* Cart Items Table */}
            <div className="mb-8 overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px] sm:min-w-full">
                <thead>
                  <tr className="border-b-2 border-slate-200">
                    <th className="py-3 px-2 text-xs font-bold text-slate-500 uppercase tracking-wider w-16">Image</th>
                    <th className="py-3 px-2 text-xs font-bold text-slate-500 uppercase tracking-wider">Item Details</th>
                    <th className="py-3 px-2 text-xs font-bold text-slate-500 uppercase tracking-wider text-right w-24">Unit Price</th>
                    <th className="py-3 px-2 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-20">Qty</th>
                    <th className="py-3 px-2 text-xs font-bold text-slate-500 uppercase tracking-wider text-right w-28">Total</th>
                    <th className="py-3 px-2 w-10 no-print"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {cart.map((item) => (
                    <tr key={`${item.id}-${JSON.stringify(item.selectedVariants)}`}>
                      <td className="py-4 px-2 align-top">
                        <div className="w-12 h-12 bg-slate-50 rounded-lg border border-slate-200 overflow-hidden flex items-center justify-center">
                          <img 
                            src={getImageUrl(item.image)} 
                            alt={item.name} 
                            className="w-full h-full object-contain mix-blend-multiply" 
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://placehold.co/100x100?text=IMG";
                            }}
                          />
                        </div>
                      </td>
                      <td className="py-4 px-2 align-top">
                        <p className="font-bold text-slate-800 text-sm">{item.name}</p>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2 print:line-clamp-none">{item.description}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                           <span className="inline-flex items-center text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
                             ID: {item.id}
                           </span>
                           {item.dimensions && (
                             <span className="inline-flex items-center text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
                               <Ruler className="w-3 h-3 mr-1" /> {item.dimensions}
                             </span>
                           )}
                           {item.selectedVariants && Object.entries(item.selectedVariants).map(([key, value]) => (
                             <span key={key} className="inline-flex items-center text-[10px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded border border-indigo-100">
                               {key}: {value}
                             </span>
                           ))}
                        </div>
                      </td>
                      <td className="py-4 px-2 text-right align-top text-sm font-medium text-slate-600">
                        ₱{item.finalPrice.toLocaleString(undefined, {minimumFractionDigits: 2})}
                      </td>
                      <td className="py-4 px-2 align-top">
                        <div className="flex items-center justify-center gap-2 no-print bg-slate-50 rounded-lg p-1">
                          <button onClick={() => updateQty(item.id, -1)} className="p-1 hover:bg-white rounded shadow-sm text-slate-500"><Minus className="w-3 h-3" /></button>
                          <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                          <button onClick={() => updateQty(item.id, 1)} className="p-1 hover:bg-white rounded shadow-sm text-slate-500"><Plus className="w-3 h-3" /></button>
                        </div>
                        <div className="hidden print:block text-center font-bold text-sm">{item.quantity}</div>
                      </td>
                      <td className="py-4 px-2 text-right align-top font-bold text-slate-900 text-sm">
                        ₱{(item.finalPrice * item.quantity).toLocaleString(undefined, {minimumFractionDigits: 2})}
                      </td>
                      <td className="py-4 px-2 text-right align-top no-print">
                        <button onClick={() => remove(item.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {cart.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400 italic">No items in quotation.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Totals Section */}
            <div className="flex flex-col sm:flex-row justify-end border-t-2 border-slate-900 pt-6">
              <div className="w-full sm:w-72 space-y-3">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-medium">₱{subtotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                </div>
                
                <div className="flex justify-between items-center text-sm text-slate-600 no-print">
                  <span>Discount:</span>
                  <div className="flex items-center gap-1 w-24">
                     <span className="text-slate-400">₱</span>
                     <input 
                       type="number" 
                       name="discount"
                       value={financials.discount} 
                       onChange={handleFinancialChange}
                       className="w-full border-b border-slate-300 focus:border-teal-500 outline-none text-right bg-transparent"
                     />
                  </div>
                </div>
                {financials.discount > 0 && (
                  <div className="hidden print:flex justify-between text-sm text-slate-600">
                    <span>Discount:</span>
                    <span>- ₱{financials.discount.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                  </div>
                )}

                <div className="flex justify-between items-center text-sm text-slate-600 no-print">
                  <span>Delivery Fee:</span>
                  <div className="flex items-center gap-1 w-24">
                     <span className="text-slate-400">₱</span>
                     <input 
                       type="number" 
                       name="delivery"
                       value={financials.delivery} 
                       onChange={handleFinancialChange}
                       className="w-full border-b border-slate-300 focus:border-teal-500 outline-none text-right bg-transparent"
                     />
                  </div>
                </div>
                 {financials.delivery > 0 && (
                  <div className="hidden print:flex justify-between text-sm text-slate-600">
                    <span>Delivery Fee:</span>
                    <span>₱{financials.delivery.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                  </div>
                )}

                <div className="flex justify-between text-xl font-black text-slate-900 pt-3 border-t border-slate-200 mt-2">
                  <span>Total:</span>
                  <span className="text-teal-700">₱{grandTotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                </div>
              </div>
            </div>

            {/* Terms & Footer */}
            <div className="mt-12 pt-8 border-t border-slate-100 text-xs text-slate-500">
              <h4 className="font-bold text-slate-700 mb-2 uppercase">Terms & Conditions</h4>
              <ul className="list-disc pl-4 space-y-1">
                <li>Quotation validity: 30 days from the date of issue.</li>
                <li>Payment terms: 50% down payment required to confirm order, balance upon delivery.</li>
                <li>Lead time: 7-14 working days depending on stock availability.</li>
                <li>Warranty: 1 year warranty on manufacturing defects.</li>
              </ul>
              <div className="mt-8 text-center font-medium print:mt-16">
                Thank you for your business!
              </div>
            </div>

          </div>

          {/* Action Buttons (Fixed Bottom on Mobile) */}
          <div className="bg-slate-50 p-4 border-t border-slate-200 flex flex-col sm:flex-row justify-end gap-3 no-print">
            <button 
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-white hover:shadow-sm transition-all"
            >
              Close
            </button>
            <button 
              onClick={handlePrint}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 text-white font-bold hover:bg-teal-600 hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Printer className="w-5 h-5" />
              <span>Print / Download PDF</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};