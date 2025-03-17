import { Client, Users } from 'node-appwrite';
import{Storage} from "appwrite"

// This Appwrite function will be executed every time your function is triggered
export default async ({ req, res, log, error }) => {
  // You can use the Appwrite SDK to interact with other services
  // For this example, we're using the Users service
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(req.headers['x-appwrite-key'] ?? '');
  const users = new Users(client);

  const storage = new Storage(client);

  try {
    const response = await users.list();
    // Log messages and errors to the Appwrite Console
    // These logs won't be seen by your end users
    log(`Total users: ${response.total}`);
  } catch(err) {
    error("Could not list users: " + err.message);
  }


  if (req.path === "/file_list" && req.method === "POST") {
    try {
      const files = await storage.listFiles('67d12ea900089fc446d9');
      const url = await storage.getFileDownload()
      
      return res.json({ success: true, files: files.files });
    } catch (err) {
      error("Storage Error: " + err.message);
      return res.json({ success: false, error: err.message });
    }
  }

   // Handle getDownloadUrl endpoint
   if (req.path === "/getDownloadUrl" && req.method === "POST") {
   // const { bucketId, fileId } = req.body;

    //if (!bucketId || !fileId) {
     // return res.json({ success: false, error: "bucketId and fileId are required." });
  //  }

    try {
      const downloadUrl = await storage.getFileDownload('67d12ea900089fc446d9', '67d13bb50006dbe69dc8');
      return res.json({ success: true, downloadUrl });
    } catch (err) {
      error("Error fetching file URL: " + err.message);
      return res.json({ success: false, error: "Failed to get file download URL" });
    }
  }

  return res.json({
    motto: "Build like a team of hundreds_",
    learn: "https://appwrite.io/docs",
    connect: "https://appwrite.io/discord",
    getInspired: "https://builtwith.appwrite.io",
  });
};
