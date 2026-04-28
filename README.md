# Cyber Evidence Locker

A modern, full-stack web application designed to demonstrate the power of cryptographic hash functions—specifically the **Whirlpool algorithm**—in verifying the integrity of digital evidence files. This application acts as a secure digital locker, where users can upload evidence, generate 512-bit cryptographic fingerprints, and detect any unauthorized modifications.

Built with **Next.js (App Router)**, **TypeScript**, and **TailwindCSS**, featuring a futuristic cyber-security UI theme.

## Features

1. **Evidence Upload System**: Upload digital artifacts to calculate their Whirlpool hash and secure them in the locker.
2. **Evidence Locker Dashboard**: Monitor and manage all stored evidence with dynamic statuses (Secure vs. Tampered).
3. **Verify Integrity Tool**: Verify an uploaded file against the secure locker to detect tampering.
4. **Avalanche Effect Demonstrator**: Interactive demo showing how flipping a single bit in the input radically alters the resulting hash.
5. **Hash Generator Utility**: Generate Whirlpool hashes for simple text strings or individual files.
6. **Tamper Simulation**: Intentionally corrupt an evidence record to see how the system detects the anomaly.
7. **Educational Section**: Learn about Hash Functions, the Whirlpool Algorithm, the Avalanche Effect, and System Architecture.
8. **Demo Mode**: Easily populate the locker with sample data to demonstrate functionality.

## How It Works

1. **Upload**: You upload a file. The system calculates a 512-bit Whirlpool Hash.
2. **Secure**: The hash, file metadata, and a timestamp are stored securely in a local JSON database (`data.json`).
3. **Verify**: If you upload the file again, the system recalculates the hash and compares it against the stored hash. If they match, the file is authentic. If even one byte changed, the hash is completely different (Avalanche Effect), and the system flags it as compromised.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

1. Clone or download the repository.
2. Navigate to the project directory:
   ```bash
   cd cyber-evidence-locker
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

1. Start the development server:
   ```bash
   npm run dev
   ```
2. Open your browser and navigate to `http://localhost:3000`.

### Using the App

- Start by enabling **Demo Mode** from the bottom of the sidebar to auto-populate the locker with sample files.
- Navigate to the **Evidence Locker** dashboard to view the sample evidence and click **Simulate Tamper** on one of them to see the status change.
- Go to the **Avalanche Effect** page to visually understand how changing "HELLO WORLD" to "HELLO WORLd" changes the binary output.
- Check out **How It Works** for a detailed explanation of the cryptographic concepts used in this project.

## Technologies Used

- [Next.js](https://nextjs.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
- [Hash-WASM](https://github.com/Daninet/hash-wasm) (for fast client-side Whirlpool hashing)

## Educational Purpose

This project is built for educational demonstration, helping students and teachers understand data integrity, chain of custody, and cryptographic hashing in digital forensics.
