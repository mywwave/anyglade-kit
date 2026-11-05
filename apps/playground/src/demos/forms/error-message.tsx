import type { Key } from "@anyglade/kit";

import { Description, ErrorMessage, Label, Tag, TagGroup } from "@anyglade/kit";
import { useMemo, useState } from "react";

export function ErrorMessageDemo() {
  const [selected, setSelected] = useState<Iterable<Key>>(new Set());
  const isInvalid = useMemo(() => Array.from(selected).length === 0, [selected]);

  return (
    <TagGroup
      selectedKeys={selected}
      selectionMode="multiple"
      onSelectionChange={(keys) => setSelected(keys)}
    >
      <Label>Required Categories</Label>
      <TagGroup.List>
        <Tag id="news">News</Tag>
        <Tag id="travel">Travel</Tag>
        <Tag id="gaming">Gaming</Tag>
        <Tag id="shopping">Shopping</Tag>
      </TagGroup.List>
      <Description>Select at least one category</Description>
      <ErrorMessage>{!!isInvalid && <>Please select at least one category</>}</ErrorMessage>
    </TagGroup>
  );
}
