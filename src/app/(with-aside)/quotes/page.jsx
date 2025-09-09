import React from "react";
import style from "@/app/(with-aside)/home.module.scss";
import Link from "next/link";

const QuotesPage = () => {
  return (
    <div className="page_container">
      <div className="widget_section">
        <h3 className="widget_title">Quotes</h3>
        <div className="widget_list">
          <div className="widget_item">
            <Link href="/quotes/1">Quotes</Link>
          </div>
          <div className="widget_item">
            <Link href="/quotes/1">Quotes</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotesPage;
