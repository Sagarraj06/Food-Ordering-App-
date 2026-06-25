import express from "express"
import { isAuth, isSeller } from "../middlewares/isAuth.js";
import { addRestrant, fetchMyRestaurant } from "../controllers/restaraunts.js";
import uplodeFile from "../middlewares/multer.js";
const router = express.Router();
router.post("/new",isAuth,isSeller,uplodeFile,addRestrant)
router.get("/my",isAuth, isSeller, fetchMyRestaurant);
export default router;