"use client";

import { useState } from "react";
import { FLAVOR_CATEGORIES } from "../../lib/types";

interface FlavorTagPickerProps {
  selected: string[];
  onChange: (tags: string[]) => void;
  max?: number;
}

export default function FlavorTagPicker({
  selected,
  onChange,
  max = 5,
}: FlavorTagPickerProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const toggle = (tag: string) => {
    if (selected.includes(tag)) {
      onChange(selected.filter((t) => t !== tag));
    } else if (selected.length < max) {
      onChange([...selected, tag]);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-text-secondary">風味標籤</span>
        <span className="text-text-muted">{selected.length}/{max}</span>
      </div>

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {selected.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => toggle(tag)}
              className="px-2.5 py-1 bg-accent/20 text-accent text-xs rounded-full border border-accent/40 hover:bg-accent/30"
            >
              {tag} ✕
            </button>
          ))}
        </div>
      )}

      <div className="space-y-1">
        {Object.entries(FLAVOR_CATEGORIES).map(([category, tags]) => (
          <div key={category}>
            <button
              type="button"
              onClick={() =>
                setExpandedCategory(expandedCategory === category ? null : category)
              }
              className="w-full flex justify-between items-center py-2 px-3 bg-bg-input rounded-lg text-sm hover:bg-bg-card"
            >
              <span>{category}</span>
              <span className="text-text-muted text-xs">
                {tags.filter((t) => selected.includes(t)).length > 0 && (
                  <span className="text-accent mr-2">
                    {tags.filter((t) => selected.includes(t)).length}
                  </span>
                )}
                {expandedCategory === category ? "▲" : "▼"}
              </span>
            </button>
            {expandedCategory === category && (
              <div className="flex flex-wrap gap-1.5 p-2">
                {tags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggle(tag)}
                    disabled={!selected.includes(tag) && selected.length >= max}
                    className={`px-2.5 py-1 text-xs rounded-full transition-all ${
                      selected.includes(tag)
                        ? "bg-accent text-bg-primary"
                        : "bg-bg-card text-text-secondary border border-border hover:border-accent disabled:opacity-30"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
