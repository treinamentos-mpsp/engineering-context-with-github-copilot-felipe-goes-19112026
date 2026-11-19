"use client";

import { useId, useState } from "react";

type TagAutocompleteProps = {
  availableTags: readonly string[];
  label: string;
  value: string;
  onChange: (value: string) => void;
};

export function TagAutocomplete({
  availableTags,
  label,
  value,
  onChange,
}: TagAutocompleteProps) {
  const listboxId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const currentTokenStart = value.lastIndexOf(",") + 1;
  const currentToken = value.slice(currentTokenStart);
  const search = currentToken.trim().toLowerCase();
  const previousTags = currentTokenStart > 0 ? value.slice(0, currentTokenStart - 1) : "";
  const selectedTags = previousTags
    .split(",")
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean);
  const suggestions = search
    ? availableTags.filter((tag) => {
        const normalizedTag = tag.toLowerCase();
        return normalizedTag.startsWith(search) && !selectedTags.includes(normalizedTag);
      })
    : [];
  const showSuggestions = isOpen && suggestions.length > 0;
  const leadingWhitespace = currentToken.match(/^\s*/)?.[0] ?? "";

  function selectTag(tag: string) {
    onChange(`${value.slice(0, currentTokenStart)}${leadingWhitespace}${tag}`);
    setIsOpen(false);
  }

  return (
    <div className="tag-autocomplete">
      <input
        aria-autocomplete="list"
        aria-controls={showSuggestions ? listboxId : undefined}
        aria-expanded={showSuggestions}
        aria-label={label}
        autoComplete="off"
        name="tags"
        onBlur={() => setIsOpen(false)}
        onChange={(event) => {
          onChange(event.currentTarget.value);
          setIsOpen(true);
        }}
        role="combobox"
        type="text"
        value={value}
      />
      {showSuggestions ? (
        <div className="tag-suggestions" id={listboxId} role="listbox">
          {suggestions.map((tag) => (
            <button
              aria-selected="false"
              key={tag}
              onClick={() => selectTag(tag)}
              onMouseDown={(event) => event.preventDefault()}
              role="option"
              tabIndex={-1}
              type="button"
            >
              {tag}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}