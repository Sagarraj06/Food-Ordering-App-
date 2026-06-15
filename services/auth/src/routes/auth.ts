import express from "express";
const router = express.Router();
import {loginUser,addUserRole,myProfile} from "../controllers/auth.js"
import {isAuth} from "../middlewares/isAuth.js"

router.post("/login",loginUser);
router.put("/add/role",isAuth,addUserRole);
router.get("/me",isAuth,myProfile);

export default router;
