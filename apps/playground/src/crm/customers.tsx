import {
  Avatar,
  Box,
  Button,
  Checkbox,
  CopyButton,
  DetailRow,
  Drawer,
  Input,
  Pagination,
  SegmentedControl,
  SortableColumn,
  Stat,
  Table,
  Text,
  toast,
  useTableSort,
  withTransition,
  type Selection,
  type SortAccessors,
} from "@anyglade/kit";
import { ChevronRight } from "@anyglade/kit/icons";
import { useMemo, useState } from "react";
import { formatRubles } from "../blocks/format.ts";
import { simulateRequest } from "../simulate.ts";
import { customers, type Customer, type CustomerStatus } from "./data.ts";
import { downloadCsv, pluralize } from "./format.ts";

const statuses: Record<CustomerStatus, { label: string; color: "default" | "warning" | "muted" }> =
  {
    active: { label: "Активен", color: "default" },
    trial: { label: "Пробный период", color: "warning" },
    churned: { label: "Ушёл", color: "muted" },
  };

type StatusFilter = CustomerStatus | "all";

const statusFilters: { id: StatusFilter; label: string }[] = [
  { id: "all", label: "Все" },
  { id: "active", label: "Активные" },
  { id: "trial", label: "Пробные" },
  { id: "churned", label: "Ушли" },
];

const sortAccessors: SortAccessors<Customer> = {
  name: (customer) => customer.name,
  status: (customer) => statuses[customer.status].label,
  revenue: (customer) => customer.revenue,
  contact: (customer) => customer.contactDaysAgo,
};

const PAGE_SIZE = 6;

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
                    <DetailRow
                      label="Почта"
                      value={customer.email}
                      action={
                        <CopyButton
                          copiedLabel="Почта скопирована"
                          label="Скопировать почту"
                          value={customer.email}
                        />
                      }
                    />
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
  const [status, setStatus] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Selection>(new Set());
  const [opened, setOpened] = useState<Customer | null>(null);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return customers.filter(
      (customer) =>
        (status === "all" || customer.status === status) &&
        `${customer.name} ${customer.company} ${customer.email}`.toLowerCase().includes(normalized),
    );
  }, [query, status]);

  const { sorted: found, tableProps } = useTableSort(filtered, sortAccessors, {
    column: "revenue",
    direction: "descending",
  });

  const pageCount = Math.max(1, Math.ceil(found.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visible = found.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const pages = Array.from({ length: pageCount }, (_, index) => index + 1);
  const chosen = selected === "all" ? found : found.filter((customer) => selected.has(customer.id));

  function filterByStatus(next: StatusFilter) {
    withTransition(() => {
      setStatus(next);
      setPage(1);
    });
  }

  function reset() {
    setQuery("");
    filterByStatus("all");
  }

  async function exportChosen() {
    await simulateRequest();
    downloadCsv("klienty.csv", [
      ["Клиент", "Компания", "Почта", "Статус", "Выручка"],
      ...chosen.map((customer) => [
        customer.name,
        customer.company,
        customer.email,
        statuses[customer.status].label,
        String(customer.revenue),
      ]),
    ]);
    toast(
      `${chosen.length} ${pluralize(chosen.length, "клиент выгружен", "клиента выгружено", "клиентов выгружено")}`,
    );
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
          {chosen.length > 0 ? (
            <Button size="sm" variant="secondary" onPress={exportChosen}>
              Выгрузить {chosen.length}
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
      <Box display="block" overflowX="auto">
        <SegmentedControl
          label="Статус клиента"
          options={statusFilters}
          value={status}
          onChange={filterByStatus}
        />
      </Box>
      {found.length === 0 ? (
        <Box flexDirection="column" alignItems="center" gap="m" padding="3xl" textAlign="center">
          <Text color="muted">Таких клиентов нет</Text>
          <Button size="sm" variant="secondary" onPress={reset}>
            Сбросить фильтры
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
              onSelectionChange={setSelected}
              {...tableProps}
            >
              <Table.Header>
                <Table.Column className="w-12">
                  <SelectionCheckbox label="Выбрать всех" />
                </Table.Column>
                <SortableColumn isRowHeader id="name">
                  Клиент
                </SortableColumn>
                <SortableColumn id="status">Статус</SortableColumn>
                <SortableColumn id="revenue">Выручка</SortableColumn>
                <SortableColumn id="contact">Контакт</SortableColumn>
                <Table.Column aria-label="Действия">{""}</Table.Column>
              </Table.Header>
              <Table.Body>
                {visible.map((customer) => (
                  <Table.Row
                    key={customer.id}
                    id={customer.id}
                    style={{ viewTransitionName: `customer-${customer.id}` }}
                  >
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
