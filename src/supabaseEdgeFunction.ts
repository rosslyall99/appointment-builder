// supabase/functions/send-appointment-enquiry/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend";

// ----------------------
// CORS helper
// ----------------------
function corsResponse(body: any, status = 200) {
    return new Response(body, {
        status,
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey"
        }
    });
}

serve(async (req) => {
    if (req.method === "OPTIONS") {
        return corsResponse("ok");
    }

    try {
        const body = await req.json();

        // Validate required fields
        if (!body.name || !body.email || !body.branch || !body.date || !body.time) {
            return corsResponse(JSON.stringify({ error: "Missing required fields" }), 400);
        }

        // Normalise appointment type for DB + email
        body.appointmentType =
            body.appointmentType ||
            body.hireType ||
            body.appointmentMode ||
            "unknown";

        // Normalise branch (branchId or branch)
        body.branch = body.branchId || body.branch;

        // Initialise Resend
        const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

        // Build HTML email
        const html = buildEmailHTML(body);

        // Send email
        await resend.emails.send({
            from: "Slanj Enquiries <enquiries@slanjkilts.com>",
            to: "ross@slanj.com",
            subject: "New Appointment Enquiry",
            html
        });

        // Insert into Supabase
        const supabaseUrl = Deno.env.get("SUPABASE_URL");
        const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

        const dbRes = await fetch(`${supabaseUrl}/rest/v1/web_enquiries`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                apikey: supabaseKey,
                Authorization: `Bearer ${supabaseKey}`
            },
            body: JSON.stringify({
                name: body.name,
                email: body.email,
                phone: body.phone,
                appointment_mode: body.appointmentMode,
                hire_type: body.hireType || null,
                buy_count: body.buyCount || null,
                buy_items: body.buyItems || null,
                adults: body.adults || null,
                children: body.children || null,
                age_category: body.ageCategory || null,
                appointment_type: body.appointmentType,
                party_appointments: body.partyAppointments || null,
                branch: body.branch,
                date: body.date,
                time: body.time,
                notes: body.notes || "",
                created_at: new Date().toISOString()
            })
        });

        if (!dbRes.ok) {
            const error = await dbRes.text();
            console.error("DB insert error:", error);
            return corsResponse(JSON.stringify({ error: "Database insert failed" }), 500);
        }

        return corsResponse(JSON.stringify({ success: true }), 200);

    } catch (err) {
        console.error(err);
        return corsResponse(JSON.stringify({ error: "Server error" }), 500);
    }
});

// ----------------------
// EMAIL TEMPLATE BUILDER
// ----------------------

function buildEmailHTML(body: any) {

    // ----------------------
    // HIRE
    // ----------------------
    if (body.appointmentMode === "hire") {
        return `
      <h2>Hire Appointment Enquiry</h2>
      <p><strong>Name:</strong> ${body.name}</p>
      <p><strong>Email:</strong> ${body.email}</p>
      <p><strong>Phone:</strong> ${body.phone}</p>
      <p><strong>Hire Type:</strong> ${body.hireType}</p>
      <p><strong>Adults:</strong> ${body.adults}</p>
      <p><strong>Children:</strong> ${body.children}</p>
      <p><strong>Age Category:</strong> ${body.ageCategory}</p>
      <p><strong>Appointment Type:</strong> ${body.appointmentType}</p>
      <p><strong>Branch:</strong> ${body.branch}</p>
      <p><strong>Date:</strong> ${body.date}</p>
      <p><strong>Time:</strong> ${body.time}</p>
      <p><strong>Notes:</strong> ${body.notes}</p>

      <h3>Party Appointments</h3>
      <pre>${JSON.stringify(body.partyAppointments, null, 2)}</pre>
    `;
    }

    // ----------------------
    // BUY
    // ----------------------
    if (body.appointmentMode === "buy") {
        return `
      <h2>Buying Appointment Enquiry</h2>
      <p><strong>Name:</strong> ${body.name}</p>
      <p><strong>Email:</strong> ${body.email}</p>
      <p><strong>Phone:</strong> ${body.phone}</p>
      <p><strong>People:</strong> ${body.buyCount}</p>

      <h3>Items</h3>
      <ul>
        ${body.buyItems
                .map(
                    (item: any, i: number) =>
                        `<li>Person ${i + 1}: ${item.type}${item.type === "other" ? ` — ${item.details}` : ""
                        }</li>`
                )
                .join("")}
      </ul>

      <p><strong>Branch:</strong> ${body.branch}</p>
      <p><strong>Date:</strong> ${body.date}</p>
      <p><strong>Time:</strong> ${body.time}</p>
      <p><strong>Notes:</strong> ${body.notes}</p>
    `;
    }

    // ----------------------
    // COMBO (BUY + HIRE)
    // ----------------------
    if (body.appointmentMode === "combo") {
        return `
      <h2>Combo Appointment Enquiry (Buy & Hire)</h2>

      <p><strong>Name:</strong> ${body.name}</p>
      <p><strong>Email:</strong> ${body.email}</p>
      <p><strong>Phone:</strong> ${body.phone}</p>

      <h3>Hire Details</h3>
      <p><strong>Hire Type:</strong> ${body.hireType}</p>
      <p><strong>Adults:</strong> ${body.adults}</p>
      <p><strong>Children:</strong> ${body.children}</p>
      <p><strong>Age Category:</strong> ${body.ageCategory}</p>

      <h3>Buy Details</h3>
      <p><strong>People:</strong> ${body.buyCount}</p>
      <ul>
        ${body.buyItems
                .map(
                    (item: any, i: number) =>
                        `<li>Person ${i + 1}: ${item.type}${item.type === "other" ? ` — ${item.details}` : ""
                        }</li>`
                )
                .join("")}
      </ul>

      <h3>Appointment Info</h3>
      <p><strong>Branch:</strong> ${body.branch}</p>
      <p><strong>Date:</strong> ${body.date}</p>
      <p><strong>Time:</strong> ${body.time}</p>
      <p><strong>Notes:</strong> ${body.notes}</p>
    `;
    }

    // ----------------------
    // FALLBACK
    // ----------------------
    return "<p>Unknown appointment type</p>";
}