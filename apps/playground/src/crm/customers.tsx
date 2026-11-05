import {
  Avatar,
  Box,
  Button,
  Checkbox,
  DetailRow,
  Drawer,
  Input,
  Pagination,
  Stat,
  Table,
  Text,
  toast,
} from "@anyglade/kit";
import { ChevronRight } from "@anyglade/kit/icons";
import { useMemo, useState } from "react";
import { formatRubles } from "../blocks/format.ts";
import { customers, type Customer, type CustomerStatus } from "./data.ts";
import { pluralize } from "./format.ts";

const statuses: Record<CustomerStatus, { label: string; color: "default" | "warning" | "muted" }> =
  {
    active: { label: "Активен", color: "default" },
    trial: { label: "Пробный период", color: "warning" },
    churned: { label: "Ушёл", color: "muted" },
  };

const PAGE_SIZE = 6;

type SortDescriptor = NonNullable<Parameters<typeof Table.Content>[0]["sortDescriptor"]>;
type Selection = NonNullable<Parameters<typeof Table.Content>[0]["selectedKeys"]>;

const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("");

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

function CustomerDrawer({ customer, onClose }: { customer: Customer | null; onClose: () => void }) {
  return (
    <Drawer.Backdrop isOpen={customer !== null} onOpenChange={(isOpen) => isOpen || onClose()}>
      <Drawer.Content placement="right">
        <Drawer.Dialog>
          <Drawer.CloseTrigger />
          {customer ? (
            <>
              <Drawer.Header>
                <Box alignItems="center" gap="m">
                  <Avatar>
                    <Avatar.Fallback>{initials(customer.name)}</Avatar.Fallback>
                  </Avatar>
                  <Box flexDirection="column">
                    <Drawer.Heading>{customer.name}</Drawer.Heading>
                    <Text color="muted">{customer.company}</Text>
                  </Box>
                </Box>
              </Drawer.Header>
              <Drawer.Body>
                <Box flexDirection="column" gap="xl">
                  <Stat label="Выручка за всё время" value={formatRubles(customer.revenue)} />
                  <Box flexDirection="column" gap="m">
                    <DetailRow label="Статус" value={statuses[customer.status].label} />
                    <DetailRow label="Менеджер" value={customer.owner} />
                    <DetailRow label="Почта" value={customer.email} />
                    <DetailRow label="Последний контакт" value={customer.lastContact} />
                    <DetailRow label="Телефон" />
                  </Box>
                </Box>
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
  );
}

export function Customers() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Selection>(new Set());
  const [opened, setOpened] = useState<Customer | null>(null);
  const [sort, setSort] = useState<SortDescriptor>({ column: "revenue", direction: "descending" });

  const found = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const column = sort.column as keyof Customer;
    const direction = sort.direction === "descending" ? -1 : 1;
    return customers
      .filter((customer) =>
        `${customer.name} ${customer.company} ${customer.email}`.toLowerCase().includes(normalized),
      )
      .toSorted((a, b) => {
        const left = a[column];
        const right = b[column];
        const order =
          typeof left === "number" && typeof right === "number"
            ? left - right
            : String(left).localeCompare(String(right));
        return order * direction;
      });
  }, [query, sort]);

  const pageCount = Math.max(1, Math.ceil(found.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visible = found.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const pages = Array.from({ length: pageCount }, (_, index) => index + 1);
  const selectedCount = selected === "all" ? found.length : new Set(selected).size;

  function exportSelected() {
    toast(`${selectedCount} ${pluralize(selectedCount, "клиент", "клиента", "клиентов")} в файле`);
    setSelected(new Set());
  }

  return (
    <Box flexDirection="column" gap="l">
      <Box
        flexDirection={{ base: "column", md: "row" }}
        alignItems={{ base: "stretch", md: "center" }}
        justifyContent="between"
        gap="m"
      >
        <Text as="h1" variant="heading-xs" weight="medium">
          Клиенты
        </Text>
        <Box alignItems="center" gap="s">
          {selectedCount > 0 ? (
            <Button size="sm" variant="secondary" onPress={exportSelected}>
              Выгрузить {selectedCount}
            </Button>
          ) : null}
          <Input
            aria-label="Поиск по клиентам"
            className="w-full md:w-64"
            placeholder="Имя, компания или почта"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
          />
        </Box>
      </Box>
      {found.length === 0 ? (
        <Box flexDirection="column" alignItems="center" gap="m" padding="3xl" textAlign="center">
          <Text color="muted">Таких клиентов нет</Text>
          <Button size="sm" variant="secondary" onPress={() => setQuery("")}>
            Сбросить поиск
          </Button>
        </Box>
      ) : (
        <Table>
          <Table.ScrollContainer>
            <Table.Content
              aria-label="Клиенты"
              className="min-w-180"
              selectedKeys={selected}
              selectionMode="multiple"
              sortDescriptor={sort}
              onSelectionChange={setSelected}
              onSortChange={setSort}
            >
              <Table.Header>
                <Table.Column className="w-12">
                  <SelectionCheckbox label="Выбрать всех" />
                </Table.Column>
                <Table.Column allowsSorting isRowHeader id="name">
                  {({ sortDirection }) => (
                    <Table.SortableColumnHeader sortDirection={sortDirection}>
                      Клиент
                    </Table.SortableColumnHeader>
                  )}
                </Table.Column>
                <Table.Column>Статус</Table.Column>
                <Table.Column allowsSorting id="revenue">
                  {({ sortDirection }) => (
                    <Table.SortableColumnHeader sortDirection={sortDirection}>
                      Выручка
                    </Table.SortableColumnHeader>
                  )}
                </Table.Column>
                <Table.Column>Контакт</Table.Column>
                <Table.Column aria-label="Действия">{""}</Table.Column>
              </Table.Header>
              <Table.Body>
                {visible.map((customer) => (
                  <Table.Row key={customer.id} id={customer.id}>
                    <Table.Cell>
                      <SelectionCheckbox label={`Выбрать ${customer.name}`} />
                    </Table.Cell>
                    <Table.Cell>
                      <Box flexDirection="column" minWidth={0}>
                        <Text as="span">{customer.name}</Text>
                        <Text as="span" variant="caption" color="muted">
                          {customer.company}
                        </Text>
                      </Box>
                    </Table.Cell>
                    <Table.Cell>
                      <Text as="span" color={statuses[customer.status].color}>
                        {statuses[customer.status].label}
                      </Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text as="span" tabularNums>
                        {formatRubles(customer.revenue)}
                      </Text>
                    </Table.Cell>
                    <Table.Cell>{customer.lastContact}</Table.Cell>
                    <Table.Cell>
                      <Button
                        isIconOnly
                        aria-label={`Открыть ${customer.name}`}
                        size="sm"
                        variant="ghost"
                        onPress={() => setOpened(customer)}
                      >
                        <ChevronRight />
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
        </Table>
      )}
      <Box alignItems="center" justifyContent="between" gap="l" flexWrap="wrap">
        <Text color="muted">
          {found.length} {pluralize(found.length, "клиент", "клиента", "клиентов")}
        </Text>
        {pageCount > 1 ? (
          <Pagination className="w-auto">
            <Pagination.Content>
              {pages.map((item) => (
                <Pagination.Item key={item}>
                  <Pagination.Link isActive={item === currentPage} onPress={() => setPage(item)}>
                    {item}
                  </Pagination.Link>
                </Pagination.Item>
              ))}
            </Pagination.Content>
          </Pagination>
        ) : null}
      </Box>
      <Drawer>
        <CustomerDrawer customer={opened} onClose={() => setOpened(null)} />
      </Drawer>
    </Box>
  );
}
