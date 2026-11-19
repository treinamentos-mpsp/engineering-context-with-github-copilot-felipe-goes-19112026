"use client";

import { useId, useState, type KeyboardEvent } from "react";

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
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
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
  const activeOptionIndex =
    activeIndex !== null && activeIndex < suggestions.length ? activeIndex : null;
  const leadingWhitespace = currentToken.match(/^\s*/)?.[0] ?? "";

  function closeSuggestions() {
    setIsOpen(false);
    setActiveIndex(null);
  }

  function selectTag(tag: string) {
    onChange(`${value.slice(0, currentTokenStart)}${leadingWhitespace}${tag}`);
    closeSuggestions();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    switch (event.key) {
      case "ArrowDown":
        if (suggestions.length === 0) return;
        event.preventDefault();
        setIsOpen(true);
        setActiveIndex((current) =>
          current === null ? 0 : (current + 1) % suggestions.length,
        );
        break;
      case "ArrowUp":
        if (suggestions.length === 0) return;
        event.preventDefault();
        setIsOpen(true);
        setActiveIndex((current) =>
          current === null
            ? suggestions.length - 1
            : (current - 1 + suggestions.length) % suggestions.length,
        );
        break;
      case "Enter":
        if (showSuggestions && activeOptionIndex !== null) {
          event.preventDefault();
          selectTag(suggestions[activeOptionIndex]);
        }
        break;
      case "Escape":
        if (isOpen) {
          event.preventDefault();
          closeSuggestions();
        }
        break;
      case "Tab":
        closeSuggestions();
        break;
    }
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
        onBlur={closeSuggestions}
        onChange={(event) => {
          onChange(event.currentTarget.value);
          setIsOpen(true);
          setActiveIndex(null);
        }}
        onKeyDown={handleKeyDown}
        aria-activedescendant={
          showSuggestions && activeOptionIndex !== null
            ? `${listboxId}-option-${activeOptionIndex}`
            : undefined
        }
        role="combobox"
        type="text"
        value={value}
      />
      {showSuggestions ? (
        <div className="tag-suggestions" id={listboxId} role="listbox">
          {suggestions.map((tag, index) => (
            <button
              aria-selected={activeOptionIndex === index}
              className={activeOptionIndex === index ? "active-option" : undefined}
              id={`${listboxId}-option-${index}`}
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