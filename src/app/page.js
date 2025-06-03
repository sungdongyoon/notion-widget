import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h3>Create Notion Widget</h3>
      <ul>
        <li>
          <Link href="/timer">Timer</Link>
        </li>
      </ul>
    </div>
  );
}
