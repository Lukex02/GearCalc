import React, { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { printReportPDF } from "../services/Utils";
import DatabaseService from "../services/DatabaseService";

const SignupScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const navigation = useNavigation();

  const handleSignup = () => {
    // Perform signup logic here
    console.log("Creating new account for:", name, email, password);
    DatabaseService.signUp(name, email, password).then((res) => {
      if (res.error) {
        console.log("Error:", res.error);
      } else {
        console.log(res.data);
      }
    });
  };

  const handleLogin = () => {
    // Perform login logic here
    console.log("Login:", email, password);
    DatabaseService.logIn(email, password).then((res) => {
      if (res.error) {
        console.log("Error:", res.error);
      } else {
        console.log(res.data);
      }
    });
  };
  const handlePrint = () => {
    printReportPDF();
  };

  return (
    <View>
      <Text>Signup Screen</Text>
      <TextInput placeholder="Name" value={name} onChangeText={setName} style={{ marginBottom: 10 }} />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={{ marginBottom: 10 }} />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ marginBottom: 10 }}
      />
      <Button title="Login" onPress={handleLogin} />
      <Button title="Signup" onPress={handleSignup} />
      <Button title="Print" onPress={handlePrint} />
    </View>
  );
};

export default SignupScreen;
