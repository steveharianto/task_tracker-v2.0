import "./App.css";
import { useState, useEffect, createContext, Dispatch, SetStateAction } from "react";
import { MainList } from "./components/MainList";
import { MantineProvider } from "@mantine/core";
import axios from "axios";
interface ListObject {
    data: {
        id: string;
        title: string;
        description: string;
        time_worked: number;
        is_completed: boolean;
    }[];
}
export const AppContext = createContext({ listData: [], setListData: Dispatch<SetStateAction<ListObject[]>> });
export default function App() {
    const [listData, setListData] = useState([]);
    useEffect(() => {
        axios
            .get("http://localhost:5000/api/items")
            .then((response) => {
                setListData(response.data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, [listData]);

    return (
        <AppContext.Provider value={{ listData, setListData }}>
            <MantineProvider withGlobalStyles withNormalizeCSS theme={{ colorScheme: "dark" }}>
                <MainList data={listData} />
            </MantineProvider>
        </AppContext.Provider>
    );
}
