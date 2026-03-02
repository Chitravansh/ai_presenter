// const router = require("express").Router();
// const multer = require("multer");
// const AdmZip = require("adm-zip");
// // const pdf = require("pdf-parse");

// const { XMLParser } = require("fast-xml-parser");
// const Slide = require("../models/slide.model");
// const path = require("path");
// const fs = require("fs"); // ⭐ ADD


// const { PDFParse } = require('pdf-parse');







// /* ======================
//    MULTER
// ====================== */

// const storage = multer.diskStorage({
//   destination: "uploads/",
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   }
// });

// const upload = multer({ storage });



// /* ======================
//    UPLOAD ROUTE
// ====================== */

// router.post("/:sessionId", upload.single("file"), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ error: "No file uploaded" });
//     }

//     const sessionId = req.params.sessionId;
//     const filePath = req.file.path;
//     const ext = path.extname(req.file.originalname).toLowerCase();



 

// let slides = [];

// if (ext === ".pdf") {
//   try {
//     const buffer = fs.readFileSync(filePath);

//     const parser = new PDFParse({data : buffer});



//     const data = await parser.getText();

//      console.log("pdf parsing starts");
//     const chunks = data.text.match(/(.|[\r\n]){1,1200}/g) || [];

//     slides = chunks.map((chunk, i) => ({
//       sessionId,
//       slideNo: i + 1,
//       text: chunk
//     }));

//     await Slide.deleteMany({ sessionId });
//     await Slide.insertMany(slides);

//   } catch (err) {
//     console.log("PDF parse failed:", err.message);
//   }
// }


//     /* ======================
//        SAVE TO DB
//     ====================== */

//     if (slides.length) {
//       await Slide.deleteMany({ sessionId }); // clear old
//       await Slide.insertMany(slides);
//     }



//     /* ======================
//        RETURN FILE NAME
//     ====================== */

//     res.json({
//       message: "Upload successful",
//       file: req.file.filename
//     });

//   } catch (err) {
//     console.error("UPLOAD ERROR:", err);
//     res.status(500).json({ error: "Upload failed" });
//   }
// });

// module.exports = router;

const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ✅ Updated to v2 syntax
const { PDFParse } = require("pdf-parse"); 

const Slide = require("../models/slide.model");
const Session = require("../models/session.model"); 

/* ======================
   MULTER SETUP
====================== */
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

/* ======================
   GET ROUTE (Fetch active file on refresh)
====================== */
/* ======================
   GET ROUTE (Fetch active file on refresh)
====================== */
router.get("/:sessionId", async (req, res) => {
  try {
    const id = req.params.sessionId;
    console.log(`[GET] New tab checking for file in session: ${id}`);

    // 🔥 FIX: We removed the `_id` check that was crashing Mongoose.
    // Now it strictly searches for the sessionId string.
    const session = await Session.findOne({ sessionId: id });
    
    if (session && session.pptFile) {
      console.log(`[GET] File FOUND in database: ${session.pptFile}`);
      return res.json({ pptFile: session.pptFile });
    }
    
    console.log(`[GET] No file found in database for this session.`);
    return res.json({ pptFile: null });
  } catch (err) {
    console.error("GET SESSION ERROR:", err);
    res.status(500).json({ error: "Failed to fetch session data" });
  }
});

/* ======================
   UPLOAD ROUTE
====================== */
router.post("/:sessionId", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const id = req.params.sessionId;
    const filePath = req.file.path;
    const ext = path.extname(req.file.originalname).toLowerCase();
    let slides = [];

    if (ext === ".pdf") {
      try {
        const buffer = fs.readFileSync(filePath);
        console.log("pdf parsing starts");
        const parser = new PDFParse({ data: buffer });
        const data = await parser.getText();
        await parser.destroy(); 
        
        const chunks = data.text.match(/(.|[\r\n]){1,1200}/g) || [];
        slides = chunks.map((chunk, i) => ({
          sessionId: id,
          slideNo: i + 1,
          text: chunk
        }));
      } catch (err) {
        console.log("PDF parse failed:", err.message);
      }
    }

    if (slides.length) {
      await Slide.deleteMany({ sessionId: id });
      await Slide.insertMany(slides);
    }

    // 🔥 Save the file to the DB and log the exact result
    console.log(`[POST] Saving file ${req.file.filename} to session ${id}...`);
    
    const updatedSession = await Session.findOneAndUpdate(
      { $or: [{ sessionId: id }, { _id: id }] }, 
      { 
        $set: { pptFile: req.file.filename, sessionId: id } 
      }, 
      { upsert: true, returnDocument: 'after' }
    ).catch(() => {
      // Fallback if querying by _id fails during an upsert
      return Session.findOneAndUpdate(
        { sessionId: id },
        { pptFile: req.file.filename },
        { upsert: true, returnDocument: 'after' }
      );
    });

    console.log(`[POST] Database Save Result:`, updatedSession);

    res.json({
      message: "Upload successful",
      file: req.file.filename
    });

  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

/* ======================
   DELETE ROUTE (Remove file & clear DB)
====================== */
router.delete("/:sessionId", async (req, res) => {
  try {
    const sessionId = req.params.sessionId;

    const session = await Session.findOne({ sessionId });
    
    if (session && session.pptFile) {
      const filePath = path.join(__dirname, "../uploads", session.pptFile);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath); 
      }
    }

    await Slide.deleteMany({ sessionId });
    await Session.findOneAndUpdate({ sessionId }, { pptFile: null });

    res.json({ message: "Presentation deleted successfully" });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ error: "Failed to delete presentation" });
  }
});

