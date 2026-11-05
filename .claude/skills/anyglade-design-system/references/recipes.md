# Рецепты

Рабочие сборки составных компонентов. Части компонентов HeroUI легко перепутать, поэтому копируйте отсюда, а не по памяти. Все примеры компилируются.

У компонентов HeroUI `className` открыт, но только для размера: `w-*`, `h-*`, `min-w-*`, `max-w-*`, `rounded-*`. Цвет, отступы и шрифт через него не задаются.

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

## Таблица с сортировкой, поиском, фильтром и выбором

Порядок: отфильтровать, отсортировать, разрезать на страницы. `tableProps` передаётся в `Table.Content`. Ширина на телефоне задаётся `className="min-w-*"` там же.

```tsx
type Status = "paid" | "failed";

interface Invoice {
  id: string;
  client: string;
  status: Status;
  amount: number;
}

const statusLabels = {
  paid: { label: "Оплачен", color: "muted" },
  failed: { label: "Ошибка оплаты", color: "danger" },
} as const;

const filters = [
  { id: "all", label: "Все" },
  { id: "failed", label: "Ошибки" },
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
          label="Статус"
          options={filters}
          value={filter}
          onChange={(next) => withTransition(() => setFilter(next))}
        />
        <SearchField aria-label="Поиск по клиентам" value={query} onChange={setQuery}>
          <SearchField.Group>
            <SearchField.SearchIcon />
            <SearchField.Input className="w-64" placeholder="Клиент" />
            <SearchField.ClearButton />
          </SearchField.Group>
        </SearchField>
      </Box>
      {sorted.length === 0 ? (
        <EmptyPanel
          actions={
            <Button size="sm" variant="secondary" onPress={reset}>
              Сбросить фильтры
            </Button>
          }
          description="Измените запрос или фильтры."
          icon={<Magnifier />}
          title="Ничего не найдено"
        />
      ) : (
        <Table>
          <Table.ScrollContainer>
            <Table.Content
              aria-label="Счета"
              className="min-w-150"
              selectedKeys={selected}
              selectionMode="multiple"
              onSelectionChange={setSelected}
              {...tableProps}
            >
              <Table.Header>
                <Table.Column className="w-12">
                  <SelectionCheckbox label="Выбрать все" />
                </Table.Column>
                <SortableColumn isRowHeader id="client">
                  Клиент
                </SortableColumn>
                <Table.Column>Статус</Table.Column>
                <SortableColumn className="text-right" id="amount">
                  Сумма
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
                      <SelectionCheckbox label={`Выбрать ${invoice.client}`} />
                    </Table.Cell>
                    <Table.Cell>{invoice.client}</Table.Cell>
                    <Table.Cell>
                      <Text as="span" color={statusLabels[invoice.status].color}>
                        {statusLabels[invoice.status].label}
                      </Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text align="right" tabularNums>
                        {invoice.amount.toLocaleString("ru-RU")} ₽
                      </Text>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
        </Table>
      )}
      <Text color="muted">Выбрано {chosen.length}</Text>
    </Box>
  );
}
```

## Загрузка

Размер `Skeleton` задаётся через `className`, а не пропсами. Скелетон повторяет форму контента.

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

## Строка открывает панель

`onRowAction` получает id строки. Панель из раздела «Панель с деталями» рендерится рядом с таблицей, а не внутри строки.

```tsx
function InvoicesWithDetails({ invoices }: { invoices: Invoice[] }) {
  const [openedId, setOpenedId] = useState<string | null>(null);
  const opened = invoices.find((invoice) => invoice.id === openedId) ?? null;

  return (
    <>
      <Table>
        <Table.ScrollContainer>
          <Table.Content
            aria-label="Счета"
            className="min-w-150"
            onRowAction={(id) => setOpenedId(String(id))}
          >
            <Table.Header>
              <Table.Column isRowHeader>Клиент</Table.Column>
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

## Выбор из списка

```tsx
function OwnerSelect({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <Select
      aria-label="Менеджер"
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
          <ListBox.Item id="all" textValue="Все менеджеры">
            Все менеджеры
            <ListBox.ItemIndicator />
          </ListBox.Item>
        </ListBox>
      </Select.Popover>
    </Select>
  );
}
```

## Поле с ошибкой

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
      <Label>Название</Label>
      <Input />
      <FieldError>Укажите хотя бы два символа</FieldError>
    </TextField>
  );
}
```

## Меню действий

```tsx
function RowMenu({ onArchive }: { onArchive: () => void }) {
  return (
    <Dropdown>
      <Button isIconOnly aria-label="Действия" size="sm" variant="ghost">
        <EllipsisVertical />
      </Button>
      <Dropdown.Popover>
        <Dropdown.Menu aria-label="Действия" onAction={onArchive}>
          <Dropdown.Item id="archive" textValue="В архив">
            <Label>В архив</Label>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}
```

## Панель с деталями

Состояние открытия живёт снаружи: панель показывает выбранный объект.

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
                    Закрыть
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

## Окно

Кнопка со `slot="close"` закрывает окно сама.

```tsx
function HelpModal() {
  return (
    <Modal>
      <Button variant="secondary">Как это устроено</Button>
      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>Три шага до отчёта</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              <Text as="p">Подключите кассу, и отчёт соберётся сам.</Text>
            </Modal.Body>
            <Modal.Footer>
              <Button fullWidth slot="close">
                Понятно
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
```

## Опасное подтверждение

```tsx
function DeleteDialog({ onDelete }: { onDelete: () => void }) {
  return (
    <AlertDialog>
      <Button variant="danger-soft">Удалить проект</Button>
      <AlertDialog.Backdrop>
        <AlertDialog.Container>
          <AlertDialog.Dialog>
            <AlertDialog.Header>
              <AlertDialog.Icon status="danger" />
              <AlertDialog.Heading>Удалить проект?</AlertDialog.Heading>
            </AlertDialog.Header>
            <AlertDialog.Body>
              <Text as="p">Счета и отчёты удалятся без возможности восстановить.</Text>
            </AlertDialog.Body>
            <AlertDialog.Footer>
              <Button slot="close" variant="tertiary">
                Отменить
              </Button>
              <Button slot="close" variant="danger" onPress={onDelete}>
                Удалить проект
              </Button>
            </AlertDialog.Footer>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </AlertDialog>
  );
}
```

## Вкладки

```tsx
function SectionTabs() {
  return (
    <Tabs className="w-full">
      <Tabs.ListContainer>
        <Tabs.List aria-label="Разделы">
          <Tabs.Tab id="overview">
            Обзор
            <Tabs.Indicator />
          </Tabs.Tab>
        </Tabs.List>
      </Tabs.ListContainer>
      <Tabs.Panel id="overview">
        <Box display="block" paddingTop="l">
          <Text>Содержимое</Text>
        </Box>
      </Tabs.Panel>
    </Tabs>
  );
}
```
