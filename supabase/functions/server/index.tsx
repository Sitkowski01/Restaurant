import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

app.use("*", cors());
app.use("*", logger(console.log));

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

// Get all tables with their current availability
app.get("/make-server-95a25493/tables", async (c) => {
  try {
    const tables = await kv.getByPrefix("table:");
    const tableData = tables.map(t => JSON.parse(t));
    return c.json({ success: true, tables: tableData });
  } catch (error) {
    console.error("Error fetching tables:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Initialize tables if they don't exist
app.post("/make-server-95a25493/init-tables", async (c) => {
  try {
    const tables = [
      { id: '1', number: 'T01', x: 10, y: 10, width: 80, height: 80, shape: 'circle', capacity: '2', tags: ['window'], status: 'available' },
      { id: '2', number: 'T02', x: 110, y: 10, width: 80, height: 80, shape: 'circle', capacity: '2', tags: ['window'], status: 'available' },
      { id: '3', number: 'T03', x: 210, y: 10, width: 80, height: 80, shape: 'circle', capacity: '2', tags: [], status: 'available' },
      { id: '4', number: 'T04', x: 310, y: 10, width: 100, height: 60, shape: 'rectangle', capacity: '4', tags: ['window'], status: 'available' },
      { id: '5', number: 'T05', x: 430, y: 10, width: 100, height: 60, shape: 'rectangle', capacity: '4', tags: [], status: 'available' },
      { id: '6', number: 'T06', x: 10, y: 120, width: 80, height: 80, shape: 'circle', capacity: '2', tags: ['quiet'], status: 'available' },
      { id: '7', number: 'T07', x: 110, y: 120, width: 80, height: 80, shape: 'circle', capacity: '2', tags: [], status: 'available' },
      { id: '8', number: 'T08', x: 210, y: 120, width: 100, height: 60, shape: 'rectangle', capacity: '4', tags: [], status: 'available' },
      { id: '9', number: 'T09', x: 330, y: 120, width: 80, height: 80, shape: 'circle', capacity: '2', tags: ['quiet'], status: 'available' },
      { id: '10', number: 'T10', x: 430, y: 120, width: 100, height: 60, shape: 'rectangle', capacity: '4', tags: [], status: 'available' },
      { id: '11', number: 'T11', x: 60, y: 230, width: 120, height: 80, shape: 'rectangle', capacity: '6', tags: [], status: 'available' },
      { id: '12', number: 'T12', x: 200, y: 230, width: 120, height: 80, shape: 'rectangle', capacity: '6', tags: [], status: 'available' },
      { id: '13', number: 'T13', x: 340, y: 230, width: 120, height: 80, shape: 'rectangle', capacity: '6', tags: ['window'], status: 'available' },
      { id: '14', number: 'T14', x: 10, y: 340, width: 80, height: 80, shape: 'circle', capacity: '2', tags: ['window'], status: 'available' },
      { id: '15', number: 'T15', x: 110, y: 340, width: 80, height: 80, shape: 'circle', capacity: '2', tags: [], status: 'available' },
      { id: '16', number: 'T16', x: 210, y: 340, width: 100, height: 60, shape: 'rectangle', capacity: '4', tags: ['window', 'quiet'], status: 'available' },
      { id: '17', number: 'T17', x: 330, y: 340, width: 80, height: 80, shape: 'circle', capacity: '2', tags: [], status: 'available' },
      { id: '18', number: 'T18', x: 430, y: 340, width: 100, height: 60, shape: 'rectangle', capacity: '4', tags: ['quiet'], status: 'available' },
    ];

    for (const table of tables) {
      await kv.set(`table:${table.id}`, JSON.stringify(table));
    }

    return c.json({ success: true, message: "Tables initialized" });
  } catch (error) {
    console.error("Error initializing tables:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get reservations for a specific date and time
app.get("/make-server-95a25493/reservations", async (c) => {
  try {
    const date = c.req.query("date");
    const time = c.req.query("time");
    
    if (!date || !time) {
      return c.json({ success: false, error: "Date and time are required" }, 400);
    }

    const reservations = await kv.getByPrefix(`reservation:${date}:${time}:`);
    const reservationData = reservations.map(r => JSON.parse(r));
    
    return c.json({ success: true, reservations: reservationData });
  } catch (error) {
    console.error("Error fetching reservations:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Create a new reservation
app.post("/make-server-95a25493/reservations", async (c) => {
  try {
    const body = await c.req.json();
    const { date, time, partySize, table } = body;

    if (!date || !time || !partySize || !table) {
      return c.json({ success: false, error: "Missing required fields" }, 400);
    }

    // Check if table is already reserved for this date/time
    const existingReservations = await kv.getByPrefix(`reservation:${date}:${time}:`);
    const isTableReserved = existingReservations.some(r => {
      const reservation = JSON.parse(r);
      return reservation.table.id === table.id;
    });

    if (isTableReserved) {
      return c.json({ success: false, error: "Table is already reserved for this time" }, 409);
    }

    // Create reservation
    const reservationId = crypto.randomUUID();
    const reservation = {
      id: reservationId,
      date,
      time,
      partySize,
      table,
      createdAt: new Date().toISOString()
    };

    await kv.set(`reservation:${date}:${time}:${reservationId}`, JSON.stringify(reservation));

    return c.json({ success: true, reservation });
  } catch (error) {
    console.error("Error creating reservation:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get all reservations (for debugging)
app.get("/make-server-95a25493/all-reservations", async (c) => {
  try {
    const reservations = await kv.getByPrefix("reservation:");
    const reservationData = reservations.map(r => JSON.parse(r));
    
    return c.json({ success: true, reservations: reservationData });
  } catch (error) {
    console.error("Error fetching all reservations:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Health check
app.get("/make-server-95a25493/health", (c) => {
  return c.json({ success: true, message: "Server is running" });
});

Deno.serve(app.fetch);
