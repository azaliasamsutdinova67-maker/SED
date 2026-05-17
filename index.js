const express = require("express");
const path = require("path");
const { Pool } = require("pg");

const app = express();

app.use(express.json());

app.use(
    express.static(
        path.join(__dirname, "public")
    )
);

/* PostgreSQL */

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

/* GET */

app.get("/documents", async (req, res) => {

    try{

        const result =
            await pool.query(
                "SELECT * FROM documents ORDER BY id DESC"
            );

        res.json(result.rows);

    } catch(err){

        console.log(err);

        res.status(500).json(err);

    }

});

/* POST */

app.post("/documents", async (req, res) => {

    try{

        const result =
            await pool.query(

                `INSERT INTO documents
                (name, desc, status, date)
                VALUES ($1, $2, $3, $4)
                RETURNING *`,

                [
                    req.body.name,
                    req.body.desc,
                    "В создании",
                    new Date().toLocaleDateString()
                ]

            );

        res.json(result.rows[0]);

    } catch(err){

        console.log(err);

        res.status(500).json(err);

    }

});

/* PUT */

app.put("/documents/:id", async (req, res) => {

    try{

        await pool.query(

            `UPDATE documents
            SET name=$1,
                desc=$2,
                status=$3
            WHERE id=$4`,

            [
                req.body.name,
                req.body.desc,
                req.body.status,
                req.params.id
            ]

        );

        res.json({
            message:"updated"
        });

    } catch(err){

        console.log(err);

        res.status(500).json(err);

    }

});

/* DELETE */

app.delete("/documents/:id", async (req, res) => {

    try{

        await pool.query(

            "DELETE FROM documents WHERE id=$1",

            [req.params.id]

        );

        res.json({
            message:"deleted"
        });

    } catch(err){

        console.log(err);

        res.status(500).json(err);

    }

});

/* ROOT */

app.get("/", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "public",
            "login.html"
        )
    );

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {

    console.log(
        `Server started on port ${PORT}`
    );

});
