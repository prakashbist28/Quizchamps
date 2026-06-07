import { useState } from 'react';
import { FiX, FiPlus } from 'react-icons/fi';
import { CATEGORIES, TAGS_BY_CATEGORY } from '../../constants/quizCategories';

const inputCls =
  'w-full p-3 bg-transparent border border-gray-300 dark:border-gray-600 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm';

const selectCls =
  'w-full dark:bg-slate-800 p-3 bg-transparent border border-blue-400 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500';

const CategoryTagSelector = ({
  category,
  customCategory,
  tags,
  onCategoryChange,
  onCustomCategoryChange,
  onTagsChange,
  disabled = false,
}) => {
  const [customTagInput, setCustomTagInput] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const allTagsForCategory = TAGS_BY_CATEGORY[category] || [];
  const predefined = allTagsForCategory.filter((t) => t !== 'Other');
  const hasOtherOption = allTagsForCategory.includes('Other');

  const handleCategoryChange = (cat) => {
    onCategoryChange(cat);
    onTagsChange([]);
    onCustomCategoryChange('');
    setShowCustomInput(false);
    setCustomTagInput('');
  };

  const toggleTag = (tag) => {
    if (disabled) return;
    if (tags.includes(tag)) {
      onTagsChange(tags.filter((t) => t !== tag));
    } else if (tags.length < 10) {
      onTagsChange([...tags, tag]);
    }
  };

  const addCustomTag = () => {
    const trimmed = customTagInput.trim();
    if (!trimmed || trimmed.toLowerCase() === 'other') return;
    if (tags.some((t) => t.toLowerCase() === trimmed.toLowerCase())) {
      setCustomTagInput('');
      return;
    }
    if (tags.length >= 10) return;
    onTagsChange([...tags, trimmed]);
    setCustomTagInput('');
  };

  const removeTag = (tag) => {
    if (disabled) return;
    onTagsChange(tags.filter((t) => t !== tag));
  };

  return (
    <div className="space-y-6 text-left">
      {/* ── Category ── */}
      <div>
        <label className="block text-sm font-nine font-semibold text-gray-600 dark:text-gray-400 mb-2">
          Category <span className="text-red-400">*</span>
        </label>

        <select
          value={category}
          onChange={(e) => handleCategoryChange(e.target.value)}
          disabled={disabled}
          required
          className={selectCls}
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {category === 'Other' && (
          <div className="mt-3">
            <input
              type="text"
              value={customCategory}
              onChange={(e) => onCustomCategoryChange(e.target.value)}
              placeholder="Specify your category (e.g. Cooking, Philosophy)"
              disabled={disabled}
              required
              maxLength={60}
              className={inputCls}
            />
            <p className="text-xs text-gray-400 font-nine mt-1">
              Describe your category in a few words.
            </p>
          </div>
        )}
      </div>

      {/* ── Tags ── */}
      <div>
        <label className="block text-sm font-nine font-semibold text-gray-600 dark:text-gray-400 mb-2">
          Tags{' '}
          <span className="font-normal text-gray-400">(optional · max 10)</span>
        </label>

        {/* Selected tags chips */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500 text-white text-xs font-nine font-semibold rounded-full"
              >
                {tag}
                {!disabled && (
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:text-blue-200 transition"
                    aria-label={`Remove ${tag}`}
                  >
                    <FiX className="size-3" />
                  </button>
                )}
              </span>
            ))}
          </div>
        )}

        {/* Predefined tag chips */}
        {predefined.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {predefined.map((tag) => {
              const selected = tags.includes(tag);
              const maxed = !selected && tags.length >= 10;
              return (
                <button
                  key={tag}
                  type="button"
                  disabled={disabled || maxed}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1.5 rounded-full text-xs font-nine font-semibold border transition duration-200 ${
                    selected
                      ? 'bg-blue-500 border-blue-500 text-white'
                      : maxed
                      ? 'bg-transparent border-gray-200 dark:border-gray-700 text-gray-300 dark:text-gray-600 cursor-not-allowed'
                      : 'bg-transparent border-blue-200 dark:border-blue-800 text-gray-600 dark:text-gray-300 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-300'
                  }`}
                >
                  {tag}
                </button>
              );
            })}

            {/* "Other" opens custom input */}
            {hasOtherOption && tags.length < 10 && (
              <button
                type="button"
                disabled={disabled}
                onClick={() => setShowCustomInput((p) => !p)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-nine font-semibold border transition duration-200 ${
                  showCustomInput
                    ? 'bg-gray-600 border-gray-600 text-white dark:bg-gray-700'
                    : 'bg-transparent border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-blue-400'
                }`}
              >
                <FiPlus className="size-3" />
                Other
              </button>
            )}
          </div>
        )}

        {/* "Other" category — no predefined tags, show add button directly */}
        {category === 'Other' && !showCustomInput && tags.length < 10 && (
          <button
            type="button"
            disabled={disabled}
            onClick={() => setShowCustomInput(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-nine font-semibold border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-blue-400 transition mb-3"
          >
            <FiPlus className="size-3" />
            Add custom tag
          </button>
        )}

        {/* Custom tag text input */}
        {showCustomInput && tags.length < 10 && (
          <div className="flex gap-2 mt-1 mb-3">
            <input
              type="text"
              value={customTagInput}
              onChange={(e) => setCustomTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addCustomTag();
                }
              }}
              placeholder="Type a custom tag and press Enter"
              disabled={disabled}
              maxLength={40}
              className="flex-1 p-2.5 bg-transparent border border-gray-300 dark:border-blue-700 dark:text-white rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={addCustomTag}
              disabled={disabled || !customTagInput.trim()}
              className="px-4 py-2.5 bg-blue-500 text-white text-sm font-nine font-semibold rounded-md border border-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Add
            </button>
          </div>
        )}

        {/* Tag count hint */}
        <p className="text-xs text-gray-400 font-nine mt-1">
          {tags.length >= 10
            ? 'Maximum 10 tags reached.'
            : tags.length > 0
            ? `${tags.length} / 10 tags selected`
            : 'Select tags that best describe this quiz.'}
        </p>
      </div>
    </div>
  );
};

export default CategoryTagSelector;
