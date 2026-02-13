import { NextResponse } from "next/server";
import { ConnectDB } from "@/lib/config/db"; // Sesuaikan path import ini
import EmailModel from "../../../lib/models/Email";

export async function GET(request) {
  try {
    await ConnectDB();

    // Ambil semua data dari database
    const emails = await EmailModel.find({});

    // Kirim sebagai JSON
    return NextResponse.json({ success: true, emails });
  } catch (error) {
    console.error("🔥 ERROR DETAIL:", error);
    return NextResponse.json({ success: false, error: error.message });
  }
}
export async function POST(request) {
  try {
    await ConnectDB();

    const { email } = await request.json();

    const emailExists = await EmailModel.findOne({ email: email });

    if (emailExists) {
      return NextResponse.json({ success: false, msg: "Email already subscribed" }, { status: 400 });
    }

    await EmailModel.create({ email });

    return NextResponse.json({ success: true, message: "Email Added" });
  } catch (error) {
    console.error("🔥 ERROR DETAIL:", error);
    return NextResponse.json({ success: false, error: error.message });
  }
}

export async function DELETE(request) {
  try {
    await ConnectDB();

    // 1. AMBIL ID DARI URL (Query Params)
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, msg: "ID is required" }, { status: 400 });
    }

    await EmailModel.findByIdAndDelete(id);

    return NextResponse.json({ success: true, msg: "Email deleted successfully" });
  } catch (error) {
    console.error("🔥 ERROR DETAIL:", error);
    return NextResponse.json({ success: false, error: error.message });
  }
}
