import { useState } from 'react';
import { useCategories, useCreateCategory, useDeleteCategory } from '../hooks/useCategories';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Trash2, Plus, X } from 'lucide-react';

const DEFAULT_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#FFD93D',
  '#FF69B4', '#87CEEB', '#DDA15E', '#BC6C25', '#6A4C93',
];

const DEFAULT_ICONS = [
  '🍔', '🛒', '🚗', '💡', '🎬', '🛍️', '🏥', '📚', '✈️', '🛡️',
  '🏠', '📱', '💪', '🔄', '🎁', '💇', '🐕', '💼', '💻', '🎉',
  '📈', '🏘️', '💰', '📌',
];

export default function Categories() {
  const [newCategoryType, setNewCategoryType] = useState<'income' | 'expense' | 'transfer'>('expense');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('📌');
  const [selectedColor, setSelectedColor] = useState('#FF6B6B');
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const { data: expenseData, isLoading: expenseLoading } = useCategories('expense');
  const { data: incomeData, isLoading: incomeLoading } = useCategories('income');
  const { data: transferData, isLoading: transferLoading } = useCategories('transfer');
  const createCategoryMutation = useCreateCategory();
  const deleteCategoryMutation = useDeleteCategory();

  const expenseCategories = expenseData?.data || [];
  const incomeCategories = incomeData?.data || [];
  const transferCategories = transferData?.data || [];

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;

    try {
      await createCategoryMutation.mutateAsync({
        name: newCategoryName,
        type: newCategoryType,
        icon: selectedIcon,
        color: selectedColor,
      });
      setNewCategoryName('');
      setSelectedIcon('📌');
      setSelectedColor('#FF6B6B');
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteCategoryMutation.mutateAsync(id);
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  const renderCategoryList = (categories: any[], type: string) => {
    const defaultCategories = categories.filter((c: any) => c.isDefault);
    const customCategories = categories.filter((c: any) => !c.isDefault);

    return (
      <div className="space-y-4">
        {defaultCategories.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Default Categories</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {defaultCategories.map((cat: any) => (
                <div
                  key={cat.id}
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-gray-50"
                >
                  <div
                    className="w-10 h-10 rounded flex items-center justify-center text-lg"
                    style={{ backgroundColor: cat.color || '#E5E7EB' }}
                  >
                    {cat.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">{cat.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {customCategories.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Custom Categories</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {customCategories.map((cat: any) => (
                <div
                  key={cat.id}
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-white hover:shadow-sm transition-shadow"
                >
                  <div
                    className="w-10 h-10 rounded flex items-center justify-center text-lg"
                    style={{ backgroundColor: cat.color || '#E5E7EB' }}
                  >
                    {cat.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">{cat.name}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteCategory(cat.id)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                    disabled={deleteCategoryMutation.isPending}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {categories.length === 0 && (
          <p className="text-gray-500 text-center py-4">No categories yet</p>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
        <p className="text-gray-600 mt-1">Manage expense and income categories</p>
      </div>

      {/* Add Category Card */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Category</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Type</label>
              <select
                value={newCategoryType}
                onChange={(e) => setNewCategoryType(e.target.value as 'income' | 'expense' | 'transfer')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
                <option value="transfer">Transfer</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Category Name</label>
              <Input
                type="text"
                placeholder="e.g., Coffee"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Icon</label>
              <button
                onClick={() => setShowIconPicker(!showIconPicker)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-2xl flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                {selectedIcon}
              </button>
              {showIconPicker && (
                <div className="absolute z-10 bg-white border border-gray-300 rounded-lg p-3 mt-2 grid grid-cols-8 gap-2 shadow-lg max-w-sm">
                  {DEFAULT_ICONS.map((icon) => (
                    <button
                      key={icon}
                      onClick={() => {
                        setSelectedIcon(icon);
                        setShowIconPicker(false);
                      }}
                      className="text-2xl p-2 hover:bg-gray-100 rounded transition-colors"
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Color</label>
              <button
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                style={{ backgroundColor: selectedColor, opacity: 0.2 }}
              >
                <div
                  className="w-6 h-6 rounded border border-gray-400"
                  style={{ backgroundColor: selectedColor }}
                />
              </button>
              {showColorPicker && (
                <div className="absolute z-10 bg-white border border-gray-300 rounded-lg p-3 mt-2 grid grid-cols-5 gap-2 shadow-lg">
                  {DEFAULT_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => {
                        setSelectedColor(color);
                        setShowColorPicker(false);
                      }}
                      className="w-8 h-8 rounded border-2 hover:scale-110 transition-transform"
                      style={{ backgroundColor: color, borderColor: selectedColor === color ? '#000' : '#ddd' }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          <Button
            onClick={handleAddCategory}
            disabled={!newCategoryName.trim() || createCategoryMutation.isPending}
            className="w-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2"
          >
            <Plus size={18} />
            {createCategoryMutation.isPending ? 'Adding...' : 'Add Category'}
          </Button>
        </CardContent>
      </Card>

      {/* Expense Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Expense Categories</CardTitle>
        </CardHeader>
        <CardContent>
          {expenseLoading ? (
            <p className="text-gray-500">Loading...</p>
          ) : (
            renderCategoryList(expenseCategories, 'expense')
          )}
        </CardContent>
      </Card>

      {/* Income Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Income Categories</CardTitle>
        </CardHeader>
        <CardContent>
          {incomeLoading ? (
            <p className="text-gray-500">Loading...</p>
          ) : (
            renderCategoryList(incomeCategories, 'income')
          )}
        </CardContent>
      </Card>

      {/* Transfer Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Transfer Categories</CardTitle>
        </CardHeader>
        <CardContent>
          {transferLoading ? (
            <p className="text-gray-500">Loading...</p>
          ) : (
            renderCategoryList(transferCategories, 'transfer')
          )}
        </CardContent>
      </Card>
    </div>
  );
}
