"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";

export default function Home() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data from backend
    fetch("http://localhost:4000/api/hello")
      .then((res) => res.json())
      .then((data) => {
        setMessage(data.message);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching from backend:", error);
        setMessage("Failed to connect to backend");
        setLoading(false);
      });
  }, []);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <span className={styles.highlight}>Next.js Monorepo</span>
        </h1>

        <p className={styles.description}>
          A modern monorepo setup with Next.js frontend and Node.js backend
        </p>

        <div className={styles.card}>
          <h2>Backend Connection Status</h2>
          {loading ? (
            <p>Connecting to backend...</p>
          ) : (
            <p className={styles.message}>{message}</p>
          )}
        </div>

        <div className={styles.grid}>
          <a href="/apps" className={styles.gridCard}>
            <h2>📱 My Apps →</h2>
            <p>Manage multiple apps and their custom layouts</p>
          </a>

          <a href="/docs" className={styles.gridCard}>
            <h2>Documentation →</h2>
            <p>Learn about the monorepo architecture</p>
          </a>

          <a
            href="https://nextjs.org"
            className={styles.gridCard}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2>Next.js →</h2>
            <p>Explore Next.js documentation</p>
          </a>

          <a
            href="https://turbo.build"
            className={styles.gridCard}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2>Turborepo →</h2>
            <p>Learn about Turborepo</p>
          </a>

          <a href="/api" className={styles.gridCard}>
            <h2>API Routes →</h2>
            <p>Test backend API endpoints</p>
          </a>
        </div>
      </main>
    </div>
  );
}

