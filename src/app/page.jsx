import Link from "next/link";
import style from "./home.module.scss";

export default function Home() {
  return (
    <div className="pageContainer">
      <h3 className={style.title}>Widget List</h3>
      <div className={style.widgetList}>
        <div className={style.widgetItem}>
          <Link href="/timer">Timer</Link>
        </div>
        <div className={style.widgetItem}>
          <Link href="/timer">Timer</Link>
        </div>
        <div className={style.widgetItem}>
          <Link href="/timer">Timer</Link>
        </div>
        <div className={style.widgetItem}>
          <Link href="/timer">Timer</Link>
        </div>
      </div>
    </div>
  );
}
