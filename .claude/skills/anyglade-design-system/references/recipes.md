# Recipes

Working assemblies of compound components. The parts of HeroUI components are easy to mix up, so copy from here rather than from memory. All examples compile.

HeroUI components keep `className` open, but only for size: `w-*`, `h-*`, `min-w-*`, `max-w-*`, `rounded-*`. Color, spacing and type are not set through it.

```tsx
import {
  AlertDialog,
  Box,
  Button,
  Checkbox,
  Drawer,
  Dropdown,
  EmptyPanel,
  FieldError,
  Input,
  Label,
  ListBox,
  Loadable,
  Modal,
  SearchField,
  SegmentedControl,
  Select,
  Skeleton,
  SortableColumn,
  Table,
  Tabs,
  Text,
  TextField,
  useTableSort,
  withTransition,
  type Selection,
  type SortAccessors,
} from "@anyglade/kit";
import { EllipsisVertical, Magnifier } from "@anyglade/kit/icons";
import { useState } from "react";
```

## Table with sorting, search, filter and selection

Order: filter, sort, slice into pages. `tableProps` goes to `Table.Content`. The width on the phone is set with `className="min-w-*"` in the same place.

```tsx
type Status = "paid" | "failed";

interface Invoice {
  id: string;
  client: string;
  status: Status;
  amount: number;
}

const statusLabels = {
  paid: { label: "Paid", color: "muted" },
  failed: { label: "Payment failed", color: "danger" },
} as const;

const filters = [
  { id: "all", label: "All" },
  { id: "failed", label: "Failed" },
] as const;

const sortAccessors: SortAccessors<Invoice> = {
  client: (invoice) => invoice.client,
  amount: (invoice) => invoice.amount,
};

function SelectionCheckbox({ label }: { label: string }) {
  return (
    <Checkbox aria-label={label} slot="selection">
      <Checkbox.Content>
        <Checkbox.Control>
          <Checkbox.Indicator />
        </Checkbox.Control>
      </Checkbox.Content>
    </Checkbox>
  );
}

function InvoiceTable({ invoices }: { invoices: Invoice[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | Status>("all");
  const [selected, setSelected] = useState<Selection>(new Set());

  const normalized = query.trim().toLowerCase();
  const filtered = invoices.filter(
    (invoice) =>
      (filter === "all" || invoice.status === filter) &&
      invoice.client.toLowerCase().includes(normalized),
  );
  const { sorted, tableProps } = useTableSort(filtered, sortAccessors, {
    column: "amount",
    direction: "descending",
  });
  const chosen = selected === "all" ? sorted : sorted.filter((item) => selected.has(item.id));

  function reset() {
    setQuery("");
    withTransition(() => setFilter("all"));
  }

  return (
    <Box flexDirection="column" gap="l">
      <Box flexDirection={{ base: "column", md: "row" }} justifyContent="between" gap="m">
        <SegmentedControl
          label="Status"
          options={filters}
          value={filter}
          onChange={(next) => withTransition(() => setFilter(next))}
        />
        <SearchField aria-label="Search customers" value={query} onChange={setQuery}>
          <SearchField.Group>
            <SearchField.SearchIcon />
            <SearchField.Input className="w-64" placeholder="Customer" />
            <SearchField.ClearButton />
          </SearchField.Group>
        </SearchField>
      </Box>
      {sorted.length === 0 ? (
        <EmptyPanel
          actions={
            <Button size="sm" variant="secondary" onPress={reset}>
              Reset filters
            </Button>
          }
          description="Change the search or the filters."
          icon={<Magnifier />}
          title="Nothing found"
        />
      ) : (
        <Table>
          <Table.ScrollContainer>
            <Table.Content
              aria-label="Invoices"
              className="min-w-150"
              selectedKeys={selected}
              selectionMode="multiple"
              onSelectionChange={setSelected}
              {...tableProps}
            >
              <Table.Header>
                <Table.Column className="w-12">
                  <SelectionCheckbox label="Select all" />
                </Table.Column>
                <SortableColumn isRowHeader id="client">
                  Customer
                </SortableColumn>
                <Table.Column>Status</Table.Column>
                <SortableColumn className="text-right" id="amount">
                  Amount
                </SortableColumn>
              </Table.Header>
              <Table.Body>
                {sorted.map((invoice) => (
                  <Table.Row
                    key={invoice.id}
                    id={invoice.id}
                    style={{ viewTransitionName: `invoice-${invoice.id}` }}
                  >
                    <Table.Cell>
                      <SelectionCheckbox label={`Select ${invoice.client}`} />
                    </Table.Cell>
                    <Table.Cell>{invoice.client}</Table.Cell>
                    <Table.Cell>
                      <Text as="span" color={statusLabels[invoice.status].color}>
                        {statusLabels[invoice.status].label}
                      </Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text align="right" tabularNums>
                        {invoice.amount.toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                        })}
                      </Text>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
        </Table>
      )}
      <Text color="muted">{chosen.length} selected</Text>
    </Box>
  );
}
```

