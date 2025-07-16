import express from 'express';
import {ENV} from "./config/env.js";
import {db} from "./config/db.js";
import {  favouritesTable } from './db/schema.js';
import { and, eq } from 'drizzle-orm';


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

    const newFavourite= await db.insert(favouritesTable).values({
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

//adding the delete endpoint
app.delete("/api/favourites/:userId/:recipeId", async(req, res) => {
    try{
        const { userId,  recipeId } = req.params;

        await db.delete(favouritesTable).where(
            and(eq(favouritesTable.userId, userId), eq(favouritesTable.recipeId, parseInt(recipeId)))
        );

        res.status(200).json({message: "Favourite removed successfully"});

    }catch (error){
       console.error("Error removing a favourite:", error);
       res.status(500).json({error: "Something went wrong while removing a favourite"});
   }

    }
)


app.listen(PORT, () => {
    console.log('Server is running on port:', PORT);
})