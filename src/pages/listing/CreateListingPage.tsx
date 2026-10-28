import { ImagePlus, X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import type { Category, ItemCondition } from '../../types';

const categories: Category[] = ['Cycle', 'Calculator', 'Books', 'Electronics', 'Furniture', 'Sports', 'Other'];
const conditions: ItemCondition[] = ['Like New', 'Good', 'Fair', 'Poor'];

export default function CreateListingPage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('Calculator');
  const [condition, setCondition] = useState<ItemCondition>('Good');
  const [description, setDescription] = useState('');
  const [startingPrice, setStartingPrice] = useState('');
  const [minIncrement, setMinIncrement] = useState('');
  const [closingDate, setClosingDate] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleAddPhoto = () => {
    // Demo: use a placeholder image
    if (photos.length >= 5) return;
    const placeholders = [
      'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=200&q=80',
      'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=200&q=80',
      'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=200&q=80',
    ];
    setPhotos([...photos, placeholders[photos.length % placeholders.length]]);
  };

  const removePhoto = (idx: number) => {
    setPhotos(photos.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!title || !description || !startingPrice || !minIncrement || !closingDate) {
      setError('Please fill in all required fields');
      return;
    }
    setSuccess(true);
    setTimeout(() => navigate('/seller-dashboard'), 1500);
  };

  return (
    <div className="flex flex-1">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-2xl px-4 py-8 lg:px-8">
          <h1 className="text-2xl font-bold text-surface-900 mb-8">Create a New Listing</h1>

          {success && (
            <div className="mb-6 rounded-xl bg-success-500/10 border border-success-500/20 px-5 py-4 text-sm text-success-600 font-medium animate-fade-in">
              ✓ Listing created successfully! Redirecting...
            </div>
          )}

          {error && (
            <div className="mb-6 rounded-xl bg-danger-500/10 px-5 py-4 text-sm text-danger-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-6 animate-fade-in">
            {/* Title */}
            <div>
              <label htmlFor="listing-title" className="mb-1.5 block text-sm font-medium text-surface-700">
                Title <span className="text-danger-500">*</span>
              </label>
              <input
                id="listing-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Scientific Calculator"
                className="w-full rounded-xl border border-surface-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
              />
            </div>

            {/* Category + Condition */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="listing-category" className="mb-1.5 block text-sm font-medium text-surface-700">
                  Category <span className="text-danger-500">*</span>
                </label>
                <select
                  id="listing-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                  className="w-full rounded-xl border border-surface-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="listing-condition" className="mb-1.5 block text-sm font-medium text-surface-700">
                  Condition <span className="text-danger-500">*</span>
                </label>
                <select
                  id="listing-condition"
                  value={condition}
                  onChange={(e) => setCondition(e.target.value as ItemCondition)}
                  className="w-full rounded-xl border border-surface-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                >
                  {conditions.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="listing-description" className="mb-1.5 block text-sm font-medium text-surface-700">
                Description <span className="text-danger-500">*</span>
              </label>
              <textarea
                id="listing-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the item, its condition, and any defects..."
                rows={4}
                className="w-full resize-none rounded-xl border border-surface-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
              />
            </div>

            {/* Price + Increment */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="listing-price" className="mb-1.5 block text-sm font-medium text-surface-700">
                  Starting Price (₹) <span className="text-danger-500">*</span>
                </label>
                <input
                  id="listing-price"
                  type="number"
                  value={startingPrice}
                  onChange={(e) => setStartingPrice(e.target.value)}
                  placeholder="300"
                  min="1"
                  className="w-full rounded-xl border border-surface-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                />
              </div>
              <div>
                <label htmlFor="listing-increment" className="mb-1.5 block text-sm font-medium text-surface-700">
                  Minimum Increment (₹) <span className="text-danger-500">*</span>
                </label>
                <input
                  id="listing-increment"
                  type="number"
                  value={minIncrement}
                  onChange={(e) => setMinIncrement(e.target.value)}
                  placeholder="20"
                  min="1"
                  className="w-full rounded-xl border border-surface-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                />
              </div>
            </div>

            {/* Closing date */}
            <div>
              <label htmlFor="listing-closing" className="mb-1.5 block text-sm font-medium text-surface-700">
                Closing Date & Time <span className="text-danger-500">*</span>
              </label>
              <input
                id="listing-closing"
                type="datetime-local"
                value={closingDate}
                onChange={(e) => setClosingDate(e.target.value)}
                className="w-full rounded-xl border border-surface-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
              />
            </div>

            {/* Photos */}
            <div>
              <label className="mb-2 block text-sm font-medium text-surface-700">
                Photos (Max 5)
              </label>
              <div className="flex flex-wrap gap-3">
                {photos.map((src, i) => (
                  <div
                    key={i}
                    className="relative h-20 w-20 overflow-hidden rounded-xl border border-surface-200 shadow-sm"
                  >
                    <img src={src} alt="" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removePhoto(i)}
                      className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-danger-500 text-white shadow-sm"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
                {photos.length < 5 && (
                  <button
                    type="button"
                    onClick={handleAddPhoto}
                    className="flex h-20 w-20 items-center justify-center rounded-xl border-2 border-dashed border-surface-300 text-surface-400 transition hover:border-primary-400 hover:text-primary-500"
                  >
                    <ImagePlus size={24} />
                  </button>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="mt-2 w-full rounded-xl bg-primary-500 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary-500/25 transition hover:bg-primary-600 hover:shadow-xl hover:shadow-primary-500/30 active:scale-[0.98]"
            >
              Create Listing
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
