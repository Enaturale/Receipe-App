import express from 'express';
import {ENV} from "./config/env.js";
import {db} from "./config/db.js";
import {  favourites } from './db/schema.js';


const app = express();
const PORT = ENV.PORT || 5001;

app.use(express.json());

app.get("/api/health", (req, res) => {
    res.status(200).json({success: true})
})

//adding endpoints
//to add data to favourites Table in Neon
app.post("/api/favourites", async (req, res) => {
    // Logic to add data to the database
   try{
    const {userId,  recipeId, title, image, cookTime, servings} = req.body;

    if(!userId || !recipeId || !title){
        return res.status(400).json({error: "Check again, all fields are required"});
    }

    const newFavourite= await db.insert(favourites).values({
         userId,
        recipeId,
        title,
        image,
        cookTime,
        servings
    }).returning(); //returning the newly created record

    res.status(201).json(newFavourite[0]);

   }catch (error){
       console.error("Error adding favourite:", error);
       res.status(500).json({error: "Internal server error"});
   }
})

app.listen(PORT, () => {
    console.log('Server is running on port:', PORT);
})