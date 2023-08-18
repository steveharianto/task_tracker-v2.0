import { TextInput, ActionIcon } from "@mantine/core";
import { IconChecklist, IconPlus } from "@tabler/icons-react";
import { useContext, useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { AppContext } from "../App";

export function AddTask() {
    const [newTask, setNewTask] = useState("");
    const { setListData } = useContext(AppContext);

    const handleAddTask = async () => {
        // Create a unique ID using uuid or any other method
        const id = uuidv4();

        // Make the POST request to your backend API
        console.log("Sending POST request to:", "/api/items");
        axios
            .post("http://localhost:5000/api/items", {
                id,
                title: newTask,
                description: "Default Description",
                time_worked: 0,
                is_completed: false,
            })
            .then(() => {
                // Handle success if needed
                console.log("Task added successfully");
                // You might also refresh the list of items here
            })
            .catch((error) => {
                console.error("Error adding task:", error);
                // Handle error if needed
            });
        try {
            const response = await axios.get("http://localhost:5000/api/items"); // Fetch updated data from the API
            setListData(response.data); // Update the data in the parent component
            console.log("Task added callback invoked");
        } catch (error) {
            console.error("Error fetching updated data:", error);
        }
    };

    return (
        <TextInput
            style={{ marginBottom: "1em" }}
            icon={<IconChecklist size="1.1rem" stroke={1.5} />}
            radius="md"
            size="md"
            rightSection={
                <ActionIcon
                    size={32}
                    radius="md"
                    variant="filled"
                    onClick={handleAddTask} // Call the function when the button is pressed
                    color="#1871c1"
                >
                    <IconPlus size="1.1rem" stroke={1.5} />
                </ActionIcon>
            }
            placeholder="Add Task"
            rightSectionWidth={42}
            value={newTask}
            onChange={(event) => setNewTask(event.target.value)}
            onKeyDown={(event) => {
                if (event.key === "Enter") {
                    handleAddTask();
                }
            }}
        />
    );
}
