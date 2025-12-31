import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download } from 'lucide-react';
import { BillItem } from '../types/billItem';
import jsPDF from 'jspdf';

interface BillState {
  billItems: BillItem[];
  subtotal: number;
  discountPercent: number;
  discountAmount: number;
  total: number;
}

function BillPreview() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as BillState;

  if (!state || !state.billItems) {
    navigate('/billing');
    return null;
  }

  const { billItems, subtotal, discountPercent, discountAmount, total } = state;

  const billNumber = `INV-${Date.now().toString().slice(-8)}`;
  const billDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPos = 20;

    /* ===== LOGO ===== */
    const logoBase64 =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPYAAAA5CAYAAAAFrNapAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAACK1JREFUeNrsXU1y40QUbrumZovmBHH2VKFUsY8MLGAVZ0GxjH2CiU8Q+wR2TmBnyybKig1FlBNE4QIRFwCxoKBgYSyqe+ZNT7/+l62Y91V1JXGkVr/X73s/Land22w2jEAgHBb6pAICgYhNIBBeAF5988VXuv9n23bKf58b+hrwpkO1bfW2pdLnzWfltiWK/9lC9GE7DtMxhWVf2Dgyw/Ur8HfKZVeNQfd/GxSWehXjxub2Avz9wPvNDOep7Mll3K4Ybdtn4O9fti3nY3RBo6szh35s7EToSTWXsj1AJFyuI/DZHdB5Bs//4acf//uw9/XwS91g7sFkDA3KvuUDMAl3zvuVccKVOQtwVL1t+y2ABBDTbbvy7GuIyChQcnkFNpp+Gp09Bsgx5M55Zqk/GVfIuQWwjZ4lqe8dx77mAaWyIOItQq5GfxNOTBOa81eIA2r6WSIB7t7SafWQuS74PMkYb9tC4/QbO7qE5wti9y0mQ+DUcOwdv0CtMeY1n6RCUliumbza8fO1IYIUYBxYvwU4rjQcVyKy5ppzU8kIl5JO4PkujqUKmJul4vOFRGoxh67RF8pUacYuj3HMnVpqiNKPQJ8lH3MJIt4t78vkHB6BXDXvJwf9zDjxZdwYgl4B9LuUdFDy81WkXoH5X/PrF0D/lz41duqYRq251yg1EXDKhRoCA1nyKF4riHOi6e8c9KG6ji6CTZBzhaKFHLq+xHEniogmMpOpwSDhmGFGNEV0AicYm4Nzg0zMUmcqw7nmult6lkrnGr0L+5krUtF7JBoPFESb8ybLs9I4iEQiEQPReaIg3BgZu87mpkDXgtg5t5+1Qa4pH8cc2K/34lkWUB+FRBeoWFPtNvWon9rA3KMmvPDUmWlScw15XHClmbN5i7osEeKpxrNSZDQ6e1ggn79VkP5B098ioNzLAJemlrpfKhxJ7kvs08DFj1BcW0aBnHUDNx4LNIMWdOJynI3xdUXvI4X+sghyJbqUVhPhx55yiEg80wS3keJ6qqAWJWIz9uFKYZsoHCLxQ0eInUcwVhu92Ea9kEzGJpu427F+5ZX9t5FkG3lGX5/rX3JnXmucr2rVfIRkT7krsQeIsNkOiR0rpd8VatDaSsfLlo71mediDzpOApwidp5vsBo4ZlywnNCVkAmS+qcuQa3vOLEh91Nt8BTgBMo9kjrlk3a8bW8Q0vum4xVzu1csX7NuyWArnk6e71DPVQQ7lCP/KGA8LoFO3DotPdZAxAJihjjvj2zjlUN9DYVpq75q+u15nNdj+8WC6+UBiWS6B2dGTL/KXCHOwgRfwrlEofmOSV15jBFzqCXzfxhK4MjhepeWGWZtILdYrRe3W3sxIraJ9P9X2ESPPFI6vovso4uAUe6zSIQMzT5tI/bCoaY3rY80DqK53z7WXbCPGOkgUvrRRVzxFkuOsSUZbgLS8V3ikw46lrKl7GBXes8UNuMTBOC4VzyCJ7bEzgwpQ9cM0RUz3rIIBvjM1E8iYZ4Y0+mIETKuyyuFkQ9bIuTRnmQ1ZWlzB50pyd3XpNprjSFmB0DsIkL67WpgLyUd3xexx5KRiqf/6sjE3ndgMgXHhncTh75uXSL2k8b4X3KdLR45DCW2eExz5nDOS0nH94GC67JWZEVy6hr6tGHVAXlNznzNDA+hSJwdmYidAkU/HGidHQNiVXLuYCiUjuuJPUfSUPmNq/IA5B1bHLPkwaNydRR9hLAlMFwslRkQt70iAKXjZufHEHLHxtMe5Rwwu0XXhoMnFpmhNmKfgs6EwR5ind2WMdqkiF1Px586qmNbItjg90gpvW3mgHHI9rHUmmcyx4YSMjNF7OZe2YY3zNjOiM/v0NRCPT4BmYUxVBrj7UKJYQufFzFCkEZyPmWkWttWV7lD+ZVy3t0jDgK+8oyijyjOtmAnfJwu2uymkXdYhrIFeWPhKBIhYxHb9gUk7IWPhOFvcul0OjHNU18idcKF7YF2rBlUSlz2cow3HZahdjD4fc1/yNtr8rkhTrZwSMUxIl7Y1s0S5rqUv6+IwIXi4Dbq7OTASO3y+l/JuvNWmq/B7iNje4hASNmp+r5+mgde18ZuzhzmqMKIfaqpXzAhQu5nx6qXuoKzlg1jl7hpQd7YZcI8EiF9djHVpdcY1h6Recz02zmhcvUVRCscaonM09vDNL46AFKnzH1HjS6n4wUyjwn4OW7p2gMNMWopQrnuvTZT2FuNOInEQz+mEgdz5rrV8VtkLBdS39cqYo+ZfkW20BA0szTYM3DOAtTzL/lhA2Hg94aMZqDQb9fT8Ykikok5DNnzy6TPM4QUU6TOLJFMMFXoG4vyS0VEvUCCl9iU0Qd3msAw0Di6R2kcze9wO6epbEvNvuIbRJFvwEUfLbzRGymFWCHFPRRAt1c5tp+17rqMmberVY1DhXM+Bp8FoiHiaeXxLph6vy1ML82Yny2uL+/uesnwjfx0ukzZxy8Z1Aq5THvO29oRln7rVoHFe8qpZn7F47+mlHslZSJyPzVT7/Zqs6f+mtm91XXN5an5OZfS9WtpTB/suAv3Fa8Rw5c7MxFFFmKoSD0GQIATgzHY1N5djXjYynJlkd2YVqV96sHK85hSQVqxC8g5e7/CXFnqpHYYb86N9sSQ1YltqmGaPQD9zPj/ba49AXLBfgTJjpGx2Mj/ZMmjir3fMWcq8SSROITe0zZ9E0jMGjRh+hV2QvfLjpSFb5S4q3GG2prox2dbqraQmcbz7it+6Gt0CYTDA33bJoFAxCYQCERsAoFAxCYQCERsAoGA4BWpgEAIw8+ffv799se3IX1898evf//FNq9D+nh+fu5RxCYQ4uHP0A5e99g/lIoTCAQiNoFAxCYQCERsAoFAxCYQCERsAoFAxCYQCERsAoGITSAQiNgEAoGITSAQiNgEAoGITSAQsQkEAhGbQCD0QjvYROiDiE0gdA9R9wGnfcUJBErFCQTCS8C/AgwASiRQ8MdfZagAAAAASUVORK5CYII=';

    doc.addImage(logoBase64, 'PNG', pageWidth / 2 - 25, yPos, 50, 18);
    yPos += 25;

    doc.setFontSize(10);
    doc.text('123 Main Street, City, State - 123456', pageWidth / 2, yPos, { align: 'center' });
    doc.text('Phone: +91 1234567890', pageWidth / 2, yPos + 5, { align: 'center' });

    yPos += 15;
    doc.line(20, yPos, pageWidth - 20, yPos);

    doc.text(`Bill No: ${billNumber}`, 20, yPos + 10);
    doc.text(`Date: ${billDate}`, pageWidth - 20, yPos + 10, { align: 'right' });

    yPos += 25;
    doc.line(20, yPos, pageWidth - 20, yPos);

    doc.text('No', 20, yPos + 10);
    doc.text('Book Name', 35, yPos + 10);
    doc.text('Qty', 120, yPos + 10, { align: 'center' });
    doc.text('Rate', 145, yPos + 10, { align: 'right' });
    doc.text('Amount', pageWidth - 20, yPos + 10, { align: 'right' });

    yPos += 20;
    billItems.forEach((item, index) => {
      doc.text(String(index + 1), 20, yPos);
      doc.text(item.bookName, 35, yPos);
      doc.text(String(item.quantity), 120, yPos, { align: 'center' });
      doc.text(`Rs. ${item.rate.toFixed(2)}`, 145, yPos, { align: 'right' });
      doc.text(`Rs. ${item.amount.toFixed(2)}`, pageWidth - 20, yPos, { align: 'right' });
      yPos += 10;
    });

    yPos += 10;
    doc.line(20, yPos, pageWidth - 20, yPos);

    yPos += 10;
    doc.text(`Subtotal: Rs. ${subtotal.toFixed(2)}`, pageWidth - 20, yPos, { align: 'right' });

    yPos += 8;
    doc.text(
      `Discount (${discountPercent}%): - Rs. ${discountAmount.toFixed(2)}`,
      pageWidth - 20,
      yPos,
      { align: 'right' }
    );

    yPos += 8;
    doc.setFont('helvetica', 'bold');
    doc.text(`Net Total: Rs. ${total.toFixed(2)}`, pageWidth - 20, yPos, {
      align: 'right',
    });

    doc.save(`${billNumber}.pdf`);
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="bg-white border-b border-gray-200 py-4 shadow-sm">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <button onClick={() => navigate('/billing')} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <button
            onClick={handleDownloadPDF}
            className="bg-red-800 hover:bg-red-900 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg border border-gray-200">
          <div className="p-8">
            <div className="text-center mb-8 pb-6 border-b-2 border-gray-200">
              <img src="/logo.png" alt="Logo" className="h-16 w-auto mx-auto mb-3" />
              <p className="text-sm text-gray-600">123 Main Street, City, State - 123456</p>
              <p className="text-sm text-gray-600">Phone: +91 1234567890</p>
            </div>

            <table className="w-full mb-6">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-3 py-2 text-left text-sm font-semibold text-gray-700">No</th>
                  <th className="px-3 py-2 text-left text-sm font-semibold text-gray-700">Book Name</th>
                  <th className="px-3 py-2 text-center text-sm font-semibold text-gray-700">Qty</th>
                  <th className="px-3 py-2 text-right text-sm font-semibold text-gray-700">Rate</th>
                  <th className="px-3 py-2 text-right text-sm font-semibold text-gray-700">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {billItems.map((item, index) => (
                  <tr key={item.id}>
                    <td className="px-3 py-3 text-sm">{index + 1}</td>
                    <td className="px-3 py-3 text-sm">{item.bookName}</td>
                    <td className="px-3 py-3 text-center text-sm">{item.quantity}</td>
                    <td className="px-3 py-3 text-right text-sm">
                      Rs. {item.rate.toFixed(2)}
                    </td>
                    <td className="px-3 py-3 text-right text-sm">
                      Rs. {item.amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="text-right space-y-2">
              <p>Subtotal: <strong>Rs. {subtotal.toFixed(2)}</strong></p>
              <p>
                Discount ({discountPercent}%):{' '}
                <strong>- Rs. {discountAmount.toFixed(2)}</strong>
              </p>
              <p className="text-lg font-bold">
                Net Total: Rs. {total.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default BillPreview;
