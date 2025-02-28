import { useState, useEffect, FormEvent } from "react";

type SectionInputProps = {
  days: string[];
  otherElementDay: string[];
  setDays: (days: string[]) => void;
  reserve: boolean;
};

function SectionInput({
  days,
  setDays,
  otherElementDay,
  reserve,
}: SectionInputProps) {
  const [date, setDate] = useState("");
  const [error, setError] = useState(false);

  const removeDay = (date: string) => {
    const newDays = days.filter((day) => day !== date);
    setDays(newDays);
  };

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError(false);
      }, 3000);
    }
  }, [error]);

  function addDate(e: FormEvent) {
    e.preventDefault();

    const formattedDate = date.split("-").reverse().join("/");
    const dateToday = new Date()
      .toLocaleDateString()
      .split("/")
      .reverse()
      .join("-");

    if (
      date <= dateToday ||
      days.includes(formattedDate) ||
      otherElementDay.includes(formattedDate) ||
      date.length !== 10
    ) {
      setError(true);
      return;
    }

    setDays([...days, formattedDate]);
    setDate("");
  }

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4">
      <form className="flex gap-2">
        <input
          type="date"
          maxLength={8}
          onChange={(e) => setDate(e.target.value)}
          value={date}
          className={`w-full rounded-[5px] border-none bg-gray-800 p-2 text-base text-gray-100 scheme-dark ${error ? "outline outline-[red] outline-solid" : ""} ${!reserve ? "disabled:cursor-not-allowed" : "cursor-pointer"} `}
          disabled={!reserve}
        />

        <button
          type="submit"
          disabled={!reserve}
          onClick={addDate}
          className="font-bolder cursor-pointer rounded-[7px] border-none bg-purple-500 p-2 text-base text-gray-50 hover:bg-purple-600 disabled:cursor-not-allowed disabled:bg-purple-500 hover:disabled:bg-purple-500"
        >
          Adicionar
        </button>
      </form>
      <div className="flex flex-col gap-2 rounded-[5px] bg-gray-800 has-[div]:p-[0.7rem]">
        {days.map((day) => {
          return (
            <div
              className="grid grid-cols-[1fr_auto] items-center gap-2 rounded-[5px] bg-gray-900 p-[0.4rem] text-[1.15rem]"
              key={day}
            >
              <div>{day}</div>
              <button
                disabled={!reserve}
                onClick={() => removeDay(day)}
                className="hover:bg-[rgb(187, 37, 37)] font-bolder cursor-pointer rounded-[7px] border-none bg-[rgb(223,52,52)] p-2 text-base text-gray-50"
              >
                Retirar
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SectionInput;
