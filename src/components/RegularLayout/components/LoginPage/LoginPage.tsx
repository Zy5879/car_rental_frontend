import {
  Paper,
  TextInput,
  PasswordInput,
  Button,
  Title,
  Text,
  Anchor,
} from "@mantine/core";
import classes from "./LoginPage.module.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { useUserStore } from "../../../../store/useUserStore";
import { useNavigate } from "react-router-dom";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const setUser = useUserStore((state) => state.setUser);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/customer/login",
        { email, password }
      );

      if (response.data.currentCustomer) {
        const user = response.data.currentCustomer;

        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
        navigate("/");
      } else {
        alert("Login Failed: Invaild Email or Password");
        return;
      }
    } catch (error) {
      console.log(error);
      alert("Login Failed: Invaild Email or Password");
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
        <Button onClick={handleLogin} fullWidth mt="xl" size="md">
          Login
        </Button>

        <Text ta="center" mt="md">
          Don&apos;t have an account?{" "}
          <Anchor<"a"> href="/signup" fw={700}>
            Register
          </Anchor>
        </Text>
        <Link to="/admin/login">
          <Button fullWidth mt="xl" size="md">
            Admin Login
          </Button>
        </Link>
      </Paper>
    </div>
  );
}
