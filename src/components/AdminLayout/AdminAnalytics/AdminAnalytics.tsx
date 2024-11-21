import { Button } from "@mantine/core";
import { useState } from "react";
import RentVehiclesModal from "./RentedVehiclesModal";
import InHouseVehiclesModal from "./InHouseVehiclesModal";
import TotalRevenueModal from "./RevenueModal";

export default function AdminAnalytics() {
  const [content, setContent] = useState<any>(null); // Content fetched from modals
  const [currentModal, setCurrentModal] = useState<string | null>(null); // Tracks active modal
  const [rentedVehiclesModalOpened, setRentedVehiclesModalOpened] =
    useState(false);
  const [inHouseVehiclesModalOpened, setInHouseVehiclesModalOpened] =
    useState(false);
  const [totalRevenueModalOpened, setTotalRevenueModalOpened] = useState(false);

  const handleOpenModal = (modal: string) => {
    // Clear content when opening a new modal
    setContent(null);
    setCurrentModal(modal);

    if (modal === "rentedVehicles") setRentedVehiclesModalOpened(true);
    if (modal === "inHouseVehicles") setInHouseVehiclesModalOpened(true);
    if (modal === "totalRevenue") setTotalRevenueModalOpened(true);
  };

  const handleCloseModal = () => {
    setRentedVehiclesModalOpened(false);
    setInHouseVehiclesModalOpened(false);
    setTotalRevenueModalOpened(false);
  };

  return (
    <>
      <main
        style={{
          width: "100%",
          padding: 30,
        }}
      >
        <section
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Button onClick={() => handleOpenModal("rentedVehicles")}>
            Rented Vehicles Report
          </Button>
          <Button onClick={() => handleOpenModal("inHouseVehicles")}>
            In-House Vehicles Report
          </Button>
          <Button onClick={() => handleOpenModal("totalRevenue")}>
            Revenue Report
          </Button>

          <RentVehiclesModal
            opened={rentedVehiclesModalOpened}
            onClose={handleCloseModal}
            setContent={(data) => {
              setContent(data);
              setCurrentModal("rentedVehicles");
            }}
          />

          <InHouseVehiclesModal
            opened={inHouseVehiclesModalOpened}
            onClose={handleCloseModal}
            setContent={(data) => {
              setContent(data);
              setCurrentModal("inHouseVehicles");
            }}
          />

          <TotalRevenueModal
            opened={totalRevenueModalOpened}
            onClose={handleCloseModal}
            setContent={(data) => {
              setContent(data);
              setCurrentModal("totalRevenue");
            }}
          />
        </section>

        <section>
          {content && (
            <section style={{ padding: 20 }}>
              {/* Conditional Rendering Based on Active Modal */}
              {currentModal === "rentedVehicles" && (
                <>
                  <h3>Rented Vehicles Report</h3>
                  <p style={{ textAlign: "left" }}>
                    Total Vehicles: {content.length}
                  </p>
                  <pre>{JSON.stringify(content, null, 2)}</pre>
                </>
              )}
              {currentModal === "inHouseVehicles" && (
                <>
                  <h3>In-House Vehicles Report</h3>
                  <p style={{ textAlign: "left" }}>
                    Total Vehicles: {content.length}
                  </p>
                  <pre>{JSON.stringify(content, null, 2)}</pre>
                </>
              )}
              {currentModal === "totalRevenue" && (
                <>
                  <h3>Revenue Report</h3>
                  <p style={{ textAlign: "left" }}>Total Revenue: ${content}</p>
                </>
              )}
            </section>
          )}
        </section>
      </main>
    </>
  );
}
