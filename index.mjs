import express from 'express';
import mysql from 'mysql2/promise';

const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));

const pool = mysql.createPool({
    host: "qn0cquuabmqczee2.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "tpjcy4v8vlm5z2k4",
    password: "jq8ymslmnpy6ovr2",
    database: "yb96ih654ow9fn4x",
    connectionLimit: 10,
    waitForConnections: true
});

app.get('/', async(req, res) => {
    try {
        let authorsSql = "SELECT authorId, firstName, lastName FROM authors ORDER BY lastName, firstName";
        let categoriesSql = "SELECT DISTINCT category FROM quotes ORDER BY category";
        const [authors] = await pool.query(authorsSql);
        const [categories] = await pool.query(categoriesSql);
        res.render('home.ejs', {authors, categories});
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send("Database error!");
    }
});

app.post('/searchKeyword', async(req, res) => {
    try {
        let keyword = req.body.keyword;
        let sql = `SELECT quote, authorId, firstName, lastName
                FROM quotes 
                NATURAL JOIN authors
                WHERE quote LIKE ?`;
        const [rows] = await pool.query(sql, [`%${keyword}%`]);
        res.render('quotes.ejs', {rows});
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send("Database error!");
    }
});

app.post('/searchAuthor', async(req, res) => {
    try {
        let authorId = req.body.authorId;
        let sql = `SELECT quote, authorId, firstName, lastName
                FROM quotes
                NATURAL JOIN authors
                WHERE authorId = ?`;
        const [rows] = await pool.query(sql, [authorId]);
        res.render('quotes.ejs', {rows});
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send("Database error!");
    }
});

app.post('/searchGender', async(req, res) => {
    try {
        let gender = req.body.gender;
        let sql = `SELECT quote, authorId, firstName, lastName
                FROM quotes
                NATURAL JOIN authors
                WHERE sex = ?`;
        const [rows] = await pool.query(sql, [gender]);
        res.render('quotes.ejs', {rows});
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send("Database error!");
    }
});

app.post('/searchCategory', async(req, res) => {
    try {
        let category = req.body.category;
        let sql = `SELECT quote, authorId, firstName, lastName
                FROM quotes
                NATURAL JOIN authors
                WHERE category = ?`;
        const [rows] = await pool.query(sql, [category]);
        res.render('quotes.ejs', {rows});
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send("Database error!");
    }
});

app.post('/searchLikes', async(req, res) => {
    try {
        let minLikes = req.body.minLikes;
        let maxLikes = req.body.maxLikes;
        let sql = `SELECT quote, likes, authorId, firstName, lastName
                FROM quotes
                NATURAL JOIN authors
                WHERE likes BETWEEN ? AND ?
                ORDER BY likes DESC`;
        const [rows] = await pool.query(sql, [minLikes, maxLikes]);
        res.render('likes.ejs', {rows});
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send("Database error!");
    }
});

app.get('/api/authors/:id', async(req, res) => {
    let authorId = req.params.id;
    let sql = "SELECT * FROM authors WHERE authorId = ?";
    const [rows] = await pool.query(sql, [authorId]);
    res.json(rows);
});

app.listen(3000, ()=>{
    console.log("server started");
});