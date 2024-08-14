import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
	connectionString:
		"postgresql://postgres:foURbYADEEfpnVvbyDVAsofGCwSsVsQY@viaduct.proxy.rlwy.net:22583/railway",
});

export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url);
	const id = searchParams.get("id");

	if (id) {
		try {
			const result = await pool.query(
				"SELECT id, description, latitude, longitude, county, severity, status, before_img, after_img FROM violations WHERE id = $1",
				[id]
			);

			if (result.rows.length === 0) {
				return NextResponse.json(
					{ error: "Violation not found" },
					{ status: 404 }
				);
			} else {
				return NextResponse.json(result.rows[0], { status: 200 });
			}
		} catch (error) {
			console.error("Error fetching data:", error);
			return NextResponse.json(
				{ error: "Internal Server Error" },
				{ status: 500 }
			);
		}
	} else {
		// Return all violations if no ID is provided
		try {
			const result = await pool.query(
				"SELECT id, description, latitude, longitude, county, severity, status, before_img, after_img FROM violations LIMIT 20;"
			);
			return NextResponse.json(result.rows, { status: 200 });
		} catch (error) {
			console.error("Error fetching data:", error);
			return NextResponse.json(
				{ error: "Internal Server Error" },
				{ status: 500 }
			);
		}
	}
}
