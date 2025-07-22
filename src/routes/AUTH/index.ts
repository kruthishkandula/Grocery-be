import express from "express";
import { login, logout, register } from "./service";
import { authenticate } from "../../common/middleware";

const router = express.Router();

// Using the same pattern as the other routers in the project
router.post('/login', login);
router.post('/register', register);
router.post('/logout', authenticate, logout); // Protected with authentication

export {
    router as AUTH
}
