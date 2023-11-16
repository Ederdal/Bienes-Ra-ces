import  Express  from "express";
import {
    insertProperty,
    updateProperty,
    deleteProperty,
    findAllProperties,
    findAllByUserProperties,
    findOneProperty,
    formProperty
} from "../controllers/propertyController.js";

const router =Express.Router();
router.get("/create/", formProperty);

export default router;