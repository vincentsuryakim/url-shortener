import { useState } from "react";
import Head from "next/head";
import { Inter } from "@next/font/google";
import styles from "@/styles/Home.module.css";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [longUrl, setLongUrl] = useState<string>("");
  const [shortUrl, setShortUrl] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const resetFields = (): void => {
    setLongUrl("");
    setShortUrl("");
    setError(false);
  };

  const submitForm = (e: any): void => {
    // Prevent page reload
    e.preventDefault();

    // Prevent multiple requests
    if (loading) return;

    setLoading(true);

    // Send request to API
    fetch("/api/shorten", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        longUrl,
        shortUrl,
      }),
    })
      .then(async (res) => {
        // Get response data
        const data = await res.json();

        // Check if response is successful
        if (res.ok) {
          setMessage(`${data.message}: ${window.location.host}/${shortUrl}`);
          resetFields();
        } else {
          setMessage(data.message);
          setError(true);
        }
      })
      .catch((err) => {
        setMessage(err as string);
      })

      // Always reset loading state after finishing each request
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <Head>
        <title>My URL Shortener</title>
        <meta
          name="description"
          content="A fast, easy, and simple URL shortener"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <form onSubmit={submitForm} className={styles.container}>
          <input
            type="text"
            className={`${styles.inputText} ${inter.className}`}
            placeholder="Enter your long URL"
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            disabled={loading}
          />
          <input
            type="text"
            className={`${styles.inputText} ${inter.className}`}
            placeholder="Enter your short URL"
            value={shortUrl}
            onChange={(e) => setShortUrl(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            className={`${styles.shortenButton} ${inter.className}`}
            disabled={!longUrl || !shortUrl || loading}
          >
            Shorten URL
          </button>
        </form>
        <p className={`${error && styles.errorMessage} ${inter.className}`}>
          {message}
        </p>
      </main>
    </>
  );
}
