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
import { formatMoney } from "../blocks/format.ts";
import { simulateRequest } from "../simulate.ts";
import { customers, type Customer, type CustomerStatus } from "./data.ts";
import { downloadCsv, pluralize } from "./format.ts";

const statuses: Record<CustomerStatus, { label: string; color: "default" | "warning" | "muted" }> =
  {
    active: { label: "Active", color: "default" },
    trial: { label: "Trial", color: "warning" },
    churned: { label: "Churned", color: "muted" },
  };

type StatusFilter = CustomerStatus | "all";

const statusFilters: { id: StatusFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "trial", label: "Trial" },
  { id: "churned", label: "Churned" },
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
                  <Stat label="Lifetime revenue" value={formatMoney(customer.revenue)} />
                  <Box flexDirection="column" gap="m">
                    <DetailRow label="Status" value={statuses[customer.status].label} />
                    <DetailRow label="Owner" value={customer.owner} />
                    <DetailRow
                      label="Email"
                      value={customer.email}
                      action={
                        <CopyButton
                          copiedLabel="Email copied"
                          label="Copy email"
                          value={customer.email}
                        />
                      }
                    />
                    <DetailRow label="Last contact" value={customer.lastContact} />
                    <DetailRow label="Phone" />
                  </Box>
                </Box>
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
    downloadCsv("customers.csv", [
      ["Customer", "Company", "Email", "Status", "Revenue"],
      ...chosen.map((customer) => [
        customer.name,
        customer.company,
        customer.email,
        statuses[customer.status].label,
        String(customer.revenue),
      ]),
    ]);
    toast(
      `${chosen.length} ${pluralize(chosen.length, "customer exported", "customers exported")}`,
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
          Customers
        </Text>
        <Box alignItems="center" gap="s">
          {chosen.length > 0 ? (
            <Button size="sm" variant="secondary" onPress={exportChosen}>
              Export {chosen.length}
            </Button>
          ) : null}
          <Input
            aria-label="Search customers"
            className="w-full md:w-64"
            placeholder="Name, company or email"
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
          label="Customer status"
          options={statusFilters}
          value={status}
          onChange={filterByStatus}
        />
      </Box>
      {found.length === 0 ? (
        <Box flexDirection="column" alignItems="center" gap="m" padding="3xl" textAlign="center">
          <Text color="muted">No matching customers</Text>
          <Button size="sm" variant="secondary" onPress={reset}>
            Reset filters
          </Button>
        </Box>
      ) : (
        <Table>
          <Table.ScrollContainer>
            <Table.Content
              aria-label="Customers"
              className="min-w-180"
              selectedKeys={selected}
              selectionMode="multiple"
              onSelectionChange={setSelected}
              {...tableProps}
            >
              <Table.Header>
                <Table.Column className="w-12">
                  <SelectionCheckbox label="Select all" />
                </Table.Column>
                <SortableColumn isRowHeader id="name">
                  Customer
                </SortableColumn>
                <SortableColumn id="status">Status</SortableColumn>
                <SortableColumn id="revenue">Revenue</SortableColumn>
                <SortableColumn id="contact">Last contact</SortableColumn>
                <Table.Column aria-label="Actions">{""}</Table.Column>
              </Table.Header>
              <Table.Body>
                {visible.map((customer) => (
                  <Table.Row
                    key={customer.id}
                    id={customer.id}
                    style={{ viewTransitionName: `customer-${customer.id}` }}
                  >
                    <Table.Cell>
                      <SelectionCheckbox label={`Select ${customer.name}`} />
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
                        {formatMoney(customer.revenue)}
                      </Text>
                    </Table.Cell>
                    <Table.Cell>{customer.lastContact}</Table.Cell>
                    <Table.Cell>
                      <Button
                        isIconOnly
                        aria-label={`Open ${customer.name}`}
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
          {found.length} {pluralize(found.length, "customer", "customers")}
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