module.exports = router;













































// const router = require("express").Router();
// const multer = require("multer");
// const AdmZip = require("adm-zip");
// const { XMLParser } = require("fast-xml-parser");
// const pdfParse = require("pdf-parse"); // ⭐ NEW
// const Slide = require("../models/slide.model");
// const path = require("path");
// const fs = require("fs");



// /* ======================
//    MULTER
// ====================== */

// const storage = multer.diskStorage({
//   destination: "uploads/",
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   }
// });

// const upload = multer({ storage });



// /* ======================
//    UPLOAD ROUTE
// ====================== */

// router.post("/:sessionId", upload.single("file"), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ error: "No file uploaded" });
//     }

//     const sessionId = req.params.sessionId;
//     const filePath = req.file.path;
//     const ext = path.extname(req.file.originalname).toLowerCase();

//     let slides = [];



//     /* ======================
//        PPTX PARSE (existing)
//     ====================== */

//     if (ext === ".pptx"

//     ) {
//       const zip = new AdmZip(filePath);
//       const entries = zip.getEntries();
//       const parser = new XMLParser();

//       let slideNo = 1;

//       for (const entry of entries) {
//         if (entry.entryName.includes("ppt/slides/slide")) {
//           const xml = entry.getData().toString("utf8");

//           const json = parser.parse(xml);

//           const text = JSON.stringify(json)
//             .replace(/[^a-zA-Z0-9 .]/g, " ")
//             .trim();

//           slides.push({
//             sessionId,
//             slideNo: slideNo++,
//             text
//           });
//         }
//       }
//     }



//     /* ======================
//        PDF PARSE ⭐ NEW
//     ====================== */

//     if (ext === ".pdf") {

//       const buffer = fs.readFileSync(filePath);

//       const data = await pdfParse(buffer);

//       // split into chunks (like slides)
//       const chunks = data.text.match(/(.|[\r\n]){1,1200}/g) || [];

//       chunks.forEach((chunk, index) => {
//         slides.push({
//           sessionId,
//           slideNo: index + 1,
//           text: chunk.trim()
//         });
//       });
//     }



//     /* ======================
//        SAVE TO DB
//     ====================== */

//     if (slides.length) {
//       await Slide.deleteMany({ sessionId }); // clear old
//       await Slide.insertMany(slides);
//     }



//     /* ======================
//        RESPONSE
//     ====================== */

//     res.json({
//       message: "File uploaded & parsed successfully",
//       file: req.file.filename
//     });

//   } catch (err) {
//     console.error("UPLOAD ERROR:", err);
//     res.status(500).json({ error: "Upload failed" });
//   }
// });

// module.exports = router;













// const router = require("express").Router();
// const multer = require("multer");
// const AdmZip = require("adm-zip");
// const { XMLParser } = require("fast-xml-parser");
// const pdfParse = require("pdf-parse"); // ⭐ NEW
// const fs = require("fs");
// const path = require("path");
// const Slide = require("../models/slide.model");



// /* ======================
//    Multer
// ====================== */

// const storage = multer.diskStorage({
//   destination: "uploads/",
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   }
// });

// const upload = multer({ storage });



// /* ======================
//    Upload route
// ====================== */

// router.post("/:sessionId", upload.single("file"), async (req, res) => {
//   try {
//     const sessionId = req.params.sessionId;
//     const filePath = req.file.path;
//     const ext = path.extname(req.file.originalname).toLowerCase();

//     let slides = [];



//     /* ======================
//        PPTX PARSE
//     ====================== */

//     if (ext === ".pptx") {

//       const zip = new AdmZip(filePath);
//       const entries = zip.getEntries();
//       const parser = new XMLParser();

//       let slideNo = 1;

//       for (const entry of entries) {
//         if (entry.entryName.includes("ppt/slides/slide")) {
//           const xml = entry.getData().toString("utf8");

//           const json = parser.parse(xml);

//           const text = JSON.stringify(json)
//             .replace(/[^a-zA-Z0-9 .]/g, " ")
//             .trim();

//           slides.push({
//             sessionId,
//             slideNo: slideNo++,
//             text
//           });
//         }
//       }
//     }



//     /* ======================
//        PDF PARSE ⭐ NEW
//     ====================== */

//     if (ext === ".pdf") {

//       const buffer = fs.readFileSync(filePath);

//       const data = await pdfParse(buffer);

//       // split into chunks (~slide size)
//       const chunks = data.text.match(/(.|[\r\n]){1,1200}/g);

//       chunks.forEach((chunk, index) => {
//         slides.push({
//           sessionId,
//           slideNo: index + 1,
//           text: chunk
//         });
//       });
//     }



//     /* ======================
//        Save to DB
//     ====================== */

//     if (slides.length) {
//       await Slide.deleteMany({ sessionId });
//       await Slide.insertMany(slides);
//     }



//     res.json({
//       message: "File uploaded & parsed",
//       file: req.file.filename
//     });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Upload failed" });
//   }
// });

// module.exports = router;