## Loading

The size of a `Skeleton` is set through `className`, not props. The skeleton repeats the shape of the content.

```tsx
function InvoicesSkeleton() {
  return (
    <Box flexDirection="column" gap="m">
      <Skeleton className="h-8 w-40 rounded-lg" />
      {Array.from({ length: 5 }, (_, index) => (
        <Skeleton key={index} className="h-10 w-full rounded-lg" />
      ))}
    </Box>
  );
}

function InvoicesScreen({ data }: { data: Invoice[] | null }) {
  return (
    <Loadable isLoading={data === null} skeleton={<InvoicesSkeleton />}>
      {data ? <InvoiceTable invoices={data} /> : null}
    </Loadable>
  );
}
```

## A row opens a panel

`onRowAction` receives the row id. The panel from the "Details panel" section renders next to the table, not inside the row.

```tsx
function InvoicesWithDetails({ invoices }: { invoices: Invoice[] }) {
  const [openedId, setOpenedId] = useState<string | null>(null);
  const opened = invoices.find((invoice) => invoice.id === openedId) ?? null;

  return (
    <>
      <Table>
        <Table.ScrollContainer>
          <Table.Content
            aria-label="Invoices"
            className="min-w-150"
            onRowAction={(id) => setOpenedId(String(id))}
          >
            <Table.Header>
              <Table.Column isRowHeader>Customer</Table.Column>
            </Table.Header>
            <Table.Body>
              {invoices.map((invoice) => (
                <Table.Row key={invoice.id} id={invoice.id}>
                  <Table.Cell>{invoice.client}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>
      <InvoiceDrawer invoice={opened} onClose={() => setOpenedId(null)} />
    </>
  );
}
```

## Choosing from a list

```tsx
function OwnerSelect({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <Select
      aria-label="Manager"
      className="w-48"
      value={value}
      onChange={(key) => onChange(String(key))}
    >
      <Select.Trigger>
        <Select.Value />
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover>
        <ListBox>
          <ListBox.Item id="all" textValue="All managers">
            All managers
            <ListBox.ItemIndicator />
          </ListBox.Item>
        </ListBox>
      </Select.Popover>
    </Select>
  );
}
```

## Field with an error

```tsx
function NameField() {
  const [value, setValue] = useState("");

  return (
    <TextField
      className="w-full"
      isInvalid={value.length === 1}
      isRequired
      name="name"
      value={value}
      onChange={setValue}
    >
      <Label>Name</Label>
      <Input />
      <FieldError>Enter at least two characters</FieldError>
    </TextField>
  );
}
```

## Action menu

```tsx
function RowMenu({ onArchive }: { onArchive: () => void }) {
  return (
    <Dropdown>
      <Button isIconOnly aria-label="Actions" size="sm" variant="ghost">
        <EllipsisVertical />
      </Button>
      <Dropdown.Popover>
        <Dropdown.Menu aria-label="Actions" onAction={onArchive}>
          <Dropdown.Item id="archive" textValue="Archive">
            <Label>Archive</Label>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}
```

## Details panel

The open state lives outside: the panel shows the selected object.

