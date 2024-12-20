// Updated client: App.tsx

import React, { useEffect, useState } from "react";
import CryptoJS from "crypto-js";

const API_URL = "http://localhost:8080";

function App() {
  const [data, setData] = useState<string>("");
  const [hash, setHash] = useState<string>("");
  const [verified, setVerified] = useState<boolean | null>(null);
  const [recoveryMessage, setRecoveryMessage] = useState<string>("");

  useEffect(() => {
    getData();
  }, []);

  const generateHash = (data: string) => {
    return CryptoJS.SHA256(data).toString(CryptoJS.enc.Hex);
  };

  const getData = async () => {
    const response = await fetch(API_URL);
    const { data, hash } = await response.json();
    setData(data);
    setHash(hash);
    setVerified(null); // Reset verification state
    setRecoveryMessage(""); // Clear any previous recovery messages
  };

  const updateData = async () => {
    const newHash = generateHash(data);
    await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({ data, hash: newHash }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    await getData();
  };

  const verifyData = () => {
    const computedHash = generateHash(data);
    setVerified(computedHash === hash);
  };

  const recoverData = async () => {
    setRecoveryMessage("Data tampered! Recovering original data...");
    await getData();
    setRecoveryMessage("Original data restored.");
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        position: "absolute",
        padding: 0,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: "20px",
        fontSize: "30px",
      }}
    >
      <div>Saved Data</div>
      <input
        style={{ fontSize: "30px" }}
        type="text"
        value={data}
        onChange={(e) => setData(e.target.value)}
      />

      <div style={{ display: "flex", gap: "10px" }}>
        <button style={{ fontSize: "20px" }} onClick={updateData}>
          Update Data
        </button>
        <button style={{ fontSize: "20px" }} onClick={verifyData}>
          Verify Data
        </button>
        <button style={{ fontSize: "20px" }} onClick={recoverData}>
          Recover Data
        </button>
      </div>

      {verified !== null && (
        <div style={{ fontSize: "20px", color: verified ? "green" : "red" }}>
          {verified ? "Data is valid" : "Data has been tampered with!"}
        </div>
      )}

      {recoveryMessage && (
        <div style={{ fontSize: "20px", color: "orange" }}>
          {recoveryMessage}
        </div>
      )}
    </div>
  );
}

export default App;
