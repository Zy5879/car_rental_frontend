import { useEffect, useState } from "react";
import {
  Table,
  ScrollArea,
  UnstyledButton,
  Group,
  Text,
  Center,
  TextInput,
  rem,
  keys,
  Button,
  Modal,
} from "@mantine/core";
import {
  IconSelector,
  IconChevronDown,
  IconChevronUp,
  IconSearch,
} from "@tabler/icons-react";
import classes from "./AdminCustomerView.module.css";
import axios from "axios";

interface RowData {
  id: string;
  name: string;
  password: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  driversLicense: string;
}

interface ThProps {
  children: React.ReactNode;
  reversed: boolean;
  sorted: boolean;
  onSort(): void;
}

function Th({ children, reversed, sorted, onSort }: ThProps) {
  const Icon = sorted
    ? reversed
      ? IconChevronUp
      : IconChevronDown
    : IconSelector;
  return (
    <Table.Th className={classes.th}>
      <UnstyledButton onClick={onSort} className={classes.control}>
        <Group justify="space-between">
          <Text fw={500} fz="sm">
            {children}
          </Text>
          <Center className={classes.icon}>
            <Icon style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </Table.Th>
  );
}

function filterData(data: RowData[], search: string) {
  const query = search.toLowerCase().trim();
  return data.filter((item) =>
    keys(data[0]).some((key) => item[key].toLowerCase().includes(query))
  );
}

function sortData(
  data: RowData[],
  payload: {
    sortBy: keyof RowData | null;
    reversed: boolean;
    search: string;
  }
) {
  const { sortBy } = payload;

  if (!sortBy) {
    return filterData(data, payload.search);
  }

  return filterData(
    [...data].sort((a, b) => {
      if (payload.reversed) {
        return b[sortBy].localeCompare(a[sortBy]);
      }

      return a[sortBy].localeCompare(b[sortBy]);
    }),
    payload.search
  );
}

export default function AdminCustomerView() {
  const [search, setSearch] = useState("");
  const [customerData, setCustomerData] = useState<RowData[]>([]);
  const [sortedData, setSortedData] = useState<RowData[]>([]);
  const [sortBy, setSortBy] = useState<keyof RowData | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<RowData | null>(null);

  const handleEdit = (customer: RowData) => {
    setEditingCustomer(customer);
    setEditModalOpen(true);
  };

  const handleDelete = async (customer: RowData) => {
    try {
      const response = await axios.delete(
        `http://localhost:8000/admin/customers/${customer.id}`,
      );
      console.log(response);

      setCustomerData((prevData) =>
        prevData.filter((data) => data.id !== customer.id)
      );
      
      setSortedData((prevData) =>
        prevData.filter((data) => data.id !== customer.id)
      );
      alert("Customer deleted successfully.");

    }

    catch(error) { 
      console.log(error)
    }
  };

  const handleUpdateCustomer = async () => {
    if (!editingCustomer) return;

    try {
      const response = await axios.put(
        `http://localhost:8000/admin/customers/${editingCustomer.id}`,
        editingCustomer
      );

      console.log(response);

      const updatedCustomers = customerData.map((customer) =>
        customer.id === editingCustomer.id ? editingCustomer : customer
      );

      setCustomerData(updatedCustomers);
      setSortedData(updatedCustomers);
      setEditModalOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = (field: keyof RowData, value: string) => {
    if (!editingCustomer) return;
    setEditingCustomer({ ...editingCustomer, [field]: value });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/admin/customers/"
        );
        const customers: RowData[] = response.data;
        setCustomerData(customers);
        setSortedData(customers); // Initialize sorted data with the fetched data
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const setSorting = (field: keyof RowData) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(sortData(customerData, { sortBy: field, reversed, search }));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearch(value);
    setSortedData(
      sortData(customerData, {
        sortBy,
        reversed: reverseSortDirection,
        search: value,
      })
    );
  };

  const rows = sortedData.map((row) => (
    <Table.Tr key={row.id}>
      <Table.Td>{row.id}</Table.Td>
      <Table.Td>{row.name}</Table.Td>
      <Table.Td>{row.email}</Table.Td>
      <Table.Td>{row.phone}</Table.Td>
      <Table.Td>{row.city}</Table.Td>
      <Table.Td>{row.state}</Table.Td>
      <Table.Td>{row.driversLicense}</Table.Td>
      <Table.Td style={{ display: "flex", gap: "10px" }}>
        <Button size="xs" onClick={() => handleEdit(row)}>
          Edit
        </Button>
        <Button onClick={() => handleDelete(row)} size="xs">Delete</Button>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <ScrollArea>
        <TextInput
          placeholder="Search by any field"
          mb="md"
          leftSection={
            <IconSearch
              style={{ width: rem(16), height: rem(16) }}
              stroke={1.5}
            />
          }
          value={search}
          onChange={handleSearchChange}
        />
        <Table
          horizontalSpacing="md"
          verticalSpacing="xs"
          miw={700}
          layout="fixed"
        >
          <Table.Tbody>
            <Table.Tr>
              <Th
                sorted={sortBy === "id"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("id")}
              >
                Id
              </Th>
              <Th
                sorted={sortBy === "name"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("name")}
              >
                Name
              </Th>
              <Th
                sorted={sortBy === "email"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("email")}
              >
                Email
              </Th>
              <Th
                sorted={sortBy === "phone"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("phone")}
              >
                Phone
              </Th>
              <Th
                sorted={sortBy === "city"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("city")}
              >
                City
              </Th>
              <Th
                sorted={sortBy === "state"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("state")}
              >
                State
              </Th>
              <Th
                sorted={sortBy === "driversLicense"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("driversLicense")}
              >
                Driver's License
              </Th>
              <Th sorted={false} reversed={false} onSort={() => {}}>
                Actions
              </Th>
            </Table.Tr>
          </Table.Tbody>
          <Table.Tbody>
            {rows.length > 0 ? (
              rows
            ) : (
              <Table.Tr>
                <Table.Td colSpan={6}>
                  <Text fw={500} ta="center">
                    Nothing found
                  </Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </ScrollArea>

      <Modal
        opened={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Customer"
      >
        <TextInput
          label="Name"
          value={editingCustomer?.name || ""}
          onChange={(e) => handleInputChange("name", e.target.value)}
        />
        <TextInput
          label="Email"
          value={editingCustomer?.email || ""}
          onChange={(e) => handleInputChange("email", e.target.value)}
        />
        <TextInput
          label="Phone"
          value={editingCustomer?.phone || ""}
          onChange={(e) => handleInputChange("phone", e.target.value)}
        />
        <TextInput
          label="City"
          value={editingCustomer?.city || ""}
          onChange={(e) => handleInputChange("city", e.target.value)}
        />
        <TextInput
          label="State"
          value={editingCustomer?.state || ""}
          onChange={(e) => handleInputChange("state", e.target.value)}
        />
        <TextInput
          label="Driver's License"
          value={editingCustomer?.driversLicense || ""}
          onChange={(e) => handleInputChange("driversLicense", e.target.value)}
        />
        <Group mt="md">
          <Button onClick={handleUpdateCustomer}>Save</Button>
        </Group>
      </Modal>
    </>
  );
}
