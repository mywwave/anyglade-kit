import { Box, Label, SearchField } from "@anyglade/kit";

export function SearchFieldDemo() {
  return (
    <Box flexDirection="column" gap="l">
      <SearchField name="primary-search" variant="primary">
        <Label>Primary variant</Label>
        <SearchField.Group>
          <SearchField.SearchIcon />
          <SearchField.Input className="w-70" placeholder="Search..." />
          <SearchField.ClearButton />
        </SearchField.Group>
      </SearchField>
      <SearchField name="secondary-search" variant="secondary">
        <Label>Secondary variant</Label>
        <SearchField.Group>
          <SearchField.SearchIcon />
          <SearchField.Input className="w-70" placeholder="Search..." />
          <SearchField.ClearButton />
        </SearchField.Group>
      </SearchField>
    </Box>
  );
}
