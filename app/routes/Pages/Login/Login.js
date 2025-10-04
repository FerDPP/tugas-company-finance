import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import {
  Form,
  FormGroup,
  Input,
  CustomInput,
  Button,
  Label,
  EmptyLayout,
  ThemeConsumer,
} from "./../../../components";
import { HeaderAuth } from "../../components/Pages/HeaderAuth";
import { FooterAuth } from "../../components/Pages/FooterAuth";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3001/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Login gagal");
        return;
      }

      // simpan token ke localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      alert("Login berhasil!");

      // redirect ke halaman utama
      history.push("/");
    } catch (err) {
      console.error("Error login:", err);
      alert("Terjadi error koneksi");
    }
  };

  return (
    <EmptyLayout>
      <EmptyLayout.Section center>
        <HeaderAuth title="Sign In to Application" />
        <Form className="mb-3" onSubmit={handleSubmit}>
          <FormGroup>
            <Label for="username">Username</Label>
            <Input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="username..."
              className="bg-white"
              required
            />
          </FormGroup>
          <FormGroup>
            <Label for="password">Password</Label>
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password..."
              className="bg-white"
              required
            />
          </FormGroup>
          <FormGroup>
            <CustomInput
              type="checkbox"
              id="rememberPassword"
              label="Remember Password"
              inline
            />
          </FormGroup>
          <ThemeConsumer>
            {({ color }) => (
              <Button color={color} block type="submit">
                Sign In
              </Button>
            )}
          </ThemeConsumer>
        </Form>

        {/* START Bottom Links */}
        <div className="d-flex mb-5">
          <Link to="/pages/forgotpassword" className="text-decoration-none">
            Forgot Password
          </Link>
          <Link to="/pages/register" className="ml-auto text-decoration-none">
            Register
          </Link>
        </div>
        {/* END Bottom Links */}

        <FooterAuth />
      </EmptyLayout.Section>
    </EmptyLayout>
  );
};

export default Login;
