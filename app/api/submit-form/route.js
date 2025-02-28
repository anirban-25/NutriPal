import { db, storage } from "@/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { userId, formData, file } = await req.json();

    // Upload file if it exists
    let fileURL = null;
    if (file) {
      const fileRef = ref(storage, `medicalReports/${userId}/${file.name}`);
      await uploadBytes(fileRef, Buffer.from(file.data, "base64"));
      fileURL = await getDownloadURL(fileRef);
    }

    // Save data to Firestore
    const docRef = doc(db, "users", userId, "medicalForms", "userdata");
    await setDoc(docRef, {
      ...formData,
      fileURL,
      timestamp: serverTimestamp(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error submitting form:", error);
    return NextResponse.json({ success: false, error: error.message });
  }
}
