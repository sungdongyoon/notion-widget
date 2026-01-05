import { Input } from "@/components/ui/input";
import React from "react";
import DaumPostcode from "react-daum-postcode";

const AddressInput = () => {
  return (
    <div>
      <DaumPostcode />
    </div>
  );
};

export default AddressInput;
