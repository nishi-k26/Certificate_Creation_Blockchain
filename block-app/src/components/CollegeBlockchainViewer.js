import React, { useEffect, useState } from "react";
import Web3 from "web3";
import BlocksTable from "./BlocksTable";
import "./CollegeBlockchainViewer.css"; // Import CSS file
import abi from "../artifacts/contracts/CollegeBlockchain.sol/CollegeBlockchain.json";

const CollegeBlockchainViewer = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [department, setDepartment] = useState("");
  const [studentName, setStudentName] = useState("");
  const [usn, setUsn] = useState("");
  const [dob, setDob] = useState("");
  const [semester, setSemester] = useState("");
  const [cgpa, setCgpa] = useState("");
  const [studentAddress, setStudentAddress] = useState("");
  const [blocks, setBlocks] = useState([]);

  useEffect(() => {
    const initWeb3 = async () => {
      // Ensure a wallet (like MetaMask) is available
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try {
          await window.ethereum.enable(); // Request wallet connection
          setWeb3(web3);

          const contractAddress = "0xF0422fE99a1d4D32ae6740dfd3AB92bc98cCFB8F"; // Replace with your contract address
          const contractAbi = abi.abi;
          console.log(contractAddress);
          console.log(contractAbi);
          const contract = new web3.eth.Contract(contractAbi, contractAddress);
          setContract(contract);
        } catch (err) {
          console.error("Error initializing Web3:", err);
        }
      } else {
        console.error(
          "Ethereum provider not found. Ensure MetaMask is installed."
        );
      }
    };

    initWeb3(); // Initialize Web3 on component mount
  }, []);

  const getSelectedAddress = async () => {
    if (web3) {
      const accounts = await web3.eth.getAccounts();
      if (accounts.length === 0) {
        console.error(
          "No Ethereum account connected. Please connect a wallet."
        );
        return null;
      } else {
        return accounts[0];
      }
    }
    return null;
  };

  const createGenesisBlock = async () => {
    if (
      contract &&
      department &&
      studentName &&
      usn &&
      dob &&
      semester &&
      cgpa &&
      studentAddress
    ) {
      const selectedAddress = await getSelectedAddress();
      if (selectedAddress) {
        try {
          await contract.methods
            .createGenesisBlock(
              department,
              studentName,
              usn,
              dob,
              semester,
              cgpa,
              studentAddress
            )
            .send({
              from: selectedAddress,
            });
        } catch (error) {
          console.error("Error creating genesis block:", error);
        }
      }
    } else {
      console.error("Please fill in all fields.");
    }
  };

  const addBlock = async () => {
    if (
      contract &&
      department &&
      studentName &&
      usn &&
      dob &&
      semester &&
      cgpa &&
      studentAddress
    ) {
      const selectedAddress = await getSelectedAddress();
      if (selectedAddress) {
        try {
          // Log input values before adding block
          console.log("Student Name:", department);
          console.log("USN:", studentName);
          console.log("College Name:", usn);
          console.log("Comptetition/Exam:", dob);
          console.log("Position/Marks:", semester);
          console.log("Data:", cgpa);
          console.log("Additional Information:", studentAddress);

          await contract.methods
            .addBlock(
              department,
              studentName,
              usn,
              dob,
              semester,
              cgpa,
              studentAddress
            )
            .send({
              from: selectedAddress,
            });
        } catch (error) {
          console.error("Error adding block:", error);
        }
      }
    } else {
      console.error("Please fill in all fields.");
    }
  };

  const getDepartmentBlocks = async () => {
    if (contract && department) {
      try {
        const blocks = await contract.methods
          .getDepartmentBlocks(department)
          .call();
        setBlocks(blocks);
      } catch (error) {
        console.error("Error retrieving blocks:", error);
      }
    } else {
      console.error("Please select a department.");
    }
  };

  return (
    <div className="container">
      <h1>Create Certificate</h1>
      <div className="input-container">
        <input
          type="text"
          placeholder="Student Name"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        />
        <input
          type="text"
          placeholder="USN"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
        />
        <input
          type="text"
          placeholder="College Name"
          value={usn}
          onChange={(e) => setUsn(e.target.value)}
        />
        <input
          type="text"
          placeholder="Competition/Exam"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
        />
        <input
          type="text"
          placeholder="Position/Marks"
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
        />
        <input
          type="text"
          placeholder="Date"
          value={cgpa}
          onChange={(e) => setCgpa(e.target.value)}
        />
        <input
          className="student-address"
          type="text"
          placeholder="Additional Information"
          value={studentAddress}
          onChange={(e) => setStudentAddress(e.target.value)}
        />
      </div>
      <div className="button-container">
        {/* <button onClick={createGenesisBlock}>Create Genesis Block</button> */}
        <button onClick={addBlock}>Add Block</button>
        {/* <button onClick={getDepartmentBlocks}>Get Blocks</button> */}
      </div>
      {blocks.length > 0 ? (
        <BlocksTable blocks={blocks} />
      ) : (
        <p className="no-blocks">Add Certificate Details</p>
      )}
    </div>
  );
};

export default CollegeBlockchainViewer;

