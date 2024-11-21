import { useState } from "react";
import {
  Modal,
  TextInput,
  Button,
  ScrollArea,
  Table,
  Text,
} from "@mantine/core";
import axios from "axios";

interface MakeReservationModalProps {
  opened: boolean;
  onClose: () => void;
}

export default function MakeReservationModal({
  opened,
  onClose,
}: MakeReservationModalProps) {
  const [pickUpDate, setPickUpDate] = useState("");
  const [dropOffDate, setDropOffDate] = useState("");
  const [availableVehicles, setAvailableVehicles] = useState<any[]>([]);
  const [reservedVehicle, setReservedVehicle] = useState<any | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [customerId, setCustomerId] = useState("");

  const handleClick = () => {
    setAvailableVehicles([]);
    onClose();
  };

  const calculatePrice = (start: string, end: string, dailyRate: number) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const days = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    return days * dailyRate;
  };

  const handleReserveNow = async (vehicleId: string) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/vehicles/${vehicleId}`
      );
      const vehicle = response.data;

      const price = calculatePrice(
        pickUpDate,
        dropOffDate,
        vehicle.pricePerDay || 100
      );
      setReservedVehicle({
        ...vehicle,
        price,
      });
      handleClick();
      setDetailsModalOpen(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCloseDetailsModal = () => {
    setReservedVehicle(null);
    setDetailsModalOpen(false);
  };

  const fetchAvailableVehicles = async () => {
    if (!pickUpDate || !dropOffDate) {
      alert("Please fill in required Fields");
      return;
    }
    try {
      const response = await axios.get(
        "http://localhost:8000/vehicles/available",
        {
          params: { pickUpDate, dropOffDate },
        }
      );
      setAvailableVehicles(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleConfirmReservation = async () => {
    if (!customerId) {
      alert("Please enter a Customer Id");
      return;
    }

    try {
      const reservationData = {
        cust_id: customerId,
        vehicle_id: reservedVehicle.id,
        pickupLocation: reservedVehicle.state,
        dropOffLocation: reservedVehicle.state,
        pickUpDateTime: new Date(pickUpDate).toISOString(),
        dropffDateTime: new Date(dropOffDate).toISOString(),
      };

      const response = await axios.post(
        "http://localhost:8000/admin/reservation",
        reservationData
      );
      alert(response.data);
      setReservedVehicle(null);
      setDetailsModalOpen(false);
    } catch (error) {
      console.log(error);
      alert("Failed to Complete Reservation");
    }
  };

  return (
    <>
      <Modal opened={opened} onClose={handleClick} title="Make a reservation">
        <TextInput
          label="Pickup Date"
          placeholder="YYYY-MM-DD"
          value={pickUpDate}
          onChange={(e) => setPickUpDate(e.target.value)}
        ></TextInput>
        <TextInput
          label="Drop Off Date"
          placeholder="YYYY-MM-DD"
          value={dropOffDate}
          onChange={(e) => setDropOffDate(e.target.value)}
        ></TextInput>
        <Button mt="md" onClick={fetchAvailableVehicles}>
          Find Available Vehicles
        </Button>

        {availableVehicles.length > 0 && (
          <ScrollArea mt="md" style={{}}>
            <Table>
              <Table.Tbody>
                {availableVehicles.map((vehicle) => (
                  <Table.Tr key={vehicle.id}>
                    <Table.Td>{vehicle.id}</Table.Td>
                    <Table.Td>{vehicle.make}</Table.Td>
                    <Table.Td>{vehicle.model}</Table.Td>
                    <Table.Td>{vehicle.year}</Table.Td>
                    <Table.Td>
                      <Button
                        onClick={() => handleReserveNow(vehicle.id)}
                        size="xs"
                      >
                        Reserve Now
                      </Button>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </ScrollArea>
        )}
      </Modal>

      {reservedVehicle && (
        <Modal
          opened={detailsModalOpen}
          onClose={handleCloseDetailsModal}
          title="Reservation Details"
        >
          <TextInput
            label="Customer ID"
            placeholder="Enter Customer ID"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
          />
          <Text>
            Vehicle: {`${reservedVehicle.make} ${reservedVehicle.model}`}
          </Text>
          <Text>Pickup Location: {reservedVehicle.state}</Text>
          <Text>Drop Off Location: {reservedVehicle.state}</Text>
          <Text>From: {pickUpDate}</Text>
          <Text>To: {dropOffDate}</Text>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              padding: 10,
              alignItems: "center",
              justifyContent: "center",
              gap: 20,
            }}
          >
            <Button onClick={handleCloseDetailsModal}>Close</Button>
            <Button onClick={handleConfirmReservation}>
              Confirm Reservation
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
}
