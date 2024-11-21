import { Paper, TextInput, PasswordInput, Button, Title } from "@mantine/core";
import classes from "../LoginPage/LoginPage.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEmployeeStore } from "../../../../store/useEmployeeStore";

export function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const setEmp = useEmployeeStore((state) => state.setEmployee);
  const navigate = useNavigate();

  const handleEmployeeLogin = async () => {
    try {
      const response = await axios.post("http://localhost:8000/admin/login", {
        email,
        password,
      });
      if (response.data) {
        const employee = response.data.employee;

        setEmp(employee);
        localStorage.setItem("emp", JSON.stringify(employee));
        navigate("/admin/home");
      } else {
        alert(response.data.message || "Login Failed");
      }
    } catch (error) {
      console.log(error);
      alert("Login Failed: Invalid Email or Password");
    }
  };

  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form} radius={0} p={30}>
        <Title order={2} className={classes.title} ta="center" mt="md" mb={50}>
          Car Rental System
        </Title>
        <TextInput
          label="Email address"
          placeholder="hello@gmail.com"
          size="md"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <PasswordInput
          label="Password"
          placeholder="Your password"
          mt="md"
          size="md"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button onClick={handleEmployeeLogin} fullWidth mt="xl" size="md">
          Admin Login
        </Button>
      </Paper>
    </div>
  );
}
