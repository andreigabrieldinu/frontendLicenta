import React from "react";

export default function Sort({ handleSort }) {
  const changeValue = (e) => {
    const value = e.target.value;
    handleSort(value);
  };
  return (
    <select className="selectpicker ml-auto" onChange={changeValue}>
      <option value="default">Sortare de baza</option>
      <option value="DownToUp">Pret: de la mic la mare</option>
      <option value="UpToDown">Pret: de la mare la mic</option>
    </select>
  );
}
