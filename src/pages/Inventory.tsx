import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Pencil, Trash2, Search } from 'lucide-react';
import { Book } from '../types/book';
import { useInventory } from '../context/InventoryContext';
import BookModal from '../components/BookModal';
import DeleteConfirmation from '../components/DeleteConfirmation';

const Inventory: React.FC = () => {
  const navigate = useNavigate();
  const { inventory, addBook, updateBook, deleteBook } = useInventory();

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [deleteBookId, setDeleteBookId] = useState<string | null>(null);

  const filteredBooks = inventory.filter((book) => {
    const query = searchQuery.toLowerCase();
    return (
      book.bookName.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query) ||
      book.isbn.toLowerCase().includes(query) ||
      book.bookCode.toLowerCase().includes(query) ||
      book.publisher.toLowerCase().includes(query)
    );
  });

  const handleAddBook = (book: Book) => {
    addBook(book);
    setIsModalOpen(false);
  };

  const handleUpdateBook = (updatedBook: Book) => {
    updateBook(updatedBook);
    setEditingBook(null);
    setIsModalOpen(false);
  };

  const handleDeleteBook = (id: string) => {
    deleteBook(id);
    setDeleteBookId(null);
  };

  const openEditModal = (book: Book) => {
    setEditingBook(book);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBook(null);
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
                Inventory Management
              </h1>
            </div>
            <img src="/logo.png" alt="Logo" className="h-10 w-auto" />
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, author, ISBN, code, or publisher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-red-800"
            />
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-red-800 hover:bg-red-900 text-white
                       px-4 py-2 rounded-lg flex items-center gap-2
                       transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Add Book
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-700">S.No</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-700">ISBN</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-700">Book Code</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-700">Book Name</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-700">Author</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-700">Publisher</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-700">Price</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-700">Quantity</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {filteredBooks.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                      No books found. Click “Add Book” to get started.
                    </td>
                  </tr>
                ) : (
                  filteredBooks.map((book, index) => (
                    <tr key={book.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm">{index + 1}</td>
                      <td className="px-4 py-3 text-sm">{book.isbn}</td>
                      <td className="px-4 py-3 text-sm">{book.bookCode}</td>
                      <td className="px-4 py-3 text-sm">{book.bookName}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{book.author}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{book.publisher}</td>
                      <td className="px-4 py-3 text-sm">
                        Rs. {book.price.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-sm">{book.quantity}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditModal(book)}
                            className="p-1 hover:bg-amber-100 rounded"
                          >
                            <Pencil className="w-4 h-4 text-amber-700" />
                          </button>
                          <button
                            onClick={() => setDeleteBookId(book.id)}
                            className="p-1 hover:bg-red-100 rounded"
                          >
                            <Trash2 className="w-4 h-4 text-red-700" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {isModalOpen && (
        <BookModal
          book={editingBook}
          onSave={editingBook ? handleUpdateBook : handleAddBook}
          onClose={closeModal}
        />
      )}

      {deleteBookId && (
        <DeleteConfirmation
          onConfirm={() => handleDeleteBook(deleteBookId)}
          onCancel={() => setDeleteBookId(null)}
        />
      )}
    </div>
  );
};

export default Inventory;
