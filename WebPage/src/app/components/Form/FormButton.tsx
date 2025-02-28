import { ButtonHTMLAttributes } from "react";
import { useFormContext } from "react-hook-form";

type FormButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export default function FormButton(props: FormButtonProps) {
  const {
    formState: { isSubmitting },
  } = useFormContext();

  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className="mt-4 w-full cursor-pointer place-items-center rounded-lg border-none bg-purple-500 p-2 text-[large] font-bold text-gray-50 hover:bg-purple-700 focus:outline focus:outline-gray-50"
      {...props}
    >
      {isSubmitting ? (
        <div className="h-[23px] w-[23px] animate-spin rounded-[50%] border-l-[2.5px] border-solid border-l-[rgb(0,217,255)] bg-transparent"></div>
      ) : (
        "Enviar"
      )}
    </button>
  );
}
