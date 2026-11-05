import {
  Box,
  Button,
  Input,
  Pagination,
  Table,
  Text,
  ToggleButton,
  ToggleButtonGroup,
} from "@anyglade/kit";
import { useMemo, useState } from "react";
import { formatRubles } from "../format.ts";

const statuses = {
  paid: { label: "Оплачен", color: "muted" },
  pending: { label: "Ожидает", color: "warning" },
  failed: { label: "Ошибка оплаты", color: "danger" },
} as const;

type Status = keyof typeof statuses;
type Filter = Status | "all";

const filters: { id: Filter; label: string }[] = [
  { id: "all", label: "Все" },
  { id: "failed", label: "Ошибки" },
  { id: "pending", label: "Ожидают" },
  { id: "paid", label: "Оплачены" },
];

interface Order {
  id: string;
  customer: string;
  status: Status;
  date: string;
  amount: number;
}

const initialOrders: Order[] = [
  { id: "A-1042", customer: "Анна Смирнова", status: "paid", date: "5 нояб.", amount: 12900 },
  { id: "A-1041", customer: "ООО «Вектор»", status: "pending", date: "5 нояб.", amount: 84000 },
  { id: "A-1040", customer: "Илья Воронов", status: "failed", date: "4 нояб.", amount: 3400 },
  { id: "A-1039", customer: "Мария Ким", status: "paid", date: "4 нояб.", amount: 21500 },
  { id: "A-1038", customer: "ИП Лебедев", status: "paid", date: "3 нояб.", amount: 7800 },
  { id: "A-1037", customer: "Студия «Север»", status: "failed", date: "3 нояб.", amount: 49000 },
  { id: "A-1036", customer: "Павел Орлов", status: "paid", date: "2 нояб.", amount: 1900 },
  { id: "A-1035", customer: "Ольга Белова", status: "pending", date: "2 нояб.", amount: 9900 },
  { id: "A-1034", customer: "ООО «Лента»", status: "paid", date: "1 нояб.", amount: 156000 },
];

const PAGE_SIZE = 5;

export function OrdersTableBlock() {
  const [orders, setOrders] = useState(initialOrders);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const found = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return orders.filter(
      (order) =>
        (filter === "all" || order.status === filter) &&
        `${order.id} ${order.customer}`.toLowerCase().includes(normalized),
    );
  }, [orders, filter, query]);

  const pageCount = Math.max(1, Math.ceil(found.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visible = found.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const pages = Array.from({ length: pageCount }, (_, index) => index + 1);

  function reset() {
    setFilter("all");
    setQuery("");
    setPage(1);
  }

  function retry(id: string) {
    setOrders((list) =>
      list.map((order) => (order.id === id ? { ...order, status: "paid" } : order)),
    );
  }

  return (
    <Box flexDirection="column" gap="l" padding={{ base: "l", md: "xl" }}>
      <Box
        flexDirection={{ base: "column", md: "row" }}
        alignItems={{ base: "stretch", md: "center" }}
        justifyContent="between"
        gap="m"
      >
        <ToggleButtonGroup
          aria-label="Статус заказа"
          disallowEmptySelection
          selectedKeys={new Set([filter])}
          selectionMode="single"
          size="sm"
          onSelectionChange={(keys) => {
            const [key] = keys;
            setFilter(key as Filter);
            setPage(1);
          }}
        >
          {filters.map((item) => (
            <ToggleButton key={item.id} id={item.id}>
              {item.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
        <Input
          aria-label="Поиск по заказам"
          className="w-full md:w-64"
          placeholder="Поиск по имени или номеру"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setPage(1);
          }}
        />
      </Box>
      {found.length === 0 ? (
        <Box flexDirection="column" alignItems="center" gap="m" padding="3xl" textAlign="center">
          <Text color="muted">Таких заказов нет</Text>
          <Button size="sm" variant="secondary" onPress={reset}>
            Сбросить фильтры
          </Button>
        </Box>
      ) : (
        <Table>
          <Table.ScrollContainer>
            <Table.Content aria-label="Заказы" className="min-w-150">
              <Table.Header>
                <Table.Column isRowHeader>Заказ</Table.Column>
                <Table.Column>Клиент</Table.Column>
                <Table.Column>Статус</Table.Column>
                <Table.Column>Дата</Table.Column>
                <Table.Column>Сумма</Table.Column>
              </Table.Header>
              <Table.Body>
                {visible.map((order) => (
                  <Table.Row key={order.id} id={order.id}>
                    <Table.Cell>
                      <Text as="span" monospace>
                        {order.id}
                      </Text>
                    </Table.Cell>
                    <Table.Cell>{order.customer}</Table.Cell>
                    <Table.Cell>
                      <Box alignItems="center" gap="s">
                        <Text as="span" color={statuses[order.status].color}>
                          {statuses[order.status].label}
                        </Text>
                        {order.status === "failed" ? (
                          <Button size="sm" variant="ghost" onPress={() => retry(order.id)}>
                            Повторить
                          </Button>
                        ) : null}
                      </Box>
                    </Table.Cell>
                    <Table.Cell>{order.date}</Table.Cell>
                    <Table.Cell>
                      <Text as="span" tabularNums>
                        {formatRubles(order.amount)}
                      </Text>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
        </Table>
      )}
      {found.length > 0 ? (
        <Box alignItems="center" justifyContent="between" gap="l" flexWrap="wrap">
          <Text color="muted">
            {visible.length} из {found.length}
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
      ) : null}
    </Box>
  );
}
