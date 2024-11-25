import React, { useEffect, useState } from "react";
import {
  Stack,
  Text,
  SearchBox,
  PrimaryButton,
  DefaultButton,
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
  Panel,
  PanelType,
} from "@fluentui/react";
import { useBoolean } from "@fluentui/react-hooks";
import { AiFillDashboard } from "react-icons/ai";
import AddResumePanel from "./AddResumePanel";
import ResumePreview from "./ResumePreview";
import { useNavigate } from "react-router-dom";
import { MdOutlinePreview } from "react-icons/md";
import { FiEdit2 } from "react-icons/fi";
import { RiDeleteBin6Line, RiArrowGoBackLine } from "react-icons/ri";
import axios from "axios";
import { initializeIcons } from "@fluentui/react/lib/Icons";
initializeIcons();
const Dashboard = () => {
  const [isOpen, { setTrue: openPanel, setFalse: dismissPanel }] =
    useBoolean(false);
  const [isPreviewOpen, { setTrue: openPreview, setFalse: closePreview }] =
    useBoolean(false);
  const [items, setItems] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  // Fetch data from the API when the component mounts
  useEffect(() => {
    fetchData();
  }, []);
  const token = localStorage.getItem("token");
  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:5232/api/User", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data;
      console.log("Data : ", data);

      // Format the data according to the columns in DetailsList
      const formattedData = data.map((user: any, index: number) => ({
        id: user.id,
        sno: index + 1,
        name: user.name,
        designation: user.designation,
        email: user.email,
        mobile: user.phone,
        profile: user.description,
        image: user.image ? user.image : "No Image",
        isDeleted: user.isDeleted,
        actions: (
          <div style={{ display: "flex", gap: "10px" }}>
            {!user.isDeleted && (
              <>
                <MdOutlinePreview
                  style={{ cursor: "pointer", fontSize: "18px", color: "blue" }}
                  onClick={() => handlePreview(user.id)}
                />
                <FiEdit2
                  style={{ cursor: "pointer", fontSize: "18px" }}
                  onClick={() => handleEdit(user.id)}
                />
                <RiDeleteBin6Line
                  style={{ cursor: "pointer", fontSize: "18px" }}
                  onClick={() => handleSoftDelete(user.id)}
                />
              </>
            )}
            {user.isDeleted && (
              <>
                <MdOutlinePreview
                  style={{ cursor: "pointer", fontSize: "18px", color: "blue" }}
                  onClick={() => handlePreview(user.id)}
                />
                <RiArrowGoBackLine
                  style={{
                    cursor: "pointer",
                    fontSize: "18px",
                    color: "green",
                  }}
                  onClick={() => handleUndoDelete(user.id)}
                />
              </>
            )}
          </div>
        ),
      }));
      setItems(formattedData);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };
  // Handle actions
  const handleEdit = async (id: string) => {
    try {
      const response = await axios.get(`http://localhost:5232/api/User/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const user = response.data;

      const initialValues = {
        id: user.id, // Pass ID here
        firstName: user.name.split(" ")[0],
        middleName: user.name.split(" ")[1] || "",
        lastName: user.name.split(" ")[2] || "",
        address: {
          house: user.address?.house || "",
          street: user.address?.street || "",
          landmark: user.address?.landmark || "",
          district: user.address?.district || "",
          city: user.address?.city || "",
          pincode: user.address?.pincode || 0,
          state: user.address?.state || "",
        },
        phone: user.phone.toString(),
        email: user.email,
        designation: user.designation,
        description: user.description,
        about: user.about,
        education: user.education || [
          { school: "", class: "", cgpa: "", yearOfPassing: "" },
        ],
        experience: user.experience || [
          { designation: "", startDate: "", endDate: "", skills: [""] },
        ],
      };

      setSelectedUser(initialValues);
      openPanel();
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  const handleSoftDelete = async (id: string) => {
    try {
      const confirm = window.confirm(
        "Are you sure you want to delete this user?"
      );
      if (confirm) {
        await axios.put(
          `http://localhost:5232/api/User/delete/${id}`,
          {
            isDeleted: true,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        fetchData();
      }
    } catch (error) {
      console.error("Error soft deleting user:", error);
    }
  };
  const handleUndoDelete = async (id: string) => {
    try {
      const confirm = window.confirm(
        "Are you sure you want to revert this user?"
      );
      if (confirm) {
        await axios.put(
          `http://localhost:5232/api/User/undo/${id}`,
          {
            isDeleted: false,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        fetchData();
      }
    } catch (error) {
      console.error("Error undoing delete for user:", error);
    }
  };
  const handlePreview = async (userId: string) => {
    console.log("UserId", userId);

    try {
      const response = await axios.get(
        `http://localhost:5232/api/User/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Response : ", response.data);

      setSelectedUser(response.data);
      openPreview();
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };
  const handleLogout = () => {
    const confirm = window.confirm("Are You sure you want to logout?");
    if (confirm) {
      localStorage.removeItem("token");
      navigate("/");
    } else {
      console.log("cancelled");
    }
  };
  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5232/api/User/search?name=${searchTerm}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response.data;
      const formattedData = data.map((user: any, index: number) => ({
        id: user.id,
        sno: index + 1,
        name: user.name,
        designation: user.designation,
        email: user.email,
        mobile: user.phone,
        profile: user.description,
        image: user.image ? user.image : "No Image",
        isDeleted: user.isDeleted,
        actions: (
          <div style={{ display: "flex", gap: "10px" }}>
            {!user.isDeleted && (
              <>
                <MdOutlinePreview
                  style={{ cursor: "pointer", fontSize: "18px", color: "blue" }}
                  onClick={() => handlePreview(user.id)}
                />
                <FiEdit2
                  style={{ cursor: "pointer", fontSize: "18px" }}
                  onClick={() => handleEdit(user.id)}
                />
                <RiDeleteBin6Line
                  style={{ cursor: "pointer", fontSize: "18px" }}
                  onClick={() => handleSoftDelete(user.id)}
                />
              </>
            )}
            {user.isDeleted && (
              <RiArrowGoBackLine
                style={{ cursor: "pointer", fontSize: "18px", color: "green" }}
                onClick={() => handleUndoDelete(user.id)}
              />
            )}
          </div>
        ),
      }));

      setItems(formattedData);
    } catch (error) {
      console.error("Error searching users:", error);
    }
  };
  const columns = [
    {
      key: "column1",
      name: "S No.",
      fieldName: "sno",
      minWidth: 50,
      maxWidth: 50,
      isResizable: true,
    },
    {
      key: "column2",
      name: "Name",
      fieldName: "name",
      minWidth: 100,
      maxWidth: 150,
      isResizable: true,
    },
    {
      key: "column3",
      name: "Designation",
      fieldName: "designation",
      minWidth: 100,
      maxWidth: 150,
      isResizable: true,
    },
    {
      key: "column4",
      name: "Email",
      fieldName: "email",
      minWidth: 150,
      maxWidth: 200,
      isResizable: true,
    },
    {
      key: "column5",
      name: "Mobile No",
      fieldName: "mobile",
      minWidth: 100,
      maxWidth: 150,
      isResizable: true,
    },
    {
      key: "column6",
      name: "Profile",
      fieldName: "profile",
      minWidth: 100,
      maxWidth: 150,
      isResizable: true,
    },
    {
      key: "column7",
      name: "Image",
      fieldName: "image",
      minWidth: 100,
      maxWidth: 150,
      isResizable: true,
      onRender: (item: any) =>
        item.image !== "No Image" ? (
          <img
            src={item.image}
            alt="Profile"
            style={{ width: "70px", height: "auto", objectFit: "cover" }}
          />
        ) : (
          "No Image"
        ),
    },
    {
      key: "column8",
      name: "Actions",
      fieldName: "actions",
      minWidth: 100,
      maxWidth: 150,
      isResizable: true,
    },
  ];
  const onRenderFooterContent = React.useCallback(
    () => (
      <div>
        <DefaultButton onClick={dismissPanel}>Cancel</DefaultButton>
      </div>
    ),
    [dismissPanel]
  );
  return (
    <Stack
      horizontal
      styles={{ root: { minHeight: "100vh", width: "1670px" } }}
    >
      {/* Sidebar */}
      <Stack
        verticalAlign="start"
        styles={{
          root: {
            width: 210,
            backgroundColor: "white",
            padding: 20,
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
          },
        }}
        tokens={{ childrenGap: 15 }}
      >
        <img
          src="./Images/Capsitech.png"
          alt="Company Logo"
          style={{ height: 60, marginBottom: 10, width: "160px" }}
        />
        <Stack horizontal>
          <AiFillDashboard style={{ fontSize: "24px", color: "#0078d4" }} />
          <Text
            variant="mediumPlus"
            styles={{
              root: {
                marginLeft: "10px",
                fontWeight: "regular",
                marginBottom: 0,
                color: "#0078d4",
                marginTop: "18",
              },
            }}
          >
            Dashboard
          </Text>
        </Stack>
      </Stack>
      {/* Main Content */}
      <Stack grow>
        <Stack
          horizontal
          verticalAlign="center"
          styles={{
            root: {
              width: "100%",
              backgroundColor: "#1f75fe",
              padding: "10px 20px",
              height: "50px",
            },
          }}
        >
          <PrimaryButton
            text="Logout"
            styles={{
              root: {
                fontWeight: "bold",
                marginLeft: 10,
                width: "10px",
                height: "40px",
                backgroundColor: "#1f75fe",
                borderRadius: "10px",
                fontSize: "13px",
                color: "white",
              },
            }}
            onClick={() => {
              handleLogout();
            }}
          />
        </Stack>
        <Stack
          horizontal
          tokens={{ childrenGap: 20 }}
          style={{ marginTop: "15px" }}
        >
          <Stack grow>
            <PrimaryButton
              text="+ Add"
              styles={{
                root: {
                  fontWeight: "bold",
                  marginLeft: 10,
                  width: "10px",
                  height: "40px",
                  backgroundColor: "#1f75fe",
                  borderRadius: "10px",
                  fontSize: "13px",
                },
              }}
              onClick={() => {
                setSelectedUser(null); // Clear for new entry
                openPanel();
              }}
            />
            <Panel
              isOpen={isOpen}
              onDismiss={() => {
                dismissPanel();
                fetchData(); // Refresh data after closing panel
              }}
              closeButtonAriaLabel="Close"
              headerText={
                selectedUser ? "Edit Resume Details" : "Add Resume Details"
              }
              onRenderFooterContent={onRenderFooterContent}
              isFooterAtBottom={true}
              customWidth="700px"
              type={PanelType.custom}
            >
              <AddResumePanel
                initialValues={selectedUser || {}}
                onClose={dismissPanel}
              />
            </Panel>
            <Panel
              isOpen={isPreviewOpen}
              onDismiss={closePreview}
              headerText="Resume Preview"
              type={PanelType.medium}
            >
              <ResumePreview user={selectedUser} />
            </Panel>
          </Stack>
          <Stack grow>
            <SearchBox
              placeholder="Search by name"
              styles={{
                root: {
                  maxWidth: 200,
                  marginLeft: "1100px",
                  position: "sticky",
                  borderRadius: "5px",
                },
              }}
              value={searchTerm}
              onChange={(_, newValue) => setSearchTerm(newValue || "")}
              onSearch={handleSearch}
            />
          </Stack>
        </Stack>
        {/* Table Section */}
        <Stack horizontalAlign="start" styles={{ root: { padding: 20 } }}>
          <DetailsList
            items={items}
            columns={columns}
            setKey="set"
            layoutMode={DetailsListLayoutMode.fixedColumns}
            selectionMode={SelectionMode.none}
            styles={{ root: { width: "100%" } }}
          />
        </Stack>
      </Stack>
    </Stack>
  );
};
export default Dashboard;