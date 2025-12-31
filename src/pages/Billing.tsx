import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Trash2, FileText } from 'lucide-react';
import { BillItem } from '../types/billItem';
import { Book } from '../types/book';
import { useInventory } from '../context/InventoryContext';
// Destructuring removed – inventory and reduceStock are already accessed below via useInventory()

const Billing: React.FC = () => {
  const navigate = useNavigate();
  const { inventory, reduceStock } = useInventory();

  const [searchQuery, setSearchQuery] = useState('');
  const [billItems, setBillItems] = useState<BillItem[]>([]);
  const [applyDiscount, setApplyDiscount] = useState(false);
  const [discountPercent, setDiscountPercent] = useState(0);

  const filteredInventory = inventory.filter((book) => {
    const query = searchQuery.toLowerCase();
    return (
      book.bookName.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query) ||
      book.isbn.toLowerCase().includes(query) ||
      book.bookCode.toLowerCase().includes(query)
    );
  });

  const handleSelectBook = (book: Book) => {
    const existingItem = billItems.find((item) => item.id === book.id);
    if (existingItem) return;

    const newItem: BillItem = {
      id: book.id,
      bookName: book.bookName,
      quantity: 1,
      rate: book.price,
      amount: book.price,
    };

    setBillItems([...billItems, newItem]);
  };

  const handleQuantityChange = (id: string, quantity: number) => {
    if (quantity < 1) return;
    setBillItems(
      billItems.map((item) =>
        item.id === id
          ? { ...item, quantity, amount: item.rate * quantity }
          : item
      )
    );
  };

  const handleRemoveItem = (id: string) => {
    setBillItems(billItems.filter((item) => item.id !== id));
  };

  const subtotal = billItems.reduce((sum, item) => sum + item.amount, 0);
  const discountAmount = applyDiscount ? (subtotal * discountPercent) / 100 : 0;
  const total = subtotal - discountAmount;

  const handleGenerateBill = () => {
        reduceStock(
      billItems.map(item => ({
        id: item.id,
        quantity: item.quantity
      }))
    );

    if (billItems.length === 0) {
      alert('Please add items to the bill');
      reduceStock(
  billItems.map((item) => ({
    id: item.id,
    quantity: item.quantity,
  }))
);

      return;
    }

    navigate('/bill-preview', {
      state: {
        billItems,
        subtotal,
        discountPercent: applyDiscount ? discountPercent : 0,
        discountAmount,
        total,
      },
    });
  };

  return (
    <div className="min-h-screen bg-stone-50">
      {/* HEADER */}
      <header className="bg-white border-b border-gray-200 py-4 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/home')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-700" />
              </button>

              <h1 className="font-serif text-lg font-bold text-black">
                Billing
              </h1>
            </div>

            <img src="/logo.png" alt="Logo" className="h-10 w-auto" />
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* INVENTORY */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h2 className="text-lg font-serif font-bold text-black mb-4">
              Inventory
            </h2>

            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search books..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg
                             focus:outline-none focus:ring-2 focus:ring-red-800"
                />
              </div>
            </div>

            <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-3 py-2 text-sm font-semibold text-gray-700">Book Name</th>
                    <th className="px-3 py-2 text-sm font-semibold text-gray-700">Author</th>
                    <th className="px-3 py-2 text-sm font-semibold text-gray-700">Price</th>
                    <th className="px-3 py-2 text-sm font-semibold text-gray-700">Stock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredInventory.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-3 py-6 text-center text-gray-500">
                        No books in inventory. Add books from Inventory page.
                      </td>
                    </tr>
                  ) : (
                    filteredInventory.map((book) => (
                      <tr
                        key={book.id}
                        onClick={() => handleSelectBook(book)}
                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <td className="px-3 py-2 text-sm">{book.bookName}</td>
                        <td className="px-3 py-2 text-sm text-gray-600">{book.author}</td>
                        <td className="px-3 py-2 text-sm">
                          Rs. {book.price.toFixed(2)}
                        </td>
                        <td className="px-3 py-2 text-sm">{book.quantity}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* CURRENT BILL */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h2 className="text-lg font-serif font-bold text-black mb-4">
              Current Bill
            </h2>

            <div className="mb-4">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-sm font-semibold text-gray-700">No</th>
                    <th className="px-3 py-2 text-sm font-semibold text-gray-700">Book Name</th>
                    <th className="px-3 py-2 text-sm font-semibold text-gray-700">Quantity</th>
                    <th className="px-3 py-2 text-sm font-semibold text-gray-700">Rate</th>
                    <th className="px-3 py-2 text-sm font-semibold text-gray-700">Amount</th>
                    <th className="px-3 py-2"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {billItems.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-3 py-6 text-center text-gray-500">
                        Select books from inventory to add to bill
                      </td>
                    </tr>
                  ) : (
                    billItems.map((item, index) => (
                      <tr key={item.id}>
                        <td className="px-3 py-2 text-sm">{index + 1}</td>
                        <td className="px-3 py-2 text-sm">{item.bookName}</td>
                        <td className="px-3 py-2">
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) =>
                              handleQuantityChange(item.id, parseInt(e.target.value) || 1)
                            }
                            className="w-16 px-2 py-1 border border-gray-300 rounded
                                       focus:outline-none focus:ring-2 focus:ring-red-800"
                          />
                        </td>
                        <td className="px-3 py-2 text-sm">
                          Rs. {item.rate.toFixed(2)}
                        </td>
                        <td className="px-3 py-2 text-sm">
                          Rs. {item.amount.toFixed(2)}
                        </td>
                        <td className="px-3 py-2">
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="p-1 hover:bg-red-100 rounded"
                          >
                            <Trash2 className="w-4 h-4 text-red-700" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* TOTALS */}
            <div className="border-t border-gray-200 pt-4 space-y-3">
              <div className="flex items-center gap-3 mb-3">
                <input
                  type="checkbox"
                  checked={applyDiscount}
                  onChange={(e) => {
                    setApplyDiscount(e.target.checked);
                    if (!e.target.checked) setDiscountPercent(0);
                  }}
                  className="w-4 h-4 text-red-800 border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-gray-700">
                  Apply Discount
                </span>
                {applyDiscount && (
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(Number(e.target.value) || 0)}
                    className="w-20 px-2 py-1 border border-gray-300 rounded
                               focus:outline-none focus:ring-2 focus:ring-red-800"
                    placeholder="%"
                  />
                )}
              </div>

              <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span className="font-medium">
                    Rs. {subtotal.toFixed(2)}
                  </span>
                </div>

                {applyDiscount && (
                  <div className="flex justify-between text-sm">
                    <span>Discount ({discountPercent}%):</span>
                    <span className="font-medium">
                      -Rs. {discountAmount.toFixed(2)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-lg font-serif font-bold pt-2 border-t border-gray-300">
                  <span>Total:</span>
                  <span className="text-red-800">
                    Rs. {total.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleGenerateBill}
                disabled={billItems.length === 0}
                className="w-full bg-red-800 hover:bg-red-900
                           disabled:bg-gray-300 disabled:cursor-not-allowed
                           text-white px-4 py-3 rounded-lg
                           flex items-center justify-center gap-2 font-medium"
              >
                <FileText className="w-5 h-5" />
                Generate Bill
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Billing;
