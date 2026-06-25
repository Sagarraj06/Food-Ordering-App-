import multer from "multer";

const storage = multer.memoryStorage();
const uplodeFile= multer({storage}).single("file");

export default uplodeFile; 