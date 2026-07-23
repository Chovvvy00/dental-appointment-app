CREATE TABLE "appointments" (
	"id" serial PRIMARY KEY NOT NULL,
	"patient_name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(50) NOT NULL,
	"service" varchar(100) NOT NULL,
	"dentist" varchar(100) NOT NULL,
	"appointment_date" date NOT NULL,
	"appointment_time" time NOT NULL,
	"status" varchar(20) DEFAULT 'Pending' NOT NULL,
	"notes" text DEFAULT '',
	"created_at" timestamp DEFAULT now() NOT NULL
);
