import Link from "next/link";
import React from "react";

const NotFound = () => {
  return (
    <div className="w-full h-[100dvh] flex justify-center items-center flex-col">
      <p className="mb-5 text-3xl">잘못된 접근입니다!</p>
      <Link href="/" className="text-sm">
        홈으로 가기
      </Link>
    </div>
  );
};

export default NotFound;
