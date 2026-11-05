/* oxlint-disable jsx-a11y/no-autofocus -- focus moves into the search of the popover the user just opened */
import type { Key } from "@anyglade/kit";

import {
  Autocomplete,
  Box,
  EmptyState,
  Label,
  ListBox,
  SearchField,
  Tag,
  TagGroup,
  Text,
  useFilter,
} from "@anyglade/kit";
import { useState } from "react";

export function AutocompleteDemo() {
  const [selectedKey1, setSelectedKey1] = useState<Key | null>(null);
  const [selectedKey2, setSelectedKey2] = useState<Key | null>(null);
  const [selectedKeys1, setSelectedKeys1] = useState<Key[]>([]);
  const [selectedKeys2, setSelectedKeys2] = useState<Key[]>([]);
  const { contains } = useFilter({ sensitivity: "base" });

  const items = [
    { id: "option1", name: "Option 1" },
    { id: "option2", name: "Option 2" },
    { id: "option3", name: "Option 3" },
    { id: "option4", name: "Option 4" },
  ];

  const onRemoveTags1 = (keys: Set<Key>) => {
    setSelectedKeys1((prev) => prev.filter((key) => !keys.has(key)));
  };

  const onRemoveTags2 = (keys: Set<Key>) => {
    setSelectedKeys2((prev) => prev.filter((key) => !keys.has(key)));
  };

  return (
    <Box flexDirection="column" gap="2xl">
      <Box flexDirection="column" gap="l">
        <Text as="h3" variant="heading-xxs" weight="strong">
          Single Select Variants
        </Text>
        <Box flexDirection="column" gap="l">
          <Autocomplete
            className="w-64"
            placeholder="Select one"
            selectionMode="single"
            value={selectedKey1}
            variant="primary"
            onChange={setSelectedKey1}
          >
            <Label>Primary variant</Label>
            <Autocomplete.Trigger>
              <Autocomplete.Value />
              <Autocomplete.ClearButton />
              <Autocomplete.Indicator />
            </Autocomplete.Trigger>
            <Autocomplete.Popover>
              <Autocomplete.Filter filter={contains}>
                <SearchField
                  autoFocus
                  aria-label="Search options"
                  name="search"
                  variant="secondary"
                >
                  <SearchField.Group>
                    <SearchField.SearchIcon />
                    <SearchField.Input placeholder="Search..." />
                    <SearchField.ClearButton />
                  </SearchField.Group>
                </SearchField>
                <ListBox renderEmptyState={() => <EmptyState>No results found</EmptyState>}>
                  {items.map((item) => (
                    <ListBox.Item key={item.id} id={item.id} textValue={item.name}>
                      {item.name}
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                  ))}
                </ListBox>
              </Autocomplete.Filter>
            </Autocomplete.Popover>
          </Autocomplete>
          <Autocomplete
            className="w-64"
            placeholder="Select one"
            selectionMode="single"
            value={selectedKey2}
            variant="secondary"
            onChange={setSelectedKey2}
          >
            <Label>Secondary variant</Label>
            <Autocomplete.Trigger>
              <Autocomplete.Value />
              <Autocomplete.ClearButton />
              <Autocomplete.Indicator />
            </Autocomplete.Trigger>
            <Autocomplete.Popover>
              <Autocomplete.Filter filter={contains}>
                <SearchField
                  autoFocus
                  aria-label="Search options"
                  name="search"
                  variant="secondary"
                >
                  <SearchField.Group>
                    <SearchField.SearchIcon />
                    <SearchField.Input placeholder="Search..." />
                    <SearchField.ClearButton />
                  </SearchField.Group>
                </SearchField>
                <ListBox renderEmptyState={() => <EmptyState>No results found</EmptyState>}>
                  {items.map((item) => (
                    <ListBox.Item key={item.id} id={item.id} textValue={item.name}>
                      {item.name}
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                  ))}
                </ListBox>
              </Autocomplete.Filter>
            </Autocomplete.Popover>
          </Autocomplete>
        </Box>
      </Box>
      <Box flexDirection="column" gap="l">
        <Text as="h3" variant="heading-xxs" weight="strong">
          Multiple Select Variants
        </Text>
        <Box flexDirection="column" gap="l">
          <Autocomplete
            className="w-64"
            placeholder="Select multiple"
            selectionMode="multiple"
            value={selectedKeys1}
            variant="primary"
            onChange={(keys) => setSelectedKeys1(keys as Key[])}
          >
            <Label>Primary variant</Label>
            <Autocomplete.Trigger>
              <Autocomplete.Value>
                {({ defaultChildren, isPlaceholder, state }) => {
                  if (isPlaceholder || state.selectedItems.length === 0) {
                    return defaultChildren;
                  }

                  const selectedItemsKeys = state.selectedItems.map((item) => item.key);

                  return (
                    <TagGroup size="sm" onRemove={onRemoveTags1}>
                      <TagGroup.List>
                        {selectedItemsKeys.map((selectedItemKey) => {
                          const item = items.find((s) => s.id === selectedItemKey);

                          if (!item) return null;

                          return (
                            <Tag key={item.id} id={item.id}>
                              {item.name}
                            </Tag>
                          );
                        })}
                      </TagGroup.List>
                    </TagGroup>
                  );
                }}
              </Autocomplete.Value>
              <Autocomplete.ClearButton />
              <Autocomplete.Indicator />
            </Autocomplete.Trigger>
            <Autocomplete.Popover>
              <Autocomplete.Filter filter={contains}>
                <SearchField
                  autoFocus
                  aria-label="Search options"
                  name="search"
                  variant="secondary"
                >
                  <SearchField.Group>
                    <SearchField.SearchIcon />
                    <SearchField.Input placeholder="Search..." />
                    <SearchField.ClearButton />
                  </SearchField.Group>
                </SearchField>
                <ListBox renderEmptyState={() => <EmptyState>No results found</EmptyState>}>
                  {items.map((item) => (
                    <ListBox.Item key={item.id} id={item.id} textValue={item.name}>
                      {item.name}
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                  ))}
                </ListBox>
              </Autocomplete.Filter>
            </Autocomplete.Popover>
          </Autocomplete>
          <Autocomplete
            className="w-64"
            placeholder="Select multiple"
            selectionMode="multiple"
            value={selectedKeys2}
            variant="secondary"
            onChange={(keys) => setSelectedKeys2(keys as Key[])}
          >
            <Label>Secondary variant</Label>
            <Autocomplete.Trigger>
              <Autocomplete.Value>
                {({ defaultChildren, isPlaceholder, state }) => {
                  if (isPlaceholder || state.selectedItems.length === 0) {
                    return defaultChildren;
                  }

                  const selectedItemsKeys = state.selectedItems.map((item) => item.key);

                  return (
                    <TagGroup size="sm" variant="surface" onRemove={onRemoveTags2}>
                      <TagGroup.List>
                        {selectedItemsKeys.map((selectedItemKey) => {
                          const item = items.find((s) => s.id === selectedItemKey);

                          if (!item) return null;

                          return (
                            <Tag key={item.id} id={item.id}>
                              {item.name}
                            </Tag>
                          );
                        })}
                      </TagGroup.List>
                    </TagGroup>
                  );
                }}
              </Autocomplete.Value>
              <Autocomplete.ClearButton />
              <Autocomplete.Indicator />
            </Autocomplete.Trigger>
            <Autocomplete.Popover>
              <Autocomplete.Filter filter={contains}>
                <SearchField
                  autoFocus
                  aria-label="Search options"
                  name="search"
                  variant="secondary"
                >
                  <SearchField.Group>
                    <SearchField.SearchIcon />
                    <SearchField.Input placeholder="Search..." />
                    <SearchField.ClearButton />
                  </SearchField.Group>
                </SearchField>
                <ListBox renderEmptyState={() => <EmptyState>No results found</EmptyState>}>
                  {items.map((item) => (
                    <ListBox.Item key={item.id} id={item.id} textValue={item.name}>
                      {item.name}
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                  ))}
                </ListBox>
              </Autocomplete.Filter>
            </Autocomplete.Popover>
          </Autocomplete>
        </Box>
      </Box>
    </Box>
  );
}
