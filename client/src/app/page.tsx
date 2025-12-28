"use client";
import React, { useState, useEffect } from "react";

import styles from "./page.module.css";

export default function Home() {
  type Book = {
    id: number;
    title: string;
    release_year: number;
  };

  const [books, setBooks] = useState<Book[]>([]);
  const [title, setTitle] = useState("");
  const [releaseYear, setReleaseYear] = useState(0);

  const [newTitle, setNewTitle] = useState<{[id:number]: string}>({});

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title: string = e.target.value.trim();
    setTitle(title);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const yearStr = e.target.value.trim();

    const year = yearStr ? Number(yearStr) : 0;
    setReleaseYear(year);
  };

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/books/");
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setBooks(data);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchBooks();
  }, []);

  const addBook = async () => {
    const bookData = {
      title,
      release_year: releaseYear,
    };
    try {
      const response = await fetch("http://127.0.0.1:8000/api/books/create/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookData),
      });
      const data = await response.json();
      console.log(data);
      setBooks((prev) => [...prev, data]);
      setTitle("");
      setReleaseYear(0);
    } catch (error) {
      console.error(error);
    }
  };

  const updateTitle = async (pk: number, release_year: number) => {
    const bookData = {
      title: newTitle[pk] || "",
      release_year,
    };
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/books/${pk}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookData),
      });
      const data = await response.json();
      console.log(data);
      setBooks((prev) =>
        prev.map((book) => {
          if (book.id === pk) {
            return data;
          } else {
            return book;
          }
        })
      );
      setNewTitle(" ");
    } catch (error) {
      console.error(error);
    }
  };

  const deleteBook = async (pk: number) => {
    try {
        await fetch(`http://127.0.0.1:8000/api/books/${pk}`, {
        method: "DELETE",
      });
     
      
      setBooks((prev) => prev.filter((book) => book.id !== pk));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className={styles.page}>
      <h1 className="main">Book Website</h1>

      <div>
        <input
          type="text"
          placeholder="Book Title..."
          value={title}
          onChange={handleTitleChange}
        />
      </div>

      <div>
        <input
          type="number"
          placeholder="Release Year"
          value={releaseYear}
          onChange={handleYearChange}
        />
      </div>

      <section className="cards">
        <button type="button" onClick={addBook}>
          Add Book
        </button>
      </section>
      <section className="cards">
      {books.map((book) => (
        <div key={book.id} className="book-card">
          <p>Title: {book.title}</p>
          <p>Release Year: {book.release_year}</p>
          <div>
            <input
              type="text"
              placeholder="New Title..."
              value={newTitle[book.id] || ""}
              onChange={(e) => setNewTitle((prev) => ({ ...prev, [book.id]: e.target.value }))}
            />
          </div>
          <button
            type="button"
            onClick={() => updateTitle(book.id, book.release_year)}
          >
            {" "}
            Change Title{" "}
          </button>
          <button type="button" onClick={() => deleteBook(book.id)}>
            Delete
          </button>
        </div>
      ))}
      </section>
    </main>
  );
}
