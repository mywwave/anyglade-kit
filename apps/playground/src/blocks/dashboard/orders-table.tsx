import { Box, Button, Chip, Input, Pagination, Table, Text } from "@anyglade/kit";
import { Plus } from "@anyglade/kit/icons";
import { useState } from "react";
import { formatRubles } from "../format.ts";

const statuses = {
  paid: { label: "Оплачен", color: "success" },
  pending: { label: "Ожидает", color: "warning" },
  failed: { label: "Ошибка", color: "danger" },
  refunded: { label: "Возврат", color: "default" },
} as const;

const orders = [
  { id: "A-1042", customer: "Анна Смирнова", status: "paid", date: "5 нояб.", amount: 12900 },
  { id: "A-1041", customer: "ООО «Вектор»", status: "pending", date: "5 нояб.", amount: 84000 },
  { id: "A-1040", customer: "Илья Воронов", status: "failed", date: "4 нояб.", amount: 3400 },
  { id: "A-1039", customer: "Мария Ким", status: "paid", date: "4 нояб.", amount: 21500 },
  { id: "A-1038", customer: "ИП Лебедев", status: "refunded", date: "3 нояб.", amount: 7800 },
] as const;

const pages = [1, 2, 3];

export function OrdersTableBlock() {
  const [page, setPage] = useState(1);

  return (
    <Box flexDirection="column" gap="xl" padding={{ base: "l", md: "xl" }}>
      <Box
        flexDirection={{ base: "column", md: "row" }}
        alignItems={{ base: "stretch", md: "center" }}
        justifyContent="between"
        gap="m"
      >
        <Text as="h2" variant="heading-xs" weight="medium">
          Заказы
        </Text>
        <Box gap="s">
          <Input aria-label="Поиск по заказам" className="w-full md:w-64" placeholder="Поиск" />
          <Button size="sm">
            <Plus />
            Создать
          </Button>
        </Box>
      </Box>
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
              {orders.map((order) => (
                <Table.Row key={order.id}>
                  <Table.Cell>
                    <Text as="span" monospace>
                      {order.id}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>{order.customer}</Table.Cell>
                  <Table.Cell>
                    <Chip color={statuses[order.status].color} size="sm" variant="soft">
                      <Chip.Label>{statuses[order.status].label}</Chip.Label>
                    </Chip>
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
      <Box alignItems="center" justifyContent="between" gap="l" flexWrap="wrap">
        <Text color="muted">5 из 128 заказов</Text>
        <Pagination className="w-auto">
          <Pagination.Content>
            {pages.map((item) => (
              <Pagination.Item key={item}>
                <Pagination.Link isActive={item === page} onPress={() => setPage(item)}>
                  {item}
                </Pagination.Link>
              </Pagination.Item>
            ))}
          </Pagination.Content>
        </Pagination>
      </Box>
    </Box>
  );
}
