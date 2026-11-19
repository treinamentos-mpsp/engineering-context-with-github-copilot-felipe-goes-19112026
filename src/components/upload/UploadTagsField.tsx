"use client";

import { useState } from "react";
import { TagAutocomplete } from "@/components/upload/TagAutocomplete";

type UploadTagsFieldProps = {
  availableTags: readonly string[];
  label: string;
};

export function UploadTagsField({ availableTags, label }: UploadTagsFieldProps) {
  const [value, setValue] = useState("");

  return (
    <TagAutocomplete
      availableTags={availableTags}
      label={label}
      onChange={setValue}
      value={value}
    />
  );
}