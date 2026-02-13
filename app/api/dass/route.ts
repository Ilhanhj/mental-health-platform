import { ConnectDB } from "@/lib/config/db"; // Sesuaikan path import ini
import Result from "../../../lib/models/Result";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    await ConnectDB();
    const results = await Result.find({});
    return NextResponse.json({ success: true, results });
  } catch (error: any) {
    return NextResponse.json({ success: false, msg: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await ConnectDB();

    const body = await request.json();

    if (!body.name) {
      return NextResponse.json({ success: false, msg: "Nama wajib diisi" }, { status: 400 });
    }

    await Result.create(body);

    return NextResponse.json({ success: true, msg: "Hasil DASS berhasil disimpan" }, { status: 200 });
  } catch (error) {
    console.error("🔥 ERROR DETAIL:", error);
    return NextResponse.json({ success: false, error: error.message });
  }
}

export async function DELETE(request: Request) {
  try {
    await ConnectDB();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, msg: "ID is required" }, { status: 400 });
    }

    await Result.findByIdAndDelete(id);

    return NextResponse.json({ success: true, msg: "Result deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("🔥 ERROR DETAIL:", error);
    return NextResponse.json({ success: false, error: error.message });
  }
}
