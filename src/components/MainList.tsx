import { Checkbox } from "@mantine/core";
import { AddTask } from "./AddTask";
import { IconTrash } from "@tabler/icons-react";
import axios from "axios";
import Stopwatch from "./Stopwatch";
interface ListObject {
    data: {
        id: string;
        title: string;
        description: string;
        time_worked: number;
        is_completed: boolean;
    }[];
}
function formatTime(timeInSeconds: number): string {
    if (timeInSeconds < 60) {
        return `${timeInSeconds} seconds`;
    } else if (timeInSeconds < 3600) {
        const minutes = Math.floor(timeInSeconds / 60);
        return `${minutes} minutes`;
    } else {
        const hours = Math.floor(timeInSeconds / 3600);
        const remainingMinutes = Math.floor((timeInSeconds % 3600) / 60);
        return `${hours} hours ${remainingMinutes} minutes`;
    }
}

export function MainList({ data }: ListObject) {
    const handleCheckboxChange = async (id: string, isCompleted: boolean) => {
        try {
            await axios.put(`http://localhost:5000/api/items/${id}`, { is_completed: !isCompleted });
        } catch (error) {
            console.error("Error updating checkbox:", error);
        }
    };

    const handleDeleteTask = async (id: string) => {
        try {
            await axios.delete(`http://localhost:5000/api/items/${id}`);
            // Handle the task deletion in your state management or data handling
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    const handleTitleEdit = async (id: string, newTitle: string) => {
        try {
            await axios.put(`http://localhost:5000/api/items/${id}`, { title: newTitle });
        } catch (error) {
            console.error("Error updating title:", error);
        }
    };
    const completedItems = data.filter((item) => item.is_completed);
    const incompleteItems = data.filter((item) => !item.is_completed);

    return (
        <div style={{ marginTop: "3em" }}>
            <div className="listItem">
                <AddTask key={data.length} />
                {incompleteItems.map((item) => (
                    <div key={item.id} className="listItem-item fade-in">
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <Checkbox size="lg" style={{ marginRight: "1em" }} checked={item.is_completed} onChange={() => handleCheckboxChange(item.id, item.is_completed)} />
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <p
                                    contentEditable
                                    onBlur={(e) => handleTitleEdit(item.id, e.target.innerText)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            (e.currentTarget as HTMLInputElement).blur();
                                        }
                                    }}
                                    style={{ textDecoration: item.is_completed ? "line-through" : "none", fontSize: "18px", outline: "none", marginBottom: "0", paddingBottom: "0" }}
                                >
                                    {item.title}
                                </p>
                                <p style={{ marginTop: "0", paddingTop: "0", textAlign: "left", fontSize: "0.7em" }}>{formatTime(item.time_worked)}</p>
                            </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <Stopwatch itemId={item.id} />
                            <IconTrash size="1.5rem" color="#e03131" stroke={1.5} style={{ marginRight: "1em", marginLeft: "0.5em" }} onClick={() => handleDeleteTask(item.id)} />
                        </div>
                    </div>
                ))}

                <div style={{ marginTop: "3em" }}></div>
                {completedItems.map((item) => (
                    <div key={item.id} className="listItem-item fade-in">
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <Checkbox size="lg" style={{ marginRight: "1em" }} checked={item.is_completed} onChange={() => handleCheckboxChange(item.id, item.is_completed)} />
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <p
                                    contentEditable
                                    onBlur={(e) => handleTitleEdit(item.id, e.target.innerText)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            (e.currentTarget as HTMLInputElement).blur();
                                        }
                                    }}
                                    style={{ textDecoration: item.is_completed ? "line-through" : "none", fontSize: "18px", outline: "none", marginBottom: "0", paddingBottom: "0" }}
                                >
                                    {item.title}
                                </p>
                                <p style={{ marginTop: "0", paddingTop: "0", textAlign: "left", fontSize: "0.7em" }}>{formatTime(item.time_worked)}</p>
                            </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <Stopwatch itemId={item.id} />
                            <IconTrash size="1.5rem" color="#e03131" stroke={1.5} style={{ marginRight: "1em", marginLeft: "0.5em" }} onClick={() => handleDeleteTask(item.id)} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
