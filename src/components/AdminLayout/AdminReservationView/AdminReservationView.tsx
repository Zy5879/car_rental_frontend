/* eslint-disable @typescript-eslint/no-unused-vars */
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
} from "@mantine/core";
import {
  IconSelector,
  IconChevronDown,
  IconChevronUp,
  IconSearch,
} from "@tabler/icons-react";
import classes from "./AdminReservationView.module.css";
import axios from "axios";
import MakeReservationModal from "./MakeReservationModal";

interface RowData {
  id: string;
  cust_id: string;
  vehicle_id: string;
  pickupLocation: string;
  dropOffLocation: string;
  pickupDateTime: string;
  dropOffDateTime: string;
  reservationStatus: string;
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

export default function AdminReservationView() {
  const [search, setSearch] = useState("");
  const [reservationData, setReservationData] = useState<RowData[]>([]);
  const [sortedData, setSortedData] = useState<RowData[]>([]);
  const [sortBy, setSortBy] = useState<keyof RowData | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingReservation, setEditingReservation] = useState<RowData | null>(
    null
  );
  const [makeReservationModalOpen, setReservationModalOpen] = useState(false);

  const handleEdit = (reservation: RowData) => {
    setEditingReservation(reservation);
    setEditModalOpen(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/admin/reservation/"
        );
        const reservations: RowData[] = response.data;
        setReservationData(reservations);
        setSortedData(reservations); // Initialize sorted data with the fetched data
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
    setSortedData(
      sortData(reservationData, { sortBy: field, reversed, search })
    );
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearch(value);
    setSortedData(
      sortData(reservationData, {
        sortBy,
        reversed: reverseSortDirection,
        search: value,
      })
    );
  };

  const handlePickUp = async (reservationId: string) => {
    try {
      const response = await axios.post(
        `http://localhost:8000/admin/reservation/${reservationId}/pickup`
      );

      if (response.status === 201) {
        alert(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleReturn = async (reservationId: string) => {
    try {
      const response = await axios.post(
        `http://localhost:8000/admin/reservation/${reservationId}/return`
      );

      if (response.status === 200) {
        alert(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const rows = sortedData.map((row) => (
    <Table.Tr key={row.id}>
      <Table.Td>{row.id}</Table.Td>
      <Table.Td>{row.cust_id}</Table.Td>
      <Table.Td>{row.vehicle_id}</Table.Td>
      <Table.Td>{row.pickupLocation}</Table.Td>
      <Table.Td>{row.dropOffLocation}</Table.Td>
      <Table.Td>{row.pickupDateTime}</Table.Td>
      <Table.Td>{row.dropOffDateTime}</Table.Td>
      <Table.Td>{row.reservationStatus}</Table.Td>
      <Table.Td
        style={{ display: "flex", flexDirection: "column", gap: "10px" }}
      >
        <Button size="xs" onClick={() => handleEdit(row)}>
          Edit
        </Button>
        <Button size="xs">Delete</Button>
        {row.reservationStatus === "PENDING" && (
          <Button onClick={() => handlePickUp(row.id)} size="xs">
            Pickup
          </Button>
        )}
        {row.reservationStatus === "ACTIVE" && (
          <Button onClick={() => handleReturn(row.id)} size="xs">
            Return
          </Button>
        )}
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <ScrollArea style={{ padding: "20px" }}>
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
        <Button onClick={() => setReservationModalOpen(true)}>
          Make A Reservation
        </Button>
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
                sorted={sortBy === "cust_id"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("cust_id")}
              >
                Cust_Id
              </Th>
              <Th
                sorted={sortBy === "vehicle_id"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("vehicle_id")}
              >
                Vehicle_Id
              </Th>
              <Th
                sorted={sortBy === "pickupLocation"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("pickupLocation")}
              >
                Pick Up
              </Th>
              <Th
                sorted={sortBy === "dropOffLocation"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("dropOffLocation")}
              >
                Drop Off
              </Th>
              <Th
                sorted={sortBy === "pickupDateTime"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("pickupDateTime")}
              >
                Pickup Time
              </Th>
              <Th
                sorted={sortBy === "dropOffDateTime"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("dropOffDateTime")}
              >
                Drop off Time
              </Th>
              <Th
                sorted={sortBy === "reservationStatus"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("reservationStatus")}
              >
                Status
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

      <MakeReservationModal
        opened={makeReservationModalOpen}
        onClose={() => setReservationModalOpen(false)}
      />
    </>
  );
}