```tsx
function InvoiceDrawer({ invoice, onClose }: { invoice: Invoice | null; onClose: () => void }) {
  return (
    <Drawer>
      <Drawer.Backdrop isOpen={invoice !== null} onOpenChange={(isOpen) => isOpen || onClose()}>
        <Drawer.Content placement="right">
          <Drawer.Dialog>
            <Drawer.CloseTrigger />
            {invoice ? (
              <>
                <Drawer.Header>
                  <Drawer.Heading>{invoice.client}</Drawer.Heading>
                </Drawer.Header>
                <Drawer.Body>
                  <Text color="muted">{invoice.id}</Text>
                </Drawer.Body>
                <Drawer.Footer>
                  <Button fullWidth variant="secondary" onPress={onClose}>
                    Close
                  </Button>
                </Drawer.Footer>
              </>
            ) : null}
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>
    </Drawer>
  );
}
```

## Modal

A button with `slot="close"` closes the modal by itself.

```tsx
function HelpModal() {
  return (
    <Modal>
      <Button variant="secondary">How it works</Button>
      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>Three steps to a report</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              <Text as="p">Connect your register and the report builds itself.</Text>
            </Modal.Body>
            <Modal.Footer>
              <Button fullWidth slot="close">
                Got it
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
```

## Dangerous confirmation

```tsx
function DeleteDialog({ onDelete }: { onDelete: () => void }) {
  return (
    <AlertDialog>
      <Button variant="danger-soft">Delete project</Button>
      <AlertDialog.Backdrop>
        <AlertDialog.Container>
          <AlertDialog.Dialog>
            <AlertDialog.Header>
              <AlertDialog.Icon status="danger" />
              <AlertDialog.Heading>Delete project?</AlertDialog.Heading>
            </AlertDialog.Header>
            <AlertDialog.Body>
              <Text as="p">Invoices and reports will be deleted permanently.</Text>
            </AlertDialog.Body>
            <AlertDialog.Footer>
              <Button slot="close" variant="tertiary">
                Cancel
              </Button>
              <Button slot="close" variant="danger" onPress={onDelete}>
                Delete project
              </Button>
            </AlertDialog.Footer>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </AlertDialog>
  );
}
```

## Call

`MediaStage` picks the columns by itself and keeps one element per tile, so the video does not restart when the layout changes.

```tsx
<MediaStage
  focusId={pinnedId}
  items={tiles}
  label="Call participants"
  more={{ label: (count) => `${count} more, show all`, onPress: openPeople }}
  renderItem={(tile) => (
    <MediaTile isSpeaking={tile.id === speakerId} name={tile.name} status={<MemberStatus />}>
      {tile.stream ? <StreamVideo label={tile.name} stream={tile.stream} /> : <Avatar />}
    </MediaTile>
  )}
/>
```

Show a shared screen with `fit="contain"` and your own camera with `isMirrored`.

## Moving between groups

```tsx
<ItemList
  drop={{
    canDrop: (room, value) => !room.isLocked && value !== room.id,
    onDrop: (room, value) => move(value, room.id),
    slot: (room) => ({ top: room.people.length > 0 ? 4 : 8, left: 8 }),
  }}
  renderItem={(room) => (
    <Draggable preview={<PersonChip />} value={person.id}>
      <PersonRow />
    </Draggable>
  )}
/>
```

A row that will not accept the value is not highlighted. The preview is short: a name, not the whole row. `slot` sets the offsets of the spot where the value will land: they must match the row's real layout, otherwise there is a jerk on landing.

## Tabs

```tsx
function SectionTabs() {
  return (
    <Tabs className="w-full">
      <Tabs.ListContainer>
        <Tabs.List aria-label="Sections">
          <Tabs.Tab id="overview">
            Overview
            <Tabs.Indicator />
          </Tabs.Tab>
        </Tabs.List>
      </Tabs.ListContainer>
      <Tabs.Panel id="overview">
        <Box display="block" paddingTop="l">
          <Text>Content</Text>
        </Box>
      </Tabs.Panel>
    </Tabs>
  );
}
```
