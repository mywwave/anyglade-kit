import { Box, Label, ScrollShadow, SearchField, Text } from "@anyglade/kit";
import * as icons from "@anyglade/kit/icons";
import { useState } from "react";

const allIcons = Object.entries(icons);

export function GravityIconsDemo() {
  const [query, setQuery] = useState("");
  const normalized = query.trim().toLowerCase();
  const found = allIcons.filter(([name]) => name.toLowerCase().includes(normalized));

  return (
    <Box flexDirection="column" gap="l">
      <SearchField className="max-w-xs" value={query} onChange={setQuery}>
        <Label>
          {found.length} of {allIcons.length} icons
        </Label>
        <SearchField.Group>
          <SearchField.SearchIcon />
          <SearchField.Input placeholder="Search icons" />
          <SearchField.ClearButton />
        </SearchField.Group>
      </SearchField>
      <ScrollShadow className="max-h-96">
        <Box
          as="ul"
          display="grid"
          gridTemplateColumns="repeat(auto-fill, minmax(7rem, 1fr))"
          columnGap="s"
          rowGap="xl"
        >
          {found.map(([name, Icon]) => (
            <Box
              as="li"
              key={name}
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap="s"
              minWidth={0}
            >
              <Icon />
              <Box display="block" width="100%" textAlign="center" color="text-secondary">
                <Text as="span" variant="caption" truncate>
                  {name}
                </Text>
              </Box>
            </Box>
          ))}
        </Box>
      </ScrollShadow>
    </Box>
  );
}
