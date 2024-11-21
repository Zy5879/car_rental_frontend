import { useState } from "react";
import { Modal, TextInput, Button } from "@mantine/core";
import axios from "axios";

interface RentedVehiclesModalProps {
  opened: boolean;
  onClose: () => void;
  setContent: (content: any) => void;
}

export default function RentVehiclesModal({
  opened,
  onClose,
  setContent,
}: RentedVehiclesModalProps) {
  const [pickUpDate, setPickUpDate] = useState("");
  const [dropOffDate, setDropOffDate] = useState("");

  const fetchRentalReport = async () => {
    try {
      const response = await axios.get("http://localhost:8000/admin/rented", {
        params: {
          startDate: pickUpDate,
          endDate: dropOffDate,
        },
      });
      alert(response.data.message);
      setContent(response.data.report);
      onClose();
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  return (
    <>
      <Modal opened={opened} onClose={onClose} title="Rental Report">
        <TextInput
          label="Start Date"
          placeholder="YYYY-MM-DD"
          value={pickUpDate}
          onChange={(e) => setPickUpDate(e.target.value)}
        ></TextInput>
        <TextInput
          label="End Date"
          placeholder="YYYY-MM-DD"
          value={dropOffDate}
          onChange={(e) => setDropOffDate(e.target.value)}
        ></TextInput>
        <Button mt="md" onClick={fetchRentalReport}>
          Generate Rental Report
        </Button>
      </Modal>
    </>
  );
}
