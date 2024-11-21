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
  Button,
  Modal,
} from "@mantine/core";
import {
  IconSelector,
  IconChevronDown,
  IconChevronUp,
  IconSearch,
} from "@tabler/icons-react";
import classes from "../AdminCustomerView/AdminCustomerView.module.css";
import axios from "axios";

interface RowData {
  id: string;
  make: string;
  model: string;
  transmission: "AUTOMATIC" | "MANUAL";
  maintenance: "IN_MAINTENANCE" | "OUT_OF_SERVICE" | "IN_SERVICE";
  pricePerDay: number;
  city: string;
  state: string;
  year: number;
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
    Object.keys(item).some((key) => {
      const value = item[key as keyof RowData];
      return typeof value === "string" && value.toLowerCase().includes(query);
    })
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
        return String(b[sortBy]).localeCompare(String(a[sortBy]));
      }
      return String(a[sortBy]).localeCompare(String(b[sortBy]));
    }),
    payload.search
  );
}

export default function AdminVehicleView() {
  const [search, setSearch] = useState("");
  const [customerData, setCustomerData] = useState<RowData[]>([]);
  const [sortedData, setSortedData] = useState<RowData[]>([]);
  const [sortBy, setSortBy] = useState<keyof RowData | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<RowData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/admin/vehicle/"
        );
        const vehicles: RowData[] = response.data;
        setCustomerData(vehicles);
        setSortedData(vehicles); // Initialize sorted data with the fetched data
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

  const handleEdit = (vehicle: RowData) => {
    setEditingVehicle(vehicle);
    setEditModalOpen(true);
  };

  const handleUpdateVehicle = async () => {
    if (!editingVehicle) return;

    try {
      const response = await axios.put(
        `http://localhost:8000/admin/vehicle/${editingVehicle.id}`,
        editingVehicle
      );

      console.log(response);

      const updatedVehicle = customerData.map((vehicle) =>
        vehicle.id === editingVehicle.id ? editingVehicle : vehicle
      );

      setCustomerData(updatedVehicle);
      setSortedData(updatedVehicle);
      setEditModalOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = (field: keyof RowData, value: string) => {
    if (!editingVehicle) return;
    setEditingVehicle({ ...editingVehicle, [field]: value });
  };

  const rows = sortedData.map((row) => (
    <Table.Tr key={row.id}>
      <Table.Td>{row.id}</Table.Td>
      <Table.Td>{row.make}</Table.Td>
      <Table.Td>{row.model}</Table.Td>
      <Table.Td>{row.transmission}</Table.Td>
      <Table.Td>{row.maintenance}</Table.Td>
      <Table.Td>{row.pricePerDay}</Table.Td>
      <Table.Td>{row.city}</Table.Td>
      <Table.Td>{row.state}</Table.Td>
      <Table.Td>{row.year}</Table.Td>
      <Table.Td style={{ display: "flex", gap: "10px" }}>
        <Button size="xs" onClick={() => handleEdit(row)}>
          Edit
        </Button>
        <Button size="xs">Delete</Button>
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
                sorted={sortBy === "make"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("make")}
              >
                Make
              </Th>
              <Th
                sorted={sortBy === "model"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("model")}
              >
                Model
              </Th>
              <Th
                sorted={sortBy === "transmission"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("transmission")}
              >
                Transmission
              </Th>
              <Th
                sorted={sortBy === "maintenance"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("maintenance")}
              >
                Maintenance
              </Th>
              <Th
                sorted={sortBy === "pricePerDay"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("pricePerDay")}
              >
                Price/Day
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
                sorted={sortBy === "year"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("year")}
              >
                Year
              </Th>
            </Table.Tr>
          </Table.Tbody>
          <Table.Tbody>
            {rows.length > 0 ? (
              rows
            ) : (
              <Table.Tr>
                <Table.Td colSpan={8}>
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
        title="Edit Vehicle"
      >
        <TextInput
          label="Make"
          value={editingVehicle?.make || ""}
          onChange={(e) => handleInputChange("make", e.target.value)}
        />
        <TextInput
          label="Model"
          value={editingVehicle?.model || ""}
          onChange={(e) => handleInputChange("model", e.target.value)}
        />
        <TextInput
          label="Transmission"
          value={editingVehicle?.transmission || ""}
          onChange={(e) => handleInputChange("transmission", e.target.value)}
        />
        <TextInput
          label="Maintenance"
          value={editingVehicle?.maintenance || ""}
          onChange={(e) => handleInputChange("maintenance", e.target.value)}
        />
        <TextInput
          label="Price Per Day"
          value={editingVehicle?.pricePerDay || ""}
          onChange={(e) => handleInputChange("pricePerDay", e.target.value)}
        />
        <TextInput
          label="City"
          value={editingVehicle?.city || ""}
          onChange={(e) => handleInputChange("city", e.target.value)}
        />
        <TextInput
          label="State"
          value={editingVehicle?.state || ""}
          onChange={(e) => handleInputChange("state", e.target.value)}
        />
        <TextInput
          label="Year"
          value={editingVehicle?.year || ""}
          onChange={(e) => handleInputChange("year", e.target.value)}
        />
        <Group mt="md">
          <Button onClick={handleUpdateVehicle}>Save</Button>
        </Group>
      </Modal>
    </>
  );
}
