import React from "react";
import style from "@/assets/scss/components/sidemenu.module.scss";
import Image from "next/image";
import Link from "next/link";
import ModeToggle from "./ModeToggle";

const SideMenu = () => {
  return (
    <div className={style["side_container"]}>
      <div className={style["side_header"]}>
        <div className={style["side_logo"]}>
          <Link href="/">
            <Image src="/logo/notion_widget_logo_white.png" fill alt="로고" />
          </Link>
        </div>
        <ModeToggle />
        <div className={style["side_fold_btn"]}>-</div>
      </div>
      <div className={style["side_body"]}>
        <div className={style["side_category"]}>
          <p className={style["category_title"]}>Widget</p>
          <ul className={style["category_list"]}>
            <li className={style["menu_item"]}>
              <Link href="/quotes">quotes</Link>
            </li>
            <li className={style["menu_item"]}>
              <Link href="/timer">timer</Link>
            </li>
            <li className={style["menu_item"]}>
              <Link href="/weather">weather</Link>
            </li>
          </ul>
        </div>
        <div className={style["side_category"]}>
          <p className={style["category_title"]}>Another</p>
          <ul className={style["category_list"]}>
            <li className={style["menu_item"]}>
              <Link href="/quotes">another 1</Link>
            </li>
            <li className={style["menu_item"]}>
              <Link href="/timer">another 2</Link>
            </li>
            <li className={style["menu_item"]}>
              <Link href="/weather">another 3</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SideMenu;
