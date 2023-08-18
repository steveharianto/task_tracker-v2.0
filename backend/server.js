const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors"); // Import the cors package

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to the SQLite database
const db = new sqlite3.Database("database.sqlite");

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Get all items
app.get("/api/items", (req, res) => {
    db.all("SELECT * FROM items", (err, rows) => {
        if (err) {
            console.error(err);
            res.status(500).send("Server error");
            return;
        }
        res.json(rows);
    });
});

db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS items (
        id TEXT PRIMARY KEY,
        title TEXT,
        description TEXT,
        time_worked INTEGER,
        is_completed BOOLEAN
      )
    `);
});

app.post("/api/items", (req, res) => {
    const { id, title, description, time_worked, is_completed } = req.body;

    db.run("INSERT INTO items (id, title, description, time_worked, is_completed) VALUES (?, ?, ?, ?, ?)", [id, title, description, time_worked, is_completed], (err) => {
        if (err) {
            console.error(err);
            res.status(500).send("Server error");
            return;
        }
        res.status(201).send("Item created");
    });
});

app.put("/api/items/:id", (req, res) => {
    const { id } = req.params;
    const { title, description, time_worked, is_completed } = req.body;

    const updateParams = [];
    let updateQuery = "UPDATE items SET";

    db.get("SELECT time_worked FROM items WHERE id = ?", [id], (err, row) => {
        if (err) {
            console.error(err);
            res.status(500).send("Server error");
            return;
        }

        if (title !== undefined) {
            updateParams.push(title);
            updateQuery += " title = ?,";
        }
        if (description !== undefined) {
            updateParams.push(description);
            updateQuery += " description = ?,";
        }
        if (time_worked !== undefined) {
            updateParams.push(time_worked + row.time_worked);
            updateQuery += " time_worked = ?,";
        }
        if (is_completed !== undefined) {
            updateParams.push(is_completed);
            updateQuery += " is_completed = ?,";
        }

        // Remove the trailing comma
        updateQuery = updateQuery.slice(0, -1);

        updateQuery += " WHERE id = ?";

        updateParams.push(id);

        db.run(updateQuery, updateParams, (err) => {
            if (err) {
                console.error(err);
                res.status(500).send("Server error");
                return;
            }
            res.status(200).send("Item updated");
        });
    });
});

app.delete("/api/items/:id", (req, res) => {
    const id = req.params.id;

    db.run("DELETE FROM items WHERE id = ?", [id], (err) => {
        if (err) {
            console.error(err);
            res.status(500).send("Server error");
            return;
        }
        res.status(200).send("Item deleted");
    });
});
